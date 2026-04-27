import type { operationType, type, userId } from 'srcNew/constants'
import type { valueof } from './utils'

export interface log {
  user: {
    avatar?: string
    name: string
    id: valueof<typeof userId>
  }
  type: valueof<typeof type>
  isTopped: boolean
  message: string
  timeStamp: number
  date?: string
}

export type logs = log[]

export type UpdateList = (index: number, item: log) => void

export type Permission = valueof<typeof operationType>
export type Permissions = Array<valueof<typeof operationType>>

export type Current = {
  data: log
  index: number
} | null
