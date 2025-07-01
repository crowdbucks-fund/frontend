'use client'
import { Button, Text, VStack } from '@chakra-ui/react'
import { ResponsiveDialog } from 'components/ResponsiveDialog'
import { useCommunities } from 'hooks/useCommunities'
import { useConnectToStripe } from 'hooks/useConnectToStripe'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { useAuth } from 'states/console/user'
import { Community } from 'types/Community'
import { CommunityPreview } from './CommunityPreview'

export type CreateCommunityModalProps = {
  community: Community
  isOpen: boolean
  onClose: () => void
}
export const CommunityCreateSuccessModal: FC<CreateCommunityModalProps> = ({ community, isOpen, onClose }) => {
  const { data: communities } = useCommunities()
  const { user } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { connectToStripe, loading: isConnectingToStripe } = useConnectToStripe({
    onSuccess(data) {
      setIsRedirecting(true)
      router.push(data.url)
    },
  })
  if (!user || !communities) return null

  const data = user?.stripeAccountConnected
    ? communities.length > 0
      ? {
          title: 'You have your community ready!',
          description: 'But before anything, create tiers to collect money',
          btn: 'Create tiers',
          href: `/console/communities/${community.id}/tiers`,
          modalTitle: 'Create tier',
        }
      : {
          title: 'You have your first community ready!',
          description: 'But before anything, create tiers to collect money',
          btn: 'Create tiers',
          href: `/console/communities/${community.id}/tiers`,
          modalTitle: 'Create tier',
        }
    : communities.length > 0
    ? {
        title: 'You have your community ready!',
        description: 'But before anything, connect to stripe to collect money',
        btn: 'Connect to stripe',
        modalTitle: 'Connect to Stripe',
        buttonProps: {
          onClick: connectToStripe,
          isLoading: isConnectingToStripe || isRedirecting,
          loadingText: 'Connecting to stripe',
        },
      }
    : {
        title: 'You have your first community ready!',
        description: 'But before anything, connect to stripe to collect money',
        btn: 'Connect to stripe',
        modalTitle: 'Connect to Stripe',
        buttonProps: {
          onClick: connectToStripe,
          isLoading: isConnectingToStripe || isRedirecting,
          loadingText: 'Connecting to stripe',
        },
      }

  return (
    <ResponsiveDialog isOpen={isOpen} onClose={onClose} title={data.modalTitle} showTitleOnMobile={false}>
      <VStack gap={6} w="full">
        <VStack textAlign="center" justifyContent="center" alignItems="center" gap={{ base: 1, md: 2 }}>
          <Text fontWeight="bold" fontSize={{ base: '18px', md: '25px' }}>
            {data.title}
          </Text>
          <Text color="#343333" fontSize={{ base: '14px', md: '18px' }}>
            {data.description}
          </Text>
        </VStack>
        <CommunityPreview community={community} compact />
        <Button w="full" as={data.href ? NextLink : undefined} colorScheme="primary" size="lg" variant="solid" href={data.href ? data.href : undefined} {...(data.buttonProps || {})}>
          {data.btn}
        </Button>
      </VStack>
    </ResponsiveDialog>
  )
}
