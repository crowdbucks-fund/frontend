import { CreateStripePaymentIntentByUserRequest, CreateStripePaymentIntentByUserResult } from '@xeronith/granola/core/spi'
import { api } from 'lib/api'
import { UseMutationOptions, useMutation } from 'react-query'

export const useCreateStripeIntent = (options: Omit<UseMutationOptions<CreateStripePaymentIntentByUserResult, unknown, CreateStripePaymentIntentByUserRequest, unknown>, 'mutationFn'> = {}) => {
  return useMutation(api.createStripePaymentIntentByUser.bind(api), { ...options })
}
