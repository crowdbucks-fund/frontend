import { Country } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'
import { UseQueryOptions, useQuery } from 'react-query'

export const useCountries = (options: UseQueryOptions<Country[], unknown, Country[], string[]> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getCountriesByUser'],
    queryFn: async () => (await api.getCountriesByUser({})).countries,
  })
}
