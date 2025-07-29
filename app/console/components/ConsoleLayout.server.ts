import { api } from "lib/api";
import { AUTH_TOKEN_KEY } from "lib/auth";
import { cookies } from "next/headers";
import { cache } from "react";


export const getAuthTokenFromCookie = async () => {
  "use server";
  const token = (await cookies()).get(AUTH_TOKEN_KEY)?.value;
  return token;
};


const getUserProfile = async (token?: string) => {
  if (!token)
    return null;
  return api
    .getProfile({}, { token })
    .catch(() => null)
};

export const fetchProfile = cache(async () => {
  const currentAuthToken = await getAuthTokenFromCookie();
  const userProfile = await getUserProfile(currentAuthToken)

  return { profile: userProfile, token: currentAuthToken };
})


export type AuthUser = Awaited<ReturnType<typeof fetchProfile>>;
