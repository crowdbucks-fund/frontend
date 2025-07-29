"use client";
import { chakra, VStack } from "@chakra-ui/react";
import { CommunityTabLayout } from "app/console/communities/[community]/components/community-layout";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import CupIconBase from "assets/icons/cup.svg?react";
import TreeIconBase from "assets/icons/tree.svg?react";
import { usePathname } from "next/navigation";
import { FC, PropsWithChildren } from "react";
import {
  getCommunityGoalsLink,
  getCommunityLink,
  getCommunityTiersLink,
} from "utils/community";

const CupIcon = chakra(CupIconBase);
const TreeIcon = chakra(TreeIconBase);

export const CommunityPublicPageLayoutWithDetails: FC<PropsWithChildren> = ({
  children,
}) => {
  const community = useCurrentCommunity();
  const pathname = usePathname();

  return (
    <VStack gap={{ base: 2, md: 6 }} w="full">
      <CommunityTabLayout
        community={community}
        communityPreview={true}
        links={(community) => [
          {
            title: "Tiers",
            icon: (
              <TreeIcon width="24px" display={{ base: "none", md: "block" }} />
            ),
            href: getCommunityLink(community),
            props: {
              activatedLink:
                pathname === getCommunityLink(community) ||
                pathname === getCommunityTiersLink(community),
            },
          },
          {
            title: "Goals",
            icon: (
              <CupIcon width="24px" display={{ base: "none", md: "block" }} />
            ),
            href: getCommunityGoalsLink(community),
          },
        ]}
      >
        {children}
      </CommunityTabLayout>
    </VStack>
  );
};
