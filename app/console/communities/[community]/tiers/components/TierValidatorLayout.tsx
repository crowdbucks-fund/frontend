"use client";
import { GetTierByUserResult } from "@xeronith/granola/core/spi";
import { FullPageLoading } from "components/Loading";
import { api } from "lib/api";
import { useParams } from "next/navigation";
import { PropsWithChildren, createContext, useContext } from "react";
import { useQuery } from "react-query";
import { TierNotFound } from "./not-found";

const CurrentTierContext = createContext<GetTierByUserResult | null>(null);
export const useCurrentTier = () => useContext(CurrentTierContext)!;

export default function TierValidatorLayout({ children }: PropsWithChildren) {
  const tierId = useParams<{ tier: string }>().tier.toString();
  const {
    data: tier,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getTiersByUser", tierId],
    queryFn: () => {
      return api.getTierByUser({
        id: parseInt(tierId),
      });
    },
  });

  if (isLoading) return <FullPageLoading />;
  if (isError) return <TierNotFound />;
  if (tier)
    return (
      <CurrentTierContext.Provider value={tier}>
        {children}
      </CurrentTierContext.Provider>
    );
}
