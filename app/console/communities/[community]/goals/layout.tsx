import { PropsWithChildren } from 'react'
import { GoalCreateProviders } from './components/GoalCreateProviders'

export default function TierCreateLayout({ children }: PropsWithChildren) {
  return <GoalCreateProviders>{children}</GoalCreateProviders>
}
