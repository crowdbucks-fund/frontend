import { Currency } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'
import { UseQueryOptions, useQuery } from 'react-query'

export const useCurrencies = (options: UseQueryOptions<Currency[], unknown, Currency[], string[]> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getCurrenciesByUser'],
    queryFn: async () => (await api.getCurrenciesByUser({})).currencies,
  })
}
