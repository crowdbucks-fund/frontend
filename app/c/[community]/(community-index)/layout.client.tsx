"use client";
import { Box, chakra, VStack } from "@chakra-ui/react";
import { CommunityTabLayout } from "app/console/communities/[community]/components/community-layout";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { CommunityPreview } from "app/console/communities/components/CommunityPreview";
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
      <Box display={{ base: "none", md: "block" }} w="full">
        <CommunityPreview community={community} />
      </Box>

      <CommunityTabLayout
        community={community}
        communityPreview={false}
        beforeTab={
          <Box
            pt={{ md: "7" }}
            w="full"
            display={{ base: "block", md: "none" }}
          >
            <CommunityPreview
              shareCommunity
              showSummary
              community={community}
            />
          </Box>
        }
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
