import React, { useState } from 'react'
import {
  TextInput,
  Text,
  Button,
  StyleSheet,
  View,
  ToastAndroid
} from 'react-native'
import NameProvider from './contexts/nameContext'
import { changeNameFile } from './utils/fs'
import RNFS from 'react-native-fs'
import { WebView } from 'react-native-webview'
import WxMessageCount from './components/WxMessageCount'

const Init = () => {
  const [status, setStatus] = useState(false)
  const [bad, setBad] = React.useState<string | undefined>()
  const [good, setGood] = React.useState<string | undefined>()

  const handleSave = () => {
    setStatus(true)
    changeNameFile(good, bad).then(() => {
      ToastAndroid.show('修改成功！重启生效。', ToastAndroid.SHORT)
      setStatus(false)
      setGood(undefined)
      setBad(undefined)
    })
  }

  return (
    <View style={styles.main}>
      <TextInput
        style={styles.input}
        onChangeText={setBad}
        value={bad}
        placeholder="脆弱的一面"
      />
      <TextInput
        style={styles.input}
        onChangeText={setGood}
        placeholder="理智的一面"
        value={good}
      />
      <Button
        title="确认double"
        onPress={handleSave}
        disabled={!bad || !good || status}
      />

      {/* 查看微信通知数量 */}
      <WxMessageCount />

      <Text>{RNFS.DocumentDirectoryPath}</Text>
      {[
        RNFS.DownloadDirectoryPath,
        RNFS.ExternalDirectoryPath,
        RNFS.CachesDirectoryPath
      ].map((text) => (
        <Text key={text}>{text}</Text>
      ))}
      <WebView
        source={{ uri: 'https://developer.mozilla.org/zh-CN/' }}
        style={{ marginTop: 20 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    padding: 10,
    backgroundColor: '#fff'
  },
  main: {
    justifyContent: 'center',
    flex: 1,
    rowGap: 15,
    backgroundColor: 'gainsboro',
    padding: 20
  }
})

const InitScreen = () => (
  <NameProvider>
    <Init />
  </NameProvider>
)

const imageUrlPrefix = './assets/images/'

InitScreen.options = {
  topBar: {
    title: {
      text: '起个名字吧~',
      alignment: 'center'
    }
  },
  bottomTab: {
    text: '昵称',
    selectedTextColor: 'darkseagreen',
    selectedIcon: require(imageUrlPrefix + 'edit-selected.png'),
    icon: require(imageUrlPrefix + 'edit.png')
  }
}

export default InitScreen
