"use client";
import { Box, Button, HStack, VStack, chakra } from "@chakra-ui/react";
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
import EditIconBase from "assets/images/edit.svg?react";
import { CreateFirstEntity } from "components/FirstEntity";
import { CreateGoalCard, GoalCard, GoalCardProps } from "components/GoalCard";
import { FullPageLoading } from "components/Loading";
import { toast } from "components/Toast";
import { useGoals } from "hooks/useGoals";
import { api } from "lib/api";
import { queryClient } from "lib/reactQuery";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { FC, useCallback, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { useCurrentCommunity } from "../../components/community-validator-layout";
import { DeleteGoalModal } from "../../goals/components/DeleteGoalModal";

const EditIcon = chakra(EditIconBase);

export default function GoalsPage() {
  const [deletingGoal, setIsDeletingGoal] = useState<UserGoal | null>(null);
  const community = useCurrentCommunity();
  const { data: goals, isLoading } = useGoals({
    communityId: community.id,
  });
  const pathname = usePathname();
  useUpdateBreadcrumb(
    {
      breadcrumb: [
        {
          title: `${community!.name}`,
          link: `/console`,
        },
        {
          title: `Goals`,
          link: pathname,
          startsWith: true,
        },
      ],
      title: `${community!.name} goals`,
    },
    []
  );

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

  const handleDragEnd = useCallback((event: any) => {
    const goals = useGoals.getData(community.id);
    if (!goals) return;
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = goals.findIndex((goal) => goal.id === active.id);
      const newIndex = goals.findIndex((goal) => goal.id === over.id);
      const newArr = arrayMove(goals, oldIndex, newIndex);
      useGoals.setData(community.id, newArr);
      updateGoalsPriority({
        goalPriorities: newArr.map((goal, i) => ({
          id: goal.id,
          priority: i + 1,
        })),
      });
    }
  }, []);

  const extraGoal = useMemo(() => {
    if (goals) {
      const extraGoal = goals.find(
        (goal) => goal.accumulatedFunds - goal.amount > 0
      );
      const [totalRaised, totalAmount] = goals.reduce(
        ([raised, amount], goal) => {
          return [raised + goal.accumulatedFunds, amount + goal.amount];
        },
        [0, 0]
      );
      if (extraGoal) {
        const extraDonationAmount = totalRaised - totalAmount;
        return {
          accumulatedFunds: extraDonationAmount,
          amount: extraDonationAmount,
          title: "Extra Donation",
          caption: `Goals are met! $${totalRaised} raised of $${totalAmount} goal + $${extraDonationAmount} extra thanks to generous donors! Your community keeps giving. Put their trust to work by starting your next goal now.`,
          communityId: community.id,
          currency: extraGoal.currency,
          goalFrequency: extraGoal.goalFrequency,
          name: "Extra Donation",
          priority: extraGoal.priority + 1,
          timestamp: extraGoal.timestamp + 1,
          id: extraGoal.id + 1,
        } as UserGoal;
      }
    }
    return null;
  }, [goals]);

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
        link={`/console/goals/create`}
      />
    );

  if (goals) {
    return (
      <Box position="relative">
        <HStack py="4" w="full" display={{ base: "flex", md: "none" }}>
          <Button
            as={NextLink}
            href={`/console/goals/create`}
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
              items={goals.map((goal) => goal.id)}
              strategy={verticalListSortingStrategy}
            >
              {goals.map((goal, i) => {
                return (
                  <DraggableGoalCard
                    key={goal.id}
                    index={i}
                    goal={goal}
                    community={community}
                    onDelete={setIsDeletingGoal.bind(null, goal)}
                    goalPriorityLoading={isMutatingGoalsPriority}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
          {extraGoal && (
            <GoalCard
              community={community}
              goal={extraGoal}
              btnText={"Convert to a goal"}
              extra
              buttonProps={{
                w: "full",
                as: NextLink,
                href: `/console/goals/create`,
              }}
            />
          )}
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
  GoalCardProps & { goalPriorityLoading: boolean; index: number }
> = ({ goal, community, onDelete, goalPriorityLoading, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id: goal.id, disabled: goalPriorityLoading });
  const style = {
    transform: CSS.Transform.toString({
      x: isSorting ? 0 : transform?.x ?? 0,
      y: transform?.y ?? 0,
      scaleX: transform?.scaleX ?? 1,
      scaleY: transform?.scaleY ?? 1,
    }),
    transition,
    zIndex: isDragging ? 999 : undefined,
  };
  return (
    <GoalCard
      dragRef={setNodeRef}
      draggable
      goal={{
        ...goal,
        priority: index + 1,
        accumulatedFunds:
          goal.accumulatedFunds > goal.amount
            ? goal.amount
            : goal.accumulatedFunds,
      }}
      style={style}
      community={community}
      onDelete={onDelete}
      attributes={attributes}
      listeners={listeners}
      btnText={
        <EditIcon
          width={{ base: "18px", md: "24px" }}
          height={{ base: "18px", md: "24px" }}
        />
      }
      buttonProps={{
        w: "auto",
        title: "Edit goal",
      }}
    />
  );
};
