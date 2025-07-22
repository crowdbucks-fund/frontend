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
import { GetGoalByUserResult } from "@xeronith/granola/core/spi";
import { CenterLayout } from "app/console/components/CenterLayout";
import { AutoResizeTextarea } from "components/AutoResizeTextArea";
import { toast } from "components/Toast";
import { useCurrencies } from "hooks/useCurrencies";
import { useGoalsFrequency } from "hooks/useGoalFrequency";
import { useGoals } from "hooks/useGoals";
import { api } from "lib/api";
import { zodInputStringPipe } from "lib/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useMutation } from "react-query";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { z } from "zod";
import { useCurrentCommunity } from "../components/community-validator-layout";
import { DeleteGoalModal } from "./components/DeleteGoalModal";

export const goalZodSchema = z.object({
  id: z.number(),
  communityId: z
    .string()
    .min(1)
    .transform((s) => parseInt(s))
    .or(z.number()),
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
  goalFrequencyId: z
    .string()
    .min(1)
    .transform((s) => parseInt(s))
    .or(z.number()),
  caption: z.string().trim().min(1).max(512),
  currency: z.object({
    name: z.string(),
    id: z.number(),
    code: z.string(),
  }),
  goalFrequency: z.object({
    name: z.string(),
    id: z.number(),
    unit: z.string(),
  }),
  accumulatedFunds: z.number(),
  timestamp: z.number(),
  priority: z.number().or(z.string().transform((v) => parseInt(v))),
});

