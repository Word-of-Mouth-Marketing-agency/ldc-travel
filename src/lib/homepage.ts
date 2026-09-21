import {
  demoHomepage,
  type Cta,
  type DestinationViewModel,
  type FaqViewModel,
  type HomepageViewModel,
  type ImageSource,
  type InspirationItem,
  type SiteViewModel,
  type SocialLink,
  type WhyLdcItem,
} from "../content/homepage-demo";
import { approvedDestinationSlugs } from "../content/destinations";
import { createWhatsAppUrl, type WhatsAppConfig } from "./whatsapp";
import { getLaunchMarketCode } from "./markets";
import { isUiPreviewMode } from "./preview";

type RecordValue = Record<string, unknown>;

const allowedExternalImageHosts = new Set(["images.unsplash.com", "images.pexels.com"]);

export class HomepageDataError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "HomepageDataError";
  }
}

function developmentFallback() {
  if (process.env.NODE_ENV !== "development" && !isUiPreviewMode()) {
    throw new HomepageDataError("Homepage CMS content is unavailable.");
  }

  return demoHomepage;
}

const asRecord = (value: unknown): RecordValue | undefined =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as RecordValue) : undefined;

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

const asRecords = (value: unknown) =>
  Array.isArray(value) ? value.map(asRecord).filter((item): item is RecordValue => Boolean(item)) : [];

function readAllowedExternalImageUrl(value: string) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" || !allowedExternalImageHosts.has(parsed.hostname)) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function readSafeMediaUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return readAllowedExternalImageUrl(value);
}

function isVisibleInMarket(value: RecordValue, marketId: string) {
  return asRecords(value.markets).some((market) => asString(market.id) === marketId) ||
    (Array.isArray(value.markets) && value.markets.some((market) => typeof market === "string" && market === marketId));
}

function readImage(value: unknown, fallback: ImageSource): ImageSource {
  const record = asRecord(value);
  const directUrl = readSafeMediaUrl(asString(record?.imageUrl));
  const media = asRecord(record?.coverImage) ?? asRecord(record?.image) ?? record;
  const sizes = asRecord(media?.sizes);
  const cardSize = asRecord(sizes?.card);
  const mediaUrl = readSafeMediaUrl(asString(media?.url)) || readSafeMediaUrl(asString(cardSize?.url));

  return {
    src: mediaUrl || directUrl || fallback.src,
    alt: asString(media?.alt, fallback.alt),
  };
}

function readRichText(value: unknown): string {
  const record = asRecord(value);
  if (!record) return "";

  const text = asString(record.text);
  if (text) return text;

  return asRecords(record.children).map(readRichText).filter(Boolean).join(" ");
}

export function buildSite(raw: unknown): SiteViewModel {
  const record = asRecord(raw);
  const contact = asRecord(record?.contact);
  const whatsapp = asRecord(record?.whatsapp);
  const socialLinks: SocialLink[] = asRecords(record?.socialLinks).map((item) => ({
    label: asString(item.label),
    url: asString(item.url) || undefined,
  })).filter((item) => item.label);

  return {
    ...demoHomepage.site,
    name: asString(record?.siteName, demoHomepage.site.name),
    tagline: asString(record?.tagline, demoHomepage.site.tagline),
    office: asString(contact?.office, demoHomepage.site.office),
    whatsappDisplay: asString(contact?.whatsappDisplay, demoHomepage.site.whatsappDisplay),
    whatsappNumber: asString(contact?.whatsappNumber, demoHomepage.site.whatsappNumber),
    reservationsEmail: asString(contact?.reservationsEmail, demoHomepage.site.reservationsEmail),
    salesEmail: asString(contact?.salesEmail, demoHomepage.site.salesEmail),
    defaultMessage: asString(whatsapp?.defaultMessage, demoHomepage.site.defaultMessage),
    contextTemplate: asString(whatsapp?.contextTemplate, demoHomepage.site.contextTemplate),
    footerCopy: asString(record?.footerCopy, demoHomepage.site.footerCopy),
    socialLinks: socialLinks.length ? socialLinks : demoHomepage.site.socialLinks,
  };
}

export function buildWhatsappConfig(site: SiteViewModel): WhatsAppConfig {
  return {
    phoneNumber: site.whatsappNumber,
    defaultMessage: site.defaultMessage,
    contextTemplate: site.contextTemplate,
  };
}

function ctaFromCms(value: unknown, fallback: Cta, whatsappConfig: WhatsAppConfig): Cta {
  const record = asRecord(value);
  const kind = asString(record?.kind, "whatsapp");
  const label = asString(record?.label, fallback.label);
  if (kind === "whatsapp") return { label, href: createWhatsAppUrl(whatsappConfig), external: true };
  const href = asString(record?.url, fallback.href);
  return { label, href: href === "#" ? fallback.href : href, external: kind === "external" };
}

function mapDestination(value: unknown, index: number): DestinationViewModel {
  const record = asRecord(value);
  const fallback = demoHomepage.destinations[index % demoHomepage.destinations.length];
  const slug = asString(record?.slug, fallback.slug);

  return {
    slug,
    title: asString(record?.title, fallback.title),
    country: asString(record?.country, fallback.country),
    regionOrCity: asString(record?.regionOrCity, fallback.regionOrCity),
    summary: asString(record?.summary, fallback.summary),
    image: readImage(record, fallback.image),
    href: `/destinations/${slug}`,
  };
}

