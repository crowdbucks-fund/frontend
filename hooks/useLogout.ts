'use client'
import { logout } from "hooks/useLogout.server";
import { api } from "lib/api";
import { queryClient } from "lib/reactQuery";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useMutation } from "react-query";

export const useLogout = (router: AppRouterInstance) =>
  useMutation({
    mutationFn: async () => {
      return Promise.allSettled([logout(), api.logout({})]).finally(() => {
        queryClient.clear()
        router.push("/auth/logout");
      })
    }
  });
