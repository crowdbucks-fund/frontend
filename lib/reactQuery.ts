import { QueryClient } from "@tanstack/react-query";
import { logout } from "hooks/useLogout.server";
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

const isAuthError = (error: unknown): boolean => {
  const message = (error as ApiError).message
  return (message === 'unauthorized')
}


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (count, error: unknown) => {
        if (isAuthError(error)) {
          logout()
          return false;
        }
        if (isNetworkError(error))
          return true
        return false
      },
      throwOnError(error) {
        if (isAuthError(error)) {
          return false;
        }
        return false;
      },
    },
    mutations: {
      retry: (count, error: unknown) => {
        if (isAuthError(error)) {
          logout()
          return false;
        }
        if (isNetworkError(error))
          return true
        return false
      },
      throwOnError(error) {
        if (isAuthError(error)) {
          return false;
        }
        return false;
      },
    },
  },
})
