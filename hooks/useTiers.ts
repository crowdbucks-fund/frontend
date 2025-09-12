import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { UserTier } from '@xeronith/granola/core/objects';
import { sortTiers } from 'hooks/useTiers.server';
import { api } from 'lib/api';


export const useTiers = ({ communityId, ...options }: Omit<UndefinedInitialDataOptions<UserTier[], unknown, UserTier[], string[]>, 'queryKey'> & { communityId: number }) => {
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
