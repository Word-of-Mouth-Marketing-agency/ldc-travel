import { createHash } from "node:crypto";
import { readFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
  throw new Error("Seed requires DATABASE_URL and PAYLOAD_SECRET from the explicitly selected environment.");
}
if (process.env.NODE_ENV === "production" && process.env.LDC_ALLOW_PRODUCTION_SEED !== "true") {
  throw new Error("Production seed is disabled. Set LDC_ALLOW_PRODUCTION_SEED=true only for an explicitly approved run.");
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const maxImageBytes = 5 * 1024 * 1024;
let mediaDirectory;
const mediaBySource = new Map();
const socialAccounts = {
  egypt: {
    instagram: "https://www.instagram.com/ldctravels.eg/",
    facebook: "https://www.facebook.com/profile.php?id=61591627376189",
  },
  saudi: {
    instagram: "https://www.instagram.com/elwajha_elraeda_travels/",
    facebook: "https://www.facebook.com/profile.php?id=61575912646557#",
  },
};
const officeData = {
  egypt: { label: "Egypt", address: "15 Mahmoud Essmat Hamdy, Sheraton", whatsappDisplay: "+20 12 11118118", whatsappNumber: "201211118118" },
  saudi: {
    label: "Saudi Arabia",
    address: ["18th Floor, Al Faisaliah Tower", "King Fahd Road, Al Olaya District", "P.O. Box 54995", "Riyadh 11524, Kingdom of Saudi Arabia"].join("\n"),
    whatsappDisplay: "+966 7277981053",
    whatsappNumber: "9667277981053",
  },
};

const { default: config } = await import("../payload.config.ts");
const { getPayload } = await import("payload");
const { demoHomepage } = await import("../src/content/homepage-demo.ts");
const { demoDestinations } = await import("../src/content/destinations.ts");
const { demoAboutPage, demoContactPage, demoDestinationsPage } = await import("../src/content/page-content-demo.ts");
const destinationContent = JSON.parse(await readFile(path.join(projectDir, "src", "content", "destinations-data.json"), "utf8"));
let payload;

async function findBy(collection, field, value) {
  const result = await payload.find({
    collection,
    where: { [field]: { equals: value } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });
  return result.docs[0];
}

function isEmpty(value) {
  return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function missingFields(existing, defaults) {
  const patch = {};
  const source = existing && typeof existing === "object" ? existing : {};
  for (const [key, defaultValue] of Object.entries(defaults)) {
    const current = source[key];
    if (isEmpty(current)) {
      patch[key] = defaultValue;
    } else if (current && typeof current === "object" && !Array.isArray(current) && defaultValue && typeof defaultValue === "object" && !Array.isArray(defaultValue)) {
      const nested = missingFields(current, defaultValue);
      if (Object.keys(nested).length) patch[key] = { ...current, ...nested };
    }
  }
  return patch;
}

function enrichRows(existingRows, defaultRows, matchKey = "title") {
  if (!Array.isArray(existingRows) || existingRows.length === 0) return defaultRows;
  const defaultsByKey = new Map(defaultRows.map((row) => [row[matchKey], row]));
  return existingRows.map((row) => {
    const defaults = defaultsByKey.get(row?.[matchKey]);
    return defaults ? { ...row, ...missingFields(row, defaults) } : row;
  });
}

function normalizeImageSource(source) {
  if (typeof source !== "string") throw new Error("An image source is missing from the reviewed seed content.");
  if (source.startsWith("/")) {
    const allowedLocal = new Set([
      "/hero-travel.webp",
      "/destinations/turkey.webp",
      "/destinations/thailand.webp",
      "/destinations/russia-st-isaacs.webp",
      "/brand/ldc-travel-primary.webp",
      "/brand/ldc-travel-white.webp",
    ]);
    if (!allowedLocal.has(source)) throw new Error("Seed local image source is not in the reviewed allowlist.");
    return { key: source, localPath: path.resolve(projectDir, "public", `.${source}`), sourceUrl: undefined };
  }

  const url = new URL(source);
  if (url.protocol !== "https:" || url.hostname !== "images.unsplash.com" || !/^\/photo-[A-Za-z0-9-]+$/.test(url.pathname)) {
    throw new Error("Seed remote images must be curated Unsplash CDN assets without redirects.");
  }
  const canonical = `${url.origin}${url.pathname}`;
  return { key: canonical, remoteUrl: `${canonical}?auto=format&fit=crop&w=2200&q=82`, sourceUrl: canonical };
}

function mimeExtension(mimeType) {
  const known = new Map([
    ["image/webp", ".webp"], ["image/jpeg", ".jpg"], ["image/png", ".png"], ["image/avif", ".avif"],
  ]);
  const extension = known.get(mimeType);
  if (!extension) throw new Error(`Seed image MIME type is not allowed: ${mimeType || "unknown"}.`);
  return extension;
}

async function getMedia(source, alt, options = {}) {
  const normalized = normalizeImageSource(source);
  const cached = mediaBySource.get(normalized.key);
  if (cached) return cached;

  const fingerprint = createHash("sha256").update(normalized.key).digest("hex").slice(0, 20);
  let known;
  for (const extension of [".webp", ".jpg", ".png", ".avif"]) {
    known = await findBy("media", "filename", `ldc-${fingerprint}${extension}`);
    if (known) break;
  }
  if (known) {
    mediaBySource.set(normalized.key, known.id);
    return known.id;
  }

  let bytes;
  let mimeType;
  let sourceUrl = normalized.sourceUrl;
  if (normalized.localPath) {
    bytes = await readFile(normalized.localPath);
    const extension = path.extname(normalized.localPath).toLowerCase();
    mimeType = extension === ".webp" ? "image/webp" : extension === ".png" ? "image/png" : "image/jpeg";
  } else {
    const response = await fetch(normalized.remoteUrl, { redirect: "error", signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Unable to import a reviewed Unsplash image (HTTP ${response.status}).`);
    mimeType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const announcedSize = Number(response.headers.get("content-length"));
    if (Number.isFinite(announcedSize) && announcedSize > maxImageBytes) {
      throw new Error("Seed image exceeds the configured 5 MiB media limit.");
    }
    const reader = response.body?.getReader();
    if (!reader) throw new Error("The reviewed image response had no readable body.");
    const chunks = [];
    let totalBytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        if (totalBytes > maxImageBytes) {
          await reader.cancel();
          throw new Error("Seed image exceeds the configured 5 MiB media limit.");
        }
        chunks.push(Buffer.from(value));
      }
    } finally {
      reader.releaseLock();
    }
    bytes = Buffer.concat(chunks, totalBytes);
  }
  if (bytes.byteLength > maxImageBytes) throw new Error("Seed image exceeds the configured 5 MiB media limit.");
  const extension = mimeExtension(mimeType);
  const filename = `ldc-${fingerprint}${extension}`;
  mediaDirectory ??= await mkdtemp(path.join(tmpdir(), "ldc-travel-seed-"));
  const filePath = path.join(mediaDirectory, filename);
  await writeFile(filePath, bytes, { flag: "wx" });

  const created = await payload.create({
    collection: "media",
    data: {
      alt,
      ...(options.credit ? { credit: options.credit } : {}),
      ...(sourceUrl ? { sourceUrl } : {}),
    },
    filePath,
    overrideAccess: true,
  });
  mediaBySource.set(normalized.key, created.id);
  console.log(`create media:${filename}`);
  return created.id;
}

function lexical(text) {
  return {
    root: {
      type: "root",
      children: [{ type: "paragraph", children: [{ type: "text", text, version: 1 }], direction: null, format: "", indent: 0, version: 1 }],
      direction: null,
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

async function ensureFaq(question, answer, order, category) {
  const existing = await findBy("faqs", "question", question);
  if (existing) return existing;
  const created = await payload.create({
    collection: "faqs",
    data: { question, answer: lexical(answer), order, enabled: true, category },
    overrideAccess: true,
  });
  console.log(`create FAQ:${category}`);
  return created;
}

async function ensureGlobal(slug, defaults, transform = (value) => value) {
  const existing = await payload.findGlobal({ slug, depth: 2, overrideAccess: true });
  const data = transform(missingFields(existing, defaults), existing);
  if (!Object.keys(data).length) {
    console.log(`skip global:${slug}; content already exists`);
    return existing;
  }
  const merged = { ...data };
  for (const [key, value] of Object.entries(data)) {
    const current = existing?.[key];
    if (current && typeof current === "object" && !Array.isArray(current) && value && typeof value === "object" && !Array.isArray(value)) {
      merged[key] = { ...current, ...value };
    }
  }
  const updated = await payload.updateGlobal({ slug, data: merged, overrideAccess: true });
  console.log(`enrich global:${slug}`);
  return updated;
}

try {
  payload = await getPayload({ config });
  let egypt = await findBy("markets", "code", "EG");
  if (!egypt) {
    egypt = await payload.create({
      collection: "markets",
      data: {
        name: "Egypt", code: "EG", locale: "en-EG", currency: { code: "EGP", symbol: "EGP" },
        isDefault: true, isActive: true, isPublic: true,
      },
      overrideAccess: true,
    });
    console.log("create market:EG");
  }
  const marketId = egypt.id;

  const heroMediaId = await getMedia(demoHomepage.hero.image.src, demoHomepage.hero.image.alt, { credit: "Unsplash" });
  const socialImageId = await getMedia(demoHomepage.site.defaultSocialImage, "International travel landscape for LDC Travel", { credit: "Unsplash" });
  const headerLogoId = await getMedia("/brand/ldc-travel-primary.webp", "LDC Travel logo on light backgrounds", { credit: "Client-supplied brand asset" });
  const footerLogoId = await getMedia("/brand/ldc-travel-white.webp", "LDC Travel white logo for dark backgrounds", { credit: "Client-supplied brand asset" });
  const aboutImageId = await getMedia(demoAboutPage.whoWeAre.image.src, demoAboutPage.whoWeAre.image.alt, { credit: "Client-supplied image asset" });

  const destinationMedia = new Map();
  for (const destination of destinationContent) {
    const demo = demoDestinations.find((item) => item.slug === destination.slug);
    const coverId = await getMedia(demo.heroImage.src, demo.heroImage.alt, { credit: demo.heroImage.src.startsWith("https:") ? "Unsplash" : "Client-supplied image asset" });
    const heroId = destination.heroImage
      ? await getMedia(destination.heroImage, destination.heroImageAlt ?? `${destination.title} destination landscape`, { credit: destination.heroImage.startsWith("https:") ? "Unsplash" : "Client-supplied image asset" })
      : coverId;
    const highlights = [];
    for (const highlight of destination.highlights) {
      highlights.push({
        title: highlight.title,
        description: highlight.description,
        image: await getMedia(highlight.image, highlight.alt, { credit: highlight.image.startsWith("https:") ? "Unsplash" : "Client-supplied image asset" }),
        alt: highlight.alt,
      });
    }
    const gallery = [];
    for (const image of destination.gallery) {
      gallery.push(await getMedia(image.image, image.alt, { credit: image.image.startsWith("https:") ? "Unsplash" : "Client-supplied image asset" }));
    }
    destinationMedia.set(destination.slug, { coverId, heroId, highlights, gallery });
  }

  const destinationDefaults = new Map();
  for (const destination of destinationContent) {
    const media = destinationMedia.get(destination.slug);
    const existing = await findBy("destinations", "slug", destination.slug);
    const defaultFaqs = [];
    const demo = demoDestinations.find((item) => item.slug === destination.slug);
    for (const [index, faq] of demo.faqs.entries()) {
      defaultFaqs.push(await ensureFaq(faq.question, faq.answer, index, destination.title));
    }
    const defaults = {
      title: destination.title,
      slug: destination.slug,
      country: destination.country,
      regionOrCity: destination.regionOrCity,
      eyebrow: destination.eyebrow,
      summary: destination.summary,
      overview: destination.overview,
      coverImage: media.coverId,
      heroImage: media.heroId,
      highlights: media.highlights,
      experiences: destination.experiences,
      bestTimeToVisit: destination.bestTimeToVisit,
      usefulInformation: destination.usefulInformation,
      gallery: media.gallery,
      featured: true,
      status: "published",
      markets: [marketId],
      relatedDestinations: (demo.relatedDestinations ?? []).map((slug) => slug),
      faqs: defaultFaqs.map((faq) => faq.id),
      seo: { metaTitle: destination.seoMetaTitle, metaDescription: destination.seoMetaDescription },
    };
    destinationDefaults.set(destination.slug, defaults);
    if (!existing) {
      const created = await payload.create({
        collection: "destinations",
        data: { ...defaults, relatedDestinations: [] },
        overrideAccess: true,
      });
      destinationDefaults.set(destination.slug, { ...defaults, id: created.id });
      console.log(`create destination:${destination.slug}`);
      continue;
    }

    // relatedDestinations defaults are slugs, while Payload expects document IDs.
    // Resolve that relationship in the second pass after all destination records exist.
    const mergeDefaults = Object.fromEntries(
      Object.entries(defaults).filter(([key]) => key !== "relatedDestinations"),
    );
    const patch = missingFields(existing, mergeDefaults);
    if (Array.isArray(existing.highlights) && existing.highlights.length) {
      const enrichedHighlights = enrichRows(existing.highlights, defaults.highlights);
      if (JSON.stringify(enrichedHighlights) !== JSON.stringify(existing.highlights)) patch.highlights = enrichedHighlights;
    }
    if (Array.isArray(existing.experiences) && existing.experiences.length) {
      const enrichedExperiences = enrichRows(existing.experiences, defaults.experiences);
      if (JSON.stringify(enrichedExperiences) !== JSON.stringify(existing.experiences)) patch.experiences = enrichedExperiences;
    }
    if (Object.keys(patch).length) {
      await payload.update({ collection: "destinations", id: existing.id, data: patch, overrideAccess: true });
      console.log(`enrich destination:${destination.slug}`);
    } else {
      console.log(`skip destination:${destination.slug}; editor content preserved`);
    }
    destinationDefaults.set(destination.slug, { ...defaults, id: existing.id });
  }

  const destinationRecords = new Map();
  for (const destination of destinationContent) {
    const record = await findBy("destinations", "slug", destination.slug);
    if (!record) throw new Error(`Seed failed to create destination ${destination.slug}.`);
    destinationRecords.set(destination.slug, record);
  }
  for (const destination of destinationContent) {
    const record = destinationRecords.get(destination.slug);
    const defaults = destinationDefaults.get(destination.slug);
    const patch = {};
    if (isEmpty(record.relatedDestinations)) patch.relatedDestinations = defaults.relatedDestinations.map((slug) => destinationRecords.get(slug)?.id).filter(Boolean);
    if (isEmpty(record.faqs)) patch.faqs = defaults.faqs;
    if (Object.keys(patch).length) await payload.update({ collection: "destinations", id: record.id, data: patch, overrideAccess: true });
  }

  const homepageFaqs = [];
  for (const [index, faq] of demoHomepage.faqs.entries()) {
    homepageFaqs.push(await ensureFaq(faq.question, faq.answer, index, "Homepage"));
  }

  const homepageDefaults = {
    hero: {
      eyebrow: demoHomepage.hero.eyebrow,
      headline: demoHomepage.hero.headline,
      supportingCopy: demoHomepage.hero.supportingCopy,
      image: heroMediaId,
      primaryCta: { label: demoHomepage.hero.primaryCta.label, kind: "internal", url: demoHomepage.hero.primaryCta.href },
      secondaryCta: { label: demoHomepage.hero.secondaryCta.label, kind: "whatsapp" },
    },
    destinationsSection: demoHomepage.destinationsSection,
    featuredDestinations: destinationContent.map((destination) => destinationRecords.get(destination.slug).id),
    whyLdc: demoHomepage.whyLdc,
    inspiration: {
      eyebrow: demoHomepage.inspiration.eyebrow,
      headline: demoHomepage.inspiration.headline,
      description: demoHomepage.inspiration.description,
      items: demoHomepage.inspiration.items.map((item) => ({
        title: item.title, label: item.label, description: item.description,
        destination: destinationRecords.get(item.destinationSlug).id,
        href: item.href,
      })),
    },
    destinationCta: {
      eyebrow: demoHomepage.destinationCta.eyebrow,
      headline: demoHomepage.destinationCta.headline,
      description: demoHomepage.destinationCta.description,
      primaryCta: { label: demoHomepage.destinationCta.primaryCta.label, kind: "internal", url: demoHomepage.destinationCta.primaryCta.href },
      secondaryCta: { label: demoHomepage.destinationCta.secondaryCta.label, kind: "whatsapp" },
      form: demoHomepage.destinationCta.form,
    },
    faqSection: demoHomepage.faqSection,
    faqs: homepageFaqs.map((faq) => faq.id),
    seo: { metaTitle: demoHomepage.seo.title, metaDescription: demoHomepage.seo.description, socialImage: socialImageId },
  };
  await ensureGlobal("homepage", homepageDefaults, (patch, existing) => {
    const output = { ...patch };
    const existingInspiration = existing.inspiration?.items;
    if (Array.isArray(existingInspiration) && existingInspiration.length) {
      const enriched = enrichRows(existingInspiration, homepageDefaults.inspiration.items);
      if (JSON.stringify(enriched) !== JSON.stringify(existingInspiration)) {
        output.inspiration = { ...existing.inspiration, items: enriched };
      }
    }
    return output;
  });

  const siteDefaults = {
    siteName: demoHomepage.site.name,
    tagline: demoHomepage.site.tagline,
    defaultMarket: marketId,
    publicEmail: demoHomepage.site.publicEmail,
    contact: {
      egyptOffice: officeData.egypt,
      saudiOfficeDetails: officeData.saudi,
      whatsappDisplay: officeData.saudi.whatsappDisplay,
      whatsappNumber: officeData.saudi.whatsappNumber,
      office: officeData.egypt.address,
      saudiOffice: officeData.saudi.address,
      reservationsEmail: demoHomepage.site.publicEmail,
      salesEmail: demoHomepage.site.publicEmail,
    },
    socials: socialAccounts,
    branding: { primaryLogo: headerLogoId, footerLogo: footerLogoId },
    whatsapp: { defaultMessage: demoHomepage.site.defaultMessage, contextTemplate: demoHomepage.site.contextTemplate },
    socialLinks: demoHomepage.site.socialLinks.filter((item) => ["instagram", "facebook"].includes(item.label.toLowerCase())),
    footerCopy: demoHomepage.site.footerCopy,
    seo: { metaTitle: demoHomepage.site.defaultMetaTitle, metaDescription: demoHomepage.site.defaultMetaDescription, socialImage: socialImageId },
  };
  await ensureGlobal("site-settings", siteDefaults, (patch, existing) => {
    if (String(existing.defaultMarket?.id ?? existing.defaultMarket ?? "") !== String(marketId)) patch.defaultMarket = marketId;
    const currentContact = existing.contact && typeof existing.contact === "object" ? existing.contact : {};
    if (/[\u0600-\u06ff]/u.test(String(currentContact.saudiOffice ?? ""))) {
      patch.contact = { ...(patch.contact ?? {}), saudiOffice: officeData.saudi.address };
    }
    const oldSocials = existing.socialLinks;
    if (Array.isArray(oldSocials) && oldSocials.some((item) => !["instagram", "facebook"].includes(String(item.label).toLowerCase()))) {
      patch.socialLinks = siteDefaults.socialLinks;
    }
    return patch;
  });

  const aboutDefaults = {
    masthead: demoAboutPage.masthead,
    whoWeAre: {
      eyebrow: demoAboutPage.whoWeAre.eyebrow,
      headline: demoAboutPage.whoWeAre.headline,
      paragraphs: demoAboutPage.whoWeAre.paragraphs.map((text) => ({ text })),
      image: aboutImageId,
      imageCaption: demoAboutPage.whoWeAre.imageCaption,
      imageTitle: demoAboutPage.whoWeAre.imageTitle,
    },
    approach: {
      eyebrow: demoAboutPage.approach.eyebrow, headline: demoAboutPage.approach.headline,
      description: demoAboutPage.approach.description, principles: demoAboutPage.approach.principles.map((label) => ({ label })),
    },
    support: demoAboutPage.support,
    destinationStories: {
      eyebrow: demoAboutPage.destinationStories.eyebrow,
      headline: demoAboutPage.destinationStories.headline,
      description: demoAboutPage.destinationStories.description,
      items: demoAboutPage.destinationStories.items.map((item) => ({ destination: destinationRecords.get(item.href.split("/").at(-1)).id, label: item.label })),
    },
    process: demoAboutPage.process,
    cta: demoAboutPage.cta,
    seo: { metaTitle: demoAboutPage.seo.metaTitle, metaDescription: demoAboutPage.seo.metaDescription, socialImage: socialImageId },
  };
  await ensureGlobal("about-page", aboutDefaults);

  const contactDefaults = {
    masthead: demoContactPage.masthead,
    form: demoContactPage.form,
    details: demoContactPage.details,
    social: demoContactPage.social,
    seo: { metaTitle: demoContactPage.seo.metaTitle, metaDescription: demoContactPage.seo.metaDescription, socialImage: socialImageId },
  };
  await ensureGlobal("contact-page", contactDefaults);

  const destinationsPageDefaults = {
    masthead: demoDestinationsPage.masthead,
    listing: demoDestinationsPage.listing,
    support: demoDestinationsPage.support,
    seo: { metaTitle: demoDestinationsPage.seo.metaTitle, metaDescription: demoDestinationsPage.seo.metaDescription, socialImage: socialImageId },
  };
  await ensureGlobal("destinations-page", destinationsPageDefaults);

  console.log("LDC Travel CMS seed complete. No users or inquiries were created; existing non-empty editor content was preserved.");
} finally {
  if (payload) {
    try { await payload.destroy(); } catch { /* Preserve the original seed failure if shutdown also fails. */ }
  }
  if (mediaDirectory) await rm(mediaDirectory, { recursive: true, force: true });
}
