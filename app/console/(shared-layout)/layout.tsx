import { SharedLayout as GlobalSharedLayout } from 'app/console/components/SharedLayout'
import { PropsWithChildren } from 'react'

export default function SharedLayout({ children }: PropsWithChildren) {
  return <GlobalSharedLayout flexGrow={{ base: 1, md: 'unset' }}>{children}</GlobalSharedLayout>
}
