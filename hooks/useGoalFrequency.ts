import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query"
import { GoalFrequency } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'

export const useGoalsFrequency = (options: Omit<UndefinedInitialDataOptions<GoalFrequency[], unknown, GoalFrequency[], string[]>, 'queryKey'> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getGoalFrequenciesByUser'],
    queryFn: async () => (await api.getGoalFrequenciesByUser({})).goalFrequencies,
  })
}
