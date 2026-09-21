import {
  approvedDestinationSlugs,
  demoDestinations,
  getDemoDestination,
  type DestinationDetailViewModel,
} from "../content/destinations";
import type { DestinationViewModel, ImageSource } from "../content/homepage-demo";
import { getLaunchMarketCode } from "./markets";
import { isUiPreviewMode } from "./preview";

type RecordValue = Record<string, unknown>;

const allowedExternalImageHosts = new Set(["images.unsplash.com", "images.pexels.com"]);

export class DestinationDataError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "DestinationDataError";
  }
}

function asRecord(value: unknown): RecordValue | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : undefined;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asRecords(value: unknown) {
  return Array.isArray(value) ? value.map(asRecord).filter((item): item is RecordValue => Boolean(item)) : [];
}

function readAllowedImageUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return value;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && allowedExternalImageHosts.has(parsed.hostname) ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function readImage(value: unknown, fallback: ImageSource): ImageSource {
  const record = asRecord(value);
  const media = asRecord(record?.image) ?? asRecord(record?.coverImage) ?? record;
  const sizes = asRecord(media?.sizes);
  const cardSize = asRecord(sizes?.card);
  const source = readAllowedImageUrl(asString(media?.url)) ||
    readAllowedImageUrl(asString(cardSize?.url)) ||
    readAllowedImageUrl(asString(record?.imageUrl));

  return { src: source || fallback.src, alt: asString(media?.alt, asString(record?.alt, fallback.alt)) };
}

function readRichText(value: unknown): string {
  const record = asRecord(value);
  if (!record) return "";
  const text = asString(record.text);
  if (text) return text;
  return asRecords(record.children).map(readRichText).filter(Boolean).join(" ");
}

function isVisibleInMarket(value: RecordValue, marketId: string) {
  const markets = value.markets;
  return asRecords(markets).some((market) => String(market.id ?? "") === marketId) ||
    (Array.isArray(markets) && markets.some((market) => String(market) === marketId));
}

function fallbackFor(slug: string) {
  return getDemoDestination(slug);
}

function mapDestinationRecord(value: unknown, fallback: DestinationDetailViewModel): DestinationDetailViewModel {
  const record = asRecord(value);
  const slug = asString(record?.slug, fallback.slug);
  const fallbackHighlights = fallback.highlights;
  const highlights = asRecords(record?.highlights).map((item, index) => {
    const fallbackHighlight = fallbackHighlights[index % fallbackHighlights.length];
    return {
      title: asString(item.title, fallbackHighlight.title),
      description: asString(item.description, fallbackHighlight.description),
      image: readImage(item, fallbackHighlight.image),
    };
  });
  const fallbackExperiences = fallback.experiences;
  const experiences = asRecords(record?.experiences).map((item, index) => {
    const fallbackExperience = fallbackExperiences[index % fallbackExperiences.length];
    return {
      title: asString(item.title, fallbackExperience.title),
      description: asString(item.description, fallbackExperience.description),
      icon: asString(item.icon, fallbackExperience.icon),
    };
  });
  const usefulInformation = asRecords(record?.usefulInformation).map((item, index) => {
    const fallbackInformation = fallback.usefulInformation[index % fallback.usefulInformation.length];
    return {
      label: asString(item.label, fallbackInformation.label),
      value: asString(item.value, fallbackInformation.value),
    };
  });
  const gallery = asRecords(record?.gallery).map((item, index) => readImage(item, fallback.gallery[index % fallback.gallery.length]));
  const relatedDestinations = asRecords(record?.relatedDestinations).map((item) => asString(item.slug)).filter(Boolean);
  const faqs = asRecords(record?.faqs).map((item) => ({ question: asString(item.question), answer: readRichText(item.answer) })).filter((item) => item.question && item.answer);

  return {
    slug,
    title: asString(record?.title, fallback.title),
    country: asString(record?.country, fallback.country),
    regionOrCity: asString(record?.regionOrCity, fallback.regionOrCity),
    eyebrow: asString(record?.eyebrow, fallback.eyebrow),
    summary: asString(record?.summary, fallback.summary),
    heroImage: readImage(record, fallback.heroImage),
    overview: asString(record?.overview, readRichText(record?.content) || fallback.overview),
    highlights: highlights.length ? highlights : fallback.highlights,
    experiences: experiences.length ? experiences : fallback.experiences,
    bestTimeToVisit: asString(record?.bestTimeToVisit, fallback.bestTimeToVisit),
    usefulInformation: usefulInformation.length ? usefulInformation : fallback.usefulInformation,
    gallery: gallery.length ? gallery : fallback.gallery,
    seoMetaTitle: asString(asRecord(record?.seo)?.metaTitle, fallback.seoMetaTitle),
    seoMetaDescription: asString(asRecord(record?.seo)?.metaDescription, fallback.seoMetaDescription),
    relatedDestinations: relatedDestinations.length ? relatedDestinations : fallback.relatedDestinations,
    faqs: faqs.length ? faqs : fallback.faqs,
  };
}

