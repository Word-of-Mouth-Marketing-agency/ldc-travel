import {
  demoHomepage,
  type Cta,
  type DestinationViewModel,
  type EventViewModel,
  type FaqViewModel,
  type GuideViewModel,
  type HomepageViewModel,
  type ImageSource,
  type OfferViewModel,
  type ProgramViewModel,
  type SiteViewModel,
  type SocialLink,
  type TestimonialViewModel,
} from "../content/homepage-demo";
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

const asNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

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
  const mediaUrl = readSafeMediaUrl(asString(media?.url)) || readSafeMediaUrl(asString(asRecord(media?.sizes)?.card && asRecord(asRecord(media?.sizes)?.card)?.url));

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

function formatDate(value: string, fallback: string) {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return fallback;
  return new Intl.DateTimeFormat("en-EG", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

function dateParts(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return { month: "", day: "" };
  return {
    month: new Intl.DateTimeFormat("en-EG", { month: "short" }).format(date).toUpperCase(),
    day: new Intl.DateTimeFormat("en-EG", { day: "2-digit" }).format(date),
  };
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
  return { label, href, external: kind === "external" };
}

function mapDestination(value: unknown, index: number): DestinationViewModel {
  const record = asRecord(value);
  const fallback = demoHomepage.destinations[index % demoHomepage.destinations.length];
  const slug = asString(record?.slug);
  return {
    title: asString(record?.title, fallback.title),
    country: asString(record?.country, fallback.country),
    regionOrCity: asString(record?.regionOrCity) || undefined,
    summary: asString(record?.summary, fallback.summary),
    image: readImage(record, fallback.image),
    href: slug ? `/destinations/${slug}` : fallback.href,
  };
}

function mapProgram(value: unknown, index: number, whatsappConfig: WhatsAppConfig): ProgramViewModel {
  const record = asRecord(value);
  const fallback = demoHomepage.programs[index % demoHomepage.programs.length];
  const destination = asRecords(record?.destinations)[0];
  const price = asRecord(record?.startingPrice);
  const title = asString(record?.title, fallback.title);
  const slug = asString(record?.slug);
  const durationDays = asNumber(record?.durationDays, fallback.durationDays);
  const unit = asString(price?.unit, fallback.unit);
  return {
    title,
    destination: asString(destination?.title, fallback.destination),
    summary: asString(record?.summary, fallback.summary),
    durationDays,
    durationLabel: asString(record?.durationLabel, fallback.durationLabel || `${durationDays} days`),
    amount: asNumber(price?.amount, fallback.amount),
    currency: asString(price?.currency, fallback.currency),
    unit,
    priceQualifier: asString(price?.note, fallback.priceQualifier || (unit === "person" ? "Per person" : unit)) || undefined,
    priceNote: asString(record?.priceNote, fallback.priceNote) || undefined,
    image: readImage(record, fallback.image),
    href: slug ? createWhatsAppUrl(whatsappConfig, { title }) : fallback.href,
  };
}

function mapOffer(value: unknown, whatsappConfig: WhatsAppConfig): OfferViewModel | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  const title = asString(record.title, demoHomepage.offer?.title ?? "Seasonal offer");
  const fallback = demoHomepage.offer;
  if (!fallback) return undefined;
  return {
    title,
    badge: asString(record.badge, fallback.badge),
    headline: asString(record.headline, fallback.headline),
    description: asString(record.description, fallback.description),
    discountLabel: asString(record.discountLabel, fallback.discountLabel),
    image: readImage(record, fallback.image ?? demoHomepage.hero.image),
    cta: { label: asString(record.ctaLabel, fallback.cta.label), href: createWhatsAppUrl(whatsappConfig, { title }), external: true },
  };
}

function mapEvent(value: unknown, index: number, whatsappConfig: WhatsAppConfig): EventViewModel {
  const record = asRecord(value);
  const fallback = demoHomepage.events[index % demoHomepage.events.length];
  const title = asString(record?.title, fallback.title);
  const startDate = asString(record?.startDate);
  const parts = dateParts(startDate);
  return {
    title,
    location: asString(record?.location, fallback.location),
    summary: asString(record?.summary, fallback.summary),
    date: formatDate(startDate, fallback.date),
    month: parts.month || fallback.month,
    day: parts.day || fallback.day,
    image: readImage(record, fallback.image),
    cta: { label: "Ask about this event", href: createWhatsAppUrl(whatsappConfig, { title }), external: true },
  };
}

function mapTestimonial(value: unknown, index: number): TestimonialViewModel {
  const record = asRecord(value);
  const fallback = demoHomepage.testimonials[index % demoHomepage.testimonials.length];
  return {
    displayName: asString(record?.displayName, fallback.displayName),
    location: asString(record?.location, fallback.location),
    quote: asString(record?.quote, fallback.quote),
    rating: Math.min(5, Math.max(1, asNumber(record?.rating, fallback.rating))),
  };
}

function mapGuide(value: unknown, index: number): GuideViewModel {
  const record = asRecord(value);
  const fallback = demoHomepage.guides[index % demoHomepage.guides.length];
  const slug = asString(record?.slug);
  return {
    title: asString(record?.title, fallback.title),
    category: asString(record?.category, fallback.category),
    excerpt: asString(record?.excerpt, fallback.excerpt),
    publishedAt: asString(record?.publishedAt, fallback.publishedAt),
    image: readImage(record, fallback.image),
    href: slug ? `/blog/${slug}` : fallback.href,
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
    const destinations = asRecords(homepageRecord?.featuredDestinations).filter((item) => isVisibleInMarket(item, marketId));
    const programs = asRecords(homepageRecord?.popularPrograms).filter((item) => isVisibleInMarket(item, marketId));
    const events = asRecords(homepageRecord?.upcomingEvents).filter((item) => isVisibleInMarket(item, marketId));
    const activeOffer = asRecord(homepageRecord?.activeOffer);
    const testimonials = asRecords(homepageRecord?.featuredTestimonials);
    const guides = asRecords(homepageRecord?.latestGuides);
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
      programs: programs.length ? programs.map((item, index) => mapProgram(item, index, whatsappConfig)) : demoHomepage.programs,
      offer: activeOffer && isVisibleInMarket(activeOffer, marketId) ? mapOffer(activeOffer, whatsappConfig) ?? demoHomepage.offer : demoHomepage.offer,
      events: events.length ? events.map((item, index) => mapEvent(item, index, whatsappConfig)) : demoHomepage.events,
      testimonials: testimonials.length ? testimonials.map(mapTestimonial) : demoHomepage.testimonials,
      guides: guides.length ? guides.map(mapGuide) : demoHomepage.guides,
      faqs: faqs.length ? faqs.map(mapFaq) : demoHomepage.faqs,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "development") {
      throw new HomepageDataError("Homepage CMS content is unavailable.", error);
    }

    return demoHomepage;
  }
}
