import { Box, VStack } from "@chakra-ui/react";
import WalletIcon from "assets/icons/empty-wallet.svg?react";
import { FC, PropsWithChildren } from "react";

export const EmptyState: FC<PropsWithChildren> = ({ children }) => {
  return (
    <VStack gap="5" color="brand.black.4" fontSize="18px" py="5">
      <WalletIcon />
      <Box>{children}</Box>
    </VStack>
  );
};
