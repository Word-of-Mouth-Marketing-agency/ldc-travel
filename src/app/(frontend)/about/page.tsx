import type { Metadata } from "next";

import { AboutPage, AboutUnavailable } from "../../../components/about/AboutPage";
import { getAboutPageData, PageContentDataError } from "../../../lib/page-content";
import { buildPageMetadata, buildUnavailableMetadata, getSiteUrl } from "../../../lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getAboutPageData();
    return buildPageMetadata({ siteName: data.site.name, siteUrl: getSiteUrl(), pathname: "/about", title: data.page.seo.metaTitle, description: data.page.seo.metaDescription, socialImageUrl: data.page.seo.socialImage || data.site.defaultSocialImage });
  } catch (error) {
    if (!(error instanceof PageContentDataError)) throw error;
    return buildUnavailableMetadata("About page temporarily unavailable | LDC Travel");
  }
}

export default async function AboutRoute() {
  let data: Awaited<ReturnType<typeof getAboutPageData>>;
  try {
    data = await getAboutPageData();
  } catch (error) {
    if (!(error instanceof PageContentDataError)) throw error;
    return <AboutUnavailable />;
  }
  return <AboutPage site={data.site} whatsappConfig={data.whatsappConfig} page={data.page} />;
}
