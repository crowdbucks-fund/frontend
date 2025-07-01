export type Community = {
  id?: number
  name: string
  summary: string
  handle: string
  avatar: string | File | null
  banner: string | File | null
}

export type DeepReplace<T, M extends [any, any]> = {
  [P in keyof T]: T[P] extends M[0] ? Replacement<M, T[P]> : T[P] extends object ? DeepReplace<T[P], M> : T[P]
}

type Replacement<M extends [any, any], T> = M extends any ? ([T] extends [M[0]] ? M[1] : never) : never
