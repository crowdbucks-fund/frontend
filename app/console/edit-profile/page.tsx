"use client";
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CenterLayout } from "app/console/components/CenterLayout";
import CameraIcon from "assets/icons/camera.svg?react";
import LogoutIcon from "assets/icons/logout.svg?react";
import defaultAvatar from "assets/images/default-profile.png";
import { AutoResizeTextarea } from "components/AutoResizeTextArea";
import { toast } from "components/Toast";
import { useUserAuthProvider } from "hooks/useUserAuthProvider";
import { ApiError, api } from "lib/api";
import { mutateOnSubmit, useMutationWithFile } from "lib/file";
import { queryClient } from "lib/reactQuery";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useAuth, useUserQueryKey } from "states/console/user";
import { createFilePath } from "utils/files";
import { z } from "zod";
import { LogoutModal } from "./LogoutModal";

const schema = z.object({
  name: z.string().trim().min(1).max(128),
  bio: z.string().trim().max(512),
  avatar: z.any().nullable(),
});

export default function EditProfilePage() {
  const { user } = useAuth();
  const authProvider = useUserAuthProvider();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      avatar: null,
      bio: "",
      ...user,
      name: user?.displayName,
    },
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const errors = form.formState.errors;

  const { mutate: updateProfile, isLoading } = useMutationWithFile(
    (data) => {
      return api.updateProfile({
        ...data,
        displayName: data.name,
      });
    },
    {
      onSuccess: () => {
        toast({
          status: "success",
          title: "Profile updated successfully",
        });
        queryClient.invalidateQueries(useUserQueryKey);
        router.push(`/console/`);
      },
      onError(error) {
        const { message } = (error as ApiError) || {};
        if (message) {
          toast({
            status: "error",
            title: message,
          });
        }
      },
    }
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: false,
    onDropAccepted: ([file]) => {
      form.setValue<any>("avatar", file);
    },
  });

  const [selectedAvatar] = useWatch({
    control: form.control,
    name: ["avatar"],
  });

  const avatar = useMemo(() => {
    return !selectedAvatar ? defaultAvatar.src : createFilePath(selectedAvatar);
  }, [selectedAvatar]);

  const clearAvatar: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    form.setValue<any>("avatar", null);
  };

  return (
    <CenterLayout
      flexGrow={1}
      h="full"
      wrapperProps={{
        flexGrow: 1,
        height: "full",
      }}
    >
      <VStack
        gap={6}
        flexGrow={1}
        w="full"
        justifyContent="space-between"
        h="full"
        as="form"
        onSubmit={form.handleSubmit(mutateOnSubmit(updateProfile))}
      >
        <VStack gap={6} w="full">
          <VStack {...getRootProps()}>
            <input {...getInputProps()} />
            <Avatar
              cursor="pointer"
              src={avatar}
              size={{ base: "xl", md: "2xl" }}
            />

            {!selectedAvatar ? (
              <>
                <IconButton
                  aria-label="upload image"
                  variant="ghost"
                  colorScheme="blackAlpha"
                >
                  <CameraIcon />
                </IconButton>
                <Button
                  variant="link"
                  fontWeight="normal"
                  color="brand.black.3"
                  fontSize="14px"
                >
                  Upload a pic
                </Button>
              </>
            ) : (
              <HStack pt="2">
                <Button
                  variant="link"
                  fontWeight="normal"
                  colorScheme="black"
                  fontSize="14px"
                >
                  Update avatar
                </Button>
                <Button
                  onClick={clearAvatar}
                  variant="link"
                  fontWeight="normal"
                  colorScheme="black"
                  fontSize="14px"
                  color="red"
                >
                  Remove avatar
                </Button>
              </HStack>
            )}
          </VStack>

          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input {...form.register("name")} />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.bio}>
            <FormLabel>Bio</FormLabel>
            <Controller
              control={form.control}
              name="bio"
              render={({ field }) => {
                return (
                  <VStack w="full">
                    <AutoResizeTextarea {...field} />
                    <HStack justify="end" w="full">
                      <Text
                        fontSize="12px"
                        color={
                          field.value.trim().length > 512
                            ? "red.500"
                            : "brand.black.1"
                        }
                      >
                        {field.value.trim().length}/512
                      </Text>
                    </HStack>
                  </VStack>
                );
              }}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <Text w="full" color="gray.700" fontSize={"14px"}>
            Authenticated using <b>{authProvider.provider}</b> as{" "}
            <b>{authProvider.value}</b>
          </Text>
        </VStack>
        <Flex
          gap={{ base: 3, md: 6 }}
          flexDirection={{
            md: "column",
            base: "row-reverse",
          }}
          w="full"
        >
          <Button
            isDisabled={Object.keys(errors).length > 0}
            type="submit"
            w="full"
            size="lg"
            colorScheme="primary"
            variant="solid"
            isLoading={isLoading}
          >
            Update profile
          </Button>

          <Button
            size="lg"
            onClick={setIsLoggingOut.bind(null, true)}
            leftIcon={<LogoutIcon />}
            variant={{ md: "link", base: "outline" }}
            w="full"
            colorScheme="brand.red"
            textDecoration={{ md: "underline" }}
            textUnderlineOffset="4px"
          >
            Log out
          </Button>
        </Flex>
      </VStack>
      <LogoutModal
        isOpen={isLoggingOut}
        onClose={setIsLoggingOut.bind(null, false)}
      />
    </CenterLayout>
  );
}
