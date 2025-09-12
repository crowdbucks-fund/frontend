import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query"
import { PaymentMethod } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'

export const usePaymentMethods = (options: Omit<UndefinedInitialDataOptions<PaymentMethod[], unknown, PaymentMethod[], string[]>, 'queryKey'> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getPaymentMethodsByUser'],
    queryFn: async () => (await api.getPaymentMethodsByUser({})).paymentMethods,
  })
}
