import { UserGoal } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'
import { queryClient } from 'lib/reactQuery'
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

useGoals.invalidateQuery = (communityId: number) => {
  return queryClient.invalidateQueries(['findGoalsByUser', communityId.toString()])
}

useGoals.setData = (communityId: number, data: UserGoal[]) => {
  return queryClient.setQueryData(['findGoalsByUser', communityId.toString()], data)
}
