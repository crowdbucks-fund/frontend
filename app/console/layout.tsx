import { PropsWithChildren } from 'react'
import ConsoleLayout from './components/ConsoleLayout'
import './styles.css'

export default function ConsoleMainLayout({ children }: PropsWithChildren) {
  return <ConsoleLayout publicPage={false}>{children}</ConsoleLayout>
}
