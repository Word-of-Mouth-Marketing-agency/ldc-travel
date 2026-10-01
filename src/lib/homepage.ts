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
import { publicContact, publicWhatsAppCopy, saudiOfficeAddress } from "./public-contact";
import { getLaunchMarketCode } from "./markets";
import { isUiPreviewMode } from "./preview";

type RecordValue = Record<string, unknown>;

const socialHosts = new Set(["facebook.com", "www.facebook.com", "instagram.com", "www.instagram.com"]);
const externalCtaHosts = new Set(["wa.me", "api.whatsapp.com", "ldc-tourism.com", "www.ldc-tourism.com"]);
const allowedInternalCta = /^(?:\/(?:about|contact|destinations(?:\/[a-z-]+)?)?|#destination-inquiry|#inquiry)$/;

export class HomepageDataError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "HomepageDataError";
  }
}

const asRecord = (value: unknown): RecordValue | undefined =>
  value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : undefined;

const asString = (value: unknown) => typeof value === "string" ? value.trim() : "";
const asRecords = (value: unknown) => Array.isArray(value) ? value.map(asRecord).filter((item): item is RecordValue => Boolean(item)) : [];

function requiredString(value: unknown, field: string) {
  const text = asString(value);
  if (!text) throw new HomepageDataError(`Required CMS content is missing: ${field}.`);
  return text;
}

function getDevelopmentFallback() {
  if (process.env.NODE_ENV !== "development" && !isUiPreviewMode()) {
    throw new HomepageDataError("Homepage CMS content is unavailable.");
  }
  return demoHomepage;
}

function readSafeMediaUrl(value: unknown) {
  const url = asString(value);
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ["ldc-tourism.com", "www.ldc-tourism.com"].includes(parsed.hostname) ? parsed.toString() : "";
  } catch {
    return "";
  }
}

export function readMediaImage(value: unknown, altFallback = "", preferredSize: "card" | "hero" | "thumbnail" | "original" = "card"): ImageSource | null {
  const record = asRecord(value);
  if (!record) return null;
  const sizes = asRecord(record.sizes);
  const preferred = asRecord(sizes?.[preferredSize]);
  const fallback = asRecord(sizes?.card) ?? asRecord(sizes?.hero) ?? asRecord(sizes?.thumbnail);
  const src = preferredSize === "original"
    ? readSafeMediaUrl(record.url)
    : readSafeMediaUrl(preferred?.url) || readSafeMediaUrl(fallback?.url) || readSafeMediaUrl(record.url);
  const alt = asString(record.alt) || altFallback;
  if (!src || !alt) return null;
  return {
    src,
    alt,
    width: typeof record.width === "number" ? record.width : undefined,
    height: typeof record.height === "number" ? record.height : undefined,
  };
}

function readImageField(value: unknown, altFallback = "", preferredSize: "card" | "hero" | "thumbnail" = "card") {
  const record = asRecord(value);
  const relation = asRecord(record?.image) ?? asRecord(record?.coverImage) ?? record;
  return readMediaImage(relation, altFallback, preferredSize);
}

function readRichText(value: unknown): string {
  const record = asRecord(value);
  if (!record) return "";
  const ownText = asString(record.text);
  const children = asRecords(record.children).map(readRichText).filter(Boolean);
  return [ownText, ...children].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

function safeSocial(value: unknown, label: string): SocialLink | null {
  const raw = asString(value);
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" || !socialHosts.has(parsed.hostname)) return null;
    return { label, url: parsed.toString() };
  } catch {
    return null;
  }
}

function cleanPhoneNumber(value: unknown, fallback: string) {
  const digits = asString(value).replace(/\D/g, "");
  return /^\d{8,15}$/.test(digits) ? digits : fallback;
}

function logoImage(value: unknown, fallback: ImageSource): ImageSource {
  return readMediaImage(value, fallback.alt, "original") ?? fallback;
}

