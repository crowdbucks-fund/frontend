'use client'

import { GetProfileResult } from '@xeronith/granola/core/spi'
import { api } from 'lib/api'
import { QueryKey, UseQueryOptions, useQuery } from 'react-query'

export const useUserQueryKey = 'getProfile'

export const useAuth = (options: UseQueryOptions<GetProfileResult, unknown, GetProfileResult, QueryKey> = {}) => {
  const {
    data: user,
    isLoading: loading,
    isFetching,
  } = useQuery<GetProfileResult, unknown, GetProfileResult, QueryKey>({
    ...options,
    queryFn: () => api.getProfile({}),
    queryKey: [useUserQueryKey],
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  return { user, loading, isFetching }
}
