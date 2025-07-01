import HomePageClient from "app/(public-pages)/page.client";
import { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "CrowdBucks is a Fediverse-native crowd-funding, tipping, payments, and membership platform",
};

export default function Home() {
  return <HomePageClient />;
}
