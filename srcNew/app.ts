import '@/utils/errorHandle'
import '@/config/globalData'
import { listenLaunchEvent } from '../src/navigation/regLaunchedEvent'

console.log('starting app...')
listenLaunchEvent()
