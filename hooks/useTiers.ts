import { UserTier } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'
import { UseQueryOptions, useQuery } from 'react-query'

export const useTiers = ({ communityId, ...options }: UseQueryOptions<UserTier[], unknown, UserTier[], string[]> & { communityId: number }) => {
  return useQuery({
    ...options,
    queryKey: ['findTiersByUser', communityId.toString()],
    queryFn: async () =>
      (
        await api.findTiersByUser({
          communityId,
          recommended: false,
        })
      ).tiers,
  })
}
