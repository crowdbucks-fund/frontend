'use client'
import { CompleteStripeAccountDetailsByUserResult, ConnectStripeAccountByUserResult } from '@xeronith/granola/core/spi'
import { api } from 'lib/api'
import { platformInfo } from 'platform'
import { useMutation } from 'react-query'
import { useAuth } from 'states/console/user'
import { joinURL, withQuery } from 'ufo'

export type useConnectToStripeType = (props: { onSuccess: (data: ConnectStripeAccountByUserResult | CompleteStripeAccountDetailsByUserResult) => any }) => {
  loading: boolean
  connectToStripe: () => any
}

export const useConnectToStripe: useConnectToStripeType = ({ onSuccess }) => {
  const { user } = useAuth()
  const returnUrl = joinURL(platformInfo.url, '/console/stripe');
  const stripeConnectParams = {
    returnUrl: withQuery(returnUrl, { verify: '' }),
    refreshUrl: returnUrl
  }
  const { mutate: getStripeConnectUrl, isLoading } = useMutation(api.connectStripeAccountByUser.bind(api), {
    onSuccess,
  })

  const { mutate: completeStripeAccountDetails, isLoading: isCompletingStripeAccountDetails } = useMutation(api.completeStripeAccountDetailsByUser.bind(api), {
    onSuccess,
  })
  const connectToStripe = async () => {
    if (user?.stripeAccountConnected) completeStripeAccountDetails(stripeConnectParams)
    else getStripeConnectUrl(stripeConnectParams)
  }

  return {
    loading: isLoading || isCompletingStripeAccountDetails,
    connectToStripe,
  }
}
