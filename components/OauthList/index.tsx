import { Alert, AlertDescription, HStack, VStack } from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useMutation } from "react-query";

export default function OauthList() {
  const searchParams = useSearchParams();
  const oauthProvider = searchParams.get("state");
  const verify = useMutation({
    mutationFn: async (options: { oauthProvider: string; body: any }) => {
      const response = await fetch(`/auth/${options.oauthProvider}/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options.body || {}),
      });
      return response.json();
    },
  });
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (oauthProvider) {
      // remove the oauth states from the search params
      router.replace(pathname);
      verify.mutate({
        oauthProvider,
        body: {
          code: searchParams.get("code"),
          session: searchParams.get("session"),
        },
      });
    }
  }, [oauthProvider]);

  return (
    <VStack css={{ "& > pre": { whiteSpace: "break-spaces" } }}>
      {verify.isError && (verify.error as Error)?.message && (
        <Alert
          status="error"
          borderColor="red.200"
          borderRadius="lg"
          w="full"
          padding={{
            base: 4,
          }}
        >
          <AlertDescription fontSize="sm">
            {(verify.error as Error).message}
          </AlertDescription>
        </Alert>
      )}
      <HStack></HStack>
      {verify.isSuccess && verify.data && (
        <pre className="">{JSON.stringify(verify.data, null, 2)}</pre>
      )}
    </VStack>
  );
}
