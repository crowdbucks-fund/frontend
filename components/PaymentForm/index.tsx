import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  CircularProgress,
  Collapse,
  HStack,
  VStack,
} from "@chakra-ui/react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FC, FormEvent, useMemo, useState } from "react";

export type PaymentFormProps = {
  clientSecret: string;
  publishableKey: string;
  returnUrl: string;
};

export const PaymentForm: FC<PaymentFormProps> = ({
  clientSecret,
  publishableKey,
  returnUrl,
}) => {
  const stripePromise = useMemo(
    () => loadStripe(publishableKey),
    [publishableKey]
  );
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormElements returnUrl={returnUrl} />
    </Elements>
  );
};

const PaymentFormElements: FC<{ returnUrl: PaymentFormProps["returnUrl"] }> = ({
  returnUrl: return_url,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setError(null);
    setPostLoading(true);
    const result = await stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url,
        },
      })
      .finally(setPostLoading.bind(null, false));

    if (result.error) {
      setError(result.error.message || null);
    } else {
      console.log("everything is fine");
    }
  };
  return (
    <VStack
      as="form"
      w="full"
      gap="6"
      __css={{
        "& > div": {
          width: "full",
        },
      }}
      onSubmit={handleSubmit}
    >
      {loading && (
        <HStack justify="center">
          <CircularProgress isIndeterminate color="secondary.500" size="40px" />
        </HStack>
      )}
      <PaymentElement onReady={setLoading.bind(null, false)} />
      <VStack
        gap={0}
        w="full"
        __css={{ "&>.chakra-collapse": { width: "full" } }}
      >
        <Collapse in={!!error}>
          <Alert
            status="error"
            border="0"
            p={{ base: 2, md: 4 }}
            mb={4}
            w="full"
          >
            <AlertIcon />
            <AlertDescription
              fontSize={{
                base: "14px",
                md: "16px",
              }}
            >
              {error}
            </AlertDescription>
          </Alert>
        </Collapse>
        {!loading && (
          <Button
            type="submit"
            size="lg"
            colorScheme="primary"
            w="full"
            isLoading={postLoading}
            loadingText="Verifying..."
          >
            Submit
          </Button>
        )}
      </VStack>
    </VStack>
  );
};
