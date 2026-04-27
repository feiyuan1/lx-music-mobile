import type { valueof } from 'srcNew/types/utils'

/**
 * 利用发布订阅完成跨组件通信
 */
export const keysVariable = {
  imageFill: 'image-fill'
} as const

export type SubScriber<T = any> = (props?: T) => void

type keys = valueof<typeof keysVariable>

type Map = {
  [key in keys]?: SubScriber[]
}

const getManager = (() => {
  const map: Map = {}

  return () => {
    const register = (key: keys) => {
      map[key] = []
      console.log('the key ', key, 'subscribed sucess')
    }

    const dispatch = <T>(key: keys, data?: T) => {
      if (!map[key]) {
        console.log('the key ', key, 'has not subscribed')
        return
      }
      const subscriber = map[key]
      subscriber.forEach((sub: SubScriber<T>) => {
        sub(data)
      })
    }

    const subscribe = <T>(key: keys, listener: SubScriber<T>) => {
      if (!map[key]) {
        register(key)
      }
      map[key]!.push(listener)

      return () => {
        const subs = map[key]!.slice()
        map[key] = subs.filter((sub: SubScriber<T>) => sub !== listener)
      }
    }

    return {
      subscribe,
      dispatch
    }
  }
})()

export default getManager
