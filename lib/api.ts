import API from '@xeronith/granola'

export const api = new API(process.env.NEXT_PUBLIC_API_BASE as string)
export type ApiError = { message: string }
