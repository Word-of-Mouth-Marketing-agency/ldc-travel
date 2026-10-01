import {
  demoAboutPage,
  demoContactPage,
  demoDestinationsPage,
  type AboutPageViewModel,
  type ContactPageViewModel,
  type DestinationsPageViewModel,
} from "../content/page-content-demo";
import { demoHomepage } from "../content/homepage-demo";
import { readMediaImage, buildSite, buildWhatsappConfig } from "./homepage";
import { isUiPreviewMode } from "./preview";

type RecordValue = Record<string, unknown>;

export class PageContentDataError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "PageContentDataError";
  }
}

const asRecord = (value: unknown): RecordValue | undefined => value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : undefined;
const asString = (value: unknown) => typeof value === "string" ? value.trim() : "";
const asRecords = (value: unknown) => Array.isArray(value) ? value.map(asRecord).filter((item): item is RecordValue => Boolean(item)) : [];

function required(value: unknown, label: string) {
  const text = asString(value);
  if (!text) throw new PageContentDataError(`Required CMS page content is missing: ${label}.`);
  return text;
}

async function getPayloadClient() {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
    if (process.env.NODE_ENV === "development") return null;
    throw new PageContentDataError("CMS page content is unavailable.");
  }
  const { getPayload } = await import("payload");
  const { default: config } = await import("../../payload.config");
  return getPayload({ config });
}

type GlobalSlug = "site-settings" | "homepage" | "about-page" | "contact-page" | "destinations-page";

async function loadGlobals(slugs: GlobalSlug[]) {
  const payload = await getPayloadClient();
  if (!payload) return null;
  const globals = await Promise.all(slugs.map((slug) => payload.findGlobal({ slug, depth: 3, overrideAccess: false })));
  return Object.fromEntries(slugs.map((slug, index) => [slug, globals[index]]));
}

function readSeo(value: unknown, fallback: { metaTitle: string; metaDescription: string }) {
  const seo = asRecord(value);
  return {
    metaTitle: asString(seo?.metaTitle) || fallback.metaTitle,
    metaDescription: asString(seo?.metaDescription) || fallback.metaDescription,
    socialImage: readMediaImage(seo?.socialImage, "LDC Travel", "hero")?.src,
  };
}

function mapParagraphs(value: unknown) {
  return asRecords(value).map((item) => asString(item.text)).filter(Boolean);
}

function mapAbout(raw: unknown): AboutPageViewModel {
  const record = asRecord(raw);
  if (!record) throw new PageContentDataError("About Page configuration is unavailable.");
  const masthead = asRecord(record.masthead);
  const who = asRecord(record.whoWeAre);
  const approach = asRecord(record.approach);
  const support = asRecord(record.support);
  const stories = asRecord(record.destinationStories);
  const process = asRecord(record.process);
  const cta = asRecord(record.cta);
  const whoImage = readMediaImage(who?.image, "LDC Travel destination guidance", "hero");
  if (!whoImage) throw new PageContentDataError("About Page needs a Who We Are image with descriptive alt text.");

  const destinationStories = asRecords(stories?.items).map((item) => {
    const destination = asRecord(item.destination);
    const slug = asString(destination?.slug);
    const image = readMediaImage(item.image, asString(destination?.title), "card") || readMediaImage(destination?.coverImage, asString(destination?.title), "card");
    if (!slug || !image) return null;
    return { title: required(destination?.title, "About destination story title"), label: asString(item.label), image, href: `/destinations/${slug}` };
  }).filter((item): item is AboutPageViewModel["destinationStories"]["items"][number] => Boolean(item && item.label));

  return {
    masthead: { eyebrow: asString(masthead?.eyebrow), headline: required(masthead?.headline, "About masthead headline"), description: asString(masthead?.description) },
    whoWeAre: {
      eyebrow: asString(who?.eyebrow), headline: required(who?.headline, "About Who We Are headline"),
      paragraphs: mapParagraphs(who?.paragraphs), image: whoImage, imageCaption: asString(who?.imageCaption), imageTitle: asString(who?.imageTitle),
    },
    approach: {
      eyebrow: asString(approach?.eyebrow), headline: asString(approach?.headline), description: asString(approach?.description),
      principles: asRecords(approach?.principles).map((item) => asString(item.label)).filter(Boolean),
    },
    support: {
      eyebrow: asString(support?.eyebrow), headline: asString(support?.headline),
      items: asRecords(support?.items).map((item) => ({ title: asString(item.title), description: asString(item.description), icon: asString(item.icon) }))
        .filter((item) => item.title && item.description && item.icon),
    },
    destinationStories: {
      eyebrow: asString(stories?.eyebrow), headline: asString(stories?.headline), description: asString(stories?.description), items: destinationStories,
    },
    process: {
      eyebrow: asString(process?.eyebrow), headline: asString(process?.headline),
      steps: asRecords(process?.steps).map((item) => ({ title: asString(item.title), description: asString(item.description) })).filter((item) => item.title && item.description),
    },
    cta: {
      eyebrow: asString(cta?.eyebrow), headline: asString(cta?.headline), description: asString(cta?.description),
      primaryLabel: asString(cta?.primaryLabel), secondaryLabel: asString(cta?.secondaryLabel),
    },
    seo: readSeo(record.seo, demoAboutPage.seo),
  };
}

