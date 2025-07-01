import { GoalFrequency } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'
import { UseQueryOptions, useQuery } from 'react-query'

export const useGoalsFrequency = (options: UseQueryOptions<GoalFrequency[], unknown, GoalFrequency[], string[]> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getGoalFrequenciesByUser'],
    queryFn: async () => (await api.getGoalFrequenciesByUser({})).goalFrequencies,
  })
}
