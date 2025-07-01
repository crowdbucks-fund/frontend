'use client'
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, VStack, useBreakpointValue } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

export type ResponsiveDialogProps = PropsWithChildren<{
  title: string
  isOpen: boolean
  onClose: () => void
  showTitleOnMobile?: boolean
  showCloseButton?: boolean
}>

export const ResponsiveDialog: FC<ResponsiveDialogProps> = ({ isOpen, onClose, children, title, showTitleOnMobile = false, showCloseButton = true }) => {
  const isDesktop = useBreakpointValue({ md: true, base: false })
  return (
    <>
      {isDesktop && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent rounded="2xl" pt="5" px="4" pb="4">
            <ModalHeader fontSize="18px" color="brand.black.4" fontWeight="normal">
              {title}
            </ModalHeader>
            {showCloseButton && <ModalCloseButton color="brand.black.4" top={8} right={8} />}
            <ModalBody as={VStack} gap={6} py={6} pt={3}>
              {children}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {!isDesktop && (
        <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody pb="4" pt={!showTitleOnMobile ? 8 : 0}>
              {showTitleOnMobile && (
                <Text fontSize="14px" display="block" w="full" textAlign="center" py="4">
                  {title}
                </Text>
              )}
              {children}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}
