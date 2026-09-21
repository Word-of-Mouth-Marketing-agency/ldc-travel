import type { Metadata } from "next";

import { ContactPage, ContactUnavailable } from "../../../components/contact/ContactPage";
import { ContactDataError, getContactData } from "../../../lib/contact";
import { buildPageMetadata, getSiteUrl } from "../../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  siteName: "LDC Travel",
  siteUrl: getSiteUrl(),
  pathname: "/contact",
  title: "Contact LDC Travel | LDC Travel",
  description: "Contact LDC Travel about Turkey, Russia, Bali, Georgia, Indonesia, or Thailand. Send an inquiry and our team will follow up by WhatsApp or email.",
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
