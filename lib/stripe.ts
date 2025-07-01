import { GetProfileResult } from '@xeronith/granola/core/spi'

export const isStripeConnected = (user: GetProfileResult | null) => {
  return !!(user?.stripeAccountConnected && user.stripeAccountInfo && user.stripeAccountInfo.detailsSubmitted)
}
