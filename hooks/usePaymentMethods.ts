import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { PaymentMethod } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'

export const usePaymentMethods = (options: UseQueryOptions<PaymentMethod[], unknown, PaymentMethod[], string[]> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getPaymentMethodsByUser'],
    queryFn: async () => (await api.getPaymentMethodsByUser({})).paymentMethods,
  })
}
