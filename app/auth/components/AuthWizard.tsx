"use client";
import { Image } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FediverseOauth } from "app/auth/components/FediverseOauth";
import MastodonIconBase from "assets/icons/Mastodon-outline.svg?react";
import EnvelopeIcon from "assets/icons/sms.svg?react";
import CoinGlassJar from "assets/images/coins-glass-jar.webp";
import Earth from "assets/images/earth.svg?react";
import Logo from "assets/images/logo-xl.svg?react";
import { toast } from "components/Toast";
import useTimer from "hooks/useTimer";
import { useSetAtom } from "jotai";
import { ApiError, api } from "lib/api";
import { queryClient } from "lib/reactQuery";
import { find, lowerCase, upperFirst } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useMutation } from "react-query";
import { authTokenAtom } from "states/console/user";
import { handleSubmit } from "utils/formHandler";
import { maskEmail } from "utils/strings";
import { z } from "zod";

const MastodonIcon = chakra(MastodonIconBase);
const Envelope = chakra(EnvelopeIcon);
const EarthIcon = chakra(Earth);

export type AuthWizardProps = {
  step?: typeof EMAIL_STEP | typeof VERIFICATION_STEP | typeof INFORMATION_STEP;
  onSignIn?: (token: string) => Promise<void>;
  changeRouteOnCompleteSteps?: boolean;
  oAuthInstance: string | null;
  content?: {
    [key: string]: {
      title?: string;
      description?: string;
    };
  };
  compact?: boolean;
};
const DEFAULT_STEP = "";
const EMAIL_STEP = "email";
const MASTODON_STEP = "mastodon";
const VERIFICATION_STEP = "verify";
const INFORMATION_STEP = "info";
const oauthSteps = [MASTODON_STEP];
const steps = [
  DEFAULT_STEP,
  MASTODON_STEP,
  EMAIL_STEP,
  VERIFICATION_STEP,
  INFORMATION_STEP,
];

const schema = z
  .object({
    email: z.string().email(),
    code: z
      .string()
      .min(5, "The code should be at least 5 digits")
      .max(5, "The code should be 5 digits"),
    name: z.string().min(1),
    token: z.string(),
  })
  .passthrough();

type FormType = z.infer<typeof schema>;

export const AuthWizard: FC<AuthWizardProps> = (props) => {
  const router = useRouter();
  const setAuthToken = useSetAtom(authTokenAtom);
  const onComplete = async (token: string) => {
    setAuthToken(token);
    if (props.onSignIn) {
      props.onSignIn(token).then(async () => {
        queryClient.clear();
        router.replace("/console");
      });
    }
  };

  return (
    <VStack
      justify="center"
      minH="var(--app-height)"
      align="center"
      bg="brand.gray.3"
      w="full"
    >
      <VStack
        maxW="100%"
        w={{ base: "full" }}
        alignItems="center"
        gap="5"
        h="full"
        flexGrow="1"
        minH="full"
        overflow="hidden"
      >
        <AuthWizardContent
          {...props}
          onSignIn={onComplete}
          oAuthInstance={props.oAuthInstance}
        />
      </VStack>
    </VStack>
  );
};

