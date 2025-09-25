import { GetProfileResult } from "@xeronith/granola/core/spi";
import { useAuth } from "states/console/user";

export const useUserAuthProvider = () => {
  const { user } = useAuth();
  const authProviders: Record<
    string,
    { title: string; field: keyof Pick<GetProfileResult, 'email' | 'mastodonUsername'> }
  > = {
    CROWDBUCKS: {
      title: "Email",
      field: "email",
    },
    BSKY: {
      title: "Bsky",
      field: "mastodonUsername",
    },
  };
  const userAuthProvider = (user?.authProvider ||
    "BSKY") as keyof typeof authProviders;
  return {
    provider: authProviders[userAuthProvider].title,
    value: user?.[authProviders[userAuthProvider].field] || "N/A",
  }
}
