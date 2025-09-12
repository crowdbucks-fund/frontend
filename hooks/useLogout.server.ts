"use server";

import { AUTH_TOKEN_KEY } from "lib/auth";
import { cookies } from "next/headers";

export const logout = async () => {
  "use server";
  (await cookies()).delete(AUTH_TOKEN_KEY);
};
