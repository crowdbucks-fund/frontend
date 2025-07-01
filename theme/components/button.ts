import { defineStyleConfig } from '@chakra-ui/react'

export const Button = defineStyleConfig({
  variants: {
    outline: {
      borderWidth: '2px',
      _hover: {
        bg: 'transparent',
      },
      _disabled: {
        bg: 'brand.gray.3',
        _hover: {
          bg: 'brand.gray.3 !important',
        },
      },
    },
    solid: {
      _disabled: {
        bg: 'brand.gray.1',
        _hover: {
          bg: 'brand.gray.1 !important',
        },
      },
    },
    'outline-stroke': {
      border: '2px solid ',
      borderColor: 'brand.black.1',
      rounded: '12px',
      fontWeight: 'bold',
      fontsize: '16px',
      height: '48px',
      px: '6',
    },
    'outline-gray': {
      w: 'full',
      colorScheme: 'gray',
      color: 'primary.500',
      size: 'lg',
      border: '1px solid',
      borderColor: 'brand.gray.1',
      bg: 'brand.gray.3',
    },
  },
  baseStyle: {
    _focusVisible: {
      boxShadow: 'none',
      outlineWidth: '4px',
      outlineColor: 'primary.50',
      outlineOffset: '0px',
      _invalid: {
        outlineColor: 'red.100',
      },
    },
  },
  sizes: {
    lg: {
      fontSize: {
        md: '18px !important',
        base: '14px !important',
      },
      borderRadius: {
        md: '18px',
        base: '12px',
      },
      height: {
        base: '48px',
        md: 'auto',
      },
      padding: {
        md: '18px',
        base: '12px',
      },
    },
  },
})
