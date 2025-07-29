"use client";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { CenterLayout } from "app/console/components/CenterLayout";
import { PaymentForm } from "components/PaymentForm";
import { useCreateStripeIntent } from "hooks/useCreateStripeIntent";
import { useCurrencies } from "hooks/useCurrencies";
import { useTierFrequency } from "hooks/useTierFrequency";
import { requiredNumericString } from "lib/zod";
import { lowerCase } from "lodash";
import { notFound, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { joinURL } from "ufo";
import { getCommunityLink, getCommunityTiersLink } from "utils/community";
import { z } from "zod";

const DEFAULT_AMOUNT_PRICES = [10, 30, 50, 70, 100];

const schema = z.object({
  occurrenceId: z.number(),
  currencyId: z.number(),
  amount: requiredNumericString
    .refine((value) => value >= 1, "The amount too low")
    .refine((value) => value <= 999999, "The amount too big"),
});

export default function CustomTierClientPage() {
  const pathname = usePathname();
  const community = useCurrentCommunity();
  const [isButtonsDisabled, setButtonsDisabled] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      occurrenceId: 0,
      currencyId: undefined,
      amount: undefined,
    },
    resolver: zodResolver(schema),
  });

  const amount = useWatch({
    control: form.control,
    name: "amount",
  });

  useEffect(() => {
    if (!amount) setButtonsDisabled(false);
  }, [amount]);

  const { data: tierFrequencies, isLoading: isTiersFrequencyLoading } =
    useTierFrequency();
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  useEffect(() => {
    if (!form.getValues("currencyId") && currencies) {
      form.setValue("currencyId", currencies[0].id);
    }
  }, [currencies]);

  useUpdateBreadcrumb({
    breadcrumb: [
      {
        link: getCommunityLink(community),
        title: `${community.name}`,
      },
      {
        title: "Custom amount",
        link: pathname,
      },
    ],
    title: "Custom amount",
    back: {
      link: getCommunityLink(community),
      title: `${community.name}`,
    },
  });

  const {
    mutate: createStripeIntent,
    isPending: isLoading,
    data: paymentFormData,
    isSuccess: paymentFormReady,
    variables,
  } = useCreateStripeIntent({
    onError() {},
  });

  const selectedFrequency = useMemo(() => {
    if (variables && tierFrequencies) {
      return (
        tierFrequencies.find((f) => f.id === variables?.tierFrequencyId) || {
          id: 0,
          name: "One-time",
          unit: "one-time",
        }
      );
    }
    return null;
  }, [variables?.tierFrequencyId, tierFrequencies]);

  if (!community.customAmountsEnabled) return notFound();
  const errors = form.formState.errors;

  const handleSubmit = (data: z.infer<typeof schema>) => {
    createStripeIntent({
      communityId: community.id,
      tierFrequencyId: data.occurrenceId,
      amount: data.amount,
      tierId: 0,
      goalId: 0,
      goalFrequencyId: 0,
    });
  };
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
      {!paymentFormReady && (
        <>
          <VStack
            maxW={{ base: "unset", md: "370px" }}
            w="full"
            justify={{ base: "space-between", md: "start" }}
            flexGrow={{ base: 1, md: 0 }}
            h="full"
            as="form"
            onSubmit={form.handleSubmit(handleSubmit)}
            gap={8}
          >
            <VStack
              flexGrow={1}
              justifyContent={{ base: "center", md: "start" }}
              w="full"
              gap={{ base: 8, md: 10 }}
            >
              <VStack mb={{ md: "40px" }}>
                <Text textStyle="bold22">Choose what’s best for you</Text>
                <Text textStyle="regular22">
                  Select the amount and occurrence
                </Text>
                V
              </VStack>
              <VStack gap={6} w="full">
                <HStack alignItems="start" w="full">
                  <FormControl isInvalid={!!errors.occurrenceId} flexGrow={1}>
                    <FormLabel>Occurrence</FormLabel>
                    <Controller
                      control={form.control}
                      name="occurrenceId"
                      render={({ field }) => {
                        return (
                          <Select
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(parseInt(String(e.target.value)))
                            }
                            icon={
                              isTiersFrequencyLoading ? (
                                <CircularProgress
                                  isIndeterminate
                                  size="25px"
                                  color="primary.500"
                                />
                              ) : undefined
                            }
                          >
                            <option value={0}>One-time</option>
                            {tierFrequencies &&
                              tierFrequencies.map((cr, id) => {
                                return (
                                  <option key={id} value={cr.id}>
                                    {cr.name}
                                  </option>
                                );
                              })}
                          </Select>
                        );
                      }}
                    />
                    <FormErrorMessage>
                      {errors.currencyId?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.currencyId} flexGrow={1}>
                    <FormLabel>Currency</FormLabel>
                    <Controller
                      control={form.control}
                      name="currencyId"
                      render={({ field }) => {
                        return (
                          <Input
                            id="currencyId"
                            readOnly
                            value={
                              (currencies &&
                                currencies?.find(
                                  (currency) => currency.id === field.value
                                )?.name) ||
                              ""
                            }
                          />
                        );
                      }}
                    />
                    <FormErrorMessage>
                      {errors.currencyId?.message}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
                <Controller
                  control={form.control}
                  name="amount"
                  render={({ field }) => {
                    return (
                      <HStack w="full">
                        {DEFAULT_AMOUNT_PRICES.map((amount) => {
                          const isActive =
                            !isButtonsDisabled && field.value == amount;
                          return (
                            <HStack flexGrow={1} key={amount} justify="center">
                              <Button
                                isDisabled={isButtonsDisabled}
                                variant="outline"
                                onClick={() => field.onChange(amount)}
                                rounded="12px"
                                borderColor={
                                  isActive ? "primary.500" : "brand.black.1"
                                }
                                color={
                                  isActive ? "primary.500" : "brand.black.1"
                                }
                                h="48px"
                                textStyle="medium18"
                                fontSize={{
                                  base: "14px",
                                  md: "md",
                                }}
                              >
                                {amount}
                              </Button>
                            </HStack>
                          );
                        })}
                      </HStack>
                    );
                  }}
                />
                <FormControl isInvalid={!!errors.amount}>
                  <FormLabel>Custom amount</FormLabel>
                  <Controller
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          if (e.target.value) setButtonsDisabled(true);
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
                </FormControl>
              </VStack>
            </VStack>
            <VStack w="full">
              <Button
                isDisabled={Object.keys(errors).length > 0}
                type="submit"
                w="full"
                size="lg"
                colorScheme="primary"
                variant="solid"
                isLoading={isLoading}
              >
                Submit
              </Button>
            </VStack>
          </VStack>
        </>
      )}
      {paymentFormReady && (
        <Flex
          flexDirection={{
            base: "column",
            md: "row",
          }}
          w="full"
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
                    ${variables?.amount}
                    {selectedFrequency?.unit !== "one-time" &&
                      `/` + lowerCase(selectedFrequency?.unit)}
                  </Text>
                </HStack>
              </VStack>
              <Divider color="brand.gray.2" />
              <VStack w="full">
                <HStack w="full" justifyContent="space-between">
                  <Text>Total</Text>
                  <Text>
                    ${variables?.amount}
                    {selectedFrequency?.unit !== "one-time" &&
                      `/` + lowerCase(selectedFrequency?.unit)}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>
          <VStack minW={{ base: "unset", md: "370px" }}>
            <PaymentForm
              {...paymentFormData}
              returnUrl={`${joinURL(
                window.location.origin,
                getCommunityTiersLink(community)
              )}?verify`}
            />
          </VStack>
        </Flex>
      )}
    </CenterLayout>
  );
}