export default function CreateUpdateGoal({
  goal,
}: {
  goal?: GetGoalByUserResult;
}) {
  const community = useCurrentCommunity();
  const communityId = community.id;
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!goal;
  const form = useFormContext<z.infer<typeof goalZodSchema>>();

  useEffect(() => {
    if (goal)
      Object.keys(goal).forEach((key) => {
        // @ts-ignore
        form.setValue(key, goal[key]);
      });
  }, [goal]);

  const router = useRouter();
  const errors = form.formState.errors;
  const { data: goals, isFetching: goalsLoading } = useGoals({
    communityId,
    onSuccess(data) {
      if (!isEditing) {
        form.setValue("priority", data.length + 1);
      }
    },
  });
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies();
  const { data: goalsFrequencies, isLoading: frequenciesLoading } =
    useGoalsFrequency();

  useEffect(() => {
    if (currencies && !form.getValues("currencyId")) {
      form.setValue("currencyId", currencies[0].id);
      form.setValue("currency", currencies[0]);
    }
  }, [currencies]);
  useEffect(() => {
    if (goalsFrequencies && !form.getValues("goalFrequencyId")) {
      form.setValue("goalFrequencyId", goalsFrequencies[0].id);
      form.setValue("goalFrequency", goalsFrequencies[0]);
    }
  }, [goalsFrequencies]);

  const { mutate: createUpdateGoal, isLoading } = useMutation({
    mutationFn: api.addOrUpdateGoalByUser.bind(api),
    onSuccess() {
      toast({
        status: "success",
        title: "The goal was successfully updated",
      });
      router.push(`/console/communities/${communityId}/goals`);
    },
  });
  const pathname = usePathname();
  useUpdateBreadcrumb(
    !isEditing
      ? {
          breadcrumb: [
            {
              title: `${community!.name} community`,
              link: `/console/communities/${community!.id}`,
            },
            {
              title: `Create goal`,
              link: pathname,
              startsWith: true,
            },
          ],
          back: {
            link: `/console/communities/${community.id}/goals`,
            title: "Goals",
          },
          title: "Create Goal",
        }
      : {
          breadcrumb: [
            {
              title: `${community!.name} community`,
              link: `/console/communities/${community!.id}`,
            },
            {
              title: `Gaols`,
              link: `/console/communities/${community!.id}/goals`,
            },
            {
              title: `Edit ${goal.name}`,
              link: pathname,
            },
          ],
          back: {
            link: `/console/communities/${community.id}/goals`,
            title: "Goals",
          },
          title: "Edit Goal",
        },
    []
  );

  const formLoading = currenciesLoading || frequenciesLoading;
  const handleSubmit = (
    values: Omit<z.infer<typeof goalZodSchema>, "currency" | "goalFrequency">
  ) => {
    if (isEditing) return createUpdateGoal(values);
    // reset form to the validated values
    form.reset(values, {
      keepValues: false,
    });
    router.push(`/console/communities/${community.id}/goals/create/publish`);
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
        gap={8}
        flexGrow={1}
        h="full"
        as="form"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <VStack gap={6} w="full">
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input {...form.register("name")} />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <VStack w="full">
            <FormLabel m="0" textAlign="left" w="full" htmlFor="currencyId">
              Desired amount
            </FormLabel>
            <HStack align="start" w="full">
              <FormControl isInvalid={!!errors.currency} flexGrow={1}>
                <Controller
                  control={form.control}
                  name="currency"
                  render={({ field }) => {
                    return (
                      <Input
                        id="currencyId"
                        value={field.value?.name}
                        readOnly
                        isDisabled={isEditing}
                      />
                    );
                  }}
                />
                <FormErrorMessage>
                  {errors.currencyId?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!!errors.amount}
                h="full"
                display="flex"
                justifyContent="space-between"
                flexDirection="column"
              >
                <Input
                  type="number"
                  isDisabled={isEditing}
                  step="0.01"
                  {...form.register("amount")}
                  placeholder="Amount"
                />
                <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!!errors.goalFrequencyId}
                h="full"
                display="flex"
                justifyContent="space-between"
                flexDirection="column"
              >
                <Controller
                  control={form.control}
                  name="goalFrequencyId"
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        isDisabled={isEditing}
                        onChange={(e) => {
                          const selectedFrequency = goalsFrequencies?.find(
                            (frequency) =>
                              frequency.id.toString() === e.target.value
                          );
                          if (selectedFrequency)
                            form.setValue("goalFrequency", selectedFrequency);
                          field.onChange(e);
                        }}
                        icon={
                          frequenciesLoading ? (
                            <CircularProgress
                              isIndeterminate
                              size="25px"
                              color="primary.500"
                            />
                          ) : undefined
                        }
                      >
                        {goalsFrequencies &&
                          goalsFrequencies.map((cr, id) => {
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
                  {errors.goalFrequencyId?.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
          </VStack>
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
          <FormControl isInvalid={!!errors.priority}>
            <FormLabel>Priority</FormLabel>
            <Controller
              control={form.control}
              name="priority"
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    isDisabled={goalsLoading}
                    icon={
                      goalsLoading ? (
                        <CircularProgress
                          isIndeterminate
                          size="25px"
                          color="primary.500"
                        />
                      ) : undefined
                    }
                  >
                    {goals &&
                      goals.map((cr, id) => {
                        return (
                          <option key={id} value={id + 1}>
                            #{id + 1}
                          </option>
                        );
                      })}

                    {!isEditing && goals && (
                      <option value={goals.length + 1}>
                        #{goals.length + 1}
                      </option>
                    )}
                  </Select>
                );
              }}
            />
            <FormErrorMessage>{errors.priority?.message}</FormErrorMessage>
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
            isLoading={isLoading}
          >
            {isEditing ? "Update changes" : "Create goal"}
          </Button>
          {isEditing && (
            <Button
              onClick={setIsDeleting.bind(null, true)}
              variant="link"
              colorScheme="red"
              textDecoration="underline"
              textUnderlineOffset="4px"
            >
              Delete goal
            </Button>
          )}
        </VStack>
      </VStack>
      {isEditing && (
        <DeleteGoalModal
          isOpen={isDeleting}
          deletingGoal={goal}
          onClose={setIsDeleting.bind(null, false)}
          onDeleted={() => {
            router.push(`/console/communities/${communityId}/goals/`);
          }}
        />
      )}
    </CenterLayout>
  );
}
