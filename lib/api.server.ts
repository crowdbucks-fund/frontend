import API from '@xeronith/granola'

export const api = new API(process.env.NEXT_PUBLIC_API_BASE as string, {
  clientSideValidationEnabled: true,
  suppressConsoleOutput: true,
})
export type ApiError = { message: string }
