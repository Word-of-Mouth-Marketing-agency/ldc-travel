import type { Metadata } from "next";

import { Homepage, HomepageUnavailable } from "../../components/homepage/Homepage";
import { getHomepageData, HomepageDataError } from "../../lib/homepage";
import { buildPageMetadata, buildUnavailableMetadata, getSiteUrl } from "../../lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getHomepageData();
    return buildPageMetadata({ siteName: data.site.name, siteUrl: getSiteUrl(), title: data.seo.title, description: data.seo.description, socialImageUrl: data.seo.image || data.site.defaultSocialImage });
  } catch (error) {
    if (!(error instanceof HomepageDataError)) throw error;
    return buildUnavailableMetadata("Homepage temporarily unavailable | LDC Travel");
  }
}

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
