import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DestinationDetailPage, DestinationDetailUnavailable } from "../../../../components/destinations/DestinationDetailPage";
import { getContactPageData, PageContentDataError } from "../../../../lib/page-content";
import { DestinationDataError, getDestinationData, getDestinationsData, getRelatedDestinationItems } from "../../../../lib/destinations";
import { buildPageMetadata, buildUnavailableMetadata, getSiteUrl } from "../../../../lib/seo";
import { DestinationStructuredData } from "../../../../components/seo/StructuredData";

export const dynamic = "force-dynamic";

type DestinationRouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: DestinationRouteProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const destination = await getDestinationData(slug);
    if (!destination) return buildUnavailableMetadata("Destination not found | LDC Travel");
    const siteData = await getContactPageData();
    return buildPageMetadata({
      siteName: siteData.site.name,
      siteUrl: getSiteUrl(),
      pathname: `/destinations/${destination.slug}`,
      title: destination.seoMetaTitle,
      description: destination.seoMetaDescription,
      socialImageUrl: destination.heroImage.src || siteData.site.defaultSocialImage,
    });
  } catch (error) {
    if (!(error instanceof DestinationDataError) && !(error instanceof PageContentDataError)) throw error;
    return buildUnavailableMetadata("Destination temporarily unavailable | LDC Travel");
  }
}

export default async function DestinationRoute({ params }: DestinationRouteProps) {
  const { slug } = await params;
  let destination: Awaited<ReturnType<typeof getDestinationData>> = null;
  try {
    destination = await getDestinationData(slug);
  } catch (error) {
    if (!(error instanceof DestinationDataError)) throw error;
    return <DestinationDetailUnavailable />;
  }
  if (!destination) notFound();

  let destinations: Awaited<ReturnType<typeof getDestinationsData>> | null = null;
  let contact: Awaited<ReturnType<typeof getContactPageData>> | null = null;

  try {
    [destinations, contact] = await Promise.all([getDestinationsData(), getContactPageData()]);
  } catch (error) {
    if (!(error instanceof DestinationDataError) && !(error instanceof PageContentDataError)) throw error;
  }

  if (!destinations || !contact) return <DestinationDetailUnavailable />;
  return <><DestinationStructuredData destination={destination} /><DestinationDetailPage destination={destination} relatedDestinations={getRelatedDestinationItems(destination, destinations)} site={contact.site} whatsappConfig={contact.whatsappConfig} /></>;
}
