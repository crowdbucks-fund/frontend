"use client";
import { Button, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { UserBankInfo } from "@xeronith/granola/core/objects";
import AddIcon from "assets/icons/add-square.svg?react";
import PaymentMethodSymbol from "assets/icons/payment-method-symbol.svg?react";
import TrashIcon from "assets/icons/trash.svg?react";
import VisaIcon from "assets/icons/visa.svg?react";
import { FC } from "react";
import { useAuth } from "states/console/user";
import { formatCardNumber } from "utils/number";

export type PaymentCardProps = {
  bankInfo: UserBankInfo;
  href?: string;
  onDelete?: () => void;
};

export const PaymentCard: FC<PaymentCardProps> = ({
  bankInfo,
  href,
  onDelete,
}) => {
  const { user } = useAuth();
  return (
    <VStack
      role="group"
      gap={7}
      color="brand.black.1"
      p={8}
      bg="#DBECEA90"
      borderRadius="xl"
      w="full"
      align="start"
      border="solid 2px"
      borderColor="#C9E1DE"
    >
      <HStack justify="space-between" w="full">
        <PaymentMethodSymbol />
        {onDelete && (
          <IconButton
            aria-label="Delete Payment Method"
            variant="ghost"
            size="sm"
            colorScheme="blackAlpha"
            onClick={onDelete}
          >
            <TrashIcon width="24px" />
          </IconButton>
        )}
      </HStack>
      <VStack align="start">
        <Text fontFamily="monospace" fontSize="30px">
          {formatCardNumber(bankInfo.cardNumber)}
        </Text>
        <Text fontSize="17px">{user?.displayName || "Holder name"}</Text>
      </VStack>
      <HStack gap={4} justify="space-between" w="full" color="primary.500">
        <Button
          variant="link"
          fontWeight="normal"
          colorScheme="primary"
          textUnderlineOffset={3}
          _groupHover={
            {
              // textDecoration: 'underline',
            }
          }
        >
          For XYZ Community
        </Button>
        <VisaIcon height="50px" style={{ transform: "translateY(-15px)" }} />
      </HStack>
    </VStack>
  );
};

export const CreatePaymentCard: FC = () => {
  const { user } = useAuth();
  return (
    <VStack
      role="group"
      gap={7}
      color="brand.black.4"
      p={8}
      bg="white"
      borderRadius="xl"
      w="full"
      align="start"
      border="dashed 2px"
      borderColor="primary.500"
    >
      <HStack justify="space-between" w="full" opacity="0.3">
        <PaymentMethodSymbol />
      </HStack>
      <VStack align="start">
        <Text fontFamily="monospace" fontSize="30px">
          {formatCardNumber("1111111111111111")}
        </Text>
        <Text fontSize="17px">{user?.displayName || "Holder name"}</Text>
      </VStack>
      <HStack gap={4} justify="space-between" w="full">
        <Button
          variant="link"
          fontWeight="normal"
          colorScheme="primary"
          textUnderlineOffset={3}
          _groupHover={{
            textDecoration: "underline",
          }}
        >
          Add another one
        </Button>
        <IconButton
          aria-label="create new community"
          color="primary.500"
          variant="ghost"
        >
          <AddIcon width="38px" />
        </IconButton>
      </HStack>
    </VStack>
  );
};
