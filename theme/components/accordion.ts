import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(accordionAnatomy.keys)

export const Accordion = defineMultiStyleConfig({
  baseStyle: {
    root: {
      w: 'full',
      display: 'flex',
      flexDirection: 'column',
    },
    container: {
      border: 0,
      gap: 4,
    },
    panel: {
      border: 0,
    },
  },
})
