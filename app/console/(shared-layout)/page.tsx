"use client";
import { VStack } from "@chakra-ui/react";
import PlusIcon from "assets/icons/add-square.svg?react";
import CommunitiesIcon from "assets/icons/communities NB.svg?react";
import LinkIcon from "assets/icons/link-2.svg?react";
import StripeIcon from "assets/icons/stripe.svg?react";
import { OnboardingState } from "components/Onboarding/OnboardingState";
import { OnboardingStep } from "components/Onboarding/OnboardingStep";
import { useCommunities } from "hooks/useCommunities";
import { useConnectToStripe } from "hooks/useConnectToStripe";
import { isStripeConnected } from "lib/stripe";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "states/console/user";
import { CenterLayout } from "../components/CenterLayout";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: communities } = useCommunities({ suspense: true });
  const [accordionKeys, setAccordionKeys] = useState<number[]>([]);
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { connectToStripe, loading: isConnectingToStripe } = useConnectToStripe(
    {
      onSuccess(data) {
        setIsRedirecting(true);
        router.push(data.url);
      },
    }
  );
  const isStripeOk = isStripeConnected(user!);
  const userState = useMemo(() => {
    return {
      stripe: isStripeOk,
      isFirstCommunityCreated: communities && communities.length > 0,
    };
  }, [isStripeOk, communities]);

  const steps = Object.keys(userState).length;
  const passedSteps = Object.keys(userState).filter(
    (key) => userState[key as keyof typeof userState]
  ).length;

  useEffect(() => {
    const defaultKeys = Object.keys(userState)
      .map((key, i) => {
        if (!userState[key as keyof typeof userState]) return i;
        return null;
      })
      .filter((v) => v !== null) as number[];
    setAccordionKeys(defaultKeys);
  }, [userState]);

  const handleOpenAccordion = (key: number) => () => {
    let tmpKeys = [...accordionKeys];
    if (accordionKeys.indexOf(key) !== -1)
      tmpKeys.splice(accordionKeys.indexOf(key), 1);
    else tmpKeys.push(key);
    setAccordionKeys(tmpKeys);
  };

  return (
    <CenterLayout
      maxW={{
        base: "full",
        md: "630px",
      }}
      gap={6}
    >
      <OnboardingState passedSteps={passedSteps} steps={steps} />
      <VStack gap={6}>
        <OnboardingStep
          heading="Connect your Stripe account"
          headingIcon={<StripeIcon />}
          description="Link your Stripe account to securely manage payments and subscriptions. This ensures seamless financial transactions and easy revenue tracking."
          handleOpenAccordion={handleOpenAccordion(0)}
          inCompleteButtonText="Let's go"
          inCompleteIcon={<LinkIcon width="38px" height="38px" />}
          completeButtonText="Go to my Stripe"
          completedHref="https://dashboard.stripe.com"
          isCompleted={!!userState.stripe}
          inCompleteButtonProps={{
            onClick: connectToStripe,
            isLoading: isRedirecting || isConnectingToStripe,
            justifyContent: "center",
            alignContent: "center",
            display: "flex",
          }}
          isOpen={accordionKeys.includes(0)}
        />

        <OnboardingStep
          heading="Create your first community"
          headingIcon={<CommunitiesIcon />}
          description="Create and customize your first community to provide a space where supporters can contribute financially and engage with your content."
          handleOpenAccordion={handleOpenAccordion(1)}
          inCompleteButtonText="Create Community"
          completeButtonText="Add another"
          inCompleteIcon={<PlusIcon width="38px" height="38px" />}
          inCompleteHref="/console/communities/create"
          completedHref="/console/communities/create"
          isCompleted={!!userState.isFirstCommunityCreated}
          isOpen={accordionKeys.includes(1)}
        />
      </VStack>
    </CenterLayout>
  );
}
