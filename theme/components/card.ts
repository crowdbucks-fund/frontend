import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys)

const variants = {
  filled: definePartsStyle({
    container: {
      bg: 'brand.gray.4',
      borderRadius: {
        base: '12px',
        md: '18px',
      },
      py: {
        md: 8,
        base: 4,
      },
      px: {
        md: 8,
        base: 4,
      },
      gap: 0,
    },
    body: {
      p: 0,
      pt: {
        md: 6,
        base: 2,
      },
    },
    header: {
      fontWeight: {
        md: 'bold',
        base: 'medium',
      },
      fontsize: {
        md: '20px',
        base: '14px',
      },
      p: 0,
      '&  svg ': {
        width: {
          base: '18px',
          md: '32px',
        },
      },
    },
  }),
}

export const Card = defineMultiStyleConfig({
  variants,
  defaultProps: {
    variant: 'filled',
  },
})
