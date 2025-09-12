import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const baseStyle = definePartsStyle((props) => ({
  control: {
    rounded: 'md',
    borderColor: 'brand.black.3',
    _checked: {
      borderColor: `${props.colorScheme}.500`,
    },
  },
  label: {
    fontSize: { md: '16px' },
  },
}))

export const Checkbox = defineMultiStyleConfig({
  defaultProps: {
    variant: 'outline',
    size: 'lg',
    colorScheme: 'primary',
  },
  variants: {
    outline: baseStyle,
  },
  sizes: {
    lg: {
      control: {
        width: { base: '21px', md: '25px' },
        height: { base: '21px', md: '25px' },
      },
      label: {
        fontSize: { md: '18px', base: '14px' },
        fontWeight: 'bold',
        ml: '14px',
      },
    },
  },
})
