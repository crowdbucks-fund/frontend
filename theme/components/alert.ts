import { alertAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import clsx from 'clsx'
const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(alertAnatomy.keys)

export const Alert = defineMultiStyleConfig({
  variants: {
    brand: definePartsStyle(({ status }) => ({
      container: {
        borderRadius: '99px',
        borderWidth: '2px',
        borderColor: clsx({
          'primary-glass.600': status === 'success',
          'red.400': status === 'error',
        }),
        bg: 'white',
        py: '2',
        px: '3',
      },
      icon: {
        color: clsx({
          'primary.500': status === 'success',
          'red.400': status === 'error',
        }),
      },
    })),
    subtle: definePartsStyle({
      container: {
        rounded: 'xl',
        borderWidth: '2px',
        padding: {
          base: 4,
          md: 6,
        },
        color: 'brand.black.1',
      },
      title: {
        fontSize: {
          base: '12px',
          md: '20px',
        },
        fontWeight: {
          base: 'normal',
          md: 'bold',
        },
      },
      description: {
        fontWeight: 'normal',
        fontSize: {
          base: '12px',
          md: '18px',
        },
      },
    }),
  },
})
