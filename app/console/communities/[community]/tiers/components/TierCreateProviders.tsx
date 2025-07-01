'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, PropsWithChildren } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCurrentCommunity } from '../../components/community-validator-layout'
import { tierZodSchema } from '../create-update-tier'

export const TierCreateProviders: FC<PropsWithChildren> = ({ children }) => {
  const community = useCurrentCommunity()
  const communityId = community.id
  const form = useForm<z.infer<typeof tierZodSchema>>({
    defaultValues: {
      id: 0,
      caption: '',
      recommended: false,
      subscribers: 0,
      communityId,
    },
    resolver: zodResolver(tierZodSchema),
  })
  return <FormProvider {...form}>{children}</FormProvider>
}