export function buildSite(raw: unknown): SiteViewModel {
  const record = asRecord(raw);
  if (!record) throw new HomepageDataError("Site Settings are unavailable.");
  const contact = asRecord(record.contact);
  const egypt = asRecord(contact?.egyptOffice);
  const saudi = asRecord(contact?.saudiOfficeDetails);
  const socials = asRecord(record.socials);
  const egyptSocial = asRecord(socials?.egypt);
  const saudiSocial = asRecord(socials?.saudi);
  const branding = asRecord(record.branding);
  const whatsapp = asRecord(record.whatsapp);
  const egyptLinks = [safeSocial(egyptSocial?.instagram, "Instagram"), safeSocial(egyptSocial?.facebook, "Facebook")].filter((link): link is SocialLink => Boolean(link));
  const saudiLinks = [safeSocial(saudiSocial?.instagram, "Instagram"), safeSocial(saudiSocial?.facebook, "Facebook")].filter((link): link is SocialLink => Boolean(link));
  const headerLogo = logoImage(branding?.primaryLogo, demoHomepage.site.headerLogo);
  const footerLogo = logoImage(branding?.footerLogo, demoHomepage.site.footerLogo);

  return {
    ...demoHomepage.site,
    name: requiredString(record.siteName, "Site Settings → brand name"),
    tagline: asString(record.tagline) || "Tourism Marketing",
    publicEmail: requiredString(record.publicEmail, "Site Settings → public email"),
    email: requiredString(record.publicEmail, "Site Settings → public email"),
    egyptOfficeLabel: asString(egypt?.label) || "Egypt",
    office: requiredString(egypt?.address, "Site Settings → Egypt office address"),
    saudiOfficeLabel: asString(saudi?.label) || "Saudi Arabia",
    saudiOffice: requiredString(saudi?.address, "Site Settings → Saudi Arabia office address") || saudiOfficeAddress,
    egyptWhatsappDisplay: asString(egypt?.whatsappDisplay) || publicContact.whatsapp.egypt.display,
    egyptWhatsappNumber: cleanPhoneNumber(egypt?.whatsappNumber, publicContact.whatsapp.egypt.number),
    whatsappDisplay: asString(saudi?.whatsappDisplay) || publicContact.whatsapp.saudi.display,
    whatsappNumber: cleanPhoneNumber(saudi?.whatsappNumber, publicContact.whatsapp.saudi.number),
    defaultMessage: asString(whatsapp?.defaultMessage) || publicWhatsAppCopy.defaultMessage,
    contextTemplate: asString(whatsapp?.contextTemplate) || publicWhatsAppCopy.contextTemplate,
    footerCopy: asString(record.footerCopy),
    socialLinks: egyptLinks,
    regionalSocials: { egypt: egyptLinks, saudi: saudiLinks },
    headerLogo,
    footerLogo,
    defaultMetaTitle: asString(asRecord(record.seo)?.metaTitle) || `${asString(record.siteName)} — Tourism Marketing`,
    defaultMetaDescription: asString(asRecord(record.seo)?.metaDescription) || "Explore international destinations with LDC Travel and get personal guidance for your next journey.",
    defaultSocialImage: readMediaImage(asRecord(record.seo)?.socialImage, "LDC Travel destinations", "hero")?.src,
  };
}

export function buildWhatsappConfig(site: SiteViewModel): WhatsAppConfig {
  return { phoneNumber: site.whatsappNumber, defaultMessage: site.defaultMessage, contextTemplate: site.contextTemplate };
}

function ctaFromCms(value: unknown, fallback: Cta, whatsappConfig: WhatsAppConfig): Cta {
  const record = asRecord(value);
  const label = asString(record?.label);
  const kind = asString(record?.kind);
  if (!label) throw new HomepageDataError("A homepage CTA label is missing.");
  if (kind === "whatsapp") return { label, href: createWhatsAppUrl(whatsappConfig), external: true };
  const href = asString(record?.url);
  if (kind === "internal" && allowedInternalCta.test(href)) return { label, href };
  if (kind === "external") {
    try {
      const parsed = new URL(href);
      if (parsed.protocol === "https:" && externalCtaHosts.has(parsed.hostname)) return { label, href: parsed.toString(), external: true };
    } catch { /* An invalid editor-provided URL falls through to the approved route. */ }
  }
  return fallback;
}

