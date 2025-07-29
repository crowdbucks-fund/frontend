import { QueryClient } from "@tanstack/react-query";
import { ApiError } from './api';

const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    const networkErrorTerms = ['network', 'failed to fetch', 'offline', 'connection', 'timeout', 'load failed'];
    return networkErrorTerms.some(term => errorMessage.includes(term));
  }
  return false;
};
export const formatErrorMessage = (error: unknown): string => {
  if ((error as Error)?.message) {
    const errorMessage = (error as Error).message.toLowerCase();
    const networkErrorTerms = ['network', 'failed to fetch', 'offline', 'connection', 'timeout', 'load failed'];
    if (networkErrorTerms.some(term => errorMessage.includes(term))) {
      return 'Network error, please try again later.';
    }
    return (error as Error).message;
  }
  return 'An unexpected error occurred.';
}


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (count, error: unknown) => {
        if (isNetworkError(error))
          return true
        return false
      },
      throwOnError(error) {
        const message = (error as ApiError).message
        if (message === 'unauthorized') {
          if (window.location.pathname.startsWith('/console'))
            window.location.assign(`/auth/logout/`)
          return false;
        }
        return true;
      },
    },
    mutations: {
      retry: (count, error: unknown) => {
        if (isNetworkError(error))
          return true
        return false
      },
      onError(error) {
        const message = (error as ApiError).message
        if (message === 'unauthorized') {
          if (window.location.pathname.startsWith('/console'))
            window.location.assign(`/auth/logout/`)
        }
      },
    },
  },
})
