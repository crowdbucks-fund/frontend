import { api } from "lib/api";
import { queryClient } from "lib/reactQuery";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useMutation } from "react-query";

export const logout = (router: AppRouterInstance) => { };

export const useLogout = (router: AppRouterInstance) =>
  useMutation(() => {
    return api.logout({}).finally(() => {
      queryClient.clear()
      router.push("/auth/logout");
    });
  });
