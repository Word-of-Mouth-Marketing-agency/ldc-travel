import type { Metadata } from "next";

import { Homepage, HomepageUnavailable } from "../../components/homepage/Homepage";
import { getHomepageData, HomepageDataError } from "../../lib/homepage";
import { buildPageMetadata } from "../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  siteName: "LDC Travel",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "LDC Travel | Tourism Marketing",
  description: "Explore international destinations with LDC Travel from Egypt. Discover Turkey, Russia, Bali, Georgia, Indonesia, and Thailand, then start a thoughtful travel conversation.",
  socialImageUrl: "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1200&q=80",
});

export default async function Home() {
  let data: Awaited<ReturnType<typeof getHomepageData>> | null = null;

  try {
    data = await getHomepageData();
  } catch (error) {
    if (!(error instanceof HomepageDataError)) throw error;
  }

  if (!data) return <HomepageUnavailable />;
  return <Homepage data={data} />;
}
