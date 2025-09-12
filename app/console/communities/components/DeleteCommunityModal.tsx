"use client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import TrashIcon from "assets/icons/trash.svg?react";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { toast } from "components/Toast";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "states/console/user";
import { Community } from "types/Community";
import { z } from "zod";
import { CommunityPreview } from "./CommunityPreview";

export type CreateCommunityModalProps = {
  community: Community;
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteCommunityModal: FC<CreateCommunityModalProps> = ({
  community,
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { user } = useAuth();
  const schema = z.object({
    name: z.literal(community.name, {
      errorMap: () => ({
        message: `The value should be '${community.name}'`,
      }),
    }),
  });
  const {
    formState: { errors },
    ...form
  } = useForm({
    defaultValues: { name: "" },
    resolver: zodResolver(schema),
  });
  const { mutate: deleteCommunity, isPending: isLoading } = useMutation({
    mutationFn: () =>
      api.removeCommunityByUser({
        id: community.id!,
      }),
    onSuccess() {
      router.push("/console/communities");
      toast({
        status: "success",
        title: `Community was successfully deleted`,
      });
    },
  });
  return (
    <ResponsiveDialog
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setStep(1);
      }}
      showTitleOnMobile
      title={`Delete ${community.name}
		${user?.displayName && ` from ${user?.displayName}'s communities`}`}
    >
      <VStack as={VStack} gap={6} w="full">
        <CommunityPreview community={community} compact />
        {step === 1 && (
          <>
            <Alert
              status="warning"
              alignItems="start"
              gap={{ base: 2, md: 3 }}
              bg="brand.secondary.5"
              borderColor="brand.secondary.1"
            >
              <AlertIcon
                color="brand.black.1"
                m="0"
                mt={{ base: "4px", md: 0 }}
                w={{ base: "18px", md: "32px" }}
                h={{ base: "18px", md: "32px" }}
              >
                <ExclamationTriangleIcon />
              </AlertIcon>
              <VStack gap={{ base: 2, md: 3 }} align="start">
                <AlertTitle>Read the following before any action</AlertTitle>
                <Divider opacity="1" borderColor="brand.secondary.4" />
                <AlertDescription lineHeight="base">
                  This will permanently delete the {community.name} Community.
                  Tiers, goals, donation history and everything else will be
                  removed for ever.
                </AlertDescription>
              </VStack>
            </Alert>
            <Button
              w="full"
              colorScheme="gray"
              color="primary.500"
              border="2px solid"
              borderColor="gray.200"
              size="lg"
              variant="solid"
              onClick={setStep.bind(null, 2)}
            >
              I&rsquo;ve read the above information
            </Button>
          </>
        )}
        {step === 2 && (
          <VStack
            as="form"
            w="full"
            gap={6}
            onSubmit={form.handleSubmit(() => deleteCommunity())}
          >
            <FormControl isInvalid={!!errors.name?.message}>
              <FormLabel>
                To confirm, type &rsquo;<span>{community.name}</span>&rsquo; in
                the field
              </FormLabel>
              <Input
                placeholder={community.name}
                {...form.register("name")}
                size="lg"
                variant="outline"
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <Button
              isLoading={isLoading}
              isDisabled={community.name !== form.watch("name")}
              colorScheme={
                community.name !== form.watch("name") ? "gray" : "brand.red"
              }
              type="submit"
              w="full"
              size="lg"
              variant="outline"
              leftIcon={<TrashIcon width="23px" />}
              onClick={setStep.bind(null, 2)}
            >
              Delete community
            </Button>
          </VStack>
        )}
      </VStack>
    </ResponsiveDialog>
  );
};
