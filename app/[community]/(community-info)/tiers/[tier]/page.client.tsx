"use client";
import {
  Box,
  CircularProgress,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { UserTier } from "@xeronith/granola/core/objects";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { CenterLayout } from "app/console/components/CenterLayout";
import { PaymentForm } from "components/PaymentForm";
import { useCreateStripeIntent } from "hooks/useCreateStripeIntent";
import { lowerCase } from "lodash";
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
        title: `${community.name}`,
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
      maxW="full"
      justifyContent="start"
    >
      <Flex
        flexDirection={{
          base: "column",
          md: "row",
        }}
        w="full"
        h="full"
        gap={8}
        justifyContent="center"
      >
        <Box
          maxW={{
            base: "unset",
            md: "340px",
          }}
          flexGrow={1}
        >
          <VStack
            p={{ base: 4, md: 5 }}
            borderRadius="2xl"
            border="2px solid"
            borderColor="brand.gray.1"
            bg="brand.gray.4"
            gap={4}
            w="full"
            alignItems="start"
          >
            <Text
              fontSize={{
                base: "16px",
                md: "18px",
              }}
              fontWeight="bold"
            >
              Order Summary
            </Text>
            <Divider color="brand.gray.2" />
            <VStack w="full">
              <HStack w="full" justifyContent="space-between">
                <Text>Price</Text>
                <Text>
                  ${tier.amount}/{lowerCase(tier.tierFrequency?.unit)}
                </Text>
              </HStack>
            </VStack>
            <Divider color="brand.gray.2" />
            <VStack w="full">
              <HStack w="full" justifyContent="space-between">
                <Text>Total</Text>
                <Text>
                  ${tier.amount}/{lowerCase(tier.tierFrequency?.unit)}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </Box>
        <VStack minW={{ base: "unset", md: "370px" }}>
          {isLoading && (
            <HStack justify="center">
              <CircularProgress
                isIndeterminate
                color="secondary.500"
                size="40px"
              />
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
        </VStack>
      </Flex>
    </CenterLayout>
  );
}
