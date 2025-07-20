'use client'

import { GetProfileResult } from '@xeronith/granola/core/spi'
import { atom, useAtom } from 'jotai'
import { api } from 'lib/api'
import { QueryKey, UseQueryOptions, useQuery } from 'react-query'

export const useUserQueryKey = 'getProfile'
export const authTokenAtom = atom<string | undefined>(undefined)

export const useAuth = (options: UseQueryOptions<GetProfileResult | undefined, unknown, GetProfileResult, QueryKey> = {}) => {
  const [token] = useAtom(authTokenAtom);

  const {
    data: user,
    isLoading: loading,
    isFetching,
  } = useQuery<GetProfileResult | undefined, unknown, GetProfileResult, QueryKey>({
    ...options,
    queryFn: () => {
      return api.getProfile({})
    },
    queryKey: [useUserQueryKey],
    retry: (count, error: unknown) => {
      if ((error as Error)?.message?.includes?.('unauthorized'))
        return false;
      if (count >= 3)
        return false;
      return true;
    },
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!token
  })

  return { user, loading, isFetching }
}
