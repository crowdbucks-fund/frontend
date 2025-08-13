"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "components/Toast";
import { Provider as JotaiProvider } from "jotai";
import { store } from "lib/jotai";
import { queryClient } from "lib/reactQuery";
import "lib/zod";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import theme from "theme/chakra.config";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      defaults: "2025-05-24",
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  useEffect(() => {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--app-height", `${window.innerHeight}px`);
    };
    window.addEventListener("resize", appHeight);
    appHeight();
    return () => window.removeEventListener("resize", appHeight);
  }, [path]);
  return (
    <PostHogProvider>
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <JotaiProvider store={store}>
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
          </JotaiProvider>
        </CacheProvider>
        <ToastContainer />
      </QueryClientProvider>
    </PostHogProvider>
  );
}
