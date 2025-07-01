import { drawerAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

export const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(drawerAnatomy.keys)

export const Drawer = defineMultiStyleConfig({
  baseStyle: {
    dialog: {
      borderTopRadius: '24px',
    },
  },
})