export const AuthWizardContent: FC<AuthWizardProps> = ({
  content,
  onSignIn,
  changeRouteOnCompleteSteps = true,
  oAuthInstance,
  ...props
}) => {
  const form = useForm<FormType>({
    defaultValues: {
      email: "",
      code: "",
    },
    resolver: zodResolver(schema),
  });
  const searchParams = useSearchParams();
  const [step, setStep] = useState(
    find(
      steps,
      (step) => step === (searchParams.get("step") || DEFAULT_STEP)
    ) || DEFAULT_STEP
  );

  const router = useRouter();

  const handleStepChange = (step: string) => {
    if (changeRouteOnCompleteSteps) {
      router.push(`/auth?${new URLSearchParams({ step }).toString()}`);
    } else setStep(step);
  };

  useEffect(() => {
    if (changeRouteOnCompleteSteps)
      setStep(
        find(
          steps,
          (step) => step === (searchParams.get("step") || DEFAULT_STEP)
        ) || DEFAULT_STEP
      );
  }, [searchParams]);
  return (
    <FormProvider {...form}>
      {step === DEFAULT_STEP && (
        <SigninList
          onChangeStep={handleStepChange}
          compact={props.compact || false}
          content={content}
        />
      )}
      {[EMAIL_STEP, VERIFICATION_STEP].includes(step) && (
        <Email
          compact={props.compact || false}
          content={content}
          step={step}
          onChangeStep={handleStepChange}
          changeRouteOnCompleteSteps={changeRouteOnCompleteSteps}
          onComplete={onSignIn}
        />
      )}
      {step === INFORMATION_STEP && (
        <Step3
          compact={props.compact || false}
          content={content}
          onChangeStep={handleStepChange}
          onComplete={onSignIn}
          changeRouteOnCompleteSteps={changeRouteOnCompleteSteps}
        />
      )}
      {oauthSteps.includes(step) && (
        <FediverseOauth
          step={step}
          onBack={handleStepChange.bind(null, DEFAULT_STEP)}
          onSignIn={onSignIn!}
          changeRouteOnCompleteSteps={changeRouteOnCompleteSteps}
          onChangeStep={handleStepChange}
          defaultOauthInstance={oAuthInstance}
          compact={props.compact || false}
        />
      )}
    </FormProvider>
  );
};

const SigninList: FC<StepProps> = ({ onChangeStep, compact, content }) => {
  return (
    <HStack
      gap={6}
      w="full"
      px={compact ? 0 : 4}
      h={{
        base: "full",
        md: "full",
      }}
      flexGrow="1"
      justifyContent={{
        base: "start",
        md: "center",
      }}
      flexDir={{
        base: "column",
        md: compact ? "column" : "row",
      }}
      maxWidth={{
        base: "full",
        md: "auto",
      }}
    >
      <Box
        maxH={{
          base: compact ? "230px" : "full",
          md: compact ? "230px" : "full",
        }}
        h={{
          base: "calc(100vw / 1.4)",
          md: compact ? "calc(100vw / 5.5)" : "auto",
        }}
        minW={{
          lg: "450px",
          base: "calc(100% - 460px)",
        }}
      >
        <Image
          alt=""
          src={CoinGlassJar}
          position="absolute"
          left={{
            base: "50%",
            md: compact ? "50%" : "0",
          }}
          top={{
            base: 0,
            md: compact ? "30px" : "50%",
          }}
          w={compact ? "auto" : "full"}
          maxH={{
            base: compact ? "230px" : "full",
          }}
          maxW={{
            base: "85%",
            md: "42%",
            lg: "50%",
          }}
          transform={{
            md: compact ? "translateX(-50%) rotate(90deg)" : "translateY(-50%)",
            base: "translateX(-50%) rotate(90deg)",
          }}
        />
      </Box>
      <VStack
        gap={8}
        textAlign="center"
        minW={{
          base: "full",
          md: "400px",
        }}
      >
        <Text
          fontWeight="bold"
          fontSize={{
            md: "28px",
            base: "24px",
          }}
          color="brand.black.1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          flexWrap="wrap"
        >
          {content?.default.title || (
            <>
              Welcome to <Logo height="35px" width="150px" />
            </>
          )}
        </Text>
        <VStack gap={3} w="full">
          <Button
            colorScheme="primary"
            size="lg"
            w="full"
            gap={2}
            onClick={onChangeStep.bind(null, EMAIL_STEP)}
          >
            <Envelope />
            Sign in with Email
          </Button>
          <Button
            colorScheme="primary"
            size="lg"
            w="full"
            gap={2}
            variant="outline"
            onClick={onChangeStep.bind(null, MASTODON_STEP)}
          >
            <MastodonIcon />
            Sign in with Mastodon
          </Button>
        </VStack>
      </VStack>
    </HStack>
  );
};

