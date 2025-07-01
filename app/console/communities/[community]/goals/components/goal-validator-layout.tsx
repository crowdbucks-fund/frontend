'use client'
import { GetGoalByUserResult } from '@xeronith/granola/core/spi'
import { FullPageLoading } from 'components/Loading'
import { api } from 'lib/api'
import { useParams } from 'next/navigation'
import { PropsWithChildren, createContext, useContext } from 'react'
import { useQuery } from 'react-query'
import { GoalNotFound } from './not-found'

const CurrentGoalContext = createContext<GetGoalByUserResult | null>(null)
export const useCurrentGoal = () => useContext(CurrentGoalContext)!

export default function GoalValidatorLayout({ children }: PropsWithChildren) {
  const goalId = useParams().goal.toString()
  const {
    data: goal,
    isLoading,
    isError,
  } = useQuery({
    retry: 0,
    queryKey: ['GOAL', goalId],
    queryFn: () => {
      return api.getGoalByUser({
        id: parseInt(goalId),
      })
    },
  })

  if (isLoading) return <FullPageLoading />
  if (isError) return <GoalNotFound />
  if (goal) return <CurrentGoalContext.Provider value={goal}>{children}</CurrentGoalContext.Provider>
}
