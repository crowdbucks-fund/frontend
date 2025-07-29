import { UseMutationOptions, useMutation } from "@tanstack/react-query"
import { CreateStripePaymentIntentByUserRequest, CreateStripePaymentIntentByUserResult } from '@xeronith/granola/core/spi'
import { api } from 'lib/api'

export const useCreateStripeIntent = (options: Omit<UseMutationOptions<CreateStripePaymentIntentByUserResult, unknown, CreateStripePaymentIntentByUserRequest, unknown>, 'mutationFn'> = {}) => {
  return useMutation({ ...options, mutationFn: api.createStripePaymentIntentByUser.bind(api) })
}
