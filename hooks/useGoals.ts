import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query"
import { UserGoal } from '@xeronith/granola/core/objects'
import { sortGoals } from 'hooks/useGoals.server'
import { api } from 'lib/api'
import { queryClient } from 'lib/reactQuery'

export const useGoals = ({ communityId, ...options }: Omit<UndefinedInitialDataOptions<UserGoal[], unknown, UserGoal[], string[]>, 'queryKey'> & { communityId: number }) => {
  return useQuery({
    ...options,
    queryKey: ['findGoalsByUser', communityId.toString()],
    queryFn: async () =>
      (
        await api.findGoalsByUser({
          communityId,
        })
      ).goals.sort(sortGoals)
  })
}

useGoals.invalidateQuery = (communityId: number) => {
  return queryClient.invalidateQueries({ queryKey: ['findGoalsByUser', communityId.toString()] })
}

useGoals.setData = (communityId: number, data: UserGoal[]) => {
  return queryClient.setQueryData(['findGoalsByUser', communityId.toString()], data)
}

useGoals.getData = (communityId: number) => {
  return queryClient.getQueryData<UserGoal[]>(['findGoalsByUser', communityId.toString()])
}
