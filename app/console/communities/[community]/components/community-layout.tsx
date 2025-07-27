"use client";

import {
  Box,
  Button,
  ButtonProps,
  chakra,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { GetCommunityByUserResult } from "@xeronith/granola/core/spi";
import CupIconBase from "assets/icons/cup.svg?react";
import DollarIconBase from "assets/icons/dollar-square.svg?react";
import HomeIconBase from "assets/icons/home NB.svg?react";
import TreeIconBase from "assets/icons/tree.svg?react";
import { ActiveLink, ActiveLinkProps } from "components/Link";
import { FC, PropsWithChildren, ReactElement, ReactNode } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { CommunityPreview } from "../../components/CommunityPreview";
import CommunityValidatorLayout, {
  useCurrentCommunity,
} from "./community-validator-layout";

const HomeIcon = chakra(HomeIconBase);
const DollarIcon = chakra(DollarIconBase);
const TreeIcon = chakra(TreeIconBase);
const CupIcon = chakra(CupIconBase);

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
              <CommunityPreview
                community={community}
                // editButton
              />
            </Box>
            <Box
              pt={{ md: "7" }}
              w="full"
              display={{ base: "block", md: "none" }}
            >
              <CommunityPreview
                shareCommunity
                showSummary
                // editButton
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
                leftIcon={tab.icon}
                scroll={false}
                {...(tab.props || {})}
                href={tab.href}
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

const links = (
  community: GetCommunityByUserResult
): {
  title: string;
  icon: ReactElement;
  href: string;
  props?: Omit<ButtonProps & ActiveLinkProps, "href">;
}[] => [
  // {
  //   title: "Home",
  //   icon: (
  //     <HomeIcon
  //       display={{
  //         base: "none",
  //         md: "block",
  //       }}
  //       width="24px"
  //       strokeWidth="2.7px"
  //     />
  //   ),
  //   href: `/console/communities/${community.id}`,
  //   props: {},
  // },
  {
    title: "Tiers",
    icon: (
      <TreeIcon
        display={{
          base: "none",
          md: "block",
        }}
        width="24px"
      />
    ),
    // href: `/console/communities/${community.id}/tiers`,
    href: `/console`,
  },
  {
    title: "Goals",
    icon: (
      <CupIcon
        display={{
          base: "none",
          md: "block",
        }}
        width="24px"
      />
    ),
    // href: `/console/communities/${community.id}/goals`,
    href: `/console/goals`,
  },
  {
    title: "Stripe",
    icon: (
      <DollarIcon
        display={{
          base: "none",
          md: "block",
        }}
        width="24px"
      />
    ),
    // href: `/console/communities/${community.id}/goals`,
    href: `/console/stripe`,
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
          title: `${community!.name}`,
          // link: `/console/communities/${community!.id}`,
          link: `/console`,
          startsWith: true,
        },
      ],
      title: community.name,
      // back: {
      //   title: "communities",
      //   link: "/console/communities",
      // },
    },
    []
  );
  return (
    <CommunityTabLayout community={community} links={links}>
      {children}
    </CommunityTabLayout>
  );
};
