import { Navigation, type NavigationProps } from 'react-native-navigation'
import { useEffect, useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AppState,
  type FlatList,
  Pressable,
  Alert,
  Modal,
  Image,
  type ImageSourcePropType
} from 'react-native'
import NameProvider, { useNameContext } from 'srcNew/contexts/nameContext'
import { MAX_GAP, MAX_LENGTH, type, userId } from 'srcNew/constants'
import { clearCache, readLogFile, writeLogFile } from 'srcNew/utils/fs'
import type { log, logs, UpdateList } from './types/log'
import LogList from './components/LogList'
import getManager, { keys, type SubScriber } from './utils/manager'
import type { Timeout } from './types/utils'

interface HomeProps {
  navToHistory: () => void
}

interface FooterProps {
  handleSend: (arg0: log) => void
}

// 触发保存的时机
type source =
  | 'length' // list.length 到达阈值
  | 'timer' // 到达间隔时间
  | 'leave' // 离开应用（后台、退出）

// 订阅发布的管理者
const { subscribe } = getManager()

const Footer = ({ handleSend }: FooterProps) => {
  const [good, setGood] = useState('')
  const [bad, setBad] = useState('')
  const { good: goodName, bad: badName } = useNameContext()[0]

  const onChangeBad = (value: string) => {
    setBad(value)
  }
  const onChangeGood = (value: string) => {
    setGood(value)
  }
  const clearGood = () => {
    setGood('')
  }
  const clearBad = () => {
    setBad('')
  }
  const handleSendGood = () => {
    if (!good) {
      return
    }
    const item = {
      type: type.normal,
      timeStamp: Date.now(),
      message: good,
      isTopped: false,
      user: {
        name: goodName,
        id: userId.good
      }
    }
    handleSend(item)
    clearGood()
  }
  const handleSendBad = () => {
    if (!bad) {
      return
    }
    const item = {
      type: type.normal,
      timeStamp: Date.now(),
      message: bad,
      isTopped: false,
      user: {
        name: badName,
        id: userId.bad
      }
    }
    handleSend(item)
    clearBad()
  }

  return (
    <>
      <View style={styles.line}></View>
      <View style={leftInput}>
        <Pressable style={leftInputButton} onPress={handleSendGood}>
          <Text>{goodName}</Text>
        </Pressable>
        <TextInput
          onChangeText={onChangeGood}
          value={good}
          style={styles.inputter}
        />
      </View>

      <View style={styles.input}>
        <TextInput
          onChangeText={onChangeBad}
          value={bad}
          style={styles.inputter}
        />
        <Pressable style={styles.inputButton} onPress={handleSendBad}>
          <Text>{badName}</Text>
        </Pressable>
      </View>
      <ImageModal />
    </>
  )
}

const ImageModal = () => {
  const [source, setSource] = useState<ImageSourcePropType | undefined>()
  const [visible, setVisible] = useState(false)

  const subscriber = useCallback<SubScriber<ImageSourcePropType>>((source) => {
    setSource(source)
    setVisible(true)
  }, [])

  useEffect(() => {
    const unsub = subscribe(keys.imageFill, subscriber)

    return unsub
  }, [subscriber])

  return (
    <Modal visible={visible && Boolean(source)}>
      <Pressable onPress={() => setVisible(false)} style={styles.image}>
        <Image source={source} style={styles.imageInner} />
      </Pressable>
    </Modal>
  )
}

