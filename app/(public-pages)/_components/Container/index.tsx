'use client'

import { Box, BoxProps } from '@chakra-ui/react'
import { FC } from 'react'

export const Container: FC<BoxProps> = (props) => {
  return <Box mx="auto" maxW="1168px" w="full" px="6" {...props} />
}
