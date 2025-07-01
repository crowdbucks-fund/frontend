import { Textarea, TextareaProps } from '@chakra-ui/react'
import React from 'react'
import ResizeTextarea from 'react-textarea-autosize'

export const AutoResizeTextarea = React.forwardRef<HTMLElement, TextareaProps>(function TextareaComponent(props, ref) {
  return <Textarea minH="unset" w="100%" overflow="hidden" ref={ref} minRows={4} as={ResizeTextarea} {...props} />
})
