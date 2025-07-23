"use client";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { Container } from "app/(public-pages)/_components/Container";
import { Navbar } from "app/(public-pages)/_components/Navbar";
import {
  Ellipsis,
  Vector1,
  Vector3,
} from "app/(public-pages)/_components/Shapes";
import EmojiIcon from "assets/icons/emoji-normal.svg?react";
import MockupImage from "assets/images/mobile-mockup.png";
import { scrollAnimate } from "lib/framerMotion";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <>
      <Navbar />
      <Container position="relative">
        <Flex
          justify="space-between"
          w="full"
          py={{ base: 8, md: 0 }}
          flexDirection={{
            base: "column",
            md: "row",
          }}
          gap={{ base: "50px", lg: 0 }}
        >
          <VStack maxW={{ lg: "650px" }} gap="10" w="full" justify="center">
            <VStack
              gap="5"
              {...scrollAnimate("fadeInBottom", "reset")}
              alignItems={{ base: "center", md: "start" }}
            >
              <Text
                as="h2"
                textStyle={{
                  base: "bold30",
                  lg: "bold72",
                }}
                lineHeight="normal"
                textAlign={{ base: "center", md: "left" }}
              >
                Help fund the Fediverse.
              </Text>
              <Text
                textStyle={{
                  base: "regular16",
                  md: "regular20",
                }}
                textAlign={{ base: "center", md: "left" }}
              >
                CrowdBucks is a Fediverse-native crowd-funding, tipping,
                payments, and membership platform.
              </Text>
            </VStack>
            <HStack
              justify={{
                md: "start",
                base: "center",
              }}
              w="full"
              gap="4"
              {...scrollAnimate("fadeInBottom", "resetDelayed1")}
            >
              <Button
                as={Link}
                href="/auth"
                size="lg"
                variant="solid"
                colorScheme="primary"
                leftIcon={<EmojiIcon />}
                w={{ md: "240px" }}
                px="6"
              >
                Get started
              </Button>
              <Button
                display={{
                  md: "flex",
                  base: "none",
                }}
                size="lg"
                variant="solid"
                colorScheme="primary-glass"
                color="primary.500"
                border="1px solid"
                borderColor="primary.500"
                w="240px"
                as="a"
                href="#steps"
              >
                How does it work?
              </Button>
            </HStack>
          </VStack>
          <Box
            px={{ base: "4", md: 0 }}
            mr={{ md: "20" }}
            display="flex"
            justifyContent="center"
            {...scrollAnimate("fadeInRight", "reset")}
            __css={{
              "&>img": {
                maxWidth: {
                  base: "500px",
                  lg: "full",
                },
                width: "100%",
              },
            }}
          >
            <Image
              alt="CrowdBucks"
              src={MockupImage}
              priority
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Box
            {...scrollAnimate("fadeInRight", "resetDelayed1")}
            position="absolute"
            right="35%"
            top={{
              base: "27%",
              md: "36%",
            }}
            zIndex="-1"
          >
            <Vector1 />
          </Box>
          <Box
            {...scrollAnimate("fadeInRight", "resetDelayed2")}
            position="absolute"
            right={{
              base: "-150px",
              md: "10%",
            }}
            top={{
              base: "60%",
              md: "50%",
            }}
            zIndex="-1"
          >
            <Vector3 />
          </Box>
          <Ellipsis
            position="absolute"
            top={{
              base: "0px",
              md: "-400px",
            }}
            right={{
              base: "-500px",
              md: "-50px",
            }}
            zIndex={-1}
          />
        </Flex>
      </Container>
    </>
  );
};
