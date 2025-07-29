import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query"
import { TierFrequency } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'

export const useTierFrequency = (options: Omit<UndefinedInitialDataOptions<TierFrequency[], unknown, TierFrequency[], string[]>, 'queryKey'> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getTierFrequenciesByUser'],
    queryFn: async () => (await api.getTierFrequenciesByUser({})).tierFrequencies,
  })
}
