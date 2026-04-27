export const checkFirst = <T>() => {
  let last: null | T = null
  console.log('[check fitst]', 'checked')
  return (cur: T) => {
    if (!last || last !== cur) {
      last = cur
      return true
    }
    return false
  }
}

export const errorLog = (title = 'TEST', ...rest: unknown[]) => {
  console.log(`[${title}]`, ...rest)
}
