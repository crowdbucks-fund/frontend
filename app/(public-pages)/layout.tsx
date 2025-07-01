import { PropsWithChildren } from 'react'

export default function PublicPageLayout({ children }: PropsWithChildren) {
  return <div id="public-page">{children}</div>
}
