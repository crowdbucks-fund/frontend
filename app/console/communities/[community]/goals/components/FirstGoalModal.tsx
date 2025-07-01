"use client";
import { Button, Text, VStack, useClipboard } from "@chakra-ui/react";
import { UserGoal } from "@xeronith/granola/core/objects";
import ShareIcon from "assets/icons/Share my community.svg?react";
import { GoalCard } from "components/GoalCard";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { toast } from "components/Toast";
import { FC, useEffect } from "react";
import { generateCommunityLink } from "utils/community";
import { useCurrentCommunity } from "../../components/community-validator-layout";

export type FirstGoalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  goal: UserGoal | null;
};

export const FirstGoalModal: FC<FirstGoalModalProps> = ({
  isOpen,
  onClose,
  goal,
}) => {
  const community = useCurrentCommunity();
  const { onCopy, hasCopied } = useClipboard(
    generateCommunityLink(community.handle, false)
  );
  useEffect(() => {
    if (hasCopied)
      toast({
        status: "success",
        title: `Copied the link to ${community.name} community`,
        description: generateCommunityLink(community.handle, false),
      });
  }, [hasCopied]);
  return (
    <ResponsiveDialog isOpen={isOpen} onClose={onClose} title="">
      <VStack gap={{ base: 4, md: 6 }} w="full">
        <VStack
          w="full"
          gap={{ base: 0, md: 2 }}
          justify="center"
          textAlign="center"
        >
          <Text fontWeight="bold" fontSize={{ base: "18px", md: "24px" }}>
            You have your first goal ready!
          </Text>
          <Text fontSize={{ base: "14px", md: "20px" }} color="#343333">
            Share your community
          </Text>
        </VStack>
        {goal && (
          <GoalCard
            editable={false}
            community={community}
            goal={goal}
            border="2px solid"
            borderColor={"brand.gray.1"}
          />
        )}
        <Button
          onClick={onCopy}
          leftIcon={<ShareIcon />}
          colorScheme="primary"
          variant="solid"
          w="full"
          size="lg"
        >
          Share my community
        </Button>
      </VStack>
    </ResponsiveDialog>
  );
};
