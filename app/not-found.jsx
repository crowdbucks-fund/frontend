"use client";
import { Button, Text, VStack } from "@chakra-ui/react";
import img from "assets/images/not-found.png";
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
      <Image
        priority
        src="/logo.svg"
        alt="CrowdBucks Logo"
        width={188}
        height={42}
      />
      <VStack bg="brand.gray.4" maxW="630px" w="full" rounded="24px" p={8}>
        <VStack
          maxW="400px"
          gap={{
            base: 10,
            md: 14,
          }}
        >
          <Image src={img} alt="" priority />
          <VStack gap="4">
            <Text
              fontWeight="bold"
              fontSize={{
                base: "16px",
                md: "30px",
              }}
            >
              Page Not Found!
            </Text>
            <Link href="/">
              <Button
                variant="solid"
                colorScheme="primary"
                size={{
                  lg: "lg",
                  base: "sm",
                }}
              >
                Back to Home
              </Button>
            </Link>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
}
