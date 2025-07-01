import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const usePaymentVerification = (): [
  {
    hasPayment: boolean;
    isSuccess: boolean;
  },
  (props: { hasPayment: boolean; isSuccess: boolean }) => void
] => {
  const router = useRouter();
  const params = useSearchParams();
  const redirectStatus = params.get("redirect_status");
  const [paymentStatus, setPaymentStatus] = useState({
    hasPayment: false,
    isSuccess: false,
  });
  useEffect(() => {
    let hasPayment = false;
    let isSuccess = false;
    if (redirectStatus && redirectStatus.length) {
      hasPayment = true;
      if (redirectStatus === "succeeded") isSuccess = true;
      router.replace(window.location.href.replace(window.location.search, ""));
    }
    setPaymentStatus({
      hasPayment,
      isSuccess,
    });
  }, []);

  return [paymentStatus, setPaymentStatus];
};
