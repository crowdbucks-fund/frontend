"use client";
import { Box, VStack } from "@chakra-ui/react";
import { CommunityTabLayout } from "app/console/communities/[community]/components/community-layout";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import {
  CommunityPreview,
  CommunityPreviewSlim,
} from "app/console/communities/components/CommunityPreview";
import CupIcon from "assets/icons/cup.svg?react";
import TreeIcon from "assets/icons/tree.svg?react";
import { usePathname } from "next/navigation";
import { FC, PropsWithChildren } from "react";
import {
  getCommunityGoalsLink,
  getCommunityLink,
  getCommunityTiersLink,
} from "utils/community";

export const CommunityPublicPageLayoutWithDetails: FC<PropsWithChildren> = ({
  children,
}) => {
  const community = useCurrentCommunity();
  const pathname = usePathname();

  return (
    <VStack gap={{ base: 2, md: 6 }} w="full">
      <Box display={{ base: "none", md: "block" }} w="full">
        <CommunityPreviewSlim community={community} />
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
            icon: <TreeIcon width="24px" />,
            href: getCommunityLink(community),
            props: {
              activatedLink:
                pathname === getCommunityLink(community) ||
                pathname === getCommunityTiersLink(community),
            },
          },
          {
            title: "Goals",
            icon: <CupIcon width="24px" />,
            href: getCommunityGoalsLink(community),
          },
        ]}
      >
        {children}
      </CommunityTabLayout>
    </VStack>
  );
};
