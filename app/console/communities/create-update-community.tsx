"use client";
import {
  Avatar,
  Button,
  CircularProgress,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CenterLayout } from "app/console/components/CenterLayout";
import CameraIcon from "assets/icons/camera.svg?react";
import CheckIcon from "assets/icons/tick-circle.svg?react";
import TrashIcon from "assets/icons/trash.svg?react";
import defaultAvatar from "assets/images/default-avatar.svg";
import { AutoResizeTextarea } from "components/AutoResizeTextArea";
import { toast } from "components/Toast";
import { ApiError, api } from "lib/api";
import { mutateOnSubmit, useMutationWithFile } from "lib/file";
import { debounce } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { Community } from "types/Community";
import { createFilePath } from "utils/files";
import { z } from "zod";
import { BannerInput } from "./components/Banner";
import { CommunityCreateSuccessModal } from "./components/CommunityCreateSuccessModal";
import { DeleteCommunityModal } from "./components/DeleteCommunityModal";

const DeleteIcon = chakra(TrashIcon);
const UploadIcon = chakra(CameraIcon);
const HandleCheckIcon = chakra(CheckIcon);

const requiredString = z.string().min(1);

const handleSchema = z
  .string()
  .transform((val) => (val.startsWith("@") ? val.slice(1) : val))
  .pipe(
    z
      .string()
      .trim()
      .min(5, { message: "Username must be at least 5 characters" })
    // .max(16)
    // .regex(
    //   /^(?=[a-zA-Z0-9._]{5,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
    //   "Username is not valid"
    // )
  );
