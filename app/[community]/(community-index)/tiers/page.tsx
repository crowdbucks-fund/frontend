"use client";

import { Button, chakra, HStack, Text, VStack } from "@chakra-ui/react";
import { FindCommunityByUserResult } from "@xeronith/granola/core/spi";
import { EmptyState } from "app/[community]/(community-index)/EmptyState";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { CenterLayout } from "app/console/components/CenterLayout";
import TickSquare from "assets/icons/tick-square.svg?react";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { TierCard } from "components/TierCard";
import { usePaymentVerification } from "hooks/usePaymentVerification";
import { sortTiers } from "hooks/useTiers.server";
import { lowerCase } from "lodash";
import NextLink from "next/link";
import { useCallback } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { useAuth } from "states/console/user";
import { joinURL } from "ufo";
import { getCommunityLink, getCommunityTiersLink } from "utils/community";

const CheckIcon = chakra(TickSquare);

export default function TierPage() {
  const community = useCurrentCommunity<FindCommunityByUserResult>();
  const [{ hasPayment, isSuccess }, updatePaymentState] =
    usePaymentVerification();
  const { user } = useAuth();

  const isSubscribedToTier = useCallback(
    (tierId: number) => {
      return false;
      if (!user) return false;
      // @ts-ignore
      return user.subscribedTierIds.includes(tierId);
    },
    [user]
  );
  useUpdateBreadcrumb({
    breadcrumb: [
      {
        title: `${community.name}`,
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
    <CenterLayout maxW={{ md: "630px" }} mx="auto" gap={{ base: 4, md: 8 }}>
      {isSuccess && (
        <ResponsiveDialog
          isOpen={isSuccess}
          onClose={updatePaymentState.bind(null, {
            hasPayment: false,
            isSuccess: false,
          })}
          title=""
        >
          <VStack
            justify="center"
            textAlign="center"
            gap={4}
            py={4}
            mt={{
              base: 0,
              md: 6,
            }}
          >
            <CheckIcon color="primary.500" w={{ base: "42px", md: "52px" }} />
            <Text textStyle="modalTitle">
              Thanks a lot for your contribution
            </Text>
          </VStack>
        </ResponsiveDialog>
      )}
      {community.customAmountsEnabled && (
        <VStack
          role="group"
          gap={{ base: 4, md: 7 }}
          p={{ md: 8, base: 4 }}
          bg="white"
          borderRadius={{ base: "12px", md: "18px" }}
          w="full"
          align="start"
        >
          <HStack justify="space-between" w="full" overflow="hidden">
            <VStack
              align="start"
              overflow="hidden"
              gap={{ base: 4, md: 6 }}
              w="full"
            >
              <Text
                fontSize={{ base: "14px", md: "20px" }}
                fontWeight={{ base: "normal", md: "bold" }}
                isTruncated
                maxW="100%"
              >
                Custom amount
              </Text>
              <Button
                as={NextLink}
                href={joinURL(getCommunityTiersLink(community), "custom")}
                colorScheme="primary"
                variant="solid"
                size="lg"
                w="full"
              >
                Pay now
              </Button>
            </VStack>
          </HStack>
        </VStack>
      )}
      {community.tiers.length === 0 && (
        <EmptyState>There is no tier defined yet!</EmptyState>
      )}
      {community.tiers.sort(sortTiers).map((tier) => {
        const isSubscribed = isSubscribedToTier(tier.id);
        return (
          <TierCard
            key={tier.id}
            community={community}
            tier={tier}
            btnText={
              isSubscribed
                ? "Unsubscribe"
                : `Join with $${tier.amount} a ${lowerCase(
                    tier.tierFrequency?.unit
                  )}`
            }
            buttonProps={{
              as: isSubscribed ? undefined : NextLink,
              href: isSubscribed
                ? undefined
                : joinURL(getCommunityTiersLink(community), String(tier.id)),
              variant: isSubscribed ? "glass" : "solid",
              colorScheme: tier.recommended ? "secondary" : "primary",
              color: undefined,
              border: undefined,
              cursor: isSubscribed ? "not-allowed" : "pointer",
              pointerEvents: isSubscribed ? "none" : "unset",
              // opacity: isSubscribed ? ".5" : "1",
              // isDisabled: isSubscribed,
            }}
          />
        );
      })}
    </CenterLayout>
  );
}
