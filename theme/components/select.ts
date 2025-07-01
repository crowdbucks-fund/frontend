import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(selectAnatomy.keys)

export const SelectFieldStyles = {
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: 'brand.gray.1',
  outlineWidth: '0',
  color: 'brand.black.1',

  lineHeight: '22px',
  borderRadius: {
    md: '12px',
    base: '10px',
  },
  p: {
    md: '16px',
    base: '8px 16px',
  },
  fontSize: {
    md: '16px',
    base: '14px',
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
    borderColor: 'primary.500',
    outline: 0,
    _invalid: {
      outline: 0,
      borderColor: 'red.500',
    },
  },
  _focusWithin: {
    borderColor: 'primary.500',
    outline: 0,
    _invalid: {
      outline: 0,
      borderColor: 'red.500',
    },
  },
  _focusVisible: {
    boxShadow: 'none',
    outline: 0,
    outlineWidth: '4px',
    outlineColor: 'primary.50',
    outlineOffset: '0px',
    _invalid: {
      outline: 0,
      outlineColor: 'red.100',
    },
  },
}

const baseStyle = definePartsStyle({
  field: SelectFieldStyles,
})

export const Select = defineMultiStyleConfig({
  variants: {
    outline: baseStyle,
  },
})
