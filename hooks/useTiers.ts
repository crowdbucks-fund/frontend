import { UserTier } from '@xeronith/granola/core/objects';
import { api } from 'lib/api';
import { UseQueryOptions, useQuery } from 'react-query';

export const sortTiers = (a: UserTier, b: UserTier) => {
  // Sort recommended tiers first
  if (a.recommended && !b.recommended) return -1;
  if (!a.recommended && b.recommended) return 1;
  return 0;
}

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
      ).tiers.sort(sortTiers),
  })
}
