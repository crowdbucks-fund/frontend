"use client";
import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UserGoal } from "@xeronith/granola/core/objects";
import GoalIcon from "assets/icons/cup.svg?react";
import { CreateFirstEntity } from "components/FirstEntity";
import { CreateGoalCard, GoalCard, GoalCardProps } from "components/GoalCard";
import { FullPageLoading } from "components/Loading";
import { toast } from "components/Toast";
import { useGoals } from "hooks/useGoals";
import { api } from "lib/api";
import { queryClient } from "lib/reactQuery";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useCurrentCommunity } from "../../components/community-validator-layout";
import { DeleteGoalModal } from "../../goals/components/DeleteGoalModal";

export default function GoalsPage() {
  const params = useParams();
  const [deletingGoal, setIsDeletingGoal] = useState<UserGoal | null>(null);
  const community = useCurrentCommunity();
  const { data: goals, isLoading } = useGoals({
    communityId: community.id,
  });
  const [localGoals, setLocalGoals] = useState<UserGoal[]>([]);

  useEffect(() => {
    if (goals) setLocalGoals(goals);
  }, [goals]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const { mutate: updateGoalsPriority, isLoading: isMutatingGoalsPriority } =
    useMutation(api.updateGoalsPriorityByUser.bind(api), {
      onSuccess: () => {
        toast({
          status: "success",
          title: "Goals priority updated successfully",
        });
        queryClient.invalidateQueries("findGoalsByUser");
      },
    });

  const handleDragEnd = (event: any) => {
    if (!goals) return;
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = goals.findIndex((goal) => goal.id === active.id);
      const newIndex = goals.findIndex((goal) => goal.id === over.id);

      const newArr = arrayMove(goals, oldIndex, newIndex);
      setLocalGoals(newArr);
      updateGoalsPriority({
        goalPriorities: newArr.map((goal, i) => ({
          id: goal.id,
          priority: i + 1,
        })),
      });
    }
  };

  if (isLoading) return <FullPageLoading />;
  if (goals && !goals.length)
    return (
      <CreateFirstEntity
        mobileButtonText={
          <HStack>
            <GoalIcon width="20px" />
            <span>Create a goal</span>
          </HStack>
        }
        title="Make dreams come true"
        btnText="Create your first goal"
        link={`/console/communities/${params.community}/goals/create`}
      />
    );

  if (goals) {
    return (
      <Box position="relative">
        <HStack py="4" w="full" display={{ base: "flex", md: "none" }}>
          <Button
            as={NextLink}
            href={`/console/communities/${params.community}/goals/create`}
            px="10"
            variant="outline"
            colorScheme="primary-glass"
            color="primary.500"
            _hover={{ bg: "primary-glass.500" }}
            _active={{ bg: "primary-glass.500" }}
            borderWidth="1px"
            borderColor="primary.500"
            size="lg"
            bg="primary-glass.500"
            w="full"
          >
            Add goal
          </Button>
        </HStack>
        <VStack maxW={{ md: "630px" }} mx="auto" gap={{ base: 4, md: 8 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localGoals.map((goal) => goal.id)}
              strategy={verticalListSortingStrategy}
            >
              {localGoals.map((goal) => {
                return (
                  <DraggableGoalCard
                    key={goal.id}
                    goal={goal}
                    community={community}
                    onDelete={setIsDeletingGoal.bind(null, goal)}
                    goalPriorityLoading={isMutatingGoalsPriority}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
          <CreateGoalCard />
          <DeleteGoalModal
            isOpen={!!deletingGoal}
            deletingGoal={deletingGoal}
            onClose={setIsDeletingGoal.bind(null, null)}
          />
        </VStack>
      </Box>
    );
  }
}

const DraggableGoalCard: FC<
  GoalCardProps & { goalPriorityLoading: boolean }
> = ({ goal, community, onDelete, goalPriorityLoading }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id, disabled: goalPriorityLoading });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
  };
  return (
    <GoalCard
      dragRef={setNodeRef}
      draggable
      goal={goal}
      style={style}
      community={community}
      onDelete={onDelete}
      attributes={attributes}
      listeners={listeners}
    />
  );
};
