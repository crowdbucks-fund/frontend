import { Button, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";

const content = [
  {
    title: "Acceptance of Terms",
    content:
      "By using CrowdBucks, you agree to these Terms of Service. If you don’t agree, please don’t use the platform.",
  },
  {
    title: "What We Do",
    content: ` CrowdBucks is a free and open-source platform for raising and donating funds. The hosted version at crowdbucks.fund is operated by CrowdBucks, Inc.`,
  },
  {
    title: "Payments & Fees",
    content:
      " All payments are processed by Stripe.  Fundraisers must connect a Stripe account.  CrowdBucks charges a X% platform fee, plus Stripe’s own fees.",
  },
  {
    title: "Refunds",
    content:
      " Refunds are handled by the fundraiser via Stripe. CrowdBucks does not issue refunds directly.",
  },
  {
    title: "Data & Privacy",
    content:
      " We collect only essential info (e.g. email) to process donations. We do not sell your data. See our Privacy Policy for details.",
  },
  {
    title: "Acceptable Use",
    content:
      "Don’t use CrowdBucks for illegal or abusive purposes. We may suspend accounts that violate these terms or Stripe's rules.",
  },
  {
    title: "Open Source Notice",
    content:
      " CrowdBucks code is open-source under [Your License, e.g. AGPLv3]. You’re free to self-host or contribute, but using the hosted service is subject to these terms.",
  },
  {
    title: "Contact",
    content: (
      <>
        Questions? Email us at{" "}
        <Button variant="link" as="a" href="mailto:support@crowdbucks.fund">
          support@crowdbucks.fund
        </Button>
      </>
    ),
  },
];

export const TOS: FC<{ onAccept: () => void }> = ({ onAccept }) => {
  return (
    <VStack
      gap={4}
      maxH="70vh"
      overflowY="auto"
      alignItems="start"
      maxW="lg"
      px="1"
    >
      <Text fontSize="xl" fontWeight="bold" textAlign="center" w="full" pt="4">
        CrowdBucks Terms Of Services!
      </Text>
      <VStack gap="4">
        {content.map((c, i) => {
          return (
            <VStack key={c.title} align="start" w="full">
              <Text fontWeight="bold">
                {i + 1}. {c.title}
              </Text>
              <Text>{c.content}</Text>
            </VStack>
          );
        })}
      </VStack>
      <Button variant="glass" onClick={onAccept} w="full" size="lg">
        Accept
      </Button>
    </VStack>
  );
};
