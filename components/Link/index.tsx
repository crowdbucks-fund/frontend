'use client'
import { LinkProps, chakra } from '@chakra-ui/react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { RefObject, forwardRef } from 'react'

export const Link = chakra(NextLink)

type ActiveLinkProps = {
  startsWith?: boolean
  activeProps?: LinkProps
  href: string
  activatedLink?: boolean
} & LinkProps &
  NextLinkProps

export const ActiveLink = forwardRef<RefObject<any>, ActiveLinkProps>(function ActiveLink(props, ref) {
  const pathname = usePathname()
  let tmpProps = { ...props }
  const isActive = props.activatedLink || (props.startsWith ? (pathname.startsWith(props.href) ? true : false) : pathname === props.href)
  delete tmpProps.activatedLink
  tmpProps.color = isActive ? 'primary.500 !important' : props.color
  tmpProps = isActive ? { ...tmpProps, ...(tmpProps.activeProps || {}) } : tmpProps

  delete tmpProps.startsWith
  delete tmpProps.activeProps

  return <Link ref={ref} {...tmpProps} />
})
