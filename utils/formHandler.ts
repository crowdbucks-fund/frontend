import { FormEvent } from 'react'

export const handleSubmit = (callback: Function) => (e: FormEvent) => {
  e.preventDefault()
  callback()
}
