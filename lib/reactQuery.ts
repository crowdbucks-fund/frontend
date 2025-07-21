import { QueryClient } from 'react-query';
import { ApiError } from './api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (count, error: unknown) => {
        const errorMessage = ((error as Error)?.message)
        if (errorMessage) {
          const networkErrorTerms = ['network', 'failed to fetch', 'offline', 'connection', 'timeout'];
          if (networkErrorTerms.some(term => errorMessage.toLowerCase().includes(term))) {
            return true; // Always retry for network-related errors
          }
        }
        return false
      },
      onError(error) {
        const message = (error as ApiError).message
        if (message === 'unauthorized') {
          window.location.assign(`/auth/logout/`)
        }
      },
    },
    mutations: {
      retry: (count, error: unknown) => {
        const errorMessage = ((error as Error)?.message)
        if (errorMessage) {
          const networkErrorTerms = ['network', 'failed to fetch', 'offline', 'connection', 'timeout'];
          if (networkErrorTerms.some(term => errorMessage.toLowerCase().includes(term))) {
            return true; // Always retry for network-related errors
          }
        }
        return false
      },
      onError(error) {
        const message = (error as ApiError).message
        if (message === 'unauthorized') {
          window.location.assign(`/auth/logout/`)
        }
      },
    },
  },
})
