"use client";
import { Button, Text, VStack } from "@chakra-ui/react";
import { CenterLayout } from "app/console/components/CenterLayout";
import { TierCard } from "components/TierCard";
import { toast } from "components/Toast";
import { useTiers } from "hooks/useTiers";
import { api } from "lib/api";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useMutation } from "react-query";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { z } from "zod";
import { useCurrentCommunity } from "../../../components/community-validator-layout";
import { FirstTierModal } from "../../components/FirstTierModal";
import { tierZodSchema } from "../../create-update-tier";

export default function PublishTierPage() {
  const form = useFormContext<z.infer<typeof tierZodSchema>>();
  const community = useCurrentCommunity();
  const router = useRouter();
  const { data: tiers } = useTiers({
    communityId: community.id,
  });
  const [showFirstTierModal, setShowFirstTier] = useState(false);
  const { mutate: createUpdateTier, isLoading } = useMutation({
    mutationFn: api.addOrUpdateTierByUser.bind(api),
    onSuccess() {
      if (tiers && tiers.length === 0) setShowFirstTier(true);
      else {
        toast({
          status: "success",
          title: "The tier was successfully created",
        });
        router.push(`/console/communities/${community.id}/tiers`);
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
          title: `Create tier`,
          link: `/console/communities/${community!.id}/tiers/create`,
        },
        {
          title: `Publish`,
          link: pathname,
          startsWith: true,
        },
      ],
      title: "Publish",
      back: {
        title: "Create tier",
        link: `/console/communities/${community!.id}/tiers/create`,
      },
    },
    []
  );

  useEffect(() => {
    if (!form.getValues("name"))
      redirect(`/console/communities/${community.id}/tiers/create`);
  }, []);
  const onModalClose = () => {
    router.push(`/console/communities/${community.id}/tiers`);
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
          </Text>
          <TierCard
            community={community}
            tier={form.getValues()}
            format="preview"
            btnText={`Join with $${form.getValues("amount")} a ${(
              form.getValues("tierFrequency")?.unit || ""
            ).toLowerCase()}`}
          />
        </VStack>
        <Button
          onClick={() => createUpdateTier(form.getValues())}
          type="submit"
          w="full"
          size="lg"
          colorScheme="primary"
          variant="solid"
          isLoading={isLoading}
        >
          Publish now
        </Button>
        <FirstTierModal
          isOpen={showFirstTierModal}
          onClose={onModalClose}
          tier={form.getValues()}
        />
      </VStack>
    </CenterLayout>
  );
}
