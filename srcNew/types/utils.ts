export type valueof<O, T extends keyof O = keyof O> = T extends never
  ? never
  : O[T]

export type Timeout = string | number | NodeJS.Timeout | undefined