function mapContact(raw: unknown): ContactPageViewModel {
  const record = asRecord(raw);
  if (!record) throw new PageContentDataError("Contact Page configuration is unavailable.");
  const masthead = asRecord(record.masthead);
  const form = asRecord(record.form);
  const details = asRecord(record.details);
  const social = asRecord(record.social);
  return {
    masthead: { eyebrow: asString(masthead?.eyebrow), headline: required(masthead?.headline, "Contact masthead headline"), description: asString(masthead?.description) },
    form: {
      eyebrow: asString(form?.eyebrow), headline: required(form?.headline, "Contact form heading"),
      description: asString(form?.description), submitLabel: asString(form?.submitLabel) || "Send inquiry",
    },
    details: {
      eyebrow: asString(details?.eyebrow), headline: asString(details?.headline), description: asString(details?.description),
      noteHeadline: asString(details?.noteHeadline), noteDescription: asString(details?.noteDescription), noteCtaLabel: asString(details?.noteCtaLabel),
    },
    social: { eyebrow: asString(social?.eyebrow), headline: asString(social?.headline), description: asString(social?.description) },
    seo: readSeo(record.seo, demoContactPage.seo),
  };
}

function mapDestinationsPage(raw: unknown): DestinationsPageViewModel {
  const record = asRecord(raw);
  if (!record) throw new PageContentDataError("Destinations Page configuration is unavailable.");
  const masthead = asRecord(record.masthead);
  const listing = asRecord(record.listing);
  const support = asRecord(record.support);
  return {
    masthead: {
      eyebrow: asString(masthead?.eyebrow), headline: required(masthead?.headline, "Destinations masthead headline"),
      description: asString(masthead?.description), markLabel: asString(masthead?.markLabel),
    },
    listing: { eyebrow: asString(listing?.eyebrow), headline: asString(listing?.headline), description: asString(listing?.description) },
    support: { eyebrow: asString(support?.eyebrow), headline: asString(support?.headline), description: asString(support?.description), ctaLabel: asString(support?.ctaLabel) },
    seo: readSeo(record.seo, demoDestinationsPage.seo),
  };
}

export async function getAboutPageData() {
  if (isUiPreviewMode()) return { site: demoHomepage.site, whatsappConfig: demoHomepage.whatsappConfig, page: demoAboutPage };
  try {
    const records = await loadGlobals(["site-settings", "about-page"]);
    if (!records) return { site: demoHomepage.site, whatsappConfig: demoHomepage.whatsappConfig, page: demoAboutPage };
    const site = buildSite(records["site-settings"]);
    return { site, whatsappConfig: buildWhatsappConfig(site), page: mapAbout(records["about-page"]) };
  } catch (error) {
    if (process.env.NODE_ENV !== "development") throw new PageContentDataError("About page CMS content is unavailable.", error);
    return { site: demoHomepage.site, whatsappConfig: demoHomepage.whatsappConfig, page: demoAboutPage };
  }
}

export async function getContactPageData() {
  if (isUiPreviewMode()) return { site: demoHomepage.site, whatsappConfig: demoHomepage.whatsappConfig, page: demoContactPage };
  try {
    const records = await loadGlobals(["site-settings", "contact-page"]);
    if (!records) return { site: demoHomepage.site, whatsappConfig: demoHomepage.whatsappConfig, page: demoContactPage };
    const site = buildSite(records["site-settings"]);
    return { site, whatsappConfig: buildWhatsappConfig(site), page: mapContact(records["contact-page"]) };
  } catch (error) {
    if (process.env.NODE_ENV !== "development") throw new PageContentDataError("Contact page CMS content is unavailable.", error);
    return { site: demoHomepage.site, whatsappConfig: demoHomepage.whatsappConfig, page: demoContactPage };
  }
}

export async function getDestinationsPageContent() {
  if (isUiPreviewMode()) return demoDestinationsPage;
  try {
    const records = await loadGlobals(["destinations-page"]);
    if (!records) return demoDestinationsPage;
    return mapDestinationsPage(records["destinations-page"]);
  } catch (error) {
    if (process.env.NODE_ENV !== "development") throw new PageContentDataError("Destinations page CMS content is unavailable.", error);
    return demoDestinationsPage;
  }
}
