import {
  Alert,
  AlertDescription,
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthenticateResult } from "@xeronith/granola/core/spi";
import FilledCheckMark from "assets/icons/filled-check.svg?react";
import MastodonIconBase from "assets/icons/Mastodon.svg?react";
import Logo from "assets/images/logo-xl.svg?react";
import { api } from "lib/api";
import { upperFirst } from "lodash";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useQuery } from "react-query";
import { withoutProtocol, withQuery } from "ufo";
import { z } from "zod";

const CheckIcon = chakra(FilledCheckMark);
const MastodonIcon = chakra(MastodonIconBase);
const instances = {
  mastodon: {
    defaultInstances: [
      "mastodon.social",
      "mastodon.online",
      "mstdn.social",
      "mas.to",
    ],
    name: "Mastodon",
    Icon: MastodonIcon,
  },
};

const schema = z.object({
  url: z
    .string()
    .regex(
      /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
    )
    .or(z.string().ip().or(z.string().url()))
    .transform((url) => {
      return withoutProtocol(url);
    }),
});

export const FediverseOauth: FC<{
  step: string;
  onBack: () => void;
  onSignIn: (token: string) => Promise<void>;
  onChangeStep: (step: string) => void;
  defaultOauthInstance?: string | null;
  compact: boolean;
  changeRouteOnCompleteSteps?: boolean;
}> = ({
  onBack,
  onSignIn,
  onChangeStep,
  defaultOauthInstance,
  step,
  compact,
  changeRouteOnCompleteSteps = true,
}) => {
  const currentPathname = usePathname();
  const searchParams = useSearchParams();
  const platformKey = (step ||
    searchParams.get("step")!) as keyof typeof instances;
  const currentPlatform = instances[platformKey];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentPlatformInstances =
    instances[platformKey]?.defaultInstances || [];
  const [selectedInstance, setSelectedInstance] = useState(
    () => defaultOauthInstance || currentPlatformInstances[0]
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (isLoading && !!searchParams.get("error")) {
      setServerError(searchParams.get("error") || null);
      router.replace(
        withQuery(parseUrl(window.location.href).pathname, {
          step: changeRouteOnCompleteSteps ? platformKey : undefined,
        })
      );
      setIsLoading(false);
    }
  }, [searchParams.get("error"), isLoading]);
  const formContext = useFormContext();
  const {
    isLoading: isAuthorizing,
    error: verificationError,
    isSuccess,
  } = useQuery<AuthenticateResult, string>({
    queryKey: ["oauth-callback", platformKey],
    queryFn: () => {
      const code = searchParams.get("code");
      const session = searchParams.get("session");
      window.history.replaceState(
        {},
        "",
        withQuery(parseUrl(window.location.href).pathname, {
          step: changeRouteOnCompleteSteps ? platformKey : undefined,
        })
      );
      return fetch(`/auth/${platformKey}/callback`, {
        method: "POST",
        body: JSON.stringify({
          code,
          session,
        }),
      })
        .then(async (res) => {
          if (res.ok) {
            const { token, instance } = (await res.json()) as {
              token: string;
              instance: string;
            };
            setSelectedInstance(instance);
            const credentials = await api
              .authenticate({
                token,
                provider: "mastodon",
                server: instance,
              })
              .catch((e: Error) => {
                // throw e.message || "Something went wrong";
                throw "Something went wrong, please try again later.";
              });
            // if (credentials.newUser) {
            //   formContext.setValue("email", "mastodon");
            //   formContext.setValue("token", token);
            //   onChangeStep("info");
            //   return credentials;
            // } else {
            await onSignIn(credentials.token);
            return credentials;
            // }
          }
          throw res;
        })
        .catch((res) => {
          if (res instanceof Response) {
            return res.json().then((data: any) => {
              throw data.error || "Something went wrong";
            });
          }
          throw res;
        });
    },
    enabled: !!searchParams.get("code") || !!searchParams.get("session"),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
    },
  });
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const addServer = (data: z.infer<typeof schema>) => {
    setSelectedInstance(data.url);
    onClose();
    setTimeout(() => {
      nextButtonRef.current?.focus();
    });
  };
  const onStartAuth = () => {
    setIsLoading(true);
    setServerError(null);
  };
  if (!currentPlatform) return null;

  return (
    <VStack
      justifyContent="start"
      minH="full"
      flexGrow={{ base: 1, md: 0 }}
      gap="6"
      bg={{ base: "white", md: "transparent" }}
      py={compact ? 0 : 6}
      px={compact ? {} : { base: 4, md: 4 }}
      w="full"
    >
      <Logo />
      <VStack
        flexGrow={{ base: 1, md: 0 }}
        h={{ base: "full", md: "auto" }}
        bg="white"
        rounded="xl"
        w="full"
        maxW={{ base: "full", md: "600px" }}
        gap="8"
        justify="space-between"
        py={compact ? {} : { base: 0, md: 10 }}
        px={compact ? {} : { base: 0, md: 10 }}
      >
        <VStack gap="8" w="full">
          <VStack alignItems="start" w="full">
            <Text color="blackAlpha.600" fontSize="12px">
              Login with...
            </Text>
            <Text
              fontWeight="bold"
              display="flex"
              fontSize={{
                base: "22px",
                md: "30px",
              }}
              alignItems="center"
              gap="1"
            >
              <currentPlatform.Icon
                w={{
                  base: "25px",
                }}
              />
              {upperFirst(currentPlatform.name)}
            </Text>
            <Text color="blackAlpha.600" fontSize="14px">
              Click next to join <b>“{selectedInstance}”</b>. Or choose one from
              the list below.
            </Text>
          </VStack>
          <VStack w="full">
            {[
              ...currentPlatformInstances,
              ...(!currentPlatformInstances.includes(selectedInstance)
                ? [selectedInstance]
                : []),
            ].map((instance) => {
              return (
                <Button
                  variant="outline"
                  colorScheme={instance === selectedInstance ? "black" : "gray"}
                  color={instance === selectedInstance ? "black" : "gray.500"}
                  rounded="xl"
                  px="4"
                  py="6"
                  justifyContent="space-between"
                  onClick={setSelectedInstance.bind(null, instance)}
                  key={instance}
                  width="full"
                  disabled={isLoading || isAuthorizing || isSuccess}
                >
                  {instance}
                  {instance === selectedInstance && <CheckIcon width="24px" />}
                </Button>
              );
            })}
          </VStack>
          <HStack justifyContent="center" w="full">
            <Button
              onClick={onOpen}
              variant="ghost"
              disabled={isLoading || isAuthorizing || isSuccess}
            >
              Sign-in with a different server?
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent
                rounded="xl"
                p="3"
                as="form"
                onSubmit={form.handleSubmit(addServer)}
              >
                <ModalHeader
                  fontWeight="normal"
                  fontSize="18px"
                  color={"blackAlpha.500"}
                >
                  Add Server
                </ModalHeader>
                <ModalCloseButton top="6" right="6" color={"blackAlpha.500"} />
                <ModalBody>
                  <Controller
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormControl
                        isInvalid={!!form.formState.errors.url?.message}
                      >
                        <FormLabel marginBottom={0}>Server URl</FormLabel>
                        <Input placeholder="Server URL" {...field} autoFocus />
                        <FormErrorMessage>
                          {form.formState.errors.url?.message}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  />
                </ModalBody>
                <ModalFooter gap="2" flexDirection="row-reverse">
                  <Button
                    w="full"
                    size="lg"
                    colorScheme="primary"
                    type="submit"
                  >
                    Next
                  </Button>
                  <Button
                    w="full"
                    size="lg"
                    colorScheme="gray"
                    onClick={onClose}
                  >
                    Back
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </HStack>
          {(serverError || verificationError) && (
            <Alert status="error" borderColor="red.200">
              <AlertDescription textColor="red.900" fontSize="md">
                {serverError || (verificationError as string)}
              </AlertDescription>
            </Alert>
          )}
        </VStack>
        <HStack w="full" flexDir="row-reverse">
          <Button
            colorScheme="primary"
            size="lg"
            w="full"
            as={"a"}
            href={`/auth/${platformKey}?instance=${selectedInstance}&redirect_url=${currentPathname}`}
            ref={nextButtonRef}
            isLoading={isLoading || isAuthorizing || isSuccess}
            onClick={onStartAuth}
            loadingText={isLoading ? "Redirecting..." : "Authorizing..."}
          >
            Next
          </Button>
          <Button
            size="lg"
            w="full"
            onClick={onBack}
            as={changeRouteOnCompleteSteps ? Link : undefined}
            href={changeRouteOnCompleteSteps ? "/auth" : undefined}
            disabled={isLoading || isAuthorizing || isSuccess}
          >
            Back
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};
