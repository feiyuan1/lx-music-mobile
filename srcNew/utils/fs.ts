import RNFS from 'react-native-fs'
import { INIT_BAD_NAME, INIT_GOOD_NAME } from 'srcNew/constants'
import type { log, logs } from 'srcNew/types/log'
import { parseTime } from './date'
import { checkFirst, errorLog } from './index'

/**
 * 不同存储路径的注释：
 * 1. 需要 root 权限，普通用户无法访问：CachesDirectoryPath、DocumentDirectoryPath
 * 2. 普通用户可以访问：DownloadDirectoryPath(用户存储/下载/)、Externalxxxx
 */
export const ROOT_DIR = RNFS.DownloadDirectoryPath + '/lxmusic'

// log_${curdate}.json 所在目录
export const LOG_DIR = ROOT_DIR + '/log'
// name.json file path
export const NAME_JSON_FILEPATH = ROOT_DIR + '/name.json'
// legacy log.json file path
export const LEGACY_LOG_JSON_FILEPATH = ROOT_DIR + '/log.json'
// log_${curdate}.json file path
export const LOG_JSON_FILEPATH =
  LOG_DIR + `/log_${parseTime(Date.now(), 0)}.json`
// top_log.json file path
export const TOP_LOG_JSON_FILEPATH = ROOT_DIR + '/top_log.json'

// 通过时间戳获取 log 文件名称
export const getLogFileName = (time: number) =>
  `${LOG_DIR}/log_${parseTime(time, 0)}.json`

interface logEnhancerProps {
  title: string
}

interface errorEnhancerProps {
  title: string
}

const errorEnhancer = ({ title }: errorEnhancerProps) => {
  return (fn: (...props: any) => Promise<any>) =>
    function () {
      return fn(...arguments).catch((e) => {
        errorLog(title, e.message || e)
      })
    }
}

// const promiseEnhancer = ({resolvers}) => (fn: () => Promise<any>) => (...rest) => {
//   return resolvers.reduce((p, resolve) => {
//     return p.then(resolve)
//   }, fn(...rest))
// }

const logEnhancer = ({ title }: logEnhancerProps) => {
  return (fn: (log: () => void, ...props: any) => any) =>
    function () {
      const log = function () {
        errorLog(title, ...arguments)
      }
      return fn(log, ...arguments)
    }
}

type asyncComposerProps = errorEnhancerProps & logEnhancerProps
type Enhancer<T> = (props: T) => Function
// initFn param return 应该是 Enhancer return 中 fn param 的拼接 return 的交集
// type SingleFn<T> = T extends Function ? ReturnType<T>: never
// type InsetFn<T> = T extends [infer First, infer Second] ? Parameters<First> & Parameters<Second>: never
// type InitFn<T> = T extends [infer First, ...infer Rest] ? InsetFn<[SingleFn<First>, InitFn<Rest>]> : SingleFn<T>
// type a = InitFn<[typeof logEnhancer, typeof errorEnhancer]>

// deperacted rule: Expected indentation of 6 spaces but found 4.
const compose =
  <T>(fns: Array<Enhancer<T>>) =>
  (initFn: Function, data: T) => {
    return fns.reduce((result, fn) => {
      return fn(data)(result)
    }, initFn)
  }

const asyncComposer = compose<asyncComposerProps>([logEnhancer, errorEnhancer])
const logComposer = compose<logEnhancerProps>([logEnhancer])

// lxmusic 目录 & lxmiusic log
export const initFileStructure = () => {
  return RNFS.mkdir(ROOT_DIR).then(() => {
    return Promise.all([
      RNFS.mkdir(LOG_DIR),
      createNameFile(),
      createTopLogFile()
    ])
  })
}

type logError = (...props: any) => void

// name.json
export const createNameFile = asyncComposer(
  (logError: logError) => {
    return RNFS.exists(NAME_JSON_FILEPATH).then((isExist) => {
      if (isExist) {
        logError('name.json is Exiest')
        return
      }

      return changeNameFile(INIT_GOOD_NAME, INIT_BAD_NAME)
    })
  },
  { title: 'create name file' }
)

