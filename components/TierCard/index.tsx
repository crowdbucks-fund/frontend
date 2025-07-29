"use client";
import {
  Button,
  ButtonProps,
  HStack,
  IconButton,
  StackProps,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { GetCommunityByUserResult } from "@xeronith/granola/core/spi";
import AddIcon from "assets/icons/add-square.svg?react";
import TickSquare from "assets/icons/tick-square.svg?react";
import TrashIcon from "assets/icons/trash.svg?react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { LocalUserTier } from "types/Tier";

const DeleteIcon = chakra(TrashIcon);
const RecommendedIcon = chakra(TickSquare);

export type TierCardProps = {
  tier: LocalUserTier;
  href?: string;
  onDelete?: () => void;
  community: GetCommunityByUserResult;
  editable?: boolean;
  format?: "preview";
  btnText?: string;
  buttonProps?: ButtonProps & { href?: string };
} & StackProps;

export const TierCard: FC<TierCardProps> = ({
  tier,
  href,
  onDelete,
  community,
  format,
  editable = true,
  btnText = "Edit tier",
  buttonProps = {},
  ...props
}) => {
  const router = useRouter();
  const handleOnClick = () => {
    if (href) router.push(href);
  };

  return (
    <VStack
      role="group"
      gap={{ base: 4, md: 5 }}
      border="none"
      // borderColor={tier.recommended ? "secondary.500" : "transparent"}
      color="brand.black.1"
      p={{ md: 8, base: 4 }}
      bg="white"
      borderRadius="18px"
      w="full"
      align="start"
      onClick={handleOnClick}
      cursor={href && "pointer"}
      overflow="hidden"
      {...props}
    >
      {tier.recommended && (
        <Text
          fontSize={{ base: "14px", md: "14px" }}
          fontWeight="bold"
          bg="secondary.500"
          display="flex"
          gap="1"
          alignItems="center"
          justifyContent="center"
          p="2"
          rounded="8px"
          color="white"
          mb="-2"
        >
          <RecommendedIcon w="16px" strokeWidth="4px" />
          Recommended
        </Text>
      )}
      <HStack justify="space-between" w="full" overflow="hidden">
        <VStack align="start" overflow="hidden" gap={{ base: 0, md: 3 }}>
          <Text
            fontSize={{ base: "14px", md: "20px" }}
            fontWeight="bold"
            isTruncated
            maxW="100%"
          >
            {tier.name}
          </Text>
          <Text fontSize={{ base: "12px", md: "16px" }}>
            {tier.subscribers || "0"} people helping{" "}
            <Text
              as="span"
              ml="2"
              pl="2"
              borderLeft="2px solid"
              borderLeftColor="primary.500"
              textTransform="lowercase"
            >
              ${tier.amount} per {tier.tierFrequency?.unit}
            </Text>
          </Text>
        </VStack>
        {onDelete && (
          <IconButton
            aria-label="Delete Payment Method"
            variant="ghost"
            size="sm"
            colorScheme="blackAlpha"
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete();
            }}
          >
            <DeleteIcon w={{ md: "24px", base: "18px" }} />
          </IconButton>
        )}
      </HStack>
      <Text
        fontSize={{ base: "14px", md: "md" }}
        isTruncated
        noOfLines={3}
        whiteSpace="normal"
        wordBreak="break-word"
        maxW="100%"
      >
        {tier.caption}
      </Text>
      {editable && (
        <HStack gap={4} justify="space-between" w="full" color={"primary.500"}>
          <Button
            pointerEvents={format === "preview" ? "none" : "unset"}
            as={format !== "preview" ? NextLink : undefined}
            cursor={format === "preview" ? "default" : "cursor"}
            w="full"
            colorScheme={format === "preview" ? "primary" : "gray"}
            color={format === "preview" ? "white" : "primary.500"}
            border={format !== "preview" ? "2px solid" : undefined}
            borderColor={format !== "preview" ? "gray.200" : undefined}
            size="lg"
            variant="solid"
            href={
              format !== "preview"
                ? `/console/tiers/${tier.id}/edit`
                : undefined
            }
            onClick={(e) => e.stopPropagation()}
            {...buttonProps}
          >
            {btnText}
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export const CreateTierCard: FC = () => {
  // const community = useCurrentCommunity();
  return (
    <VStack
      display={{ base: "none", md: "flex" }}
      as={NextLink}
      href={`/console/tiers/create`}
      overflow="hidden"
      role="group"
      gap={7}
      color="brand.black.4"
      p={8}
      bg="white"
      borderRadius={{ base: "12px", md: "18px" }}
      w="full"
      align="start"
      border="dashed 2px"
      borderColor="primary.500"
    >
      <HStack overflow="hidden" justify="space-between" w="full" opacity="0.8">
        <VStack align="start">
          <Text fontSize="20px" fontWeight="bold">
            New tier
          </Text>
          <Text fontSize="16px">
            0 people helping{" "}
            <Text
              as="span"
              ml="3"
              pl="3"
              borderLeft="2px solid"
              borderLeftColor="primary.500"
            >
              $0 per month
            </Text>
          </Text>
        </VStack>
      </HStack>
      <Text
        overflow="hidden"
        noOfLines={3}
        whiteSpace="normal"
        wordBreak="break-word"
        maxW="100%"
      >
        Create a new funding tier to offer unique benefits and start receiving
        support from your community.
      </Text>
      <HStack gap={4} justify="end" w="full">
        <IconButton
          aria-label="create new tier"
          color="primary.500"
          variant="ghost"
        >
          <AddIcon width="38px" />
        </IconButton>
      </HStack>
    </VStack>
  );
};
