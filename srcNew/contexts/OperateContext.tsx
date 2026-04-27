import { createContext, type PropsWithChildren, useContext } from 'react'
import type { Current, UpdateList } from 'srcNew/types/log'

type Value = {
  updateLog: UpdateList
  current: Current
} | null

const OperateContext = createContext<Value>(null)

export const useOperateContext = () => useContext(OperateContext)

interface OperateProviderProps {
  value: Value
}

const OperateProvider = ({
  children,
  value
}: PropsWithChildren<OperateProviderProps>) => {
  return (
    <OperateContext.Provider value={value}>{children}</OperateContext.Provider>
  )
}

export default OperateProvider
