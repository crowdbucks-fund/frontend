"use client";

import { FindCommunityByUserResult } from "@xeronith/granola/core/spi";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { CenterLayout } from "app/console/components/CenterLayout";
import { GoalCard } from "components/GoalCard";
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
      link: "/console",
      title: "Console",
    },
    showConsoleMenu: false,
  });
  return (
    <CenterLayout maxW={{ md: "630px" }} mx="auto" gap="8">
      {community.goals
        .sort((a, b) => a.priority - b.priority)
        .map((goal) => {
          return (
            <GoalCard
              key={goal.id}
              community={community}
              goal={goal}
              btnText={`Help grow a seed`}
              buttonProps={{
                as: NextLink,
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
