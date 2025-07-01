import { TierFrequency } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'
import { UseQueryOptions, useQuery } from 'react-query'

export const useTierFrequency = (options: UseQueryOptions<TierFrequency[], unknown, TierFrequency[], string[]> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getTierFrequenciesByUser'],
    queryFn: async () => (await api.getTierFrequenciesByUser({})).tierFrequencies,
  })
}
