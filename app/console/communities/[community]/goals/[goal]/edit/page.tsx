'use client'
import { useCurrentGoal } from '../../components/goal-validator-layout'
import CreateUpdateTier from '../../create-update-goal'

export default function EditTierPage() {
  const goal = useCurrentGoal()

  return (
    <>
      <CreateUpdateTier goal={goal} />
    </>
  )
}
