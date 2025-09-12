"use client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Text,
  createStandaloneToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import ErrorIcon from "assets/icons/error.svg?react";
import CircleCheckIcon from "assets/icons/tick-circle.svg?react";
import SquareCheckIcon from "assets/icons/tick-square.svg?react";
import WarningIcon from "assets/icons/warning.svg?react";
import { ReactNode, useEffect, useState } from "react";
import theme from "theme/chakra.config";

let drawers: ReactNode[] = [];

const ToastDrawer = (props: {
  title: ReactNode;
  description: ReactNode;
  status: string;
  onClose: () => void;
  duration?: null | number;
}) => {
  // chakra had an issue with the render function
  // The render functions runs twice in chakra, idk why, maybe a bug
  // So I implemented this strategy as a temporary fix to avoid having multiple drawers with same title
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    if (!drawers.includes(props.title)) {
      drawers.push(props.title);
      setOpen(true);
      if (props.duration !== null) {
        const timeout = setTimeout(() => {
          setOpen(false);
        }, (props.duration || 5000) - 1500);
        return () => {
          drawers = drawers.filter((drawer) => drawer !== props.title);
          clearInterval(timeout);
        };
      }
      return () =>
        (drawers = drawers.filter((drawer) => drawer !== props.title));
    }
  }, []);

  return (
    <Drawer
      isOpen={isOpen}
      onCloseComplete={props.onClose}
      onClose={setOpen.bind(null, false)}
      closeOnOverlayClick
      placement="bottom"
    >
      <DrawerOverlay zIndex={9999} />
      <DrawerContent containerProps={{ zIndex: 99999 }}>
        <DrawerBody
          py="6"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={3}
        >
          <Text
            color={props.status === "success" ? "primary.500" : "brand.red.500"}
          >
            {props.status === "success" && (
              <SquareCheckIcon width="40px" height="40px" />
            )}
            {props.status === "error" && (
              <WarningIcon width="40px" height="40px" />
            )}
          </Text>
          <Text fontSize="16px" fontWeight="bold" textAlign="center">
            {props.title}
          </Text>
          {props.description && (
            <Text fontSize="16px">{props.description}</Text>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
const { ToastContainer, toast } = createStandaloneToast({
  theme,
  defaultOptions: {
    containerStyle: { maxW: "none" },
    render: function Render(props) {
      const isDesktop = useBreakpointValue({ md: true, base: false });
      return isDesktop ? (
        <Alert
          status={props.status}
          variant="brand"
          maxW="none"
          className="animate-slide-top"
        >
          <AlertIcon>
            {props.status === "success" && <CircleCheckIcon />}
            {props.status === "error" && <ErrorIcon />}
          </AlertIcon>
          <AlertTitle>{props.title}</AlertTitle>
          <AlertDescription>{props.description}</AlertDescription>
        </Alert>
      ) : (
        <ToastDrawer
          title={props.title!}
          status={props.status!}
          duration={props.duration}
          description={props.description}
          onClose={props.onClose}
        />
      );
    },
  },
});

export { ToastContainer, toast };
