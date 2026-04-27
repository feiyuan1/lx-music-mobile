/**
 * 查看累计收到的微信通知数量 - for app
 */
import { useCallback, useEffect, useState } from 'react'
import { Text, DeviceEventEmitter, NativeModules } from 'react-native'

const { SharedRefsModule } = NativeModules

const WX_MESSAGE_STORAGE_KEY = 'wx_message'

const WxMessageCount = () => {
  const [wxCount, updateCount] = useState(0)
  const readCountFromStorage = useCallback(() => {
    void SharedRefsModule.getData_Int(WX_MESSAGE_STORAGE_KEY).then(
      (count: number) => {
        if (count == null) {
          return
        }
        updateCount(count)
      }
    )
  }, [updateCount])

  useEffect(() => {
    readCountFromStorage()
  }, [readCountFromStorage])

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'onWeChatMessage',
      readCountFromStorage
    )

    return () => {
      sub.remove()
    }
  }, [readCountFromStorage])

  return (
    <>
      <Text>{wxCount}</Text>
    </>
  )
}

export default WxMessageCount
