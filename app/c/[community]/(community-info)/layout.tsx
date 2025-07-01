import { setAuthCookie } from 'app/auth/page'
import { PropsWithChildren } from 'react'
import CommunityInfoLayoutClient from './layout.client'

export default function CommunityInfoLayout({ children }: PropsWithChildren) {
  return <CommunityInfoLayoutClient onAuthorize={setAuthCookie}> {children}</CommunityInfoLayoutClient>
}
