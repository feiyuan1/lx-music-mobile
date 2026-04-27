import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState
} from 'react'
import type { logs } from 'srcNew/types/log'
import { readLogLists } from 'srcNew/utils/fs'

const LogsContext = createContext<logs | undefined>([])

export const useLogsContext = () => {
  const context = useContext(LogsContext)
  return context ?? []
}

type LogsProviderProps = PropsWithChildren<{
  value?: logs
}>
const LogsProvider = ({ value, children }: LogsProviderProps) => {
  const [logs, setLogs] = useState<logs>(value ?? [])

  useEffect(() => {
    if (value) {
      return
    }
    readLogLists().then((list: logs) => {
      const result = list.reduce<logs>((res, [_, logs]) => {
        return res.concat(logs)
      }, [])
      setLogs(result)
    })
  }, [setLogs, value])

  return <LogsContext.Provider value={logs}>{children}</LogsContext.Provider>
}
export default LogsProvider
