import { UserCommunity } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'
import { UseQueryOptions, useQuery } from 'react-query'

export const useCommunities = (options: UseQueryOptions<UserCommunity[], unknown, UserCommunity[], string[]> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getCommunitiesByUser'],
    queryFn: async () => (await api.getCommunitiesByUser({})).communities,
  })
}
