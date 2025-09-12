import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query"
import { UserCommunity } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'

export const useCommunities = (options: Omit<UndefinedInitialDataOptions<UserCommunity[], unknown, UserCommunity[], string[]>, 'queryKey'> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getCommunitiesByUser'],
    staleTime: 1000,
    queryFn: async () => (await api.getCommunitiesByUser({})).communities,
  })
}
