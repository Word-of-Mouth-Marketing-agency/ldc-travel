import {
  approvedDestinationSlugs,
  demoDestinations,
  getDemoDestination,
  type DestinationDetailViewModel,
} from "../content/destinations";
import type { DestinationHighlight } from "../content/destinations";
import type { DestinationViewModel, ImageSource } from "../content/homepage-demo";
import { getLaunchMarketCode } from "./markets";
import { isUiPreviewMode } from "./preview";
import { readMediaImage } from "./homepage";

type RecordValue = Record<string, unknown>;

export class DestinationDataError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "DestinationDataError";
  }
}

const asRecord = (value: unknown): RecordValue | undefined =>
  value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : undefined;
const asString = (value: unknown) => typeof value === "string" ? value.trim() : "";
const asRecords = (value: unknown) => Array.isArray(value) ? value.map(asRecord).filter((item): item is RecordValue => Boolean(item)) : [];

function requiredString(value: unknown, field: string) {
  const text = asString(value);
  if (!text) throw new DestinationDataError(`Required destination content is missing: ${field}.`);
  return text;
}

function developmentFallback(): DestinationDetailViewModel[] {
  if (process.env.NODE_ENV !== "development" && !isUiPreviewMode()) throw new DestinationDataError("Destination content is unavailable.");
  return demoDestinations;
}

