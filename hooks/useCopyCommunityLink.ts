import { useClipboard } from '@chakra-ui/react'
import { Community } from 'types/Community'
import { generateCommunityLink } from 'utils/community'

export const useCopyCommunityLink = (community: Community) => useClipboard(generateCommunityLink(community.handle))
