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
  // useHydrateAtoms([[breadcrumbLinks, links || {}]], { store });

  useEffect(() => {
    updateBreadcrumb(links)
  }, deps)
}

