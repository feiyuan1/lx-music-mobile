import { useState } from 'react'

const useToggle = (init?: boolean) => {
  const [status, setStatus] = useState(init ?? false)

  const toggle = () => {
    setStatus(!status)
  }

  return [status, toggle] as const
}

export default useToggle