const Home = ({ navToHistory }: HomeProps) => {
  const [list, setList] = useState<logs>([])
  const timerRef = useRef<Timeout>(-1)
  const appState = useRef('active')
  const listRef = useRef<FlatList<log> | null>(null)
  const { good, bad } = useNameContext()[0]

  const saveLogs = useCallback(
    (from: source) => {
      clearTimeout(timerRef.current)
      writeLogFile(list).then(() => {
        console.log('SAVE OK!', 'from', from)
      })
    },
    [list]
  )

  useEffect(() => {
    readLogFile().then((data: logs) => {
      setList(data)
    })
  }, [])

  // 监听应用进入&离开
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|active/) &&
        nextAppState === 'background'
      ) {
        console.log('App has come to the background!')
        // if(!tempList.length){
        //   return
        // }
        saveLogs('leave')
      }

      appState.current = nextAppState
      console.log('AppState', appState.current)
    })

    return () => {
      subscription.remove()
    }
  }, [saveLogs])

  // for android back disbale to exit app
  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     () => {
  //       return true;
  //     },
  //   )

  //   return () => backHandler.remove()
  // }, [])

  useEffect(() => {
    if (!list.length || !listRef.current) {
      return
    }

    // 发送消息后列表滚动到底部
    listRef.current.scrollToEnd({ animated: true })
    /**
     * 更新 timerRef 的逻辑应置于“长度触发保存”逻辑之前，保证延迟能被取消
     */
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    // 延迟保存
    // @ts-expected-error 暂时保留它
    timerRef.current = setTimeout(() => {
      saveLogs('timer') // submit tempList
    }, MAX_GAP)

    // 列表长度触发阈值保存
    if (list.length >= MAX_LENGTH) {
      saveLogs('length') // submit tempList
    }
  }, [list, saveLogs])

  const handleSend = (item: log) => {
    // setTotal(t => t + 1)
    /**
     * 更新 timerRef 的逻辑应置于“长度触发保存”逻辑之前，保证延迟能被取消
     */
    // if(timerRef.current){
    //   clearTimeout(timerRef.current)
    // }
    // timerRef.current = setTimeout(() => {
    //   saveLogs('time') // submit tempList
    //   timerRef.current = null
    // }, 1000)
    // new Promise((resolve) => {
    //   timerRef.current = setTimeout(() => {
    //     resolve()
    //   }, 1000)
    // }).then(() => {
    //   saveLogs('time') // submit tempList
    //   timerRef.current = null
    // })

    // setTempList(l => {
    //   console.log('after')
    //   if(l.length + 1 >= MAX_LENGTH){
    //     saveLogs('length') // submit tempList
    //     timerRef.current && clearTimeout(timerRef.current)
    //     timerRef.current = null
    //   }
    //   return l.concat([item])
    // })
    setList((l) => l.concat([item]))
  }

  const updateList = useCallback<UpdateList>(
    (index, item) => {
      const newList = list.slice()
      newList[index] = item
      setList(newList)
    },
    [list]
  )

  const handleClean = useCallback(() => {
    Alert.alert('清除缓存？', '', [
      {
        text: '取消',
        style: 'cancel'
      },
      // @ts-expect-error what should be the exact type for clearCache
      { text: '确认', onPress: clearCache }
    ])
  }, [])

  return (
    <View style={styles.root}>
      <View style={styles.name}>
        <Pressable style={styles.leftName} onPress={handleClean}>
          <Text style={styles.text}>{good}</Text>
        </Pressable>
        <Pressable style={styles.rightName} onPress={navToHistory}>
          <Text style={styles.text}>{bad}</Text>
        </Pressable>
      </View>
      <LogList list={list} ref={listRef} updateList={updateList} />
      <Footer handleSend={handleSend} />
    </View>
  )
}

const HomeScreen = (props: NavigationProps) => {
  // TODO navigate in NavigationProvier
  const navToHistory = useCallback(() => {
    void Navigation.push(props.componentId, {
      component: {
        name: 'History'
      }
    })
  }, [props])

  return (
    <NameProvider>
      <Home navToHistory={navToHistory} />
    </NameProvider>
  )
}

const imageUrlPrefix = './assets/images/'
HomeScreen.options = {
  topBar: {
    visible: false
  },
  bottomTab: {
    text: '消息',
    selectedTextColor: 'darkseagreen',
    selectedIcon: require(imageUrlPrefix + 'message-selected.png'),
    icon: require(imageUrlPrefix + 'message.png')
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'gainsboro',
    padding: 10
  },
  name: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 10,
    borderColor: 'gainsboro'
  },
  leftName: {
    backgroundColor: 'darkseagreen',
    flex: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20
  },
  rightName: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20
  },
  text: {
    textAlign: 'center',
    lineHeight: 40
  },
  input: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    height: 40
  },
  leftInput: {
    marginBottom: 10
  },
  inputButton: {
    borderRadius: 5,
    width: 70,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  leftInputButton: {
    backgroundColor: 'darkseagreen'
  },
  inputter: {
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 5
  },
  topBar: {
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'gainsboro'
  },
  topRight: {
    position: 'absolute',
    right: 20,
    lineHeight: 40
  },
  title: {
    textAlign: 'center',
    flex: 1
  },
  line: {
    height: 1,
    backgroundColor: 'dimgray',
    opacity: 0.2,
    margin: 10
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#000'
  },
  imageInner: {
    resizeMode: 'center'
  }
})

const leftInput = StyleSheet.flatten([styles.input, styles.leftInput])
const leftInputButton = StyleSheet.flatten([
  styles.inputButton,
  styles.leftInputButton
])

export default HomeScreen
