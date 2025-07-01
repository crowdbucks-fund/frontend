import { Button, Text, VStack } from '@chakra-ui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import NextLink from 'next/link'
import { useCurrentCommunity } from '../../components/community-validator-layout'

export const GoalNotFound = () => {
  const community = useCurrentCommunity()
  return (
    <VStack justify="center" flexGrow={1}>
      <Text color="red.500">
        <ExclamationTriangleIcon width="48px" height="48px" />
      </Text>
      <Text fontWeight="bold" fontSize="28px">
        Goal not found!
      </Text>
      <Button href={`/console/communities/${community.id}/goals`} as={NextLink} variant="outline" colorScheme="primary" size="lg">
        Back to community
      </Button>
    </VStack>
  )
}
