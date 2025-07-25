"use client";

import { FindCommunityByUserResult } from "@xeronith/granola/core/spi";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { CenterLayout } from "app/console/components/CenterLayout";
import { GoalCard } from "components/GoalCard";
import { sortGoals } from "hooks/useGoals.server";
import NextLink from "next/link";
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
    </CenterLayout>
  );
}
