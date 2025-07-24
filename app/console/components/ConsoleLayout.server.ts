import { GetProfileResult } from "@xeronith/granola/core/spi";
import { api } from "lib/api";
import { AUTH_TOKEN_KEY } from "lib/auth";
import { cookies } from "next/headers";


export const getAuthTokenFromCookie = async () => {
  "use server";
  const token = (await cookies()).get(AUTH_TOKEN_KEY)?.value;
  return token;
};

let _profilePromise: Promise<GetProfileResult | null> = null!;
const getUserProfile = async (token: string) => {
  if (_profilePromise) return await _profilePromise;
  _profilePromise = api
    .getProfile({}, { token })
    .catch(() => null)
    .finally(() => {
      _profilePromise = null!;
    });
  return await _profilePromise;
};

export const fetchProfile = async () => {
  const currentAuthToken = await getAuthTokenFromCookie();
  const userProfile = currentAuthToken
    ? await getUserProfile(currentAuthToken)
    : null;
  return userProfile;
}
