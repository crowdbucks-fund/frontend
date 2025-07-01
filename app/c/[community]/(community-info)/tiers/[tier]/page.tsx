import { api } from 'lib/api.server'
import { notFound } from 'next/navigation'
import TierClientPage from './page.client'

const findTier = async (communityHandle: string, tierId: number) => {
  try {
    return await api.confirmCommunityTierExists({
      communityHandle,
      tierId,
    })
  } catch (e) {
    return null
  }
}
export default async function TierPage({ params: { community, tier } }: { params: { community: string; tier: string } }) {
  const currentTier = await findTier(community, parseInt(tier))
  if (currentTier && currentTier.belongsToCommunity) return <TierClientPage tier={currentTier} />
  return notFound()
}
