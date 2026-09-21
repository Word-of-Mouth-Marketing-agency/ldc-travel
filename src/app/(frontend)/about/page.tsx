import type { Metadata } from "next";

import { AboutPage, AboutUnavailable } from "../../../components/about/AboutPage";
import { ContactDataError, getContactData } from "../../../lib/contact";
import { buildPageMetadata, getSiteUrl } from "../../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  siteName: "LDC Travel",
  siteUrl: getSiteUrl(),
  pathname: "/about",
  title: "About LDC Travel",
  description: "Discover LDC Travel's destination-led approach to thoughtful travel planning and personal follow-up.",
  socialImageUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
});

export default async function AboutRoute() {
  let data: Awaited<ReturnType<typeof getContactData>> | null = null;

  try {
    data = await getContactData();
  } catch (error) {
    if (!(error instanceof ContactDataError)) throw error;
  }

  if (!data) return <AboutUnavailable />;
  return <AboutPage site={data.site} whatsappConfig={data.whatsappConfig} />;
}
