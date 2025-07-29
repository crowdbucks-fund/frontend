import { Box, Flex, FlexProps } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface ModalOverlayProps extends FlexProps {
  children: ReactNode;
  [key: string]: any;
}

interface ModalContentProps extends FlexProps {
  children: ReactNode;
  [key: string]: any;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  children,
  ...rest
}) => {
  return (
    <Flex
      position="fixed"
      zIndex={1500}
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="blackAlpha.600"
      alignItems="center"
      flexDirection="column"
      overflow="auto"
      minH="100vh"
      p={4}
      style={{ backdropFilter: "blur(8px)" }}
      {...rest}
    >
      {children}
    </Flex>
  );
};

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  ...rest
}) => (
  <Box
    mt="auto"
    mb="auto"
    bg="white"
    borderRadius="md"
    boxShadow="lg"
    position="relative"
    maxW="fit-content"
    w="full"
    h="fit-content"
    minH="fit-content"
    p={6}
    overflow="auto"
    {...rest}
  >
    {children}
  </Box>
);

export const Modal: React.FC<ModalProps & FlexProps> = ({
  isOpen,
  onClose,
  children,
  ...rest
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <ModalOverlay
          key="modal"
          onClick={onClose}
          as={motion.div}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
            exit: { opacity: 0 },
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          visibility={rest.visibility}
        >
          <ModalContent
            {...rest}
            as={motion.div}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.95 },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            zIndex={1600}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};
