import { defineStyleConfig } from '@chakra-ui/react'

export const PinInput = defineStyleConfig({
  variants: {
    outline: {
      w: {
        md: '60px !important',
        base: '44px',
      },
      h: {
        md: '52px !important',
        base: '38px !important',
      },

      _placeholder: {
        color: 'brand.gray.1',
      },

      borderRadius: {
        md: '12px',
        base: '10px',
      },

      fontsize: {
        // md: '16px',
        base: '16px',
      },

      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: 'brand.gray.1',
      color: 'brand.black.1',
      bg: 'white',
      transitionProperty: 'all',
      _hover: {
        borderColor: 'primary.500',
        _invalid: {
          borderColor: 'red.500',
        },
      },
      _focus: {
        borderColor: 'primary.500',
        outlineWidth: 0,
        _invalid: {
          outlineWidth: 0,
          borderColor: 'red.500',
        },
      },
      _focusWithin: {
        outlineWidth: 0,
        borderColor: 'primary.500',
        _invalid: {
          outlineWidth: 0,
          borderColor: 'red.500',
        },
      },
      _focusVisible: {
        boxShadow: 'none',
        outlineWidth: 0,
        // outlineWidth: '4px',
        outlineColor: 'primary.50',
        outlineOffset: '0px',
        _invalid: {
          outlineWidth: 0,
          outlineColor: 'red.100',
        },
      },
    },
  },
})
