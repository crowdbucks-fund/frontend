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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  defaultAnimateLayoutChanges,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "@tanstack/react-query";
import { UserGoal } from "@xeronith/granola/core/objects";
import GoalIcon from "assets/icons/cup.svg?react";
import EditIconBase from "assets/images/edit.svg?react";
import { CreateFirstEntity } from "components/FirstEntity";
import {
  CreateGoalCard,
  GoalCard,
  GoalCardProps,
  TotalDonationCard,
} from "components/GoalCard";
import { FullPageLoading } from "components/Loading";
import { toast } from "components/Toast";
import { useGoals } from "hooks/useGoals";
import { api } from "lib/api";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode, useCallback, useMemo, useState } from "react";
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
      title: `${community!.name}`,
    },
    []
  );

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const { mutate: updateGoalsPriority, isPending: isMutatingGoalsPriority } =
    useMutation({
      mutationFn: api.updateGoalsPriorityByUser.bind(api),
      onSuccess: () => {
        toast({
          status: "success",
          title: "Goals priority updated successfully",
        });
        // queryClient.invalidateQueries({ queryKey: ["findGoalsByUser"] });
      },
    });

  const handleDragOver = useCallback((event: any) => {
    const goals = useGoals.getData(community.id);
    if (!goals) return;
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = goals.findIndex((goal) => goal.id === active.id);
      const newIndex = goals.findIndex((goal) => goal.id === over.id);
      const newArr = arrayMove(goals, oldIndex, newIndex);
      useGoals.setData(community.id, newArr);
      updateGoalsPriority({
        goalPriorities: useGoals.getData(community.id)!.map((goal, i) => ({
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
          title: "Extra Donations",
          caption: `Goals are met! $${totalRaised} raised of $${totalAmount} goal + $${extraDonationAmount} extra thanks to generous donors! Your community keeps giving. Put their trust to work by starting your next goal now.`,
          communityId: community.id,
          currency: extraGoal.currency,
          goalFrequency: extraGoal.goalFrequency,
          name: "Extra Donations",
          priority: extraGoal.priority + 1,
          timestamp: extraGoal.timestamp + 1,
          id: extraGoal.id + 1,
        } as UserGoal;
      }
    }
    return null;
  }, [goals]);

  const orders = useMemo(() => goals?.map((goal) => goal.id) || [], [goals]);

  const totalAccumulatedFunds = useMemo(
    () => goals?.reduce((fund, goal) => fund + goal.accumulatedFunds, 0) || 0,
    [goals]
  );

  if (isLoading) return <FullPageLoading />;
  if (goals && !goals.length)
    return (
      <VStack maxW={{ md: "630px" }} mx="auto" w="full">
        <CreateFirstEntity
          noEntityTitle="There’s no goal defined yet!"
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
        <TotalDonationCard community={community} />
      </VStack>
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
            onDragEnd={handleDragOver}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={orders}
              disabled={isMutatingGoalsPriority}
              strategy={verticalListSortingStrategy}
            >
              {
                goals.reduce<[number, ReactNode[]]>(
                  ([remainingAcFunds, renderingGoals], goal, i) => {
                    goal.accumulatedFunds =
                      remainingAcFunds > goal.amount
                        ? goal.amount
                        : remainingAcFunds;
                    renderingGoals.push(
                      <DraggableGoalCard
                        key={goal.id}
                        index={i}
                        goal={goal}
                        community={community}
                        onDelete={setIsDeletingGoal.bind(null, goal)}
                        goalPriorityLoading={isMutatingGoalsPriority}
                      />
                    );
                    return [
                      (remainingAcFunds -= goal.accumulatedFunds),
                      renderingGoals,
                    ];
                  },
                  [totalAccumulatedFunds, []] as const
                )[1]
              }
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
                leftIcon: (
                  <EditIcon
                    width={{ base: "18px", md: "24px" }}
                    height={{ base: "18px", md: "24px" }}
                  />
                ),
              }}
            />
          )}
          <TotalDonationCard community={community} />
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
  GoalCardProps & {
    goalPriorityLoading: boolean;
    index: number;
  }
> = ({ goal, community, onDelete, goalPriorityLoading, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({
    id: goal.id,
    disabled: goalPriorityLoading,
    animateLayoutChanges: defaultAnimateLayoutChanges,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isSorting ? transition : undefined,
    zIndex: isDragging ? 999 : undefined,
  };
  return (
    <GoalCard
      dragRef={setNodeRef}
      draggable
      goal={{
        ...goal,
        priority: index + 1,
        accumulatedFunds: Math.min(goal.accumulatedFunds, goal.amount),
        // goal.accumulatedFunds > goal.amount
        // ? goal.amount
        // : goal.accumulatedFunds,
      }}
      style={style}
      community={community}
      onDelete={onDelete}
      attributes={attributes}
      listeners={listeners}
      btnText={
        <>
          <EditIcon
            width={{ base: "18px", md: "24px" }}
            height={{ base: "18px", md: "24px" }}
          />
          Edit goal
        </>
      }
      buttonProps={{
        w: "full",
        title: "Edit goal",
      }}
    />
  );
};
