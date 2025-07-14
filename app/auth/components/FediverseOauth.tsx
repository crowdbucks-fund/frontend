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
import FilledCheckMark from "assets/icons/filled-check.svg?react";
import MastodonIconBase from "assets/icons/Mastodon.svg?react";
import Logo from "assets/images/logo-xl.svg?react";
import { upperFirst } from "lodash";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
      "mast.to",
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

export const FediverseOauth: FC<{ onBack: () => void }> = ({ onBack }) => {
  const searchParams = useSearchParams();
  const platformKey = searchParams.get("step")! as keyof typeof instances;
  const currentPlatform = instances[platformKey];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentPlatformInstances =
    instances[platformKey]?.defaultInstances || [];
  const [selectedInstance, setSelectedInstance] = useState(
    () => currentPlatformInstances[0]
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (isLoading && !!searchParams.get("error")) {
      setServerError(searchParams.get("error") || null);
      router.replace(
        withQuery(parseUrl(window.location.href).pathname, {
          step: platformKey,
        })
      );
      setIsLoading(false);
    }
  }, [searchParams.get("error"), isLoading]);
  const {
    isLoading: isAuthorizing,
    data: verificationData,
    error: verificationError,
  } = useQuery({
    queryFn: () =>
      fetch(`/auth/${platformKey}/callback`, {
        method: "POST",
        body: JSON.stringify({
          code: searchParams.get("code"),
          session: searchParams.get("session"),
        }),
      })
        .then((res) => {
          router.replace(
            withQuery(parseUrl(window.location.href).pathname, {
              step: platformKey,
            })
          );
          if (res.ok) {
            return res.json();
          }
          throw res;
        })
        .catch((res) => {
          if (res instanceof Response) {
            return res.json().then((data) => {
              throw data.error || "Something went wrong";
            });
          }
          throw res;
        }),
    enabled: !!searchParams.get("code"),
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
  if (!currentPlatform) redirect("/auth");
  return (
    <VStack justifyContent="start" minH="full" gap="6">
      <Logo />
      <VStack bg="white" rounded="xl" py="10" px="14" minW="600px" gap="8">
        <VStack alignItems="start" w="full">
          <Text color="blackAlpha.600">Login With...</Text>
          <Text
            fontWeight="bold"
            display="flex"
            fontSize="30px"
            alignItems="center"
            gap="1"
          >
            <currentPlatform.Icon />
            {upperFirst(currentPlatform.name)}
          </Text>
          <Text color="blackAlpha.600">
            Click next to join <b>“{upperFirst(selectedInstance)}”</b>. Or
            choose one from the list below.
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
                disabled={isLoading || isAuthorizing}
              >
                {upperFirst(instance)}
                {instance === selectedInstance && <CheckIcon width="24px" />}
              </Button>
            );
          })}
        </VStack>
        <HStack justifyContent="center" w="full">
          <Button
            onClick={onOpen}
            variant="ghost"
            disabled={isLoading || isAuthorizing}
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
                <Button w="full" size="lg" colorScheme="primary" type="submit">
                  Next
                </Button>
                <Button w="full" size="lg" colorScheme="gray" onClick={onClose}>
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
        {verificationData && (
          <pre>{JSON.stringify(verificationData, null, 2)}</pre>
        )}
        <HStack w="full" flexDir="row-reverse">
          <Button
            colorScheme="primary"
            size="lg"
            w="full"
            as={Link}
            href={`/auth/${platformKey}?instance=${selectedInstance}`}
            ref={nextButtonRef}
            isLoading={isLoading || isAuthorizing}
            onClick={onStartAuth}
            loadingText={isLoading ? "Redirecting..." : "Authorizing..."}
          >
            Next
          </Button>
          <Button
            size="lg"
            w="full"
            onClick={onBack}
            as={Link}
            href="/auth"
            disabled={isLoading || isAuthorizing}
          >
            Back
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};
