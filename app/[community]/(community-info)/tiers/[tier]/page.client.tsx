"use client";
import {
  Box,
  Button,
  chakra,
  Checkbox,
  CircularProgress,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserTier } from "@xeronith/granola/core/objects";
import {
  FindCommunityByUserResult,
  GetProfileResult,
} from "@xeronith/granola/core/spi";
import { CenterLayout } from "app/console/components/CenterLayout";
import TickSquare from "assets/icons/tick-square.svg?react";
import { PaymentForm } from "components/PaymentForm";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { toast } from "components/Toast";
import { useCreateStripeIntent } from "hooks/useCreateStripeIntent";
import useTimer from "hooks/useTimer";
import { api } from "lib/api";
import { lowerCase, startCase, upperFirst } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { joinURL } from "ufo";
import { getCommunityLink, getCommunityTiersLink } from "utils/community";
import { z } from "zod";
import { TOS } from "./Tos";

const CheckIcon = chakra(TickSquare);

export default function TierClientPage({
  tier,
  community,
  user,
}: {
  tier: UserTier;
  community: FindCommunityByUserResult;
  user: GetProfileResult | null;
}) {
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
    isPending: isLoading,
    data: paymentFormData,
    isSuccess: paymentFormReady,
    error,
  } = useCreateStripeIntent({
    onError() {},
  });

  useEffect(() => {
    if (user?.email)
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
                <Text>Fundraiser</Text>
                <Text color="brand.black.4" fontSize="14px">
                  {community.handle}
                </Text>
              </HStack>
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
        <VStack w="full" maxW="400px">
          {!isLoading && !!user && !user.email && <EmailVerificationForm />}
          {isLoading && (
            <HStack justify="center">
              <CircularProgress
                isIndeterminate
                color="secondary.500"
                size="40px"
              />
            </HStack>
          )}
          {!!error && <ErrorComponent error={error as Error} />}
          <ErrorBoundary FallbackComponent={ErrorComponent}>
            {paymentFormReady && (
              <PaymentForm
                {...paymentFormData}
                returnUrl={`${joinURL(
                  window.location.origin,
                  getCommunityTiersLink(community)
                )}?verify`}
              />
            )}
          </ErrorBoundary>
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

const schema = z.discriminatedUnion("step", [
  z.object({
    step: z.literal("email"),
    email: z.string().email("Invalid email address"),
    agreeToTerms: z.boolean().refine((val) => val, {
      message: "You must agree to the Terms of Service",
    }),
  }),
  z.object({
    step: z.literal("verify"),
    email: z.string().email("Invalid email address"),
    code: z
      .string()
      .min(5, "Code must be exactly 5 characters")
      .max(5, "Code must be exactly 5 characters"),
  }),
]);
const EmailVerificationForm: FC<{}> = () => {
  const form = useForm<z.infer<typeof schema>, any, z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      step: "email",
      email: "",
      agreeToTerms: false,
    },
    mode: "onSubmit",
  });
  const router = useRouter();
  const { mutate: submit, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      if (data.step === "verify") {
        return await api.verifyEmail({
          code: data.code,
        });
      } else if (data.step === "email") {
        return await api.updateEmail({ email: data.email });
      }
      throw new Error("Invalid step");
    },
    onSuccess(data, variables) {
      if (variables.step === "email") {
        form.reset(
          {
            ...variables,
            step: "verify",
            email: variables.email,
          },
          {
            keepIsSubmitted: false,
            keepDefaultValues: true,
          }
        );
        timer.restart();
        setTimeout(() => {
          (
            document.querySelector("#pin-input > input") as HTMLInputElement
          )?.focus();
        });
        toast({
          status: "success",
          title: "Verification code sent",
          description: "Please check your email for the verification code.",
        });
      }
      if (variables.step === "verify") {
        // useAuth.fetchProfile();
        router.refresh();
      }
    },
    onError(error, variables) {
      if (variables.step === "verify") {
        form.setError("code", {
          message: upperFirst(startCase(error.message).toLowerCase()),
        });
        timer.setEnded(true);
      }
      if (variables.step === "email") {
        form.setError("email", {
          message: upperFirst(startCase(error.message).toLowerCase()),
        });
      }
    },
  });
  const timer = useTimer(3);
  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: async () => {
      const email = form.getValues("email");
      if (!email) throw new Error("Email is required to resend code");
      return await api.resendVerificationCode({ email });
    },
    onSuccess() {
      form.setValue("code", "");
      form.clearErrors("code");
      timer.restart();
      toast({
        status: "success",
        title: "Verification code resent",
        description: "Please check your email for the new verification code.",
      });
    },
  });
  const step = useWatch({
    control: form.control,
    name: "step",
  });
  const [tosModalOpen, setOpenTosModal] = useState(false);
  const onAccept = () => {
    setOpenTosModal(false);
    form.setValue("agreeToTerms", true);
  };
  return (
    <VStack
      maxW="400px"
      gap="6"
      as="form"
      onSubmit={form.handleSubmit((data) => submit(data))}
    >
      <Text color="brand.black.2">
        To continue with your donation, please enter your email and agree to the
        Terms of Service.
      </Text>
      <Controller
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormControl
            isInvalid={!!form.formState.errors.email}
            position="relative"
          >
            {step === "verify" && (
              <Button
                size="sm"
                colorScheme="primary"
                variant="link"
                onClick={() => {
                  form.setValue("step", "email");
                  form.setValue("code", "");
                }}
                isDisabled={step !== "verify"}
                position="absolute"
                top={1}
                right={1}
              >
                Change Email
              </Button>
            )}
            <FormLabel>Email</FormLabel>
            <Input {...field} isDisabled={step !== "email"} />
            <FormHelperText>
              We’ll only use your email for donation-related communication, like
              receipts or refunds.
            </FormHelperText>
            <FormErrorMessage>
              {form.formState.errors.email?.message}
            </FormErrorMessage>
          </FormControl>
        )}
      />
      <Controller
        control={form.control}
        name="agreeToTerms"
        render={({ field }) => (
          <FormControl
            isInvalid={!!(form.formState.errors as any).agreeToTerms}
          >
            <Checkbox
              size="lg"
              {...field}
              value={undefined}
              isChecked={field.value}
              isInvalid={!!(form.formState.errors as any).agreeToTerms}
              isDisabled={step !== "email"}
            >
              <Text fontWeight="normal">
                I agree to the{" "}
                <Button
                  color="blue.500"
                  onClick={setOpenTosModal.bind(null, true)}
                  textDecoration="underline"
                  variant="link"
                  textUnderlineOffset={3}
                >
                  Terms of Service
                </Button>
              </Text>
            </Checkbox>
            <FormErrorMessage>
              {(form.formState.errors as any).agreeToTerms?.message}
            </FormErrorMessage>
          </FormControl>
        )}
      />
      {step === "verify" && (
        <Controller
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormControl
              isInvalid={!!(form.formState.errors as any).code}
              w="full"
            >
              <FormLabel>Code</FormLabel>
              <HStack justifyContent="center" id="pin-input">
                <PinInput
                  {...field}
                  onComplete={() => {
                    document.getElementById("submit-btn")?.focus();
                  }}
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
              <FormHelperText>
                We’ve sent a 5-digit verification code to your email. Please
                enter it to verify your email address.
              </FormHelperText>
              <HStack justifyContent="space-between" mt={2}>
                <FormErrorMessage>
                  {(form.formState.errors as any).code
                    ? "Invalid code. Please try again."
                    : ""}
                </FormErrorMessage>
                {!(form.formState.errors as any).code?.message && <span />}
                <Button
                  size="sm"
                  colorScheme="primary"
                  variant="ghost"
                  onClick={() => resend()}
                  isLoading={isResending}
                  disabled={!timer.isEnded}
                  tabIndex={-1}
                  gap={2}
                >
                  {!timer.isEnded ? (
                    <>
                      <span>Resend Code</span>
                      <span>
                        {timer.minutes > 9
                          ? timer.minutes
                          : "0" + timer.minutes}
                        :
                        {timer.seconds > 9
                          ? timer.seconds
                          : "0" + timer.seconds}
                      </span>
                    </>
                  ) : (
                    "Resend Code"
                  )}
                </Button>
              </HStack>
            </FormControl>
          )}
        />
      )}
      <Button
        id="submit-btn"
        w="full"
        size="lg"
        colorScheme="primary"
        type="submit"
        isLoading={isPending}
      >
        {step === "email" ? "Submit" : "Verify"}
      </Button>

      <ResponsiveDialog
        isOpen={tosModalOpen}
        onClose={setOpenTosModal.bind(null, false)}
        title="Terms Of Services"
      >
        <TOS onAccept={onAccept} />
      </ResponsiveDialog>
    </VStack>
  );
};
