"use client";
import {
  Box,
  Button,
  ButtonProps,
  HStack,
  IconButton,
  Progress,
  StackProps,
  Text,
  Tooltip,
  VStack,
  chakra,
  useClipboard,
} from "@chakra-ui/react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { UserGoal } from "@xeronith/granola/core/objects";
import { GetCommunityByUserResult } from "@xeronith/granola/core/spi";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import AddIcon from "assets/icons/add-square.svg?react";
import LinkIconBase from "assets/icons/link-2.svg?react";
import TrashIcon from "assets/icons/trash.svg?react";
import { format as dateFormat } from "date-fns";
import { useDesktop } from "hooks/useDesktop";
import { MenuIcon } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { FC, ReactNode } from "react";
import { getCommunityGoalsLink } from "utils/community";

const LinkIcon = chakra(LinkIconBase);
const DeleteIcon = chakra(TrashIcon);
const ZERO_PROGRESS_GOAL_PROGRESS = 0;

export type GoalCardProps = {
  goal: UserGoal;
  copyLinkButton?: boolean;
  href?: string;
  onDelete?: () => void;
  community: GetCommunityByUserResult;
  editable?: boolean;
  format?: "preview";
  btnText?: ReactNode;
  draggable?: boolean;
  attributes?: DraggableAttributes;
  extra?: boolean;
  listeners?: SyntheticListenerMap | undefined;
  dragRef?: (node: HTMLElement | null) => void;
  buttonProps?: ButtonProps & { href?: string };
} & StackProps;

