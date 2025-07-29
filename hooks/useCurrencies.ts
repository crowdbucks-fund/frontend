import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { Currency } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'

export const useCurrencies = (options: UseQueryOptions<Currency[], unknown, Currency[], string[]> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getCurrenciesByUser'],
    queryFn: async () => (await api.getCurrenciesByUser({})).currencies,
  })
}
