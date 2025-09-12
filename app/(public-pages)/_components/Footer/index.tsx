"use client";

import { HStack, Text, chakra } from "@chakra-ui/react";
import { Container } from "app/(public-pages)/_components/Container";
import CallIcon from "assets/icons/call.svg?react";
import LocationIcon from "assets/icons/location.svg?react";
import EnvelopeIcon from "assets/icons/sms.svg?react";
import { platformInfo } from "platform";

const Location = chakra(LocationIcon);
const Call = chakra(CallIcon);
const Envelope = chakra(EnvelopeIcon);

export const Footer = () => {
  return (
    <HStack w="full" bg="brand.black.1" py="6" position="relative" zIndex={1}>
      <Container color="brand.gray.4">
        <HStack w="full" justify="space-between">
          <Text
            textStyle={{ base: "medium16", md: "regular14" }}
            color="brand.gray.4"
          >
            {/* © {new Date().getFullYear()} CrowdBucks All rights&rsquo; Reserved */}
            ⚡️ Powered By{" "}
            <Text
              as="a"
              textDecor="underline"
              textUnderlineOffset="4px"
              href="https://crowdbucks.org"
            >
              CrowdBucks
            </Text>
          </Text>
          <HStack gap="4">
            {/* <Location
              w={{
                base: "16px",
                md: "24px",
              }}
            /> */}
            {/* <Call
              w={{
                base: "16px",
                md: "24px",
              }}
            /> */}
            <a href={`mailto:${platformInfo.contact.email}`}>
              <Envelope
                w={{
                  base: "16px",
                  md: "24px",
                }}
              />
            </a>
          </HStack>
        </HStack>
      </Container>
    </HStack>
  );
};
