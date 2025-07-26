"use client";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { useLogout } from "hooks/useLogout";
import { useRouter } from "next/navigation";
import { FC } from "react";

export type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const LogoutModal: FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { mutate: logout, isLoading, isSuccess, isError } = useLogout(router);
  const close = () => {
    if (!isLoading && !isSuccess) onClose();
  };
  return (
    <>
      <ResponsiveDialog isOpen={isOpen} onClose={close} title="Log out">
        <VStack
          w="full"
          justify="center"
          textAlign="center"
          color="#343333"
          pb={{ base: 8, md: 0 }}
          gap={1}
        >
          <Text fontWeight="bold" fontSize={{ base: "18px", md: "28px" }}>
            Are you sure you want to log out?
          </Text>
          <Text fontSize={{ base: "14px", md: "20px" }}>
            you can log back in anytime using your email
          </Text>
        </VStack>
        <HStack justify="space-between" w="full">
          <Button
            onClick={close}
            isDisabled={isLoading || isSuccess || isError}
            size="lg"
            flexGrow={1}
            w="full"
            variant="outline"
            colorScheme="gray"
            borderColor="brand.gray.1"
            bg="brand.gray.3"
          >
            Not now
          </Button>
          <Button
            onClick={() => logout()}
            isLoading={isLoading || isSuccess || isError}
            loadingText="Logging out..."
            size="lg"
            flexGrow={1}
            w="full"
            variant="solid"
            colorScheme="primary"
          >
            Yes, log out
          </Button>
        </HStack>
      </ResponsiveDialog>
      {/* <Modal isOpen={isOpen} onClose={close} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent rounded="2xl">
          <ModalHeader fontSize="18px" color="brand.black.4" fontWeight="normal">
            Log out
          </ModalHeader>
          <ModalCloseButton color="brand.black.4" top={4} right={5} />
          <ModalBody as={VStack} gap={6} py={6}>
            <VStack w="full" justify="center" textAlign="center" color="#343333">
              <Text fontWeight="bold" fontSize="28px">
                Are you sure you want to log out?
              </Text>
              <Text fontSize="20px">you can log back in anytime using your email</Text>
            </VStack>
            <HStack justify="space-between" w="full">
              <Button onClick={close} isDisabled={isLoading || isSuccess} size="lg" flexGrow={1} w="full" variant="outline" colorScheme="gray" borderColor="brand.gray.1" bg="brand.gray.3">
                Not now
              </Button>
              <Button onClick={handleLogout} isLoading={isLoading || isSuccess} loadingText="Logging out..." size="lg" flexGrow={1} w="full" variant="solid" colorScheme="primary">
                Yes, log out
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Drawer isOpen={isOpen} onClose={close} placement="bottom">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <VStack w="full" justify="center" textAlign="center" color="#343333" py={8} gap={1}>
              <Text fontWeight="bold" fontSize="18px">
                Are you sure you want to log out?
              </Text>
              <Text fontSize="14px">you can log back in anytime using your email</Text>
            </VStack>
            <HStack justify="space-between" w="full">
              <Button onClick={close} isDisabled={isLoading || isSuccess} size="lg" flexGrow={1} w="full" variant="outline" colorScheme="gray" borderColor="brand.gray.1" bg="brand.gray.3">
                Not now
              </Button>
              <Button onClick={handleLogout} isLoading={isLoading || isSuccess} loadingText="Logging out..." size="lg" flexGrow={1} w="full" variant="solid" colorScheme="primary">
                Yes, log out
              </Button>
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer> */}
    </>
  );
};
