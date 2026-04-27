import { createContext, useContext, useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { readNameFile } from 'srcNew/utils/fs'
import { INIT_BAD_NAME, INIT_GOOD_NAME } from 'srcNew/constants'

const NameContext = createContext<any>([])

export const useNameContext = () => {
  return useContext(NameContext)
}

interface Name {
  good: string
  bad: string
}

const initName: Name = {
  good: INIT_GOOD_NAME,
  bad: INIT_BAD_NAME
}

type NameProviderProps = PropsWithChildren<{
  value?: Name
}>

const NameProvider = ({ children, value }: NameProviderProps) => {
  const [name, setName] = useState(value ?? initName)

  useEffect(() => {
    if (value) {
      return
    }
    // 读取名称
    readNameFile()
      .then((c) => {
        setName(JSON.parse(c) as Name)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, [value])

  return (
    <NameContext.Provider value={[name, setName]}>
      {children}
    </NameContext.Provider>
  )
}
export default NameProvider