export const changeNameFile = asyncComposer(
  async (log: logError, good: string, bad: string) => {
    const content = JSON.stringify({
      good,
      bad
    })

    return RNFS.writeFile(NAME_JSON_FILEPATH, content, 'utf8')
  },
  { title: 'change name file' }
)

export const readNameFile = async () => {
  return RNFS.readFile(NAME_JSON_FILEPATH)
}

// 修改某日 log 文件
export const writeLogFile = asyncComposer(
  async (
    logError: logError,
    logs: logs,
    fileName: string = LOG_JSON_FILEPATH
  ) => {
    return RNFS.exists(fileName).then((isExist) => {
      if (!isExist) {
        logError('creating log file', fileName)
      }
      logError('[writing file]', fileName, logs.length)
      return RNFS.writeFile(fileName, JSON.stringify(logs), 'utf8')
    })
  },
  {
    title: 'write log file'
  }
)

// 获取某日 log 文件
export const readLogFile = asyncComposer(
  async (log: logError, fileName: string = LOG_JSON_FILEPATH) => {
    return RNFS.exists(fileName)
      .then((isExist) => {
        if (!isExist) {
          return
        }
        return RNFS.readFile(fileName)
      })
      .then((str) => {
        return str ? JSON.parse(str) : []
      })
  },
  {
    title: 'read log file'
  }
)

// 获取 log/ 下所有文件内容
export const readLogLists = asyncComposer(
  async () => {
    return RNFS.readDir(LOG_DIR).then((items) => {
      return Promise.all(
        items.map((item) => {
          const { name, path } = item
          return Promise.all([name, readLogFile(path)])
        })
      )
    })
  },
  { title: 'read log list' }
)

export const createTopLogFile = asyncComposer(
  async (log: logError) => {
    return RNFS.exists(TOP_LOG_JSON_FILEPATH).then((isExist) => {
      log('isExist: ', isExist)
      if (isExist) {
        return
      }

      return RNFS.writeFile(TOP_LOG_JSON_FILEPATH, '', 'utf8')
    })
  },
  { title: 'create top file' }
)

export const appendTopLogFile = async (log: log) => {
  if (!log) {
    throw new Error('the input is null')
  }

  const content = JSON.stringify(log) + ','

  return RNFS.appendFile(TOP_LOG_JSON_FILEPATH, content)
}

export const readTopLogFile = asyncComposer(
  async () => {
    return RNFS.readFile(TOP_LOG_JSON_FILEPATH).then((logs) => {
      const content = logs ? logs.slice(0, -1) : ''
      return JSON.parse(`[${content}]`)
    })
  },
  { title: 'read top log file' }
)

export const syncLog = logComposer(
  async (log: logError) => {
    try {
      const isExist = await RNFS.exists(LEGACY_LOG_JSON_FILEPATH)
      if (!isExist) {
        log('nothing to sync')
        return
      }
      const str = await RNFS.readFile(LEGACY_LOG_JSON_FILEPATH)
      if (!str) {
        return
      }
      const logs: logs = JSON.parse(`[${str.slice(0, -1)}]`)
      const shouldCreateLog = checkFirst<string>()
      await logs.reduce(
        async (promiseResult, log, index) => {
          const result = await promiseResult
          const date = parseTime(log.timeStamp, 0)
          const shouldCreate = shouldCreateLog(date)
          const lastFileName = result[0] && getLogFileName(result[0].timeStamp)
          const curFileName = getLogFileName(log.timeStamp)
          if (shouldCreate) {
            if (result.length) {
              await writeLogFile(result, lastFileName)
            }
            if (index === logs.length - 1) {
              await writeLogFile([log], curFileName)
            }
            return [log]
          }
          if (index === logs.length - 1) {
            await writeLogFile(result.concat([log]), curFileName)
            return []
          }
          return result.concat([log])
        },
        Promise.resolve([] as logs)
      )
      void RNFS.unlink(LEGACY_LOG_JSON_FILEPATH)
    } catch (e) {
      log('sync log error: ', (e as Error).message)
    }
  },
  { title: 'SYNC LOG' }
)

export const clearCache = asyncComposer(
  async (log: logError) => {
    // unlink lxmusic dir
    return RNFS.unlink(LOG_JSON_FILEPATH).then(() => {
      log('success')

      return true
    })
  },
  { title: 'CACHE CLEAN' }
)