function readRichText(value: unknown): string {
  const record = asRecord(value);
  if (!record) return "";
  const text = asString(record.text);
  const children = asRecords(record.children).map(readRichText).filter(Boolean);
  return [text, ...children].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

function getMedia(value: unknown, preferredSize: "card" | "hero" = "card") {
  return readMediaImage(value, asString(asRecord(value)?.alt), preferredSize);
}

function mapFaqs(value: unknown) {
  return asRecords(value).map((faq) => ({ question: asString(faq.question), answer: readRichText(faq.answer) }))
    .filter((faq) => faq.question && faq.answer);
}

function mapDestinationRecord(value: unknown): DestinationDetailViewModel {
  const record = asRecord(value);
  if (!record) throw new DestinationDataError("A destination record could not be read.");
  const slug = requiredString(record.slug, "slug");
  if (!approvedDestinationSlugs.includes(slug) || asString(record.status) !== "published") {
    throw new DestinationDataError("An unpublished or unapproved destination was returned to the public site.");
  }

  const coverImage = getMedia(record.coverImage);
  const heroImage = getMedia(record.heroImage, "hero") ?? coverImage;
  if (!coverImage || !heroImage) throw new DestinationDataError(`The ${slug} destination requires a primary Media image and descriptive alt text.`);

  const highlights: DestinationHighlight[] = asRecords(record.highlights).map((item) => ({
    title: asString(item.title),
    description: asString(item.description),
    image: getMedia(item.image),
  })).filter((item) => item.title && item.description);

  const experiences = asRecords(record.experiences).map((item) => ({
    title: asString(item.title),
    description: asString(item.description),
    icon: asString(item.icon) || "sparkles",
  })).filter((item) => item.title && item.description);

  const information = asRecords(record.usefulInformation).map((item) => ({ label: asString(item.label), value: asString(item.value) }))
    .filter((item) => item.label && item.value);
  const gallery = asRecords(record.gallery).map((item) => getMedia(item)).filter((image): image is ImageSource => Boolean(image));
  const relatedDestinations = asRecords(record.relatedDestinations).map((item) => asString(item.slug))
    .filter((relatedSlug) => approvedDestinationSlugs.includes(relatedSlug) && relatedSlug !== slug);
  const seo = asRecord(record.seo);
  const overview = asString(record.overview) || readRichText(record.content);

  return {
    slug,
    title: requiredString(record.title, `${slug} title`),
    country: requiredString(record.country, `${slug} country`),
    regionOrCity: asString(record.regionOrCity),
    eyebrow: asString(record.eyebrow),
    summary: requiredString(record.summary, `${slug} summary`),
    heroImage,
    overview: requiredString(overview, `${slug} overview`),
    highlights,
    experiences,
    bestTimeToVisit: asString(record.bestTimeToVisit),
    usefulInformation: information,
    gallery,
    seoMetaTitle: asString(seo?.metaTitle) || `${asString(record.title)} Travel | LDC Travel`,
    seoMetaDescription: asString(seo?.metaDescription) || asString(record.summary),
    relatedDestinations,
    faqs: mapFaqs(record.faqs),
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

async function findLaunchMarket(payload: Awaited<ReturnType<(typeof import("payload"))["getPayload"]>>) {
  const marketResult = await payload.find({
    collection: "markets",
    where: { and: [{ code: { equals: getLaunchMarketCode() } }, { isActive: { equals: true } }, { isPublic: { equals: true } }] },
    limit: 1,
    depth: 0,
    overrideAccess: false,
  });
  const market = marketResult.docs[0];
  if (!market) throw new DestinationDataError("The public launch market is unavailable.");
  return market;
}

async function findPublishedDestinations(payload: Awaited<ReturnType<(typeof import("payload"))["getPayload"]>>, marketId: string) {
  const result = await payload.find({
    collection: "destinations",
    where: { and: [{ status: { equals: "published" } }, { markets: { in: [marketId] } }] },
    limit: 30,
    depth: 3,
    overrideAccess: false,
  });
  const records = result.docs.map(mapDestinationRecord);
  const bySlug = new Map(records.map((record) => [record.slug, record]));
  const ordered = approvedDestinationSlugs.map((slug) => bySlug.get(slug)).filter((item): item is DestinationDetailViewModel => Boolean(item));
  if (ordered.length !== approvedDestinationSlugs.length) throw new DestinationDataError("One or more approved destinations are not published for the public launch market.");
  return ordered;
}

async function getPayloadClient() {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
    if (process.env.NODE_ENV === "development") return null;
    throw new DestinationDataError("Destination CMS content is unavailable.");
  }
  const { getPayload } = await import("payload");
  const { default: config } = await import("../../payload.config");
  return getPayload({ config });
}

export async function getDestinationsData(): Promise<DestinationViewModel[]> {
  if (isUiPreviewMode()) return demoDestinations.map(mapListingItem);
  try {
    const payload = await getPayloadClient();
    if (!payload) return developmentFallback().map(mapListingItem);
    const market = await findLaunchMarket(payload);
    const destinations = await findPublishedDestinations(payload, String(market.id));
    return destinations.map(mapListingItem);
  } catch (error) {
    if (process.env.NODE_ENV !== "development") throw new DestinationDataError("Destination content is unavailable.", error);
    return developmentFallback().map(mapListingItem);
  }
}

export async function getDestinationData(slug: string): Promise<DestinationDetailViewModel | null> {
  if (!approvedDestinationSlugs.includes(slug)) return null;
  if (isUiPreviewMode()) return getDemoDestination(slug) ?? null;

  try {
    const payload = await getPayloadClient();
    if (!payload) return getDemoDestination(slug) ?? null;
    const market = await findLaunchMarket(payload);
    const result = await payload.find({
      collection: "destinations",
      where: { and: [{ slug: { equals: slug } }, { status: { equals: "published" } }, { markets: { in: [String(market.id)] } }] },
      limit: 1,
      depth: 3,
      overrideAccess: false,
    });
    const record = result.docs[0];
    return record ? mapDestinationRecord(record) : null;
  } catch (error) {
    if (process.env.NODE_ENV !== "development") throw new DestinationDataError("Destination content is unavailable.", error);
    return getDemoDestination(slug) ?? null;
  }
}

export function getRelatedDestinationItems(destination: DestinationDetailViewModel, destinations: DestinationViewModel[]) {
  return destination.relatedDestinations.map((slug) => destinations.find((item) => item.slug === slug))
    .filter((item): item is DestinationViewModel => Boolean(item)).slice(0, 2);
}