export const GoalCard: FC<GoalCardProps> = ({
  attributes,
  listeners,
  dragRef,
  goal,
  draggable,
  href,
  onDelete,
  community,
  format,
  editable = true,
  btnText = "Edit goal",
  buttonProps = {},
  copyLinkButton = false,
  extra = false,
  ...props
}) => {
  const router = useRouter();
  const isDesktop = useDesktop();
  const currentCommunity = useCurrentCommunity();
  const { onCopy: copyGoalLink, hasCopied: goalLinkCoppied } = useClipboard(
    getCommunityGoalsLink(currentCommunity, true) + `#goal-${goal.id}`
  );

  const handleOnClick = () => {
    if (href) router.push(href);
  };

  return (
    <VStack
      id={`goal-${goal.id}`}
      role="group"
      gap={{ base: 4, md: 7 }}
      color="brand.black.1"
      p={{ md: 8, base: 4 }}
      bg="white"
      borderRadius="xl"
      w="full"
      align="start"
      onClick={handleOnClick}
      cursor={href && "pointer"}
      overflow="hidden"
      position="relative"
      {...props}
      {...(!isDesktop
        ? {
            ...attributes,
            ...listeners,
          }
        : {})}
      ref={!isDesktop ? dragRef : undefined}
    >
      <HStack
        justify="space-between"
        w="full"
        overflow="hidden"
        gap={8}
        alignItems="center"
      >
        <HStack align="start" overflow="hidden" alignItems="center">
          <Text
            fontSize={{ md: "20px", base: "14px" }}
            fontWeight="bold"
            isTruncated
            maxW="100%"
          >
            {!extra && (
              <Text as="span" mr="3" color="primary.500">
                #{goal.priority}
              </Text>
            )}
            {goal.name}
          </Text>
          (
          <Text fontSize="16px">
            <Text
              fontSize={{
                md: "md",
                base: "10px",
              }}
              whiteSpace="nowrap"
              as="span"
              ml={{ md: "3", base: 2 }}
              pl={{ md: "3", base: 2 }}
              borderLeft="2px solid"
              borderLeftColor="primary.500"
              textTransform="lowercase"
            >
              ${goal.amount}{" "}
              {goal.goalFrequency?.name !== "Milestone"
                ? goal.goalFrequency?.name
                : null}
            </Text>
            {!extra && (
              <Text
                fontSize={{
                  md: "md",
                  base: "10px",
                }}
                whiteSpace="nowrap"
                as="span"
                ml={{ md: "3", base: 2 }}
                pl={{ md: "3", base: 2 }}
                borderLeft="2px solid"
                borderLeftColor="primary.500"
                color="brand.black.3"
                textTransform="lowercase"
              >
                {dateFormat(goal.timestamp, "yy/MM/dd")}
              </Text>
            )}
          </Text>
        </HStack>
        <HStack>
          {draggable && (
            <Button
              aria-label="Drag the goal to change its priority"
              variant="ghost"
              size="sm"
              display={{
                base: "none",
                md: "flex",
              }}
              colorScheme="blackAlpha"
              {...attributes}
              {...listeners}
              ref={dragRef}
              __css={{
                "& > svg": {
                  color: "#9CA3AF",
                  width: {
                    base: "18px",
                    md: "24px",
                  },
                },
              }}
            >
              <MenuIcon />
            </Button>
          )}
        </HStack>
      </HStack>
      {!extra && (
        <Box position="relative" w="full">
          <Progress
            value={Math.max(
              Math.min((goal.accumulatedFunds / (goal.amount || 0)) * 100, 100),
              ZERO_PROGRESS_GOAL_PROGRESS
            )}
          />
          <Text
            fontSize={{ base: "12px", md: "16px" }}
            color="#343333"
            position="absolute"
            top="50%"
            right="2"
            transform="translateY(-50%)"
          >
            $ {goal.accumulatedFunds || 0} / $ {goal.amount}
          </Text>
        </Box>
      )}
      <Text
        isTruncated
        noOfLines={3}
        fontSize={{
          md: "md",
          base: "14px",
        }}
        whiteSpace="pre-line"
        wordBreak="break-word"
        maxW="100%"
      >
        {goal.caption}
      </Text>
      {editable && (
        <HStack
          gap={{ base: 2, md: 4 }}
          justify="end"
          w="full"
          color={"primary.500"}
        >
          {onDelete && (
            <Tooltip label={"Delete goal"} placement="top">
              <Button
                colorScheme={"gray"}
                cursor={"pointer"}
                color={"red.500"}
                border={"2px solid"}
                size="lg"
                borderColor={"gray.200"}
                variant="solid"
                {...buttonProps}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete();
                }}
              >
                <DeleteIcon width={{ base: "18px", md: "24px" }} />
              </Button>
            </Tooltip>
          )}

          {copyLinkButton && (
            <Tooltip
              label={goalLinkCoppied ? "Goal link coppied" : "Copy goal link"}
              placement="top"
              closeOnClick={false}
            >
              <Button
                colorScheme={"gray"}
                cursor={"pointer"}
                border={"2px solid"}
                size="lg"
                borderColor={"gray.200"}
                variant="solid"
                color="#6B7280"
                onClick={copyGoalLink}
              >
                <LinkIcon
                  height={{ base: "18px", md: "24px" }}
                  width={{ base: "18px", md: "24px" }}
                />
              </Button>
            </Tooltip>
          )}

          <Tooltip label={buttonProps.title} placement="top">
            <Button
              as={NextLink}
              colorScheme={"gray"}
              cursor={"pointer"}
              color={"primary.500"}
              border={"2px solid"}
              borderColor={"gray.200"}
              size="lg"
              variant="solid"
              href={`/console/goals/${goal.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              {...buttonProps}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {btnText}
            </Button>
          </Tooltip>
        </HStack>
      )}
    </VStack>
  );
};

export const CreateGoalCard: FC = () => {
  const community = useCurrentCommunity();
  return (
    <VStack
      display={{ base: "none", md: "flex" }}
      as={NextLink}
      href={`/console/goals/create`}
      overflow="hidden"
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
      <HStack overflow="hidden" justify="space-between" w="full" opacity="0.8">
        <VStack align="start">
          <Text fontSize="20px" fontWeight="bold" isTruncated maxW="100%">
            New goal
          </Text>
        </VStack>
      </HStack>
      <Box position="relative" w="full">
        <Progress value={ZERO_PROGRESS_GOAL_PROGRESS} />
        <Text
          fontSize={{ base: "14px", md: "16px" }}
          color="brand.black.4"
          position="absolute"
          top="50%"
          right="2"
          transform="translateY(-50%)"
        >
          $ 0 / $ 0
        </Text>
      </Box>
      <Text
        overflow="hidden"
        noOfLines={3}
        whiteSpace="normal"
        wordBreak="break-word"
        maxW="100%"
      >
        Set a new goal to outline your vision and motivate your community to
        help you achieve it.
      </Text>
      <HStack gap={4} justify="end" w="full">
        <IconButton
          aria-label="create new goal"
          color="primary.500"
          variant="ghost"
        >
          <AddIcon width="38px" />
        </IconButton>
      </HStack>
    </VStack>
  );
};

export const TotalDonationCard: FC<{ community: GetCommunityByUserResult }> = ({
  community,
}) => (
  <VStack
    role="group"
    gap={{ base: 4, md: 7 }}
    p={{ md: 8, base: 4 }}
    bg="white"
    borderRadius={{ base: "12px", md: "18px" }}
    w="full"
    align="start"
  >
    <HStack justify="space-between" w="full" overflow="hidden">
      <VStack align="start" overflow="hidden" w="full">
        <Text
          fontSize={{ base: "14px", md: "20px" }}
          fontWeight={{ base: "normal", md: "bold" }}
          isTruncated
          maxW="100%"
        >
          Total Collected Donation
        </Text>
        <Text fontSize={{ base: "12px", md: "16px" }}>
          {String(community.helpers)} people helping{" "}
          <Text
            as="span"
            ml="2"
            pl="2"
            borderLeft="2px solid"
            borderLeftColor="primary.500"
            textTransform="lowercase"
          >
            {String(community.accumulatedFunds)} total amount
          </Text>
        </Text>
      </VStack>
    </HStack>
    <Text
      fontSize={{ base: "14px", md: "md" }}
      isTruncated
      noOfLines={3}
      whiteSpace="normal"
      wordBreak="break-word"
      maxW="100%"
    >
      Total donation amount paid by donors are shown here
    </Text>
  </VStack>
);
