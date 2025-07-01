'use client'
import { StackProps, VStack } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

export const CenterLayout: FC<PropsWithChildren<StackProps & { wrapperProps?: StackProps }>> = ({ children, wrapperProps, ...props }) => {
  return (
    <VStack w="full" minH="full" py={{ md: '7', base: 2 }} pb={{ base: 0, md: 7 }} flexGrow={1} {...(wrapperProps || {})}>
      <VStack
        w="full"
        gap={6}
        minH="full"
        justify="center"
        maxW={{
          base: 'full',
          md: '370px',
        }}
        mx="auto"
        {...props}
        p={{
          base: 0,
          md: 1,
        }}
      >
        {children}
      </VStack>
    </VStack>
  )
}
