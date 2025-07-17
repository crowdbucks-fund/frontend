"use client";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import emptyWallet1 from "assets/images/empty-wallet-1.png";
import emptyWallet2 from "assets/images/empty-wallet-2.png";
import Image from "next/image";
import Link from "next/link";

export default function notFoundPage() {
  return (
    <VStack
      id="not-found"
      h="100%	"
      display="flex"
      justifyContent={{
        base: "center",
        md: "start",
      }}
      flexDirection="column"
      gap={8}
      py={8}
      bg="brand.gray.3"
      px={4}
    >
      <Box
        __css={{
          "& > img": { maxW: { base: "140px", md: "full" } },
        }}
      >
        <Image
          as={Image}
          priority
          src="/logo.svg"
          alt="CrowdBucks Logo"
          width={188}
          height={42}
        />
      </Box>
      <VStack
        bg="brand.gray.4"
        maxW={{
          base: "310px",
          md: "630px",
        }}
        w="full"
        rounded="24px"
        p={{
          base: 5,
          md: 8,
        }}
        position="relative"
      >
        <VStack
          w="full"
          gap={{
            base: 10,
            md: 14,
          }}
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            __css={{
              "& > img": {
                maxW: {
                  base: "140px",
                  md: "full",
                },
              },
            }}
          >
            <Image src={emptyWallet2} alt="" priority />
          </Box>
          <Box
            position="absolute"
            top="0"
            right="0"
            __css={{
              "& > img": {
                maxW: {
                  base: "100px",
                  md: "full",
                },
              },
            }}
          >
            <Image src={emptyWallet1} alt="" priority />
          </Box>
          <VStack
            gap="4"
            minH={{ base: "270px", md: "450px" }}
            justify="end"
            alignItems="start"
            w="full"
          >
            <Text
              fontWeight="bold"
              fontSize={{
                base: "30px",
                md: "58px",
              }}
            >
              404
            </Text>
            <Text
              fontSize={{
                base: "16px",
                md: "20px",
              }}
            >
              There’s Nothing Here
            </Text>
            <Button
              w="full"
              variant="solid"
              colorScheme="black"
              size="lg"
              as={Link}
              href="/"
            >
              Go Back To Main Page
            </Button>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
}
