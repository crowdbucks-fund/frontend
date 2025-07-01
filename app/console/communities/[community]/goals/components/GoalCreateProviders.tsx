'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, PropsWithChildren } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCurrentCommunity } from '../../components/community-validator-layout'
import { goalZodSchema } from '../create-update-goal'

export const GoalCreateProviders: FC<PropsWithChildren> = ({ children }) => {
  const community = useCurrentCommunity()
  const communityId = community.id
  const form = useForm<z.infer<typeof goalZodSchema>>({
    defaultValues: {
      id: 0,
      name: '',
      caption: '',
      accumulatedFunds: 0,
      amount: undefined,
      priority: 0,
      timestamp: new Date().getTime(),
      communityId,
    },
    resolver: zodResolver(goalZodSchema),
  })
  return <FormProvider {...form}>{children}</FormProvider>
}
