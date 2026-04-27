// 格式化为双位
export const format = (n: number) => (n >= 10 ? n : '0' + n)

type Type =
  | 0 // y-m-d
  | 1 // h:m:s
  | 2 // y-m-d h:m:s

export const parseTime = (t: number, type: Type) => {
  const date = new Date(t)
  if (type === 0) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
  if (type === 1) {
    return `${format(date.getHours())}:${format(date.getMinutes())}:${format(date.getSeconds())}`
  }
  if (type === 2) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${format(date.getHours())}:${format(date.getMinutes())}:${format(date.getSeconds())}`
  }
  return ''
}
