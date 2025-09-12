'use client'

import { QueryKey, UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query"
import { GetProfileResult } from '@xeronith/granola/core/spi'
import { atom, useAtom } from 'jotai'
import { api } from 'lib/api'
import { store } from 'lib/jotai'
import { queryClient } from 'lib/reactQuery'

export const useUserQueryKey = ['getProfile']
export const userProfileSSR = atom<GetProfileResult | null>(null)

export const useAuth = (options: Omit<UndefinedInitialDataOptions<GetProfileResult | null, unknown, GetProfileResult, QueryKey>, 'queryKey'> = {}) => {
  const [userProfileFromServer, setUserProfile] = useAtom(userProfileSSR);

  const {
    isLoading: loading,
    isFetching,
  } = useQuery<GetProfileResult | null, unknown, GetProfileResult, QueryKey>({
    ...options,
    queryFn: () => {
      return api.getProfile({}).then((data) => {
        setUserProfile(data)
        return data;
      })
      // rely only on server data
      return null
    },
    queryKey: useUserQueryKey,
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
    initialData: userProfileFromServer,
  })
  return { user: userProfileFromServer, loading, isFetching }
}

useAuth.invalidateQuery = () => {
  queryClient.invalidateQueries({ queryKey: [useUserQueryKey] })
}

useAuth.setData = (data: GetProfileResult | null) => {
  queryClient.setQueryData<GetProfileResult | null>([useUserQueryKey], data)
  store.set(userProfileSSR, data)
}

useAuth.fetchProfile = async () => {
  await api.getProfile({}).then(data => {
    useAuth.setData(data)
    store.set(userProfileSSR, data)
  })
}
