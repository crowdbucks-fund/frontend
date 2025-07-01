import { defineStyleConfig } from '@chakra-ui/react'
import { InputFieldStyles } from './input'

export const Textarea = defineStyleConfig({
  variants: {
    outline: InputFieldStyles,
  },
})
