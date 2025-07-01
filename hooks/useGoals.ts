import { UserGoal } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'
import { UseQueryOptions, useQuery } from 'react-query'

export const useGoals = ({ communityId, ...options }: UseQueryOptions<UserGoal[], unknown, UserGoal[], string[]> & { communityId: number }) => {
  return useQuery({
    ...options,
    queryKey: ['findGoalsByUser', communityId.toString()],
    queryFn: async () =>
      (
        await api.findGoalsByUser({
          communityId,
        })
      ).goals.sort((a, b) => a.priority - b.priority),
  })
}
