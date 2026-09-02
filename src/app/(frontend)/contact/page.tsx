import type { Metadata } from "next";

import { ContactPage, ContactUnavailable } from "../../../components/contact/ContactPage";
import { ContactDataError, getContactData } from "../../../lib/contact";
import { buildPageMetadata } from "../../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  siteName: "LDC Travel",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  pathname: "/contact",
  title: "Contact LDC Travel | Tourism Marketing",
  description: "Start a travel inquiry with LDC Travel from Egypt. Talk to our team about programs, destinations, festivals, and custom journeys on WhatsApp or by email.",
  socialImageUrl: "https://images.unsplash.com/photo-1580225495234-00e84e19c85e?auto=format&fit=crop&w=1200&q=80",
});

export default async function ContactRoute() {
  let data: Awaited<ReturnType<typeof getContactData>> | null = null;

  try {
    data = await getContactData();
  } catch (error) {
    if (!(error instanceof ContactDataError)) throw error;
  }

  if (!data) return <ContactUnavailable />;
  return <ContactPage site={data.site} whatsappConfig={data.whatsappConfig} />;
}