function mapDestination(value: unknown): DestinationViewModel {
  const record = asRecord(value);
  if (!record || asString(record.status) !== "published") throw new HomepageDataError("A selected homepage destination is not published.");
  const slug = requiredString(record.slug, "Destination slug");
  if (!approvedDestinationSlugs.includes(slug)) throw new HomepageDataError("A destination outside the approved launch set is selected.");
  const image = readImageField(record.coverImage, `${asString(record.title)} destination`, "card");
  if (!image) throw new HomepageDataError(`The ${slug} destination needs a published primary Media image with alt text.`);
  return {
    slug,
    title: requiredString(record.title, `${slug} destination title`),
    country: requiredString(record.country, `${slug} country`),
    regionOrCity: asString(record.regionOrCity) || undefined,
    summary: requiredString(record.summary, `${slug} summary`),
    image,
    href: `/destinations/${slug}`,
  };
}

function mapWhyLdc(value: unknown): HomepageViewModel["whyLdc"] {
  const record = asRecord(value);
  const items = asRecords(record?.items).map((item): WhyLdcItem => ({
    title: asString(item.title), description: asString(item.description), icon: asString(item.icon),
  })).filter((item) => item.title && item.description && item.icon);
  return { eyebrow: asString(record?.eyebrow), headline: asString(record?.headline), description: asString(record?.description), items };
}

function mapInspiration(value: unknown, destinationsBySlug: Map<string, DestinationViewModel>): HomepageViewModel["inspiration"] {
  const record = asRecord(value);
  const items: InspirationItem[] = asRecords(record?.items).map((item) => {
    const destination = asRecord(item.destination);
    const destinationSlug = asString(destination?.slug);
    const image = readImageField(item, asString(item.title), "card") ?? (destination ? readImageField(destination.coverImage, asString(destination.title), "card") : null);
    const href = asString(item.href) || (destinationsBySlug.has(destinationSlug) ? `/destinations/${destinationSlug}` : "/destinations");
    if (!allowedInternalCta.test(href) || !image) return null;
    return {
      title: asString(item.title), label: asString(item.label), description: asString(item.description),
      destinationSlug, image, href,
    };
  }).filter((item): item is InspirationItem => Boolean(item && item.title && item.label && item.description));
  return { eyebrow: asString(record?.eyebrow), headline: asString(record?.headline), description: asString(record?.description), items };
}

function mapFaq(value: unknown): FaqViewModel | null {
  const record = asRecord(value);
  const question = asString(record?.question);
  const answer = readRichText(record?.answer);
  return question && answer ? { question, answer } : null;
}

