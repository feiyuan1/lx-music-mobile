/**
 * 在页面右侧
 */
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ToastAndroid,
  type ViewStyle,
  type ImageStyle,
  type TextStyle
} from 'react-native'
import Avatar from './Avatar'
import type { log } from 'srcNew/types/log'
import { parseTime } from 'srcNew/utils/date'
import { type, userId } from 'srcNew/constants'

interface ItemProps {
  log: log
  index: number
  activeItem: (index: number) => void
}

const useStyle = (log: log) => {
  const {
    user: { id },
    type: logType
  } = log
  const finalStyle: {
    inner: ViewStyle
    leftAvatar: ImageStyle
    rightAvatar: ImageStyle
    textStyle: TextStyle
    main: ViewStyle
  } = {
    rightAvatar: {},
    leftAvatar: {},
    textStyle: {},
    inner: styles.inner,
    main: styles.main
  }

  if (id === userId.good) {
    finalStyle.rightAvatar = styles.hide
  }
  if (id === userId.bad) {
    finalStyle.leftAvatar = styles.hide
    finalStyle.inner = rightInner
    finalStyle.main = rightMain
  }
  if (logType === type.strong) {
    finalStyle.inner = highlightInner
    finalStyle.textStyle = styles.highlight
  }
  return finalStyle
}

const RevertItem = ({ log }: ItemProps) => {
  const {
    message,
    user: { name }
  } = log

  return (
    <Text style={styles.revert}>
      {name} {message}
    </Text>
  )
}

const MessageItem = ({ log, index, activeItem }: ItemProps) => {
  const { message, timeStamp } = log
  const { textStyle, inner, leftAvatar, rightAvatar, main } = useStyle(log)
  const formatTime = parseTime(timeStamp, 2)

  const handleLongPress = () => {
    activeItem(index)
  }

  const handlePress = () => {
    ToastAndroid.show(formatTime, ToastAndroid.SHORT)
  }

  return (
    <View style={main}>
      {/* <Text>{name}</Text> */}
      <Avatar src={require('../assets/images/good.png')} style={leftAvatar} />
      <View style={styles.mid}>
        <Pressable
          style={inner}
          onLongPress={handleLongPress}
          onPress={handlePress}
        >
          <Text style={textStyle}>{message}</Text>
        </Pressable>
      </View>
      {/* 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL5Wg60_TQxUmY6QX48LiRKib9_biTbypmKoWtf6f4iTjj4FTNdBMUh6LKN0KU91MsKXs&usqp=CAU' */}
      <Avatar src={require('../assets/images/bad.png')} style={rightAvatar} />
    </View>
  )
  //   {/* <View style={timeRight}>
  //     <FadeOutTime show={visible} resetShow={() => setVisible(false)} time={log.timeStamp}/>
  //   </View> */}
}

const LogItem = (log: log) => {
  if (log.type === type.revert) {
    return RevertItem
  }
  return MessageItem
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    columnGap: 10,
    marginBottom: 10
  },
  rightMain: {
    justifyContent: 'flex-end'
  },
  mid: {
    flexShrink: 1,
    flexDirection: 'column'
  },
  inner: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'darkseagreen'
  },
  rightBg: {
    backgroundColor: '#fff'
  },
  highlight: {
    backgroundColor: 'firebrick',
    color: '#fff'
  },
  // time: {
  //   paddingHorizontal: 50,
  // },
  // timeRight: {
  //   alignItems: 'flex-end'
  // },
  hide: {
    opacity: 0
  },
  revert: {
    textAlign: 'center',
    color: 'dimgray',
    marginBottom: 10
  }
})

// const timeRight = StyleSheet.flatten([styles.time, styles.timeRight])
const rightInner = StyleSheet.flatten([styles.inner, styles.rightBg])
const highlightInner = StyleSheet.flatten([styles.inner, styles.highlight])
const rightMain = StyleSheet.flatten([styles.main, styles.rightMain])

export default LogItem
