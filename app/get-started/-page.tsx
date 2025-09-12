"use client";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Carousel } from "./components/Carousel";

import EmojiHappy from "assets/icons/emoji-happy.svg?react";
import Image3 from "assets/images/astro-fun.svg?react";
import Image1 from "assets/images/astro.svg?react";
import Image2 from "assets/images/growth.svg?react";

import { Link } from "components/Link";

export default function SignUp() {
  return (
    <HStack justify="center" px="4" minH="var(--app-height)">
      <VStack
        maxW="100%"
        w="380px"
        justify={{
          md: "center",
          base: "space-between",
        }}
        minH={{
          md: "auto",
          base: "var(--app-height)",
        }}
        py="4"
        gap="5"
      >
        <Carousel
          wrapperProps={{
            display: "flex",
            alignItems: "center",
            flexGrow: {
              base: "1",
              md: "unset",
            },
          }}
        >
          <Box>
            <VStack
              justify="end"
              aspectRatio={{ base: "unset", md: "346 / 405" }}
            >
              <Image1 />
            </VStack>
            <Text
              pt="12"
              fontWeight="bold"
              fontSize={{
                md: "26px",
                base: "18px",
              }}
            >
              Plant a seed
            </Text>
          </Box>
          <Box>
            <VStack
              justify="end"
              aspectRatio={{ base: "unset", md: "346 / 405" }}
            >
              <Image2 />
            </VStack>
            <Text
              pt="12"
              fontWeight="bold"
              fontSize={{
                md: "26px",
                base: "18px",
              }}
            >
              Watch it grow
            </Text>
          </Box>
          <Box>
            <VStack
              justify="end"
              aspectRatio={{ base: "unset", md: "346 / 405" }}
            >
              <Image3 />
            </VStack>
            <Text
              pt="12"
              fontWeight="bold"
              fontSize={{
                md: "26px",
                base: "18px",
              }}
            >
              And have fun!
            </Text>
          </Box>
        </Carousel>
        <Link href="/auth" passHref display="block" w="full">
          <Button
            size="lg"
            colorScheme="primary"
            w="full"
            leftIcon={<EmojiHappy width="25px" />}
          >
            Let&apos;s get started
          </Button>
        </Link>
      </VStack>
    </HStack>
  );
}