function mapListingItem(destination: DestinationDetailViewModel): DestinationViewModel {
  return {
    slug: destination.slug,
    title: destination.title,
    country: destination.country,
    regionOrCity: destination.regionOrCity,
    summary: destination.summary,
    image: destination.heroImage,
    href: `/destinations/${destination.slug}`,
  };
}

function toListingItem(destination: DestinationDetailViewModel): DestinationViewModel {
  return mapListingItem(destination);
}

function developmentFallback(): DestinationDetailViewModel[] {
  if (process.env.NODE_ENV !== "development" && !isUiPreviewMode()) {
    throw new DestinationDataError("Destination content is unavailable.");
  }
  return demoDestinations;
}

export async function getDestinationsData(): Promise<DestinationViewModel[]> {
  if (isUiPreviewMode()) return demoDestinations.map(toListingItem);
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) return developmentFallback().map(toListingItem);

  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("../../payload.config");
    const payload = await getPayload({ config });
    const marketResult = await payload.find({ collection: "markets", where: { and: [{ code: { equals: getLaunchMarketCode() } }, { isActive: { equals: true } }, { isPublic: { equals: true } }] }, limit: 1, depth: 0 });
    const market = marketResult.docs[0];
    if (!market) throw new DestinationDataError("Launch market is unavailable.");

    const result = await payload.find({
      collection: "destinations",
      where: { status: { equals: "published" } },
      limit: 30,
      depth: 2,
    });
    const marketId = String(market.id);
    const records = result.docs
      .map(asRecord)
      .filter((item): item is RecordValue => Boolean(item))
      .filter((item) => approvedDestinationSlugs.includes(asString(item.slug)) && isVisibleInMarket(item, marketId));
    const ordered = approvedDestinationSlugs.map((slug) => records.find((record) => record.slug === slug)).filter((record): record is RecordValue => Boolean(record));
    return ordered.map((record, index) => {
      const fallback = fallbackFor(asString(record.slug)) ?? demoDestinations[index];
      return toListingItem(mapDestinationRecord(record, fallback));
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "development") throw new DestinationDataError("Destination content is unavailable.", error);
    return developmentFallback().map(toListingItem);
  }
}

export async function getDestinationData(slug: string): Promise<DestinationDetailViewModel | null> {
  if (!approvedDestinationSlugs.includes(slug)) return null;
  const fallback = fallbackFor(slug);
  if (!fallback) return null;
  if (isUiPreviewMode()) return fallback;
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
    if (process.env.NODE_ENV === "development") return fallback;
    throw new DestinationDataError("Destination content is unavailable.");
  }

  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("../../payload.config");
    const payload = await getPayload({ config });
    const marketResult = await payload.find({ collection: "markets", where: { and: [{ code: { equals: getLaunchMarketCode() } }, { isActive: { equals: true } }, { isPublic: { equals: true } }] }, limit: 1, depth: 0 });
    const market = marketResult.docs[0];
    if (!market) throw new DestinationDataError("Launch market is unavailable.");
    const result = await payload.find({ collection: "destinations", where: { and: [{ slug: { equals: slug } }, { status: { equals: "published" } }] }, limit: 1, depth: 2 });
    const record = asRecord(result.docs[0]);
    if (!record || !isVisibleInMarket(record, String(market.id))) return null;
    return mapDestinationRecord(record, fallback);
  } catch (error) {
    if (process.env.NODE_ENV !== "development") throw new DestinationDataError("Destination content is unavailable.", error);
    return fallback;
  }
}

export function getRelatedDestinationItems(destination: DestinationDetailViewModel, destinations: DestinationViewModel[]) {
  const allowed = destination.relatedDestinations.length ? destination.relatedDestinations : approvedDestinationSlugs.filter((slug) => slug !== destination.slug).slice(0, 2);
  return allowed.map((slug) => destinations.find((item) => item.slug === slug)).filter((item): item is DestinationViewModel => Boolean(item)).slice(0, 2);
}
