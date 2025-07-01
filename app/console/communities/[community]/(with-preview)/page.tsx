"use client";
import { Accordion } from "@chakra-ui/react";
import { CenterLayout } from "app/console/components/CenterLayout";
import PlusIcon from "assets/icons/add-square.svg?react";
import FutureIcon from "assets/icons/cup.svg?react";
import FundIcon from "assets/icons/dollar-square.svg?react";
import SummaryIcon from "assets/icons/message-edit.svg?react";
import UserIcon from "assets/icons/user-square.svg?react";
import { OnboardingState } from "components/Onboarding/OnboardingState";
import { OnboardingStep } from "components/Onboarding/OnboardingStep";
import { useGoals } from "hooks/useGoals";
import { useTiers } from "hooks/useTiers";
import { isStripeConnected as checkStripe } from "lib/stripe";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "states/console/user";
import { useCurrentCommunity } from "../components/community-validator-layout";

export default function CommunityHome() {
  const { user } = useAuth();
  const community = useCurrentCommunity();
  const { data: goals, isLoading: goalsLoading } = useGoals({
    communityId: community.id,
  });
  const { data: tiers, isLoading: tiersLoading } = useTiers({
    communityId: community.id,
  });
  const [accordionKeys, setAccordionKeys] = useState<number[]>([]);

  const handleOpenAccordion = (key: number) => () => {
    let tmpKeys = [...accordionKeys];
    if (tmpKeys.indexOf(key) !== -1)
      tmpKeys.splice(accordionKeys.indexOf(key), 1);
    else tmpKeys.push(key);
    setAccordionKeys(tmpKeys);
  };
  const isStripeConnected = useMemo(
    () => checkStripe(user!),
    [checkStripe, user]
  );
  const onboardingSteps = useMemo(() => {
    return {
      profilePhoto: {
        isCompleted: !!community.avatar,
        heading: "Add a profile photo",
        headingIcon: <UserIcon />,
        description:
          "Upload a profile photo to personalize your community and make it visually appealing.",
        inCompleteButtonText: "Set up my avatar",
        inCompleteHref: `/console/communities/${community.id}/edit`,
        inCompleteIcon: <PlusIcon width="38px" height="38px" />,
      },
      summary: {
        isCompleted: !!community.summary,
        heading: "Describe your page",
        headingIcon: <SummaryIcon />,
        description:
          "Write a summary to provide an overview of your community and its purpose.",
        inCompleteButtonText: "Add a bio",
        inCompleteHref: `/console/communities/${community.id}/edit`,
        inCompleteIcon: <PlusIcon width="38px" height="38px" />,
      },
      getFund: {
        isCompleted: !!(!tiersLoading && tiers && tiers.length > 0),
        heading: "Get fund",
        headingIcon: <FundIcon />,
        description:
          "Create your first funding tier to start receiving support and contributions from your contributors.",
        inCompleteButtonText: "Plant my first seed",
        inCompleteHref: `/console/communities/${community.id}/tiers`,
        inCompleteIcon: <PlusIcon width="38px" height="38px" />,
      },
      planTheFuture: {
        isCompleted: !!(!goalsLoading && goals && goals.length > 0),
        heading: "Plan the future",
        headingIcon: <FutureIcon />,
        description:
          "Set up your first goal to outline what you hope to achieve and inspire ongoing engagement.",
        inCompleteButtonText: "Create my first goal",
        inCompleteHref: `/console/communities/${community.id}/goals`,
        inCompleteIcon: <PlusIcon width="38px" height="38px" />,
      },
    };
  }, [isStripeConnected, goalsLoading]);

  const steps = Object.keys(onboardingSteps).length;
  const completedSteps = Object.keys(onboardingSteps).filter(
    (key) => onboardingSteps[key as keyof typeof onboardingSteps].isCompleted
  ).length;

  useEffect(() => {
    const defaultKeys = Object.keys(onboardingSteps)
      .map((key, i) => {
        if (!onboardingSteps[key as keyof typeof onboardingSteps].isCompleted)
          return i;
        return null;
      })
      .filter((v) => v !== null) as number[];
    setAccordionKeys(defaultKeys);
  }, [onboardingSteps]);

  return (
    <CenterLayout maxW="630px" gap={6}>
      <OnboardingState passedSteps={completedSteps} steps={steps} />
      <Accordion index={accordionKeys} allowMultiple gap={6}>
        {Object.values(onboardingSteps).map((step, i) => {
          return (
            <OnboardingStep
              key={step.heading}
              {...step}
              isOpen={accordionKeys.includes(i)}
              handleOpenAccordion={handleOpenAccordion(i)}
            />
          );
        })}
      </Accordion>
    </CenterLayout>
  );
}
