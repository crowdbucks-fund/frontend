import posthog from "posthog-js";
import { useEffect } from "react";

export const useCaptureException = (error: Error) => {
  useEffect(() => {
    posthog.captureException(error);
  }, []);
}
