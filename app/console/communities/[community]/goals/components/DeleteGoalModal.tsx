"use client";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { UserGoal } from "@xeronith/granola/core/objects";
import WarningIcon from "assets/icons/warning.svg?react";
import { GoalCard } from "components/GoalCard";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { toast } from "components/Toast";
import { useGoals } from "hooks/useGoals";
import { api } from "lib/api";
import { queryClient } from "lib/reactQuery";
import { FC } from "react";
import { useCurrentCommunity } from "../../components/community-validator-layout";

export type DeleteGoalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deletingGoal: UserGoal | null;
  onDeleted?: () => void;
};

export const DeleteGoalModal: FC<DeleteGoalModalProps> = ({
  isOpen,
  onClose,
  deletingGoal,
  onDeleted,
}) => {
  const community = useCurrentCommunity();
  const { mutate: deleteGoal, isPending: isLoading } = useMutation({
    mutationFn: async () =>
      deletingGoal ? api.removeGoalByUser({ id: deletingGoal.id }) : null,
    onSuccess() {
      toast.closeAll();
      toast({
        status: "success",
        title: deletingGoal && `The goal was successfully deleted`,
      });
      const currentGoals = useGoals.getData(community.id) || [];
      useGoals.setData(
        community.id,
        currentGoals.filter((goal) => goal.id !== deletingGoal?.id)
      );
      queryClient.invalidateQueries({ queryKey: ["findGoalsByUser"] });
      onDeleted && onDeleted();
      onClose();
    },
  });
  return (
    <ResponsiveDialog isOpen={isOpen} onClose={onClose} title="Delete Goal">
      <VStack gap={{ base: 4, md: 6 }} w="full" maxW={{ md: "450px" }}>
        <VStack
          w="full"
          justify="center"
          textAlign="center"
          gap={{ base: 1, md: 2 }}
          minW={{
            base: "full",
            md: "400px",
          }}
        >
          <WarningIcon />
          <Text fontWeight="bold" fontSize="24px">
            This goal is about to be deleted
          </Text>
        </VStack>
        {deletingGoal && (
          <GoalCard
            editable={false}
            community={community}
            goal={deletingGoal}
            border="2px solid"
            borderColor={"brand.gray.1"}
            p={5}
          />
        )}
        <Button
          onClick={() => deleteGoal()}
          isLoading={isLoading}
          colorScheme="brand.red"
          variant="outline"
          w="full"
          size="lg"
        >
          Delete anyways
        </Button>
      </VStack>
    </ResponsiveDialog>
  );
};
