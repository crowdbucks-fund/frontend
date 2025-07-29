import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query"
import { Currency } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'

export const useCurrencies = (options: Omit<UndefinedInitialDataOptions<Currency[], unknown, Currency[], string[]>, 'queryKey'> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getCurrenciesByUser'],
    queryFn: async () => (await api.getCurrenciesByUser({})).currencies,
  })
}
