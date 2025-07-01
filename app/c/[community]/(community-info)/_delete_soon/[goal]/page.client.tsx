"use client";
import { CircularProgress, HStack } from "@chakra-ui/react";
import { UserGoal } from "@xeronith/granola/core/objects";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { CenterLayout } from "app/console/components/CenterLayout";
import { PaymentForm } from "components/PaymentForm";
import { useCreateStripeIntent } from "hooks/useCreateStripeIntent";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { joinURL } from "ufo";
import { getCommunityGoalsLink, getCommunityLink } from "utils/community";

export default function GoalClientPage({ goal }: { goal: UserGoal }) {
  const community = useCurrentCommunity();
  const pathname = usePathname();
  useUpdateBreadcrumb({
    breadcrumb: [
      {
        link: getCommunityLink(community),
        title: `${community.name} Community`,
      },
      {
        link: `/c/${community.handle}/goals`,
        title: "Goals",
      },
      {
        link: pathname,
        title: goal.name,
      },
    ],
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
    createStripeIntent({
      communityId: community.id,
      tierFrequencyId: goal.goalFrequency!.id,
      amount: goal.amount,
      goalId: goal.id,
      goalFrequencyId: 0,
      tierId: 0,
    });
  }, []);

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
            getCommunityGoalsLink(community)
          )}?verify`}
        />
      )}
    </CenterLayout>
  );
}
