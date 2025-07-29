import { BoxProps, chakra } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { MouseEvent, ReactNode, useEffect, useRef } from "react";

export interface BottomSheetProps extends BoxProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const BottomSheetOverlay = chakra("div", {
  baseStyle: {
    position: "fixed",
    inset: 0,
    bg: "blackAlpha.600",
    transition: "background-color 0.2s",
    zIndex: 1500,
  },
});

export const BottomSheetContent = chakra(motion.div, {
  baseStyle: {
    overflow: "hidden",
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    mx: "auto",
    borderTopRadius: "2xl",
    boxShadow: "lg",
    maxW: "full",
    w: "100%",
    pb: 4,
    pt: 6,
    px: 4,
    bg: "white",
    zIndex: 1600,
  },
  shouldForwardProp() {
    return true;
  },
});

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  ...props
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    const el = contentRef.current;
    el.focus();
  }, [isOpen]);

  return (
    // <Portal>
    <AnimatePresence initial={false}>
      {isOpen && (
        <BottomSheetOverlay
          key="bottomsheet-overlay"
          onClick={onClose}
          as={motion.div}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
            exit: { opacity: 0 },
          }}
          // @ts-expect-error transition in motion.div is not compatible with chakra transition
          transition={{
            type: "tween",
            ease: "easeOut",
            duration: 0.2,
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          {...props}
        />
      )}
      {isOpen && (
        <BottomSheetContent
          key="bottomsheet-content"
          ref={contentRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          onClick={(e: MouseEvent) => e.stopPropagation()}
          // @ts-expect-error transition in motion.div is not compatible with chakra transition
          transition={{
            type: "tween",
            ease: [0.25, 0.1, 0.25, 1],
            duration: 0.35,
          }}
          variants={{
            hidden: { y: "100%" },
            visible: { y: "0" },
            exit: { y: "100%" },
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          {...props}
        >
          {children}
        </BottomSheetContent>
      )}
    </AnimatePresence>
    // </Portal>
  );
};

export default BottomSheet;
