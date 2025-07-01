import { defineStyleConfig } from '@chakra-ui/react'

export const Container = defineStyleConfig({
  variants: {
    gray: {
      maxW: 'inherit',
      bg: 'brand.gray.3',
      border: '1px solid',
      borderColor: 'brand.gray.2',
      p: {
        base: 8,
      },
      rounded: {
        base: '18px',
      },
    },
  },
})
