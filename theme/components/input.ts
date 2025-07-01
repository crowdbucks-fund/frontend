import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys)

export const InputFieldStyles = defineStyle({
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: 'brand.gray.1',
  outlineWidth: '0',
  color: 'brand.black.1',
  lineHeight: '22px',
  _placeholder: {
    color: 'brand.gray.1',
  },
  borderRadius: {
    md: '12px',
    base: '10px',
  },
  p: {
    md: '16px',
    base: '8px 16px',
  },
  fontSize: {
    base: '16px',
  },
  height: 'auto',

  bg: 'brand.gray.4',
  transitionProperty: 'all',
  _invalid: {
    boxShadow: 'none',
  },
  _hover: {
    borderColor: 'primary.500',
    _invalid: {
      borderColor: 'red.500',
    },
  },
  _focus: {
    outline: 0,
    borderColor: 'primary.500',
    _invalid: {
      borderColor: 'red.500',
    },
  },
  _focusWithin: {
    outline: 0,
    borderColor: 'primary.500',
    _invalid: {
      outline: 0,
      borderColor: 'red.500',
    },
  },
  _focusVisible: {
    boxShadow: 'none',
    // outlineWidth: '4px',
    outline: 0,
    outlineColor: 'primary.50',
    outlineOffset: '0px',
    _invalid: {
      outline: 0,
      outlineColor: 'red.100',
    },
  },
})

const baseStyle = definePartsStyle({
  field: InputFieldStyles,
  addon: {
    height: 'auto',
    borderWidth: '0',
    color: 'brand.black.1',
    bg: 'brand.gray.2',
    borderRadius: {
      md: '10px',
      base: '9px',
    },
  },
  group: {
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'brand.gray.1',
    outlineWidth: '0',
    color: 'brand.black.1',
    bg: 'brand.gray.2',
    boxSizing: 'border-box',
    transition: 'all var(--chakra-transition-duration-normal)',
    borderRadius: {
      md: '12px',
      base: '10px',
    },
    '&:has(input[aria-invalid=true])': {
      borderColor: 'red.500',
      '&:focus-within': {
        // boxShadow: '0px 0px 1px 4px var(--chakra-colors-red-100) !important',
      },
      'input[aria-invalid=true]': {
        // borderLeft: '2px solid ',
        borderColor: 'red.500',
      },
    },
    input: {
      border: 0,
      // borderLeft: '2px ',
      borderColor: 'brand.gray.1',
      outlineWidth: '0 !important',
    },
    _groupHover: {
      borderColor: 'primary.500',
      input: {
        borderColor: 'primary.500',
      },
      _invalid: {
        outline: 0,
        borderColor: 'red.500',
      },
    },
    _hover: {
      borderColor: 'primary.500',
      input: {
        borderColor: 'primary.500',
      },
      _invalid: {
        borderColor: 'red.500',
      },
    },
    _focusWithin: {
      borderColor: 'primary.500',
      // boxShadow: '0px 0px 1px 4px var(--chakra-colors-primary-50)',
    },
  },
})

export const Input = defineMultiStyleConfig({
  variants: {
    outline: baseStyle,
  },
})
