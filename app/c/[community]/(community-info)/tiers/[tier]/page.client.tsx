"use client";
import { CircularProgress, HStack } from "@chakra-ui/react";
import { UserTier } from "@xeronith/granola/core/objects";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { CenterLayout } from "app/console/components/CenterLayout";
import { PaymentForm } from "components/PaymentForm";
import { useCreateStripeIntent } from "hooks/useCreateStripeIntent";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { useAuth } from "states/console/user";
import { joinURL } from "ufo";
import { getCommunityLink, getCommunityTiersLink } from "utils/community";

export default function TierClientPage({ tier }: { tier: UserTier }) {
  const { user } = useAuth();
  const community = useCurrentCommunity();
  const pathname = usePathname();
  useUpdateBreadcrumb({
    breadcrumb: [
      {
        link: getCommunityLink(community),
        title: `${community.name} Community`,
      },
      {
        link: getCommunityTiersLink(community),
        title: "Tiers",
      },
      {
        link: pathname,
        title: tier.name,
      },
    ],
    title: `${community.name}`,
    back: {
      link: getCommunityLink(community),
      title: "Tiers",
    },
  });

  const {
    mutate: createStripeIntent,
    isLoading,
    data: paymentFormData,
    isSuccess: paymentFormReady,
  } = useCreateStripeIntent({
    onError() {},
  });

  useEffect(() => {
    if (user)
      createStripeIntent({
        communityId: community.id,
        tierFrequencyId: tier.tierFrequencyId,
        amount: tier.amount,
        tierId: tier.id,
        goalFrequencyId: 0,
        goalId: 0,
      });
  }, [user]);

  return (
    <CenterLayout
      flexGrow={1}
      h="full"
      wrapperProps={{
        flexGrow: 1,
        height: "full",
      }}
      maxW={{ base: "unset", md: "370px" }}
    >
      {isLoading && (
        <HStack justify="center">
          <CircularProgress isIndeterminate color="secondary.500" size="40px" />
        </HStack>
      )}
      {paymentFormReady && (
        <PaymentForm
          {...paymentFormData}
          returnUrl={`${joinURL(
            window.location.origin,
            getCommunityTiersLink(community)
          )}?verify`}
        />
      )}
    </CenterLayout>
  );
}
