// 理智的一面初始名称
export const INIT_GOOD_NAME = 'A'
// 脆弱的一面初始名称
export const INIT_BAD_NAME = 'B'
// 当记录条数大于 100 时保存文件
export const MAX_LENGTH = 100
// 每隔 1min 保存文件
export const MAX_GAP = 60000
// 消息类型
export const type = {
  normal: 1, // 普通消息
  revert: 2, // 撤回
  strong: 3 // 高亮
} as const
// 撤回消息文案
export const revertText = '撤回了一条消息'
// 消息操作类型
export const operationType = {
  strong: 2,
  copy: 1,
  revert: 0,
  top: 3
} as const
export const userId = {
  good: 0,
  bad: 1
} as const
