'use client'
import { atom, useSetAtom } from 'jotai'
import { useEffect } from 'react'

export type BreadcrumbLinksType = {
  breadcrumb: { title: string; link: string; startsWith?: boolean }[]
  title?: string
  showConsoleMenu?: boolean
  back?: {
    title: string
    link: string
  }
}
export const breadcrumbLinks = atom<BreadcrumbLinksType>({ breadcrumb: [] })
export const useUpdateBreadcrumb = (links: BreadcrumbLinksType, deps: any[] = []) => {
  const updateBreadcrumb = useSetAtom(breadcrumbLinks)
  useEffect(() => {
    updateBreadcrumb(links)
  }, deps)
}

export const breadcrumbs: Record<string, BreadcrumbLinksType> = {
  '/console': {
    breadcrumb: [
      {
        title: 'Home',
        link: '/console',
      },
    ],
  },
  '/console/communities': {
    breadcrumb: [
      {
        title: 'Communities',
        link: '/console/communities',
      },
    ],
  },
  '/console/stripe': {
    breadcrumb: [
      {
        title: 'Stripe',
        link: '/console/stripe',
      },
    ],
  },
  '/console/edit-profile': {
    breadcrumb: [
      {
        title: `Home`,
        link: `/console/`,
      },
      {
        title: `Edit profile`,
        link: '/console/edit-profile',
      },
    ],
    showConsoleMenu: false,
    title: 'Edit profile',
    back: {
      link: '/console',
      title: 'Console',
    },
  },
}
