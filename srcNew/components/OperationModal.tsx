import type { Dispatch, SetStateAction } from 'react'
import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  ToastAndroid
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { revertText, type } from 'srcNew/constants'
import { useOperateContext } from 'srcNew/contexts/OperateContext'
import type { log, Permission, Permissions } from 'srcNew/types/log'
import { appendTopLogFile } from 'srcNew/utils/fs'

interface OperationModalProps {
  permissions?: Permissions
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
}

interface Operation {
  type: Permission
  handler: () => void
  title: string
}

const OperationModal = ({
  permissions,
  visible,
  setVisible
}: OperationModalProps) => {
  const result = useOperateContext()

  if (!result?.current) {
    return null
  }

  const {
    current: { data, index },
    updateLog
  } = result
  const updateLogStatus = (newData: log) => {
    if (data.type === newData.type) {
      return
    }
    console.log('shouldUpdate')
    updateLog(index, newData)
  }
  const handleCopy = () => {
    Clipboard.setString(data.message)
  }
  const handleStrong = () => {
    updateLogStatus({
      ...data,
      type: type.strong
    })
  }
  const handleRevert = () => {
    updateLogStatus({
      ...data,
      type: type.revert,
      message: revertText
    })
  }
  const handleTop = () => {
    if (data.isTopped) {
      ToastAndroid.show('has topped', ToastAndroid.SHORT)
      return
    }
    const newData = {
      ...data,
      isTopped: true
    }
    updateLog(index, newData)
    appendTopLogFile(newData).catch((err) => {
      console.log('write-top: ', err.message)
    })
  }

  const operations: Operation[] = [
    {
      title: '撤回',
      type: 0,
      handler: handleRevert
    },
    {
      title: '复制',
      type: 1,
      handler: handleCopy
    },
    {
      title: '高亮',
      type: 2,
      handler: handleStrong
    },
    {
      title: '置顶',
      type: 3,
      handler: handleTop
    }
  ]

  const hideModal = () => {
    setVisible(false)
  }

  return (
    <Modal visible={visible}>
      <Pressable style={styles.modal} onPress={hideModal}>
        {operations.map((item) => {
          if (permissions && !permissions.includes(item.type)) {
            return null
          }
          return (
            <Button
              title={item.title}
              onPress={() => {
                item.handler()
                hideModal()
              }}
              key={item.type}
            />
          )
        })}
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    flex: 1,
    rowGap: 10,
    padding: 20
  }
})

export default OperationModal
