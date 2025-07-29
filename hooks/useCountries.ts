import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query"
import { Country } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'

export const useCountries = (options: Omit<UndefinedInitialDataOptions<Country[], unknown, Country[], string[]>, 'queryKey'> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getCountriesByUser'],
    queryFn: async () => (await api.getCountriesByUser({})).countries,
  })
}
