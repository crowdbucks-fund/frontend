import { QueryClient } from 'react-query'
import { ApiError } from './api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      onError(error) {
        const message = (error as ApiError).message
        console.log(error)
        if (message === 'unauthorized') {
          window.location.assign(`/auth/logout/`)
        }
      },
    },
    mutations: {
      retry: false,
      onError(error) {
        const message = (error as ApiError).message
        if (message === 'unauthorized') {
          window.location.assign(`/auth/logout/`)
        }
      },
    },
  },
})
