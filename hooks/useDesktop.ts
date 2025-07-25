import { useBreakpointValue } from '@chakra-ui/react'

export const useDesktop = () => useBreakpointValue({ md: true, base: false }, { fallback: 'md' })