export async function getHomepageData(): Promise<HomepageViewModel> {
  if (isUiPreviewMode()) return demoHomepage;
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) return getDevelopmentFallback();

  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("../../payload.config");
    const payload = await getPayload({ config });
    const [homepage, settings, marketResult] = await Promise.all([
      payload.findGlobal({ slug: "homepage", depth: 2, overrideAccess: false }),
      payload.findGlobal({ slug: "site-settings", depth: 2, overrideAccess: false }),
      payload.find({ collection: "markets", where: { and: [{ code: { equals: getLaunchMarketCode() } }, { isActive: { equals: true } }, { isPublic: { equals: true } }] }, limit: 1, depth: 0, overrideAccess: false }),
    ]);
    const market = marketResult.docs[0];
    if (!market) throw new HomepageDataError("The public launch market is unavailable.");
    const site = buildSite(settings);
    const whatsappConfig = buildWhatsappConfig(site);
    const homepageRecord = asRecord(homepage);
    if (!homepageRecord) throw new HomepageDataError("Homepage configuration is unavailable.");

    const destinations = asRecords(homepageRecord.featuredDestinations)
      .filter((item) => asString(item.status) === "published")
      .filter((item) => approvedDestinationSlugs.includes(asString(item.slug)))
      .filter((item) => {
        const markets = item.markets;
        return asRecords(markets).some((itemMarket) => String(itemMarket.id ?? "") === String(market.id)) ||
          (Array.isArray(markets) && markets.some((itemMarket) => String(itemMarket) === String(market.id)));
      });
    const mappedDestinations = destinations.map(mapDestination);
    if (mappedDestinations.length !== approvedDestinationSlugs.length || new Set(mappedDestinations.map((item) => item.slug)).size !== approvedDestinationSlugs.length) {
      throw new HomepageDataError("Homepage must select each of the six published launch destinations exactly once.");
    }

    const hero = asRecord(homepageRecord.hero);
    const heroImage = readImageField(hero, "LDC Travel destination hero", "hero");
    if (!heroImage) throw new HomepageDataError("Homepage hero image is missing. Select a Media upload with descriptive alt text.");
    const faqRecords = asRecords(homepageRecord.faqs).map(mapFaq).filter((item): item is FaqViewModel => Boolean(item));
    const ctaForm = asRecord(asRecord(homepageRecord.destinationCta)?.form);
    const heroCtas = { primary: asRecord(hero?.primaryCta), secondary: asRecord(hero?.secondaryCta) };
    const faqSection = asRecord(homepageRecord.faqSection);
    const destinationsSection = asRecord(homepageRecord.destinationsSection);
    const destinationCta = asRecord(homepageRecord.destinationCta);
    const destinationsBySlug = new Map(mappedDestinations.map((item) => [item.slug, item]));
    const rawSeo = asRecord(homepageRecord.seo);

    return {
      site,
      whatsappConfig,
      hero: {
        eyebrow: requiredString(hero?.eyebrow, "Homepage hero eyebrow"),
        headline: requiredString(hero?.headline, "Homepage hero headline"),
        supportingCopy: requiredString(hero?.supportingCopy, "Homepage hero copy"),
        image: heroImage,
        primaryCta: ctaFromCms(heroCtas.primary, demoHomepage.hero.primaryCta, whatsappConfig),
        secondaryCta: ctaFromCms(heroCtas.secondary, demoHomepage.hero.secondaryCta, whatsappConfig),
      },
      destinations: mappedDestinations,
      destinationsSection: {
        eyebrow: asString(destinationsSection?.eyebrow), headline: asString(destinationsSection?.headline), description: asString(destinationsSection?.description),
      },
      whyLdc: mapWhyLdc(homepageRecord.whyLdc),
      inspiration: mapInspiration(homepageRecord.inspiration, destinationsBySlug),
      destinationCta: {
        eyebrow: asString(destinationCta?.eyebrow), headline: asString(destinationCta?.headline), description: asString(destinationCta?.description),
        primaryCta: ctaFromCms(asRecord(destinationCta?.primaryCta), demoHomepage.destinationCta.primaryCta, whatsappConfig),
        secondaryCta: ctaFromCms(asRecord(destinationCta?.secondaryCta), demoHomepage.destinationCta.secondaryCta, whatsappConfig),
        form: {
          eyebrow: asString(ctaForm?.eyebrow), headline: asString(ctaForm?.headline), description: asString(ctaForm?.description), submitLabel: asString(ctaForm?.submitLabel),
        },
      },
      faqSection: {
        eyebrow: asString(faqSection?.eyebrow), headline: asString(faqSection?.headline), description: asString(faqSection?.description),
      },
      faqs: faqRecords,
      seo: {
        title: asString(rawSeo?.metaTitle) || `${site.name} — Tourism Marketing`,
        description: asString(rawSeo?.metaDescription) || site.defaultMetaDescription,
        image: readMediaImage(rawSeo?.socialImage, "LDC Travel destinations", "hero")?.src || site.defaultSocialImage,
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "development") throw new HomepageDataError("Homepage CMS content is unavailable.", error);
    return getDevelopmentFallback();
  }
}
