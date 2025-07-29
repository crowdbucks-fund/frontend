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
    <QueryClientProvider client={queryClient}>
      <CacheProvider>
        <JotaiProvider store={store}>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </JotaiProvider>
      </CacheProvider>
      <ToastContainer />
    </QueryClientProvider>
  );
}
