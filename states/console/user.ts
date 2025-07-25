'use client'

import { GetProfileResult } from '@xeronith/granola/core/spi'
import { atom, useAtom } from 'jotai'
import { api } from 'lib/api'
import { queryClient } from 'lib/reactQuery'
import { usePathname } from 'next/navigation'
import { QueryKey, UseQueryOptions, useQuery } from 'react-query'

export const useUserQueryKey = 'getProfile'
export const userProfileSSR = atom<GetProfileResult | null>(null)

export const useAuth = (options: UseQueryOptions<GetProfileResult | undefined, unknown, GetProfileResult, QueryKey> = {}) => {
  const [userProfileFromServer] = useAtom(userProfileSSR);
  const pathName = usePathname();
  const {
    data: user,
    isLoading: loading,
    isFetching,
  } = useQuery<GetProfileResult | undefined, unknown, GetProfileResult, QueryKey>({
    ...options,
    queryFn: () => api.getProfile({}),
    queryKey: [useUserQueryKey],
    retry: (count, error: unknown) => {
      const errorMessage = ((error as Error)?.message)
      if (errorMessage) {
        const networkErrorTerms = ['network', 'failed to fetch', 'offline', 'connection', 'timeout'];
        if (networkErrorTerms.some(term => errorMessage.toLowerCase().includes(term))) {
          return true; // Always retry for network-related errors
        }
      }
      // if ((error as Error)?.message?.includes?.('unauthorized'))
      return false;
      // return false;
    },
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialData: userProfileFromServer || undefined,
    enabled: !!userProfileFromServer || !pathName.startsWith('/c/')
  })

  return { user, loading, isFetching }
}

useAuth.invalidateQuery = () => {
  queryClient.invalidateQueries([useUserQueryKey])
}

useAuth.setData = (data: GetProfileResult | null) => {
  queryClient.setQueryData<GetProfileResult | null>([useUserQueryKey], data)
}

useAuth.fetchProfile = async () => {
  useAuth.setData(await api.getProfile({}));
}