function mapWhyLdc(value: unknown): HomepageViewModel["whyLdc"] {
  const record = asRecord(value);
  const fallback = demoHomepage.whyLdc;
  const items = asRecords(record?.items).map((item, index): WhyLdcItem => {
    const fallbackItem = fallback.items[index % fallback.items.length];
    return {
      title: asString(item.title, fallbackItem.title),
      description: asString(item.description, fallbackItem.description),
      icon: asString(item.icon, fallbackItem.icon),
    };
  });

  return {
    eyebrow: asString(record?.eyebrow, fallback.eyebrow),
    headline: asString(record?.headline, fallback.headline),
    description: asString(record?.description, fallback.description),
    items: items.length ? items : fallback.items,
  };
}

function mapInspiration(value: unknown): HomepageViewModel["inspiration"] {
  const record = asRecord(value);
  const fallback = demoHomepage.inspiration;
  const items = asRecords(record?.items).map((item, index): InspirationItem => {
    const fallbackItem = fallback.items[index % fallback.items.length];
    return {
      title: asString(item.title, fallbackItem.title),
      label: asString(item.label, fallbackItem.label),
      description: asString(item.description, fallbackItem.description),
      image: readImage(item, fallbackItem.image),
      href: asString(item.href, fallbackItem.href),
    };
  });

  return {
    eyebrow: asString(record?.eyebrow, fallback.eyebrow),
    headline: asString(record?.headline, fallback.headline),
    description: asString(record?.description, fallback.description),
    items: items.length ? items : fallback.items,
  };
}

function mapDestinationCta(value: unknown, whatsappConfig: WhatsAppConfig): HomepageViewModel["destinationCta"] {
  const record = asRecord(value);
  const fallback = demoHomepage.destinationCta;

  return {
    eyebrow: asString(record?.eyebrow, fallback.eyebrow),
    headline: asString(record?.headline, fallback.headline),
    description: asString(record?.description, fallback.description),
    primaryCta: ctaFromCms(record?.primaryCta, fallback.primaryCta, whatsappConfig),
    secondaryCta: ctaFromCms(record?.secondaryCta, fallback.secondaryCta, whatsappConfig),
  };
}

function mapFaq(value: unknown, index: number): FaqViewModel {
  const record = asRecord(value);
  const fallback = demoHomepage.faqs[index % demoHomepage.faqs.length];
  return {
    question: asString(record?.question, fallback.question),
    answer: readRichText(record?.answer) || fallback.answer,
  };
}

export async function getHomepageData(): Promise<HomepageViewModel> {
  if (isUiPreviewMode()) return demoHomepage;
  if (!process.env.DATABASE_URL) return developmentFallback();

  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("../../payload.config");
    const payload = await getPayload({ config });
    const [homepage, settings, marketResult] = await Promise.all([
      payload.findGlobal({ slug: "homepage", depth: 2 }),
      payload.findGlobal({ slug: "site-settings", depth: 1 }),
      payload.find({ collection: "markets", where: { and: [{ code: { equals: getLaunchMarketCode() } }, { isActive: { equals: true } }, { isPublic: { equals: true } }] }, limit: 1, depth: 0 }),
    ]);
    const launchMarket = marketResult.docs[0];
    if (!launchMarket) return developmentFallback();

    const marketId = String(launchMarket.id);
    const site = buildSite(settings);
    const whatsappConfig = buildWhatsappConfig(site);
    const homepageRecord = asRecord(homepage);
    const hero = asRecord(homepageRecord?.hero);
    const destinations = asRecords(homepageRecord?.featuredDestinations)
      .filter((item) => isVisibleInMarket(item, marketId))
      .filter((item) => approvedDestinationSlugs.includes(asString(item.slug)))
      .slice(0, 6);
    const faqs = asRecords(homepageRecord?.faqs);

    return {
      ...demoHomepage,
      site,
      whatsappConfig,
      hero: {
        ...demoHomepage.hero,
        eyebrow: asString(hero?.eyebrow, demoHomepage.hero.eyebrow),
        headline: asString(hero?.headline, demoHomepage.hero.headline),
        supportingCopy: asString(hero?.supportingCopy, demoHomepage.hero.supportingCopy),
        image: readImage(hero, demoHomepage.hero.image),
        primaryCta: ctaFromCms(hero?.primaryCta, demoHomepage.hero.primaryCta, whatsappConfig),
        secondaryCta: ctaFromCms(hero?.secondaryCta, demoHomepage.hero.secondaryCta, whatsappConfig),
      },
      destinations: destinations.length ? destinations.map(mapDestination) : demoHomepage.destinations,
      whyLdc: mapWhyLdc(homepageRecord?.whyLdc),
      inspiration: mapInspiration(homepageRecord?.inspiration),
      destinationCta: mapDestinationCta(homepageRecord?.destinationCta, whatsappConfig),
      faqs: faqs.length ? faqs.map(mapFaq) : demoHomepage.faqs,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "development") {
      throw new HomepageDataError("Homepage CMS content is unavailable.", error);
    }

    return demoHomepage;
  }
}
