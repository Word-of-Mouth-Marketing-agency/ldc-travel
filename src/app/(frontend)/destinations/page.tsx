import type { Metadata } from "next";

import { DestinationsListingPage, DestinationsUnavailable } from "../../../components/destinations/DestinationListingPage";
import { ContactDataError, getContactData } from "../../../lib/contact";
import { DestinationDataError, getDestinationsData } from "../../../lib/destinations";
import { buildPageMetadata, getSiteUrl } from "../../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  siteName: "LDC Travel",
  siteUrl: getSiteUrl(),
  pathname: "/destinations",
  title: "Destinations | LDC Travel",
  description: "Explore Turkey, Russia, Bali, Georgia, Indonesia, and Thailand with LDC Travel. Find a destination that fits the way you want to travel.",
  socialImageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
});

export default async function DestinationsRoute() {
  let destinations: Awaited<ReturnType<typeof getDestinationsData>> | null = null;
  let contact: Awaited<ReturnType<typeof getContactData>> | null = null;

  try {
    [destinations, contact] = await Promise.all([getDestinationsData(), getContactData()]);
  } catch (error) {
    if (!(error instanceof DestinationDataError) && !(error instanceof ContactDataError)) throw error;
  }

  if (!destinations || !contact) return <DestinationsUnavailable />;
  return <DestinationsListingPage destinations={destinations} site={contact.site} whatsappConfig={contact.whatsappConfig} />;
}
