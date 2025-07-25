"use client";

import { UserGoal } from "@xeronith/granola/core/objects";
import { FindCommunityByUserResult } from "@xeronith/granola/core/spi";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { CenterLayout } from "app/console/components/CenterLayout";
import { GoalCard } from "components/GoalCard";
import { sortGoals } from "hooks/useGoals.server";
import NextLink from "next/link";
import { useMemo } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { getCommunityLink, getCommunityTiersLink } from "utils/community";

export default function GoalsPage() {
  const community = useCurrentCommunity<FindCommunityByUserResult>();
  useUpdateBreadcrumb({
    breadcrumb: [
      {
        title: `${community.name} Community`,
        link: getCommunityLink(community),
        startsWith: true,
      },
    ],
    title: `${community.name}`,
    back: {
      link: "/console/communities",
      title: "Communities",
    },
    showConsoleMenu: false,
  });

  const extraGoal = useMemo(() => {
    if (community.goals) {
      const extraGoal = community.goals.find(
        (goal) => goal.accumulatedFunds - goal.amount > 0
      );
      const [totalRaised, totalAmount] = community.goals.reduce(
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
          caption: `Goals are met!\n$${totalRaised} raised of $${totalAmount} goal\n+ $${extraDonationAmount} extra thanks to generous donors!`,
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
  }, [community.goals]);

  return (
    <CenterLayout maxW={{ md: "630px" }} mx="auto" gap="8">
      {community.goals.sort(sortGoals).map((goal) => {
        return (
          <GoalCard
            key={goal.id}
            community={community}
            goal={goal}
            btnText={`Help achieve the goal`}
            copyLinkButton={false}
            buttonProps={{
              as: NextLink,
              w: "full",
              href: getCommunityTiersLink(community),
              variant: "solid",
              colorScheme: "primary-glass",
              color: "primary",
              border: undefined,
            }}
          />
        );
      })}
      {extraGoal && (
        <GoalCard
          community={community}
          goal={extraGoal}
          btnText={"Convert to a goal"}
          extra
          editable={false}
          buttonProps={{
            w: "full",
            as: NextLink,
            href: `/console/communities/${community.id}/goals/create`,
          }}
        />
      )}
    </CenterLayout>
  );
}
