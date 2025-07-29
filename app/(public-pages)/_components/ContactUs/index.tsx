"use client";

import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Container } from "app/(public-pages)/_components/Container";
import { Vector1, Vector2 } from "app/(public-pages)/_components/Shapes";
import EnvelopeIcon from "assets/icons/sms.svg?react";
import MoneyBinImage from "assets/images/woman has a successful contract.svg";
import { AutoResizeTextarea } from "components/AutoResizeTextArea";
import { toast } from "components/Toast";
import { api } from "lib/api";
import { scrollAnimate } from "lib/framerMotion";
import Image from "next/image";
import { platformInfo } from "platform";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ChakraNextImage = chakra(Image);

const schema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  comment: z.string().min(10),
});
export const ContactUs: FC<{ showShapes?: boolean }> = ({
  showShapes = false,
}) => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      comment: "",
    },
    resolver: zodResolver(schema),
  });
  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: api.addFeedbackByUser.bind(api),
    onSuccess() {
      toast({
        status: "success",
        title: "We've received your message",
        description: "Thank you for getting in touch!",
      });
      form.reset();
    },
  });

  return (
    <Container pt="30px" pb="60px">
      <VStack position="relative">
        <VStack
          position="relative"
          zIndex="1"
          align="start"
          w="full"
          bg={{
            md: "white",
          }}
          rounded="20px"
          p={{
            md: "60px",
          }}
          border={{
            md: "1px solid",
          }}
          borderColor="#97D0C9 !important"
        >
          <Flex
            flexDirection={{
              base: "column",
              md: "row",
            }}
            justify="space-between"
            w="full"
            align="start"
            {...scrollAnimate("fadeInBottom", "resetDelayed1")}
            gap="8"
          >
            <VStack
              align="start"
              gap="60px"
              bg={{
                base: "white",
                md: "unset",
              }}
              rounded="20px"
              p={{
                base: "6",
                md: "unset",
              }}
              border={{
                base: "1px solid",
                md: "unset",
              }}
              borderColor="primary-glass.500"
              w="full"
              maxW={{ md: "500px", base: "full" }}
            >
              <Box
                {...scrollAnimate("fadeInBottom", "reset")}
                w={{
                  base: "full",
                  md: "auto",
                }}
              >
                <Text
                  textStyle={{
                    base: "bold30",
                    md: "bold38",
                  }}
                  textAlign="center"
                >
                  Let&rsquo;s get in touch!
                </Text>
              </Box>
              <VStack
                as="form"
                gap="2"
                w="full"
                onSubmit={form.handleSubmit((values) => mutate(values))}
              >
                <FormControl isInvalid={!!form.formState.errors.name}>
                  <FormLabel>Full name</FormLabel>
                  <Input {...form.register("name")} />
                  <FormErrorMessage>
                    {form.formState.errors.name?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!form.formState.errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input {...form.register("email")} />
                  <FormErrorMessage>
                    {form.formState.errors.email?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!form.formState.errors.comment}>
                  <FormLabel>Message</FormLabel>
                  <AutoResizeTextarea {...form.register("comment")} />
                  <FormErrorMessage>
                    {form.formState.errors.comment?.message}
                  </FormErrorMessage>
                </FormControl>
                <Button
                  type="submit"
                  mt="3"
                  border="1px solid"
                  borderColor="primary.500"
                  size="lg"
                  w="full"
                  colorScheme="primary-glass"
                  color="primary.500"
                  isLoading={isLoading}
                  loadingText="Submitting..."
                >
                  Submit
                </Button>
              </VStack>
            </VStack>
            <VStack
              alignSelf="stretch"
              align="start"
              pt={{
                md: "150px",
              }}
              pr={{
                md: "8",
              }}
              p="6"
              justify={{
                md: "space-between",
              }}
              alignItems={{
                base: "center",
                md: "center",
              }}
              border={{
                base: "1px solid",
                md: "unset",
              }}
              rounded="24px"
              borderColor="primary-glass.500"
            >
              {/* <VStack align="start" gap="5">
                {data.map((row, i) => {
                  return (
                    <HStack key={i} gap="2.5">
                      {row.icon}
                      <Divider
                        orientation="vertical"
                        borderColor="primary.500"
                        w="1px"
                        h="20px"
                      />
                      <Text color="brand.black.1" textStyle="regular16">
                        {row.data}
                      </Text>
                    </HStack>
                  );
                })}
              </VStack> */}
              <ChakraNextImage
                src={MoneyBinImage}
                alt="contact us image"
                maxHeight="350px"
                objectFit="contain"
              />
              <HStack gap="2.5">
                <EnvelopeIcon />,
                <Divider
                  orientation="vertical"
                  borderColor="primary.500"
                  w="1px"
                  h="20px"
                />
                <Text
                  color="brand.black.1"
                  textStyle="regular16"
                  as="a"
                  href={`mailto:${platformInfo.contact.email}`}
                >
                  {platformInfo.contact.email}
                </Text>
              </HStack>
              {/* <Text
                pt={{
                  base: "66px",
                  md: "0",
                }}
                textStyle="regular14"
                textAlign="center"
              >
                © {new Date().getFullYear()} CrowdBucks All rights&rsquo;
                Reserved
              </Text> */}
            </VStack>
          </Flex>
          <Vector1
            position="absolute"
            right="-60px"
            bottom="0px"
            zIndex={-1}
            display={{
              base: "block",
              md: "none",
            }}
          />
        </VStack>

        {showShapes && (
          <>
            <Vector1
              display={{ base: "none", md: "block" }}
              position="absolute"
              top="160px"
              left="-60px"
              zIndex="-1"
            />
            <Vector2
              display={{ base: "none", md: "block" }}
              position="absolute"
              top="-130px"
              right="-70px"
              zIndex="-1"
            />
          </>
        )}
      </VStack>
    </Container>
  );
};
