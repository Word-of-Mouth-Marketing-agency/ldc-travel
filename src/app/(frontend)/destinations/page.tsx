import type { Metadata } from "next";

import { DestinationsListingPage, DestinationsUnavailable } from "../../../components/destinations/DestinationListingPage";
import { DestinationDataError, getDestinationsData } from "../../../lib/destinations";
import { getContactPageData, getDestinationsPageContent, PageContentDataError } from "../../../lib/page-content";
import { buildPageMetadata, buildUnavailableMetadata, getSiteUrl } from "../../../lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [page, contact] = await Promise.all([getDestinationsPageContent(), getContactPageData()]);
    return buildPageMetadata({ siteName: contact.site.name, siteUrl: getSiteUrl(), pathname: "/destinations", title: page.seo.metaTitle, description: page.seo.metaDescription, socialImageUrl: page.seo.socialImage || contact.site.defaultSocialImage });
  } catch (error) {
    if (!(error instanceof PageContentDataError)) throw error;
    return buildUnavailableMetadata("Destinations temporarily unavailable | LDC Travel");
  }
}

export default async function DestinationsRoute() {
  let data: Awaited<ReturnType<typeof loadDestinationsPage>>;
  try {
    data = await loadDestinationsPage();
  } catch (error) {
    if (!(error instanceof DestinationDataError) && !(error instanceof PageContentDataError)) throw error;
    return <DestinationsUnavailable />;
  }
  return <DestinationsListingPage destinations={data.destinations} site={data.contact.site} whatsappConfig={data.contact.whatsappConfig} page={data.page} />;
}

async function loadDestinationsPage() {
  const [destinations, contact, page] = await Promise.all([
    getDestinationsData(), getContactPageData(), getDestinationsPageContent(),
  ]);
  return { destinations, contact, page };
}
