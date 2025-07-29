import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { Country } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'

export const useCountries = (options: UseQueryOptions<Country[], unknown, Country[], string[]> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getCountriesByUser'],
    queryFn: async () => (await api.getCountriesByUser({})).countries,
  })
}
