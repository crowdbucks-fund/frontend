"use client";
import { Box, IconButton, Text, VStack } from "@chakra-ui/react";
import { BottomSheet } from "components/BottomSheet";
import { Modal } from "components/Modal";
import { XIcon } from "lucide-react";
import { FC, PropsWithChildren } from "react";

export type ResponsiveDialogProps = PropsWithChildren<{
  title: string;
  isOpen: boolean;
  onClose: () => void;
  showTitleOnMobile?: boolean;
  showCloseButton?: boolean;
}>;

export const ResponsiveDialog: FC<ResponsiveDialogProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showTitleOnMobile = false,
  showCloseButton = true,
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        visibility={{ md: "visible", base: "hidden" }}
        rounded="2xl"
        pt="5"
        px="10"
        pb="4"
        position="relative"
        overflow="hidden"
      >
        <Box>
          {
            <Text
              fontSize="18px"
              color="brand.black.4"
              fontWeight="normal"
              mt="4"
              minH={"24px"}
              maxW={showCloseButton ? "calc(100% - 40px)" : "100%"}
              isTruncated
            >
              {title}
            </Text>
          }
          {showCloseButton && (
            <IconButton
              aria-label="Close dialog"
              size="sm"
              position="absolute"
              color="brand.black.4"
              variant="ghost"
              top={8}
              right={8}
              onClick={onClose}
            >
              <XIcon />
            </IconButton>
          )}
          <VStack gap={6} py={6} pt={3}>
            {children}
          </VStack>
        </Box>
      </Modal>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        visibility={{ md: "hidden", base: "visible" }}
      >
        {showTitleOnMobile && (
          <Text
            fontSize="14px"
            display="block"
            w="full"
            textAlign="center"
            py="4"
          >
            {title}
          </Text>
        )}
        {children}
      </BottomSheet>
    </>
  );
};
