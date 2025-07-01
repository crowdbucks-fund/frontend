"use client";

import {
  Box,
  Button,
  Image as ChakraImage,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Container } from "app/(public-pages)/_components/Container";
import { Navbar } from "app/(public-pages)/_components/Navbar";
import {
  Ellipsis,
  Vector1,
  Vector3,
} from "app/(public-pages)/_components/Shapes";
import EmojiIcon from "assets/icons/emoji-normal.svg?react";
import Coin from "assets/images/coin.png";
import MockupImage from "assets/images/mockup-left.png";
import { scrollAnimate } from "lib/framerMotion";
import Image from "next/image";
import Link from "next/link";

export const Header2 = () => {
  return (
    <>
      <Navbar />
      <Container position="relative">
        <Flex
          justify="space-between"
          w="full"
          py="8"
          flexDirection={{
            base: "column-reverse",
            md: "row",
          }}
          gap={{ base: "50px", md: 0 }}
        >
          <Box
            px={{ base: "4", md: 0 }}
            mr={{ md: "20" }}
            display="flex"
            justifyContent="center"
            {...scrollAnimate("fadeInRight", "reset")}
            maxH="575px"
          >
            <Image
              alt="CrowdBucks"
              src={MockupImage}
              priority
              style={{ objectFit: "contain" }}
            />
          </Box>
          <VStack maxW={{ md: "650px" }} gap="10" w="full">
            <VStack gap="5" {...scrollAnimate("fadeInBottom", "reset")}>
              <Text
                as="h2"
                textStyle={{
                  base: "bold30",
                  md: "bold72",
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
            </HStack>
          </VStack>
          <Box
            {...scrollAnimate("fadeInLeft", "resetDelayed1")}
            position="absolute"
            left="6%"
            top={{
              base: "50%",
              md: "40%",
            }}
          >
            <ChakraImage
              src={Coin.src}
              alt="Coin"
              width={{ base: "24px", md: "36px" }}
            />
          </Box>
          <Box
            {...scrollAnimate("fadeInLeft", "resetDelayed2")}
            position="absolute"
            left={{
              base: "auto",
              md: "37%",
            }}
            right={{
              base: "10%",
              md: "auto",
            }}
            top={{
              base: "68%",
              md: "58%",
            }}
          >
            <ChakraImage
              src={Coin.src}
              alt="Coin"
              width={{ base: "20px", md: "24px" }}
            />
          </Box>
          <Ellipsis
            position="absolute"
            top={{
              base: "0px",
            }}
            left={{
              base: "unset",
              md: "-500px",
            }}
            right={{
              base: "-500px",
              md: "unset",
            }}
            zIndex={-1}
          />
          <Vector1
            position="absolute"
            right="0"
            transform="rotate(0deg) scale(-1, 1)"
            zIndex="-1"
            display={{
              base: "none",
              md: "block",
            }}
          />
          <Box
            {...scrollAnimate("fadeInRight", "resetDelayed1")}
            position="absolute"
            right="35%"
            top={{
              base: "15%",
              md: "36%",
            }}
            zIndex="-1"
            display={{
              base: "block",
              md: "none",
            }}
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
            zIndex="-3"
            display={{
              base: "block",
              md: "none",
            }}
          >
            <Vector3 />
          </Box>
        </Flex>
      </Container>
    </>
  );
};
