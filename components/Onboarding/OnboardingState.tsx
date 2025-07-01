"use client";
import { Card, CardBody, CardHeader, Progress, Text } from "@chakra-ui/react";
import CheckIcon from "assets/icons/tick-square.svg?react";
import clsx from "clsx";
import { FC } from "react";

export const OnboardingState: FC<{
  steps: number;
  passedSteps: number;
}> = ({ steps, passedSteps }) => {
  const allStepsDone = steps === passedSteps;
  return (
    <Card w="full">
      <CardHeader
        display="flex"
        alignItems="center"
        justifyContent={clsx({
          "space-between": !allStepsDone,
          center: allStepsDone,
        })}
        gap={{ base: 2 }}
      >
        {allStepsDone && (
          <CheckIcon width="24px" height="24px" strokeWidth="3px" />
        )}
        <Text
          display={clsx({ block: allStepsDone })}
          fontWeight={{
            base: "normal",
            md: "bold",
          }}
          fontSize={{
            base: "12px",
            md: "20px",
          }}
        >
          {allStepsDone
            ? "You’re all done, enjoy!"
            : "Finish setting up your page"}
        </Text>
        {!allStepsDone && (
          <Text
            as="span"
            size="18px"
            fontWeight="normal"
            color="brand.black.3"
            fontSize={{
              base: "12px",
              md: "18px",
            }}
          >
            {passedSteps}/{steps}
          </Text>
        )}
      </CardHeader>
      <CardBody>
        <Progress value={(passedSteps / steps) * 100} />
      </CardBody>
    </Card>
  );
};
