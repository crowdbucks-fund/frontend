'use client'
import { Avatar, Button, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import StripeAvatar from 'assets/images/stripe-avatar.png'
import { useConnectToStripe } from 'hooks/useConnectToStripe'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

export type StripeCardProps = {
  name: string
  stripeUrl: string
  partiallyConnect?: boolean
}

export const StripeCard: FC<StripeCardProps> = ({ name, stripeUrl, partiallyConnect = false }) => {
  const router = useRouter()
  const [redirecting, setIsRedirecting] = useState(false)
  const { connectToStripe, loading: isConnectingToStripe } = useConnectToStripe({
    onSuccess(data) {
      setIsRedirecting(true)
      router.push(data.url)
    },
  })
  const loading = isConnectingToStripe || redirecting
  return (
    <HStack bg="white" borderRadius="18px" px={{ base: 4, md: 8 }} py={{ base: 4, md: 9 }} w="full" justifyContent="space-between">
      <HStack gap={{ base: 3, md: 6 }}>
        <Avatar width={{ base: '46px', md: '56px' }} height={{ base: '46px', md: '56px' }} src={StripeAvatar.src} />
        <VStack align="start" gap={0}>
          <Text fontSize={{ base: '16	px', md: '24px' }} fontWeight="bold">
            {name}
          </Text>
          <Text fontSize={{ base: '12px', md: '16px' }} fontWeight="medium" color={partiallyConnect ? 'brand.black.4' : 'primary.500'}>
            {partiallyConnect ? 'Partially Connected' : 'Connected'}
          </Text>
        </VStack>
      </HStack>
      <Button
        display={{ base: 'none', md: 'flex' }}
        target="_blank"
        href={stripeUrl}
        as={partiallyConnect ? undefined : NextLink}
        onClick={partiallyConnect ? connectToStripe : undefined}
        size="lg"
        variant="outline"
        colorScheme="black"
        _active={{ bg: 'brand.gray.2' }}
        rightIcon={<ChevronRightIcon width="24px" strokeWidth="2px" />}
        isLoading={loading}
        loadingText="Connecting to stripe..."
      >
        Go to my Stripe
      </Button>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        aria-label="Go to stripe"
        target="_blank"
        href={stripeUrl}
        as={partiallyConnect ? undefined : NextLink}
        onClick={partiallyConnect ? connectToStripe : undefined}
        size="xs"
        variant="outline"
        colorScheme="black"
        isLoading={loading}
        _active={{ bg: 'brand.gray.2' }}
      >
        <ChevronRightIcon width="15px" strokeWidth="2.8px" />
      </IconButton>
    </HStack>
  )
}
