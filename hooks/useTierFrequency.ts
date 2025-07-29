import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { TierFrequency } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'

export const useTierFrequency = (options: UseQueryOptions<TierFrequency[], unknown, TierFrequency[], string[]> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getTierFrequenciesByUser'],
    queryFn: async () => (await api.getTierFrequenciesByUser({})).tierFrequencies,
  })
}
