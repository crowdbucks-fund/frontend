"use client";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  IconButton,
  IconButtonProps,
  Text,
  chakra,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { default as NextLink } from "next/link";
import { FC, ReactNode, useEffect, useState } from "react";

const AccordionIcon = chakra(ChevronDownIcon, {
  baseStyle: {
    width: {
      base: "18px",
      md: "28px",
    },
    height: {
      base: "18px",
      md: "28px",
    },
  },
});
const UnstyledButton = chakra("button");

export const OnboardingStep: FC<{
  isCompleted: boolean;
  isOpen: boolean;
  heading: string;
  description: string;
  inCompleteHref?: string;
  completedHref?: string;
  completeButtonText?: string;
  inCompleteButtonText: string;
  inCompleteIcon: ReactNode;
  headingIcon: ReactNode;
  inCompleteButtonProps?: Omit<IconButtonProps, "aria-label">;
  handleOpenAccordion: () => void;
}> = ({
  // isOpen,
  completeButtonText,
  completedHref,
  description,
  heading,
  inCompleteButtonText,
  inCompleteHref,
  isCompleted,
  handleOpenAccordion,
  inCompleteIcon,
  headingIcon,
  inCompleteButtonProps = {},
}) => {
  const [isOpen, setIsOpen] = useState(!isCompleted);
  useEffect(() => {
    setIsOpen(!isCompleted);
  }, [isCompleted]);

  const toggleOpen = setIsOpen.bind(null, !isOpen);
  return (
    <Box w="full">
      <Card w="full">
        <CardHeader
          display="flex"
          justifyContent="space-between"
          as={UnstyledButton}
          onClick={(e) => {
            handleOpenAccordion();
            toggleOpen();
          }}
        >
          <HStack gap={{ base: 2, md: 6 }} display="flex" flexDirection="row">
            {headingIcon}
            <Text
              fontSize={{
                base: "14px",
                md: "20px",
              }}
              textDecoration={clsx({ "line-through": isCompleted })}
            >
              {heading}
            </Text>
          </HStack>

          {/* {isCompleted && <CheckedIcon opacity="0.7" color="primary.500" />} */}
        </CardHeader>
        <IconButton
          display={"flex"}
          w="fit-content"
          p="2"
          size="sm"
          aria-label="open accordion"
          color="primary.500"
          variant="ghost"
          onClick={toggleOpen}
          position="absolute"
          top={{
            base: 4,
            md: 8,
          }}
          right={{
            base: 4,
            md: 8,
          }}
        >
          <AccordionIcon
            transition=".2s all ease-out"
            transform={isOpen ? "rotate(180deg)" : ""}
          />
        </IconButton>

        <HStack
          pl={0}
          maxHeight={isOpen ? "200px" : "0"}
          overflow="hidden"
          transition="max-height 0.2s ease-out"
        >
          <CardBody
            display="flex"
            flexDirection={"column"}
            gap={6}
            opacity={isOpen ? 1 : 0}
            transition="opacity 0.2s ease-out"
          >
            <HStack gap={{ base: 6, md: 12 }}>
              <Text
                color="brand.black.3"
                fontSize={{
                  base: "14px",
                  md: "18px",
                }}
              >
                {description}
              </Text>
              {/* {!isCompleted && (
                <IconButton
                  aria-label={inCompleteButtonText}
                  as={!!inCompleteHref ? NextLink : undefined}
                  href={!!inCompleteHref ? inCompleteHref : undefined}
                  color="primary.500"
                  variant="ghost"
                  _hover={{ bg: "transparent" }}
                  {...inCompleteButtonProps}
                  display={{ base: "none", md: "flex" }}
                >
                  {inCompleteIcon}
                </IconButton>
              )} */}
            </HStack>

            {completeButtonText && (
              <Button
                display={isCompleted ? "flex" : "none"}
                size="lg"
                variant="outline-gray"
                as={NextLink}
                href={completedHref}
              >
                {completeButtonText}
              </Button>
            )}

            {!isCompleted && (
              <Button
                size="lg"
                variant="solid"
                colorScheme="primary"
                as={inCompleteHref ? NextLink : undefined}
                href={inCompleteHref ? inCompleteHref : undefined}
                {...inCompleteButtonProps}
                display={{
                  base: "flex",
                  // md: "none",
                }}
              >
                {inCompleteButtonText}
              </Button>
            )}
          </CardBody>
        </HStack>
      </Card>
    </Box>
  );
};
