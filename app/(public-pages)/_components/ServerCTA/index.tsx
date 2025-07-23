"use client";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "app/(public-pages)/_components/Container";
import { Vector1, Vector2 } from "app/(public-pages)/_components/Shapes";
import ThunderIcon from "assets/icons/Thunder.svg?react";
import SendIcon from "assets/icons/send.svg?react";
import { toast } from "components/Toast";
import { ApiError, api } from "lib/api";
import { scrollAnimate } from "lib/framerMotion";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export const ServerCTA: FC<{ shapesStyle?: "default" | "custom" }> = ({
  shapesStyle = "default",
}) => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });
  const { mutate, isLoading } = useMutation(
    api.addFundraiserRequestByUser.bind(api),
    {
      onSuccess() {
        form.reset();
        toast({
          status: "success",
          title: "We've received your request",
          description: "Stay tuned, we will contact you soon!",
        });
      },
      onError(error: ApiError) {
        console.log(error);
        toast({
          status: "error",
          title: error.message,
        });
      },
    }
  );

  return (
    <Container py={{ base: "50px", md: "100px" }} pt="50px">
      <VStack w="full" position="relative">
        <VStack
          position="relative"
          zIndex={2}
          rounded="20px"
          w="full"
          bg="primary-glass.500"
          p={{
            base: "6",
            md: "60px",
          }}
          gap="8"
        >
          <VStack w="full" gap={3} {...scrollAnimate("fadeInBottom", "reset")}>
            <Text
              textStyle={{
                base: "bold22",
                md: "bold38",
              }}
              textAlign="center"
            >
              For you, who runs a server all by themselves!
            </Text>
            <Text
              textStyle={{
                base: "regular18",
                md: "regular16",
              }}
              textAlign="center"
            >
              We’re here to help! Leave your email and we’ll reach out if you
              have any questions or need support.
            </Text>
          </VStack>
          <Box
            {...scrollAnimate("fadeInBottom", "resetDelayed1")}
            w={{ base: "full", md: "unset" }}
          >
            <HStack
              rounded={{ base: "12px", md: "22px" }}
              bg="white"
              as="form"
              p="1.5"
              pl={{ base: "4", md: "1.5" }}
              w={{ base: "full", md: "unset" }}
              onSubmit={form.handleSubmit((values) => mutate(values))}
            >
              <FormControl isInvalid={!!form.formState.errors.email}>
                <Input
                  _focus={{
                    outline: "0",
                  }}
                  border="0"
                  placeholder="Enter your email here"
                  _placeholder={{
                    color: "brand.black.1",
                  }}
                  textStyle={{
                    base: "regular16",
                  }}
                  px="1"
                  {...form.register("email")}
                />
              </FormControl>
              <Button
                minH={{
                  base: "unset",
                  md: "59px",
                }}
                type="submit"
                colorScheme="primary"
                size="lg"
                px={{
                  base: "10 !important",
                  md: "20 !important",
                }}
                leftIcon={<ThunderIcon />}
                isLoading={isLoading}
                loadingText="Submitting..."
                display={{ md: "flex", base: "none" }}
              >
                Get started
              </Button>
              <IconButton
                isLoading={isLoading}
                type="submit"
                display={{ base: "flex", md: "none" }}
                aria-label="send"
                variant="solid"
                colorScheme="primary"
                rounded="10px"
              >
                <SendIcon />
              </IconButton>
            </HStack>
            <FormControl isInvalid={!!form.formState.errors.email}>
              <FormErrorMessage>
                {form.formState.errors.email?.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
        </VStack>
        {shapesStyle === "default" && (
          <>
            <Box
              {...scrollAnimate("fadeInRight", "resetDelayed2")}
              position="absolute"
              top="-60px"
              right="-20%"
              display={{
                base: "none",
                md: "block",
              }}
            >
              <Vector2 width="800px" />
            </Box>
            <Vector1
              transform="rotate(-250deg)"
              position="absolute"
              left="-160px"
              display={{
                base: "block",
                md: "none",
              }}
            />
          </>
        )}
        {shapesStyle === "custom" && (
          <>
            <Vector1
              position="absolute"
              left={{
                md: "-160px",
                base: "-100px",
              }}
              width={{
                base: "350px",
                md: "450px",
              }}
              top={{
                base: "-300px",
                md: "-140px",
              }}
              zIndex={-1}
            />
          </>
        )}
      </VStack>
    </Container>
  );
};
