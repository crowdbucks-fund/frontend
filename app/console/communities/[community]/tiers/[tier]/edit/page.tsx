'use client'
import { useCurrentTier } from '../../components/TierValidatorLayout'
import CreateUpdateTier from '../../create-update-tier'

export default function EditTierPage() {
  const tier = useCurrentTier()

  return <CreateUpdateTier tier={tier} />
}
