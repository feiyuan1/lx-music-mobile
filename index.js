import './shim'
import './srcNew/app'
import { Navigation } from 'react-native-navigation'
import { initFileStructure, syncLog } from 'srcNew/utils/fs'
import HistoryScreen from 'srcNew/History'
import InitScreen from 'srcNew/Init'
import HomeScreen from 'srcNew/Home'
import { PermissionsAndroid } from 'react-native'

/**
 * 初始化逻辑：
 * 1. 创建本地 json 文件，保存 AB 两面的名称（默认名称为 A、B）
 */
const init = () => {
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'read write storage',
      message: 'App needs access to your storage ',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK'
    }
  )
    .then(() => initFileStructure())
    .then(() => syncLog())
    .catch((err) => {
      console.log(err.message)
    })
}

Navigation.registerComponent('Home', () => HomeScreen)
Navigation.registerComponent('Init', () => InitScreen)
Navigation.registerComponent('History', () => HistoryScreen)

Navigation.events().registerAppLaunchedListener(async (a) => {
  init()

  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'Home'
                  }
                }
              ]
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'Init'
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })
})
