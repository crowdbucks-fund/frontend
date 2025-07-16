"use client";
import { Button, Text, VStack } from "@chakra-ui/react";
import { CenterLayout } from "app/console/components/CenterLayout";
import { GoalCard } from "components/GoalCard";
import { toast } from "components/Toast";
import { useGoals } from "hooks/useGoals";
import { api } from "lib/api";
import { queryClient } from "lib/reactQuery";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useMutation } from "react-query";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { z } from "zod";
import { useCurrentCommunity } from "../../../components/community-validator-layout";
import { FirstGoalModal } from "../../components/FirstGoalModal";
import { goalZodSchema } from "../../create-update-goal";

export default function PublishTierPage() {
  const form = useFormContext<z.infer<typeof goalZodSchema>>();
  const community = useCurrentCommunity();
  const router = useRouter();
  const { data: goals } = useGoals({
    communityId: community.id,
  });
  const [showFirstGoalModal, setShowFirstGoal] = useState(false);
  const { mutate: createUpdateGoal, isLoading } = useMutation({
    mutationFn: api.addOrUpdateGoalByUser.bind(api),
    onSuccess() {
      queryClient.invalidateQueries(["findGoalsByUser"]);
      if (goals && goals.length === 0) setShowFirstGoal(true);
      else {
        toast({
          status: "success",
          title: "The goal was successfully created",
        });
        router.push(`/console/communities/${community.id}/goals`);
      }
    },
  });
  const pathname = usePathname();
  useUpdateBreadcrumb(
    {
      breadcrumb: [
        {
          title: `${community!.name} community`,
          link: `/console/communities/${community!.id}`,
        },
        {
          title: `Create goal`,
          link: `/console/communities/${community!.id}/goals/create`,
        },
        {
          title: `Publish`,
          link: pathname,
          startsWith: true,
        },
      ],
      back: {
        link: `/console/communities/${community.id}/goals/create`,
        title: "Create goals",
      },
      title: "Preview",
    },
    []
  );

  useEffect(() => {
    if (!form.getValues("name"))
      redirect(`/console/communities/${community.id}/goals/create`);
  }, []);
  const onModalClose = () => {
    router.push(`/console/communities/${community.id}/goals`);
  };
  return (
    <CenterLayout
      flexGrow={1}
      h="full"
      wrapperProps={{
        flexGrow: 1,
        height: "full",
      }}
      maxW="630px"
    >
      <VStack
        maxW="630px"
        h="full"
        flexGrow={1}
        justify={{ base: "space-between", md: "start" }}
        mx="auto"
        gap="12"
        w="full"
      >
        <VStack w="full" align="start">
          <Text
            fontWeight="bold"
            fontSize="22px"
            pb="3"
            color="#343333"
            display={{ base: "block", md: "none" }}
          >
            Preview
          </Text>{" "}
          <GoalCard
            community={community}
            goal={form.getValues()}
            format="preview"
            btnText={`Help achieve the goal`}
          />
        </VStack>
        <Button
          onClick={() => createUpdateGoal(form.getValues())}
          type="submit"
          w="full"
          size="lg"
          colorScheme="primary"
          variant="solid"
          isLoading={isLoading}
        >
          Publish now
        </Button>
        <FirstGoalModal
          isOpen={showFirstGoalModal}
          onClose={onModalClose}
          goal={form.getValues()}
        />
      </VStack>
    </CenterLayout>
  );
}
