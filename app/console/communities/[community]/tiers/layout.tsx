import { PropsWithChildren } from 'react'
import { TierCreateProviders } from './components/TierCreateProviders'

export default function TierCreateLayout({ children }: PropsWithChildren) {
  return <TierCreateProviders>{children}</TierCreateProviders>
}
