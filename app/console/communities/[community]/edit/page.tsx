'use client'

import CreateUpdateCommunityPage from '../../create-update-community'
import { useCurrentCommunity } from '../components/community-validator-layout'

export default function CommunityEdit() {
  const community = useCurrentCommunity()

  return <CreateUpdateCommunityPage community={community} />
}
