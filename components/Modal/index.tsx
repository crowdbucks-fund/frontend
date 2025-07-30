import { chakra, Flex, FlexProps } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { ComponentProps, MouseEvent, ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface ModalOverlayProps extends FlexProps {
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

const ModalContent = chakra(motion.div, {
  baseStyle: {
    mt: "auto",
    mb: "auto",
    bg: "white",
    borderRadius: "md",
    boxShadow: "lg",
    position: "relative",
    maxW: "fit-content",
    w: "full",
    h: "fit-content",
    minH: "fit-content",
    p: 6,
    overflow: "auto",
  },
  shouldForwardProp(prop) {
    return true;
  },
});

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
          // @ts-ignore
          transition={
            {
              duration: 0.1,
              ease: "easeOut",
            } as ComponentProps<typeof motion.div>["transition"]
          }
          initial="hidden"
          animate="visible"
          exit="exit"
          visibility={rest.visibility}
        >
          <ModalContent
            {...rest}
            variants={{
              hidden: { opacity: 0, scale: 0.96 },
              visible: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.96 },
            }}
            // @ts-ignore
            transition={
              {
                opacity: {
                  duration: 0.1,
                  ease: "easeOut",
                },
                scale: {
                  duration: 0.2,
                  ease: [0.33, 1, 0.68, 1],
                },
              } as ComponentProps<typeof motion.div>["transition"]
            }
            initial="hidden"
            animate="visible"
            exit="exit"
            zIndex={1600}
            onClick={(e: MouseEvent) => {
              console.log("here");
              e.stopPropagation();
            }}
          >
            {children}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};