type StepProps = {
  step?: string;
  compact: boolean;
  active?: boolean;
  onComplete?: (token: string) => Promise<void>;
  changeRouteOnCompleteSteps?: boolean;
  onChangeStep: (step: string) => void;
  content?: {
    [key: string]: {
      title?: string;
      description?: string;
    };
  };
};
const Email: FC<StepProps> = ({
  onChangeStep,
  changeRouteOnCompleteSteps,
  content,
  step,
  onComplete,
  ...props
}) => {
  const form = useFormContext<FormType>();

  const {
    mutate: onSubmit,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn() {
      return form.trigger("email", { shouldFocus: true }).then((isValid) => {
        if (isValid)
          return api
            .signIn({
              email: form.getValues("email"),
            })
            .then((data) => {
              if (!!parseInt(data?.code))
                toast({
                  status: "success",
                  colorScheme: "green",
                  duration: 10000,
                  title: "Your Magic Code",
                  description: data?.code,
                  isClosable: true,
                });
              form.setValue("token", data!.token);
              form.setValue("code", "");
              onChangeStep(VERIFICATION_STEP);
            })
            .catch((error) => {
              form.setError("email", { message: error.message });
              throw error;
            });
        throw new Error();
      });
    },
  });
  if (step === EMAIL_STEP)
    return (
      <HStack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={6}
        w="full"
        px={props.compact ? 0 : 4}
        h={{
          base: "full",
          md: "full",
        }}
        flexGrow="1"
        justifyContent={{
          base: "start",
          md: "center",
        }}
        flexDir={{
          base: "column",
          md: props.compact ? "column" : "row",
        }}
        maxWidth={{
          base: "full",
          md: "auto",
        }}
      >
        <Box
          maxH={{
            base: props.compact ? "230px" : "full",
            md: props.compact ? "230px" : "full",
          }}
          h={{
            base: "calc(100vw / 1.4)",
            md: props.compact ? "calc(100vw / 5.5)" : "auto",
          }}
          minW={{
            lg: "450px",
            base: "calc(100% - 460px)",
          }}
        >
          <Image
            alt=""
            src={CoinGlassJar}
            position="absolute"
            left={{
              base: "50%",
              md: props.compact ? "50%" : "0",
            }}
            top={{
              base: 0,
              md: props.compact ? "30px" : "50%",
            }}
            w={props.compact ? "auto" : "full"}
            maxH={{
              base: props.compact ? "230px" : "full",
            }}
            maxW={{
              base: "85%",
              md: "42%",
              lg: "50%",
            }}
            transform={{
              md: props.compact
                ? "translateX(-50%) rotate(90deg)"
                : "translateY(-50%)",
              base: "translateX(-50%) rotate(90deg)",
            }}
          />
        </Box>
        <VStack
          gap={4}
          textAlign="center"
          minW={{
            base: "full",
            md: "400px",
          }}
        >
          <Text
            fontWeight="bold"
            fontSize={{
              md: "28px",
              base: "24px",
            }}
            color="brand.black.1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            flexWrap="wrap"
          >
            {content?.email.title || (
              <>
                Welcome to <Logo height="32px" width="150px" />
              </>
            )}
          </Text>

          <Text
            fontWeight="normal"
            fontSize={{
              md: "24px",
              base: "16px",
            }}
            color="brand.black.1"
          >
            {content?.email.description ||
              `Place your email address down below`}
          </Text>
          <FormControl isInvalid={!!form.formState.errors.email?.message}>
            <Controller
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <Input
                    autoFocus
                    placeholder="Email"
                    {...field}
                    onChange={(e) => {
                      if (!!form.formState.errors.email)
                        form.clearErrors("email");
                      field.onChange(e);
                    }}
                  />
                );
              }}
            />
            <FormErrorMessage>
              {form.formState.errors.email?.message}
            </FormErrorMessage>
          </FormControl>
          <VStack w="full">
            <Button
              loadingText="Sending Code..."
              isLoading={isLoading || isSuccess}
              type="submit"
              colorScheme="primary"
              w="full"
              size="lg"
            >
              Send Code
            </Button>
            <Button
              onClick={() => onChangeStep(DEFAULT_STEP)}
              isDisabled={isLoading || isSuccess}
              colorScheme="gray"
              w="full"
              size="lg"
            >
              Back
            </Button>
          </VStack>
        </VStack>
      </HStack>
    );
  if (step === VERIFICATION_STEP)
    return (
      <Step2
        content={content}
        onChangeStep={onChangeStep}
        onComplete={onComplete}
        compact={props.compact || false}
        changeRouteOnCompleteSteps={changeRouteOnCompleteSteps}
      />
    );
};

