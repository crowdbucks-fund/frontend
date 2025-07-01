"use client";

import {
  Button,
  CircularProgress,
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
import { notFound, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
    useTierFrequency({
      onError(err) {},
    });
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies({
    onError(err) {},
  });

  useEffect(() => {
    if (!form.getValues("currencyId") && currencies) {
      form.setValue("currencyId", currencies[0].id);
    }
  }, [currencies]);

  useUpdateBreadcrumb({
    breadcrumb: [
      {
        link: getCommunityLink(community),
        title: `${community.name} Community`,
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
    isLoading,
    data: paymentFormData,
    isSuccess: paymentFormReady,
  } = useCreateStripeIntent({
    onError() {},
  });

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
      maxW={{ base: "unset", md: "370px" }}
      justifyContent="start"
    >
      {!paymentFormReady && (
        <>
          <VStack
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
