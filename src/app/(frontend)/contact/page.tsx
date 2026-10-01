import type { Metadata } from "next";

import { ContactPage, ContactUnavailable } from "../../../components/contact/ContactPage";
import { getContactPageData, PageContentDataError } from "../../../lib/page-content";
import { buildPageMetadata, buildUnavailableMetadata, getSiteUrl } from "../../../lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getContactPageData();
    return buildPageMetadata({ siteName: data.site.name, siteUrl: getSiteUrl(), pathname: "/contact", title: data.page.seo.metaTitle, description: data.page.seo.metaDescription, socialImageUrl: data.page.seo.socialImage || data.site.defaultSocialImage });
  } catch (error) {
    if (!(error instanceof PageContentDataError)) throw error;
    return buildUnavailableMetadata("Contact page temporarily unavailable | LDC Travel");
  }
}

export default async function ContactRoute() {
  let data: Awaited<ReturnType<typeof getContactPageData>>;
  try {
    data = await getContactPageData();
  } catch (error) {
    if (!(error instanceof PageContentDataError)) throw error;
    return <ContactUnavailable />;
  }
  return <ContactPage site={data.site} whatsappConfig={data.whatsappConfig} page={data.page} />;
}