export default function CreateUpdateCommunityPage({
  community,
}: {
  community?: Community;
}) {
  const [communityCreateSuccessModal, setCommunityCreateSuccessModal] =
    useState(null);
  const [isDeleteCommunityModalOpen, setDeleteCommunityModalOpen] =
    useState(false);
  const isEditing = !!community;
  const schema = z
    .object({
      id: z.number(),
      name: requiredString.trim().max(128),
      handle: handleSchema,
      summary: requiredString.trim().max(512),
      banner: z.any().nullable(), // TODO: z.instanceof(File)
      avatar: z.any().nullable(), // TODO: z.instanceof(File)
    })
    .passthrough()
    .superRefine((data, ctx) => {
      if (usernameError)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: usernameError,
          path: ["handle"],
        });
    });
  const {
    formState: { errors },
    ...form
  } = useForm({
    defaultValues: community
      ? community
      : {
          id: 0,
          name: "",
          handle: "",
          summary: "",
          banner: null,
          avatar: null,
        },
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const [selectedAvatar, selectedBanner] = useWatch({
    control: form.control,
    name: ["avatar", "banner"],
  });

  const handle = useWatch({
    control: form.control,
    name: "handle",
  });

  const {
    data: usernameAvailability,
    isFetching: isCheckingUsername,
    error: handleAvailabilityError,
  } = useQuery({
    queryFn: async () => {
      if (handle && handle.length && (await form.trigger("handle"))) {
        const h = handleSchema.parse(handle);
        if (h === community?.handle) return { isAvailable: true, handle: h };
        return api.checkHandleAvailability({
          handle: handleSchema.parse(handle),
        });
      } else return null;
    },
    queryKey: ["checkUsernameAvailability", handle],
  });

  const clearAvatar: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    form.setValue<any>("avatar", null);
  };
  const queryClient = useQueryClient();
  const {
    mutate: mutate,
    isPending: isLoading,
    isSuccess,
  } = useMutationWithFile(
    async (data) => {
      toast.closeAll();
      if (isEditing && community) data.handle = community.handle;
      return await api.addOrUpdateCommunityByUser(data);
    },
    {
      onSuccess: ({ id }: any) => {
        queryClient.invalidateQueries({
          queryKey: ["COMMUNITY", String(community?.id)],
        });
        if (!isEditing) {
          setCommunityCreateSuccessModal(id);
        } else {
          router.push("/console/communities");
          toast({
            status: "success",
            title: "Community was successfully updated",
          });
        }
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

  const avatar = useMemo(() => {
    return !selectedAvatar ? defaultAvatar.src : createFilePath(selectedAvatar);
  }, [selectedAvatar]);
  const pathname = usePathname();
  useUpdateBreadcrumb(
    community
      ? {
          breadcrumb: [
            // {
            //   title: "Communities",
            //   link: "/console/communities",
            // },
            {
              title: "Edit Community",
              link: pathname,
            },
          ],
          title: "Edit community",
          back: {
            title: "Home",
            link: "/console",
          },
        }
      : {
          breadcrumb: [
            // {
            //   title: "Communities",
            //   link: "/console/communities",
            // },
            {
              title: "Create Community",
              link: "/console/communities/create",
            },
          ],
          title: "Create community",
          back: {
            title: "Home",
            link: "/console",
          },
        }
  );

  const changeHandle = useCallback(
    debounce((handle: string) => {
      form.clearErrors("handle");
      form.setValue("handle", handle);
    }, 300),
    []
  );

  const usernameError =
    (usernameAvailability &&
      !usernameAvailability.isAvailable &&
      handle !== community?.handle &&
      "Community handle already taken") ||
    (handleAvailabilityError && (handleAvailabilityError as any).message) ||
    false;

  useEffect(() => {
    if (usernameError) form.setError("handle", { message: usernameError });
  }, [usernameAvailability, handleAvailabilityError]);

  return (
    <>
      <VStack
        as="form"
        onSubmit={form.handleSubmit(mutateOnSubmit(mutate))}
        flexGrow="1"
        gap="6"
        height="full"
      >
        <CenterLayout
          flexGrow={1}
          h="full"
          wrapperProps={{
            flexGrow: 1,
            height: "full",
          }}
          maxW={{ base: "unset", md: "370px" }}
        >
          <VStack
            flexGrow={1}
            gap={10}
            w="full"
            justify={{ base: "space-between", md: "start" }}
            h="full"
          >
            <VStack gap={6} w="full">
              <VStack {...getRootProps()}>
                <input {...getInputProps()} />
                <Avatar
                  cursor="pointer"
                  src={avatar}
                  width={{ md: "130px", base: "80px" }}
                  height={{ md: "130px", base: "80px" }}
                />

                {!selectedAvatar ? (
                  <>
                    {/* <IconButton
                      aria-label="upload image"
                      variant="ghost"
                      colorScheme="blackAlpha"
                    >
                      <UploadIcon width={{ base: "24px", md: "32px" }} />
                    </IconButton> */}
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
                      fontSize={{ base: "10px", md: "14px" }}
                    >
                      Update avatar
                    </Button>
                    <Button
                      onClick={clearAvatar}
                      variant="link"
                      fontWeight="normal"
                      colorScheme="black"
                      fontSize={{ base: "10px", md: "14px" }}
                      color="red"
                    >
                      Remove avatar
                    </Button>
                  </HStack>
                )}
              </VStack>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Community Name</FormLabel>
                <Input {...form.register("name")} placeholder="" />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.handle}>
                <FormLabel>Community handle</FormLabel>
                <InputGroup>
                  {/* <InputLeftElement
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    h="full"
                    pl="3"
                  >
                    <HandleIcon w="6" h="6" opacity="0.5" />
                  </InputLeftElement> */}
                  <Controller
                    control={form.control}
                    name="handle"
                    render={({ field }) => {
                      return (
                        <Input
                          defaultValue={field.value}
                          onChange={(e) => changeHandle(e.target.value)}
                          // pl={"10 !important"}
                          isDisabled
                          pr={
                            isCheckingUsername ||
                            (usernameAvailability &&
                              usernameAvailability.isAvailable)
                              ? "10 !important"
                              : undefined
                          }
                        />
                      );
                    }}
                  />
                  <InputRightElement
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    h="full"
                    pr="3"
                  >
                    {isCheckingUsername && (
                      <CircularProgress
                        isIndeterminate
                        size="22px"
                        color="primary.500"
                      />
                    )}
                    {!isCheckingUsername &&
                      ((usernameAvailability &&
                        usernameAvailability.isAvailable) ||
                        handle === community?.handle) && (
                        <HandleCheckIcon color="primary.500" />
                      )}
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.handle?.message} </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.summary}>
                <FormLabel>Summary</FormLabel>
                <Controller
                  control={form.control}
                  name="summary"
                  render={({ field }) => {
                    return (
                      <VStack w="full">
                        <AutoResizeTextarea {...field} />
                        <HStack justify="end" w="full">
                          <FormErrorMessage flexGrow="1" mt="0">
                            {errors.summary?.message}
                          </FormErrorMessage>
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
              </FormControl>
              <FormControl isInvalid={!!errors.banner}>
                <FormLabel>Banner</FormLabel>
                <BannerInput
                  selectedBanner={selectedBanner}
                  setBanner={(banner) => {
                    form.setValue<any>("banner", banner);
                    form.trigger("banner");
                  }}
                />
                <FormErrorMessage>{errors.banner?.message}</FormErrorMessage>
              </FormControl>
              <Button
                maxW={{ base: "unset", md: "370px" }}
                isDisabled={
                  Object.keys(errors).length > 0 ||
                  isCheckingUsername ||
                  isSuccess
                }
                type="submit"
                w="full"
                size="lg"
                colorScheme="primary"
                variant="solid"
                isLoading={isLoading}
                display={{ base: "none", md: "flex" }}
              >
                {isSuccess
                  ? community
                    ? "Changes saved"
                    : "Community created"
                  : community
                  ? "Save changes"
                  : "Create Community"}
              </Button>
            </VStack>
          </VStack>
        </CenterLayout>
        <VStack w="full" gap={5}>
          <CommunityCreateSuccessModal
            community={{
              ...form.getValues(),
              id: communityCreateSuccessModal!,
            }}
            isOpen={!!communityCreateSuccessModal}
            onClose={() => {
              setCommunityCreateSuccessModal(null);
              router.push("/console/communities");
            }}
          />
          {community && (
            <VStack w="full">
              <VStack align="start" w="full">
                <Text
                  fontWeight="bold"
                  fontSize={{ base: "14px", md: "20px" }}
                  color="brand.red.500"
                >
                  Danger zone
                </Text>
                <HStack
                  flexDirection={{
                    base: "row",
                    md: "row",
                  }}
                  px={{ base: 3, md: 6 }}
                  py={{ base: 2, md: 6 }}
                  color="brand.black.1"
                  rounded="xl"
                  justifyItems="start"
                  w="full"
                  bg="white"
                  border="1px solid"
                  borderColor={{ base: "red.200", md: "red.500" }}
                  justify="space-between"
                >
                  <VStack
                    alignItems="start"
                    w={{ base: "full", md: "auto" }}
                    gap={{ base: 0, md: 2 }}
                  >
                    <Text
                      fontWeight="bold"
                      fontSize={{ base: "12px", md: "20px" }}
                    >
                      Delete this community
                    </Text>
                    <Text
                      fontWeight="medium"
                      fontSize={{ base: "10px", md: "18px" }}
                    >
                      you can’t undo this action
                    </Text>
                  </VStack>
                  <Button
                    onClick={setDeleteCommunityModalOpen.bind(null, true)}
                    variant="outline"
                    colorScheme="brand.red"
                    leftIcon={
                      <DeleteIcon
                        w={{ base: "18px", md: "24px" }}
                        h={{ base: "18px", md: "24px" }}
                      />
                    }
                    px={{ base: 10 }}
                    py={{ base: 2 }}
                    borderWidth={{ base: "1px", md: "2px" }}
                    size="lg"
                  >
                    Delete Community
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          )}
          <Button
            isDisabled={Object.keys(errors).length > 0 || isSuccess}
            type="submit"
            w="full"
            size="lg"
            colorScheme="primary"
            variant="solid"
            isLoading={isLoading}
            display={{ base: "flex", md: "none" }}
          >
            {isSuccess
              ? community
                ? "Changes saved"
                : "Community created"
              : community
              ? "Save changes"
              : "Create Community"}
          </Button>
        </VStack>
      </VStack>
      {community && (
        <DeleteCommunityModal
          isOpen={isDeleteCommunityModalOpen}
          community={community}
          onClose={setDeleteCommunityModalOpen.bind(null, false)}
        />
      )}
    </>
  );
}