const Step2: FC<StepProps> = ({
  onComplete,
  onChangeStep,
  changeRouteOnCompleteSteps,
  compact,
}) => {
  const [showResendCode, setShowResendCode] = useState(false);
  const form = useFormContext<FormType>();
  const timer = useTimer(3);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const email = useWatch({
    control: form.control,
    name: "email",
  });
  useEffect(() => {
    const email = form.getValues("email");
    if (!email) {
      onChangeStep(EMAIL_STEP);
    }
  }, []);

  const { mutate: resendCode, isLoading: resendCodeLoading } = useMutation({
    mutationFn: async () =>
      api.resendVerificationCode({
        email,
      }),
    onSuccess(data) {
      timer.restart();
      setShowResendCode(false);
      form.clearErrors("code");
      if (!!parseInt(data?.code))
        toast({
          status: "success",
          colorScheme: "green",
          duration: 10000,
          title: "Your Magic Code",
          description: data?.code,
          isClosable: true,
        });
    },
  });

  const {
    mutate: onSubmit,
    isLoading,
    isSuccess,
  } = useMutation({
    onError(error: ApiError) {
      if (error.message) {
        form.setError("code", { message: error.message });
        setTimeout(() => firstInputRef.current?.focus());
      }
    },
    mutationFn() {
      return form.trigger("code", { shouldFocus: true }).then((isValid) => {
        if (isValid)
          return api
            .verify({
              email: form.getValues("email"),
              code: form.getValues("code"),
              token: form.getValues("token"),
            })
            .then((data) => {
              if (data && data.token) {
                form.setValue("token", data.token);
                if (data.newUser) {
                  onChangeStep(INFORMATION_STEP);
                } else {
                  onComplete && onComplete(data.token);
                }
              } else throw new Error();
            })
            .catch((error) => {
              setShowResendCode(true);
              firstInputRef.current?.focus();
              form.resetField("code");
              form.setError("code", { message: error.message });
              throw error;
            });
        throw new Error();
      });
    },
  });

  return (
    <HStack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      gap={6}
      w="full"
      px={4}
      h={{
        base: "full",
        md: "full",
      }}
      flexGrow="1"
      justifyContent={{
        base: "start",
        md: "center",
      }}
      flexDir={{
        base: "column",
        md: compact ? "column" : "row",
      }}
      maxWidth={{
        base: "full",
        md: "auto",
      }}
    >
      <Box
        maxH={{
          base: compact ? "230px" : "full",
          md: compact ? "230px" : "full",
        }}
        h={{
          base: "calc(100vw / 1.4)",
          md: compact ? "calc(100vw / 5.5)" : "auto",
        }}
        minW={{
          lg: "450px",
          base: "calc(100% - 460px)",
        }}
      >
        <Image
          alt=""
          src={CoinGlassJar}
          position="absolute"
          left={{
            base: "50%",
            md: compact ? "50%" : "0",
          }}
          top={{
            base: 0,
            md: compact ? "30px" : "50%",
          }}
          w={compact ? "auto" : "full"}
          maxH={{
            base: compact ? "230px" : "full",
          }}
          maxW={{
            base: "85%",
            md: "42%",
            lg: "50%",
          }}
          transform={{
            md: compact ? "translateX(-50%) rotate(90deg)" : "translateY(-50%)",
            base: "translateX(-50%) rotate(90deg)",
          }}
        />
      </Box>
      <VStack
        gap={4}
        textAlign="center"
        minW={{
          base: "full",
          md: "400px",
        }}
      >
        <VStack gap={2} textAlign="center">
          <Text
            fontWeight="bold"
            fontSize={{
              md: "28px",
              base: "24px",
            }}
            color="brand.black.1"
          >
            We sent a code to
          </Text>
          <Text
            fontWeight="normal"
            fontSize={{
              md: "24px",
              base: "16px",
            }}
            color="brand.black.1"
          >
            {maskEmail(email)}
          </Text>
        </VStack>
        <VStack
          gap={{ md: 6, base: 3 }}
          maxW={{ md: "370px", base: "450px" }}
          w="full"
        >
          <FormControl
            isInvalid={!!form.formState.errors.code?.message}
            w="auto"
          >
            <Controller
              control={form.control}
              name="code"
              render={({ field: { ref, ...field } }) => {
                return (
                  <HStack
                    width="full"
                    mx="auto"
                    gap={{
                      md: 4,
                      base: 3,
                    }}
                    justify={{
                      base: "center",
                      md: "space-between",
                    }}
                  >
                    <PinInput
                      {...field}
                      placeholder="_"
                      onComplete={() => onSubmit()}
                      onChange={(e) => {
                        if (!!form.formState.errors.code)
                          form.clearErrors("code");
                        field.onChange(e);
                      }}
                      isDisabled={isLoading || isSuccess}
                      autoFocus
                      isInvalid={!!form.formState.errors.code?.message}
                    >
                      <PinInputField ref={firstInputRef} />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                );
              }}
            />
            <FormErrorMessage>
              {upperFirst(lowerCase(form.formState.errors.code?.message))}
            </FormErrorMessage>
          </FormControl>
          <Button
            isDisabled={form.watch("code").length !== 5}
            type="submit"
            colorScheme="primary"
            w="full"
            size="lg"
            loadingText="Verifying..."
            isLoading={isLoading || isSuccess}
          >
            Next
          </Button>
          <HStack mt={{ base: 0, md: -3 }} w="full" justify="space-between">
            <Text
              color="brand.black.1"
              fontWeight="medium"
              fontSize={{ base: "16px", md: "20px" }}
            >
              {timer.minutes > 9 ? timer.minutes : "0" + timer.minutes}:
              {timer.seconds > 9 ? timer.seconds : "0" + timer.seconds}
            </Text>
            <Button
              isDisabled={!timer.isEnded && !showResendCode}
              variant="link"
              textDecoration="underline"
              textUnderlineOffset="2px"
              isLoading={resendCodeLoading}
              onClick={() => resendCode()}
              loadingText="Sending the code..."
              colorScheme="primary"
              fontWeight="medium"
              fontSize={{ base: "16px", md: "20px" }}
              _hover={{
                textDecoration: "underline",
              }}
              _active={{
                colorScheme: "primary",
              }}
            >
              Send the code again
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </HStack>
  );
};

