import HomePageClient from "app/(public-pages)/page.client";
import { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "SkyBucks is a Bluesky-native crowdfunding, tipping, payments, and membership platform.",
};

export default function Home() {
  return <HomePageClient />;
}
