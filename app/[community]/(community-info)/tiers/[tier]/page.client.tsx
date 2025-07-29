"use client";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  chakra,
  Checkbox,
  CircularProgress,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { UserTier } from "@xeronith/granola/core/objects";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { CenterLayout } from "app/console/components/CenterLayout";
import TickSquare from "assets/icons/tick-square.svg?react";
import { useCreateStripeIntent } from "hooks/useCreateStripeIntent";
import { lowerCase } from "lodash";
import { usePathname } from "next/navigation";
import { FC, useEffect } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { useAuth } from "states/console/user";
import { getCommunityLink, getCommunityTiersLink } from "utils/community";

const CheckIcon = chakra(TickSquare);

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
    error,
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
        align={{ base: "center", md: "start" }}
      >
        <Box
          maxW={{
            base: "400px",
            md: "340px",
          }}
          w="full"
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
                <Text>Donation</Text>
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
        <VStack minW={{ base: "unset", md: "400px" }}>
          {!isLoading && !!user && (
            <VStack maxW="400px" gap="6">
              <Text color="brand.black.2">
                To continue with your donation, please enter your email and
                agree to the Terms of Service.
              </Text>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input />
                <FormHelperText>
                  We’ll only use your email for donation-related communication,
                  like receipts or refunds.
                </FormHelperText>
              </FormControl>
              <FormControl>
                <Checkbox size="lg">
                  <Text fontWeight="normal">
                    I agree to the{" "}
                    <Link
                      href="/tos"
                      color="blue.500"
                      textDecoration="underline"
                      textUnderlineOffset={3}
                    >
                      Terms of Service
                    </Link>
                  </Text>
                </Checkbox>
              </FormControl>
              <Button w="full" size="lg" colorScheme="primary">
                Submit
              </Button>
            </VStack>
          )}
          {isLoading && (
            <HStack justify="center">
              <CircularProgress
                isIndeterminate
                color="secondary.500"
                size="40px"
              />
            </HStack>
          )}
          {/* {!!error && <ErrorComponent error={error as Error} />} */}
          {/* <ErrorBoundary FallbackComponent={ErrorComponent}>
            {paymentFormReady && (
              <PaymentForm
                {...paymentFormData}
                returnUrl={`${joinURL(
                  window.location.origin,
                  getCommunityTiersLink(community)
                )}?verify`}
              />
            )}
          </ErrorBoundary> */}
        </VStack>
      </Flex>
    </CenterLayout>
  );
}

const ErrorComponent: FC<{ error: Error | string }> = ({ error }) => {
  const message =
    typeof error === "string"
      ? error
      : error.message || "An unexpected error occurred.";

  const isSubscribeError = message.includes("subscribed");
  if (isSubscribeError) {
    return (
      <VStack>
        <CheckIcon color="primary.500" w={{ base: "42px", md: "52px" }} />
        <Text color="primary.500" fontSize="lg" fontWeight="bold">
          {message}
        </Text>
      </VStack>
    );
  }
  return (
    <VStack>
      <Text color="red.500" fontSize="lg" fontWeight="bold">
        An error occurred
      </Text>
      <Text color="red.300">
        Please try again later or contact support if the issue persists.
      </Text>
    </VStack>
  );
};
