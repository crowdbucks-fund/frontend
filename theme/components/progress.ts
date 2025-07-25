import { progressAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(progressAnatomy.keys)

export const Progress = defineMultiStyleConfig({
  defaultProps: {
    variant: 'solid',
  },
  variants: {
    solid: {
      track: {
        height: { md: '30px', base: '20px' },
        w: 'full',
        rounded: 'full',
        bg: 'primary-glass.500',
      },
      filledTrack: {
        borderRadius: '9999px',
        minW: '0',
        bg: 'primary.500',
      },
    },
    secondary: {
      track: {
        height: { md: '30px', base: '20px' },
        w: 'full',
        rounded: 'full',
        bg: 'secondary.200',
      },
      filledTrack: {
        borderRadius: '9999px',
        minW: '0',
        bg: 'secondary.500',
      },
    },
  },
})
