'use client'
import { GetCommunityByUserResult } from '@xeronith/granola/core/spi'
import { FullPageLoading } from 'components/Loading'
import { api } from 'lib/api'
import { useParams } from 'next/navigation'
import { PropsWithChildren, createContext, useContext } from 'react'
import { useQuery } from 'react-query'
import { CommunityNotFound } from './not-found'

export const CurrentCommunityContext = createContext<(GetCommunityByUserResult & { isLoading: boolean }) | null>(null)

export default function CommunityValidatorLayout({ children }: PropsWithChildren) {
  const communityId = useParams().community.toString()
  const {
    data: community,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    retry: 0,
    queryKey: ['COMMUNITY', communityId],
    queryFn: () => {
      return api.getCommunityByUser({
        id: parseInt(communityId),
      })
    },
  })

  if (isLoading) return <FullPageLoading />
  if (isError) return <CommunityNotFound />
  if (community) return <CurrentCommunityContext.Provider value={{ ...(community || {}), isLoading: isLoading || isFetching }}>{children}</CurrentCommunityContext.Provider>
}
export const useCurrentCommunity = <T = GetCommunityByUserResult & { isLoading: boolean },>() => useContext(CurrentCommunityContext)! as T
