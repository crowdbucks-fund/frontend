'use client'
import { CircularProgress, HStack } from '@chakra-ui/react'

export const FullPageLoading = () => {
  return (
    <HStack w="full" align="center" justify="center" h="full" flexGrow={1}>
      <CircularProgress color="secondary.500" isIndeterminate size="40px" />
    </HStack>
  )
}
