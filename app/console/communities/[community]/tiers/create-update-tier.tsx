"use client";
import {
  Button,
  Checkbox,
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
import { useMutation } from "@tanstack/react-query";
import { GetTierByUserResult } from "@xeronith/granola/core/spi";
import { CenterLayout } from "app/console/components/CenterLayout";
import { AutoResizeTextarea } from "components/AutoResizeTextArea";
import { toast } from "components/Toast";
import { useCurrencies } from "hooks/useCurrencies";
import { useTierFrequency } from "hooks/useTierFrequency";
import { api } from "lib/api";
import { zodInputStringPipe } from "lib/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { z } from "zod";
import { useCurrentCommunity } from "../components/community-validator-layout";
import { DeleteTierModal } from "./components/DeleteTierModal";

export const tierZodSchema = z.object({
  id: z.number(),
  communityId: z
    .string()
    .min(1)
    .transform((s) => parseInt(s))
    .or(z.number()),
  recommended: z.boolean(),
  name: z.string().trim().min(1).max(128),
  currencyId: z
    .string()
    .min(1)
    .transform((s) => parseInt(s))
    .or(z.number()),
  amount: zodInputStringPipe(
    z
      .number()
      .min(1, "Amount should be greather than 0")
      .max(1000000, "Amount can't be greather than 1M")
  ),
  tierFrequencyId: z
    .string()
    .min(1)
    .transform((s) => parseInt(s))
    .or(z.number()),
  caption: z.string().trim().min(1).max(512),
  currency: z
    .object({
      name: z.string(),
      id: z.number(),
    })
    .optional(),
  tierFrequency: z
    .object({
      name: z.string(),
      id: z.number(),
      unit: z.string(),
    })
    .optional(),
  subscribers: z.number(),
});
export default function CreateUpdateTier({
  tier,
}: {
  tier?: GetTierByUserResult;
}) {
  const community = useCurrentCommunity();
  const communityId = community.id;
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!tier;
  const form = useFormContext<z.infer<typeof tierZodSchema>>();
  useEffect(() => {
    if (tier)
      Object.keys(tier).forEach((key) => {
        // @ts-ignore
        form.setValue(key, tier[key]);
      });
  }, [tier]);

  const router = useRouter();
  const errors = form.formState.errors;

  const { data: currencies, isLoading: currenciesLoading } = useCurrencies();
  const { data: tierFrequencies, isLoading: tierFrequenciesLoading } =
    useTierFrequency();

  useEffect(() => {
    if (currencies && currencies[0] && !form.getValues("currencyId")) {
      form.setValue("currencyId", currencies[0].id);
      form.setValue("currency", currencies[0]);
    }
  }, [currencies]);
  useEffect(() => {
    if (
      tierFrequencies &&
      tierFrequencies[0] &&
      !form.getValues("tierFrequencyId")
    ) {
      form.setValue("tierFrequencyId", tierFrequencies[0].id);
      form.setValue("tierFrequency", tierFrequencies[0]);
    }
  }, [tierFrequencies]);

  const {
    mutate: createUpdateTier,
    isPending: isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: api.addOrUpdateTierByUser.bind(api),
    onSuccess() {
      toast({
        status: "success",
        title: `The tier was successfully ${isEditing ? "updated" : "created"}`,
      });
      router.push(`/console/tiers`);
    },
  });
  const pathname = usePathname();
  useUpdateBreadcrumb(
    !isEditing
      ? {
          breadcrumb: [
            {
              title: `${community!.name} community`,
              link: `/console`,
            },
            {
              title: `Create tier`,
              link: pathname,
              startsWith: true,
            },
          ],
          back: {
            title: "Tiers",
            link: `/console/tiers`,
          },
          title: "Create tier",
        }
      : {
          breadcrumb: [
            {
              title: `${community!.name} community`,
              link: `/console`,
            },
            {
              title: `Tiers`,
              link: `/console/tiers`,
            },
            {
              title: `Edit ${tier.name}`,
              link: pathname,
            },
          ],
          back: {
            title: "Tiers",
            link: `/console/tiers`,
          },
          title: "Edit tier",
        },
    []
  );

  const formLoading = currenciesLoading || tierFrequenciesLoading;
  const handleSubmit = (
    values: Omit<z.infer<typeof tierZodSchema>, "currency" | "tierFrequency">
  ) => {
    return createUpdateTier(values);
    // reset form to the validated values
    // form.reset(values, {
    //   keepValues: false,
    // });
    // router.push(`/console/communities/${community.id}/tiers/create/publish`);
  };

  const editButtonIsDisabled = isEditing && !form.formState.isDirty;

  return (
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
        w="full"
        justify={{ base: "space-between", md: "start" }}
        flexGrow={1}
        h="full"
        as="form"
        onSubmit={form.handleSubmit(handleSubmit)}
        gap="6"
      >
        <VStack gap={6} w="full">
          <FormControl isInvalid={!!errors.recommended}>
            <Controller
              control={form.control}
              name="recommended"
              render={({ field }) => {
                const { value, ...props } = field;
                return (
                  <Checkbox size="lg" {...props} isChecked={field.value}>
                    Recommended Tier
                  </Checkbox>
                );
              }}
            />
            <FormErrorMessage>{errors.recommended?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input {...form.register("name")} />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <HStack alignItems="start" w="full">
            <FormControl isInvalid={!!errors.currencyId} flexGrow={1}>
              <FormLabel textAlign="left" w="full">
                Pricing
              </FormLabel>
              <Controller
                control={form.control}
                name="currency"
                render={({ field }) => {
                  return (
                    <Input
                      id="currencyId"
                      readOnly
                      isDisabled
                      value={field.value?.name}
                    />
                  );
                }}
              />
              <FormErrorMessage>{errors.currencyId?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.amount} flexGrow={1}>
               <FormLabel textAlign="left" w="full"></FormLabel>
              <Input
                type="number"
                isDisabled={isEditing}
                step="0.01"
                {...form.register("amount")}
                placeholder="Amount"
              />
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.tierFrequencyId} flexGrow={1}>
               <FormLabel textAlign="left" w="full"></FormLabel>
              <Controller
                control={form.control}
                name="tierFrequencyId"
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      isDisabled={isEditing}
                      onChange={(e) => {
                        const selectedFrequency = tierFrequencies?.find(
                          (frequency) =>
                            frequency.id.toString() === e.target.value
                        );
                        if (selectedFrequency)
                          form.setValue("tierFrequency", selectedFrequency);
                        field.onChange(e);
                      }}
                      icon={
                        tierFrequenciesLoading ? (
                          <CircularProgress
                            isIndeterminate
                            size="25px"
                            color="primary.500"
                          />
                        ) : undefined
                      }
                    >
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
                {errors.tierFrequencyId?.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          <FormControl isInvalid={!!errors.caption}>
            <FormLabel>Caption</FormLabel>
            <Controller
              control={form.control}
              name="caption"
              render={({ field }) => {
                return (
                  <VStack w="full">
                    <AutoResizeTextarea {...field} />
                    <HStack justify="end" w="full">
                      <FormErrorMessage flexGrow="1" mt="0">
                        {errors.caption?.message}
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
        </VStack>
        <VStack w="full">
          <Button
            isDisabled={
              formLoading ||
              Object.keys(errors).length > 0 ||
              editButtonIsDisabled
            }
            type="submit"
            w="full"
            size="lg"
            colorScheme="primary"
            variant="solid"
            isLoading={isLoading || isSuccess}
          >
            {isEditing ? "Save changes" : "Create a tier"}
          </Button>
          {isEditing && (
            <Button
              onClick={setIsDeleting.bind(null, true)}
              variant="link"
              colorScheme="red"
              textDecoration="underline"
              textUnderlineOffset="4px"
            >
              Delete tier
            </Button>
          )}
        </VStack>
      </VStack>
      {isEditing && (
        <DeleteTierModal
          isOpen={isDeleting}
          deletingTier={tier}
          onClose={setIsDeleting.bind(null, false)}
          onDeleted={() => {
            router.push(`/console/tiers/`);
          }}
        />
      )}
    </CenterLayout>
  );
}