const Step3: FC<StepProps> = ({ onComplete, onChangeStep }) => {
  const form = useFormContext<FormType>();

  useEffect(() => {
    const email = form.getValues("email");
    if (!email) {
      onChangeStep(DEFAULT_STEP);
    }
  }, []);

  const setUpToken = () => {
    return onComplete && onComplete(form.getValues("token"));
  };

  const {
    mutate: onSubmit,
    isLoading,
    isSuccess,
  } = useMutation({
    onError(error: ApiError) {
      error.message && form.setError("name", { message: error.message });
    },
    mutationFn() {
      return form.trigger("name", { shouldFocus: true }).then((isValid) => {
        if (isValid)
          return api
            .updateProfile({
              displayName: form.getValues("name"),
              bio: "",
              avatar: "",
            })
            .then(async () => {
              setUpToken();
            })
            .catch((error) =>
              form.setError("code", { message: error.message })
            );
        throw new Error();
      });
    },
  });

  return (
    <VStack
      gap={6}
      px={4}
      flexGrow={1}
      h={{
        base: "full",
      }}
      maxWidth={{
        base: "400px",
        md: "auto",
      }}
      justifyContent="center"
      w="full"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <VStack gap={2} textAlign="center">
        <Text
          fontWeight="normal"
          fontSize={{
            md: "28px",
            base: "24px",
          }}
          color="brand.black.1"
        >
          What should we call you?
        </Text>
      </VStack>
      <VStack gap={6} maxW={{ md: "400px", base: "450px" }} w="full">
        <FormControl isInvalid={!!form.formState.errors.name?.message}>
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => {
              return <Input placeholder="Your name" {...field} />;
            }}
          />
          <FormErrorMessage>
            {form.formState.errors.name?.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          colorScheme="primary"
          w="full"
          size="lg"
          isLoading={isLoading || isSuccess}
        >
          Let&apos;s go
        </Button>
        <Button
          variant="link"
          onClick={setUpToken}
          color="secondary.500"
          textDecoration="underline"
          fontWeight="bold"
          fontSize={{
            base: "12px",
            md: "16px",
          }}
        >
          Skip for now
        </Button>
      </VStack>
    </VStack>
  );
};
