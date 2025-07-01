"use client";

import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { GetCommunityByUserResult } from "@xeronith/granola/core/spi";
import CupIcon from "assets/icons/cup.svg?react";
import HomeIcon from "assets/icons/home NB.svg?react";
import TreeIcon from "assets/icons/tree.svg?react";
import { ActiveLink } from "components/Link";
import { useDesktop } from "hooks/useDesktop";
import { FC, PropsWithChildren, ReactNode } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import {
  CommunityPreview,
  CommunityPreviewSlim,
} from "../../components/CommunityPreview";
import CommunityValidatorLayout, {
  useCurrentCommunity,
} from "./community-validator-layout";

export default function CommunityLayout({ children }: PropsWithChildren) {
  return (
    <CommunityValidatorLayout>
      <CommunityLayoutComponents>{children}</CommunityLayoutComponents>
    </CommunityValidatorLayout>
  );
}

type CommunityPageProps = {
  community?: GetCommunityByUserResult;
};

export type CommunityTabLayoutProps = PropsWithChildren<{
  community: GetCommunityByUserResult;
  links: typeof links;
  communityPreview?: boolean;
  beforeTab?: ReactNode;
}>;
export const CommunityTabLayout: FC<CommunityTabLayoutProps> = ({
  links,
  community,
  children,
  communityPreview = true,
  beforeTab,
}) => {
  const isDesktop = useDesktop();
  return (
    <VStack flexGrow={{ base: 1, md: "unset" }} w="full">
      <Box
        bg={{
          base: "brand.gray.3",
          md: "transparent",
        }}
        position={{
          base: "sticky",
          md: "static",
        }}
        zIndex={1}
        top={0}
        pb={{ base: 2, md: 0 }}
        w="full"
      >
        {beforeTab}
        {communityPreview && (
          <>
            <Box display={{ base: "none", md: "block" }} w="full" pb="6">
              <CommunityPreviewSlim community={community} />
            </Box>
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
          </>
        )}
        <HStack
          justify={{ base: "center", md: "start" }}
          bg={{ base: "white", md: "transparent" }}
          rounded="md"
          p={{ base: 1, md: 0 }}
          w="full"
          gap={{ base: 1, md: 4 }}
        >
          {links(community!).map((tab) => {
            return (
              <Button
                key={tab.title}
                variant="outline"
                fontWeight="medium"
                colorScheme="primary-glass"
                color={{ base: "brand.black.3" }}
                borderWidth={{ base: "0", md: "2px" }}
                borderColor={{ md: "brand.gray.2" }}
                fontSize={{ base: "14px", md: "18px" }}
                py={{ base: "8px", md: 3 }}
                px={{ base: "8px", md: 4 }}
                h={{ base: "fit-content" }}
                as={ActiveLink}
                flexGrow={{ base: 1, md: 0 }}
                maxW={{ base: `${100 / links.length}%`, md: "unset" }}
                activeProps={{
                  borderColor: {
                    base: "transparent",
                    md: "brand.black.2 !important",
                  },
                  color: {
                    base: "primary.500 !important",
                    md: "brand.black.2 !important",
                  },
                  fontWeight: "bold !important",
                  bg: {
                    base: "primary-glass.500 !important",
                    md: "transparent !important",
                  },
                  _hover: {
                    bg: {
                      base: "primary-glass.500 !important",
                      md: "transparent !important",
                    },
                  },
                }}
                leftIcon={isDesktop ? tab.icon : undefined}
                href={tab.href}
                scroll={false}
                {...(tab.props || {})}
              >
                {tab.title}
              </Button>
            );
          })}
        </HStack>
      </Box>
      <Box
        flexGrow={1}
        w="full"
        mt={{ md: "4" }}
        rounded="20px"
        border={{ md: "2px solid" }}
        borderColor={{ md: "brand.gray.2" }}
        bg={{ md: "brand.gray.3" }}
        pt={0}
        p={{ md: "6" }}
        display="flex"
        flexDir="column"
      >
        {children}
      </Box>
    </VStack>
  );
};

const links = (community: GetCommunityByUserResult) => [
  {
    title: "Home",
    icon: <HomeIcon width="24px" strokeWidth="2.7px" />,
    href: `/console/communities/${community.id}`,
    props: {},
  },
  {
    title: "Tiers",
    icon: <TreeIcon width="24px" />,
    href: `/console/communities/${community.id}/tiers`,
  },
  {
    title: "Goals",
    icon: <CupIcon width="24px" />,
    href: `/console/communities/${community.id}/goals`,
  },
];
const CommunityLayoutComponents: FC<PropsWithChildren<CommunityPageProps>> = ({
  children,
}) => {
  const community = useCurrentCommunity();
  useUpdateBreadcrumb(
    {
      breadcrumb: [
        {
          title: `${community!.name} community`,
          link: `/console/communities/${community!.id}`,
          startsWith: true,
        },
      ],
      title: community.name,
      back: {
        title: "communities",
        link: "/console/communities",
      },
    },
    []
  );
  return (
    <CommunityTabLayout community={community} links={links}>
      {children}
    </CommunityTabLayout>
  );
};
