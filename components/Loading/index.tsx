"use client";
import { CircularProgress, HStack, StackProps } from "@chakra-ui/react";

export const FullPageLoading = (props: StackProps = {}) => {
  return (
    <HStack
      w="full"
      align="center"
      justify="center"
      h="full"
      minH="300px"
      flexGrow={1}
      {...props}
    >
      <CircularProgress color="secondary.500" isIndeterminate size="40px" />
    </HStack>
  );
};
