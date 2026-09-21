import { readFile } from "node:fs/promises";

if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
  console.error("Seed requires DATABASE_URL and PAYLOAD_SECRET in the local environment.");
  process.exit(1);
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const heroImagePath = "/hero-travel.webp";
const { default: config } = await import("../payload.config.ts");
const { getPayload } = await import("payload");
const destinationContent = JSON.parse(await readFile(new URL("../src/content/destinations-data.json", import.meta.url), "utf8"));

const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

const lexical = (text) => ({
  root: {
    type: "root",
    children: [{ type: "paragraph", children: [{ type: "text", text, version: 1 }], direction: null, format: "", indent: 0, version: 1 }],
    direction: null,
    format: "",
    indent: 0,
    version: 1,
  },
});

async function findBy(collection, field, value) {
  const result = await payload.find({ collection, where: { [field]: { equals: value } }, limit: 1, depth: 0 });
  return result.docs[0];
}

async function ensure(collection, field, value, data) {
  const existing = await findBy(collection, field, value);
  if (existing) {
    console.log(`skip ${collection}:${value}`);
    return existing;
  }

  const created = await payload.create({ collection, data });
  console.log(`create ${collection}:${value}`);
  return created;
}

const payload = await getPayload({ config });

const egypt = await ensure("markets", "code", "EG", {
  name: "Egypt",
  code: "EG",
  locale: "en-EG",
  currency: { code: "EGP", symbol: "EGP" },
  isDefault: true,
  isActive: true,
  isPublic: true,
  contact: {
    office: "15 Mahmoud Essmat Hamdy, Sheraton",
    reservationsEmail: "reservations@ldc-tourism.com",
    salesEmail: "sales@ldc-tourism.com",
    whatsapp: "+966 7277981053",
  },
});

const marketId = egypt.id;
const destinationRelations = {
  turkey: ["georgia", "russia"],
  russia: ["turkey", "georgia"],
  bali: ["indonesia", "thailand"],
  georgia: ["turkey", "russia"],
  indonesia: ["bali", "thailand"],
  thailand: ["bali", "turkey"],
};
const destinationSeeds = destinationContent.map((destination) => [destination.slug, {
  title: destination.title,
  country: destination.country,
  regionOrCity: destination.regionOrCity,
  summary: destination.summary,
  overview: destination.overview,
  imageUrl: destination.highlights[0].image,
  highlights: destination.highlights.map(({ title, description, image: imageUrl, alt }) => ({ title, description, imageUrl, alt })),
  experiences: destination.experiences,
  bestTimeToVisit: destination.bestTimeToVisit,
  usefulInformation: destination.usefulInformation,
  featured: true,
  seo: { metaTitle: destination.seoMetaTitle, metaDescription: destination.seoMetaDescription },
}]);

const legacyEditorialSignatures = {
  turkey: {
    summary: "Layered history, dramatic landscapes, and a Mediterranean rhythm that changes from city to coast.",
    overview: "Turkey brings together the energy of Istanbul, the sculpted valleys of Cappadocia, and a long coastline shaped by light, water, and ancient stories. It is a destination for travelers who want culture and contrast in the same journey.",
    bestTimeToVisit: "Spring and autumn are often comfortable for city walks, cultural visits, and inland exploration. Summer suits the coast, while Cappadocia and higher inland areas can feel very different from the shoreline.",
  },
  russia: {
    summary: "Monumental cityscapes, celebrated museums, and a cultural journey with a strong sense of place.",
    overview: "Russia's classic city route moves between Moscow's historic centre and Saint Petersburg's water-shaped architectural landscape. The experience is rich in museums, public squares, theatres, palaces, and layers of cultural history.",
    bestTimeToVisit: "The most suitable season depends on the route and experience you want. Warmer months support long city walks and riverfront time, while winter brings a different atmosphere and requires more careful planning for weather.",
  },
  bali: {
    summary: "Green terraces, temple calm, warm coastlines, and a culture that invites you to slow down.",
    overview: "Bali brings together natural beauty, cultural heritage, and a relaxed island rhythm. From Ubud's artistic centre to rice terraces, beaches, and temples by the sea, the island rewards travelers who leave room for both discovery and pause.",
    bestTimeToVisit: "The drier months are generally popular for outdoor plans, while the wetter season can bring lush landscapes and shorter, more flexible outings. Local conditions vary across the island and by activity.",
  },
  georgia: {
    summary: "Old streets, mountain horizons, generous tables, and a destination with many different moods.",
    overview: "Georgia sits at a crossroads of Europe and Asia, bringing together a lively capital, Caucasus landscapes, Black Sea air, and a deep food and wine culture. It is compact enough to feel connected while changing character from region to region.",
    bestTimeToVisit: "Georgia spans several landscapes and climates, so the best period depends on your route. Spring and autumn are inviting for cities, food, and walking; summer opens more mountain routes, while winter suits snow experiences in selected regions.",
  },
  indonesia: {
    summary: "A broader Indonesian journey through ancient places, volcanic landscapes, creative cities, and island life.",
    overview: "Indonesia is much larger than any single island. A destination-first journey can move through Java's cultural centres, volcanic landscapes, historic cities, and the different rhythms of islands such as Lombok, while keeping Bali as its own distinct destination.",
    bestTimeToVisit: "Indonesia's scale means weather varies by island and activity. Drier months are often preferred for outdoor routes, but the best timing should be matched to the specific islands and experiences you want to include.",
  },
  thailand: {
    summary: "Temple mornings, street-side flavour, creative city energy, and coastlines made for a change of pace.",
    overview: "Thailand offers an easy-to-love mix of city life, cultural landmarks, northern landscapes, and islands. A well-shaped route can move from Bangkok's energy to Chiang Mai's slower rhythm and then toward the sea.",
    bestTimeToVisit: "Thailand varies by region and coast, with seasonal differences that matter for city, mountain, and island plans. A route should be timed around the specific regions you want rather than one nationwide season assumption.",
  },
};

function matchesLegacyEditorialCopy(existing, slug) {
  const signature = legacyEditorialSignatures[slug];
  return Boolean(signature && existing.summary === signature.summary && existing.overview === signature.overview && existing.bestTimeToVisit === signature.bestTimeToVisit);
}

const legacyBrokenImageUrls = [
  "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?auto=format&fit=crop&w=1200&q=85",
];

const destinations = {};
for (const [slug, data] of destinationSeeds) {
  const existing = await findBy("destinations", "slug", slug);
  if (!existing) {
    destinations[slug] = await payload.create({ collection: "destinations", data: { ...data, slug, status: "published", markets: [marketId] } });
    console.log(`create destinations:${slug}`);
    continue;
  }

  const missingDetailFields = {};
  const safeEditorialRefresh = matchesLegacyEditorialCopy(existing, slug);
  const needsImageRefresh = legacyBrokenImageUrls.some((url) => JSON.stringify(existing).includes(url));
  for (const field of ["overview", "highlights", "experiences", "bestTimeToVisit", "usefulInformation", "seo"]) {
    if (safeEditorialRefresh || existing[field] == null || (Array.isArray(existing[field]) && existing[field].length === 0)) missingDetailFields[field] = data[field];
  }
  if (safeEditorialRefresh || !existing.imageUrl) missingDetailFields.imageUrl = data.imageUrl;
  if (needsImageRefresh) {
    missingDetailFields.highlights = data.highlights;
    missingDetailFields.gallery = data.gallery;
  }
  if (Object.keys(missingDetailFields).length) {
    destinations[slug] = await payload.update({ collection: "destinations", id: existing.id, data: missingDetailFields });
    console.log(`enrich destinations:${slug}`);
  } else {
    destinations[slug] = existing;
    console.log(`skip destinations:${slug}`);
  }
}

for (const [slug, relatedSlugs] of Object.entries(destinationRelations)) {
  const destination = destinations[slug];
  if (destination && (!destination.relatedDestinations || destination.relatedDestinations.length === 0)) {
    await payload.update({ collection: "destinations", id: destination.id, data: { relatedDestinations: relatedSlugs.map((relatedSlug) => destinations[relatedSlug].id) } });
  }
}

const faqSeeds = [
  ["How do I start planning with LDC Travel?", "Start with a WhatsApp message or the contact form. Tell us which destination interests you and what kind of experience you are imagining."],
  ["Can you help if I am still choosing a destination?", "Yes. Share the mood, pace, and kind of places you enjoy, and our team can suggest a useful direction to explore."],
  ["Do you arrange custom travel requests?", "We can discuss a destination-specific request and the details that matter to you before outlining the next step."],
  ["What happens after I send an inquiry?", "A member of the LDC Travel team will follow up directly to understand your request and answer your questions."],
  ["Can I ask about a destination that is not listed yet?", "Absolutely. The destinations shown here are our current focus, but you can still message us with another idea and we will let you know how we can help."],
];
const faqs = [];
for (const [index, [question, answer]] of faqSeeds.entries()) {
  const existing = await payload.find({ collection: "faqs", where: { question: { equals: question } }, limit: 1, depth: 0 });
  faqs.push(existing.docs[0] ?? await payload.create({ collection: "faqs", data: { question, answer: lexical(answer), order: index, enabled: true, category: "Homepage" } }));
}

const siteSettings = await payload.findGlobal({ slug: "site-settings", depth: 0 });
const destinationWhatsapp = {
  defaultMessage: "Hi LDC Travel, I'd like to explore one of your destinations.",
  contextTemplate: "Hi LDC Travel, I'm interested in {{title}} and would like more information.",
};

if (!siteSettings.siteName) {
  await payload.updateGlobal({ slug: "site-settings", data: {
    siteName: "LDC Travel",
    tagline: "Tourism Marketing",
    defaultMarket: marketId,
    canonicalUrl: siteUrl,
    contact: { whatsappDisplay: "+966 7277981053", whatsappNumber: "9667277981053", office: "15 Mahmoud Essmat Hamdy, Sheraton", reservationsEmail: "reservations@ldc-tourism.com", salesEmail: "sales@ldc-tourism.com" },
    whatsapp: destinationWhatsapp,
    footerCopy: "Thoughtful destination guidance for travelers ready to see more of the world.",
    socialLinks: [
      { label: "Instagram", url: "https://www.instagram.com/ldctravels.eg/" },
      { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61591627376189" },
      { label: "TikTok", url: "https://www.tiktok.com/@ldc.travel.agency" },
      { label: "LinkedIn", url: "https://www.linkedin.com/company/ldctravel/" },
    ],
  } });
  console.log("create global:site-settings");
} else {
  const currentWhatsapp = siteSettings.whatsapp && typeof siteSettings.whatsapp === "object" ? siteSettings.whatsapp : {};
  const currentContact = siteSettings.contact && typeof siteSettings.contact === "object" ? siteSettings.contact : {};
  const currentNumber = String(currentContact.whatsappNumber ?? "");
  const knownLegacyNumbers = new Set(["", "201211118118", "+20 12 11118118", "7277981053"]);
  const legacyMessage = `${currentWhatsapp.defaultMessage ?? ""} ${currentWhatsapp.contextTemplate ?? ""}`.toLowerCase();
  const shouldUpdateCopy = legacyMessage.includes("program") || legacyMessage.includes("package") || !currentWhatsapp.contextTemplate;
  const shouldUpdateNumber = knownLegacyNumbers.has(currentNumber);
  if (shouldUpdateCopy || shouldUpdateNumber) {
    await payload.updateGlobal({ slug: "site-settings", data: {
      ...(shouldUpdateNumber ? { contact: { ...currentContact, whatsappDisplay: "+966 7277981053", whatsappNumber: "9667277981053" } } : {}),
      ...(shouldUpdateCopy ? { whatsapp: destinationWhatsapp } : {}),
    } });
    console.log("migrate global:site-settings destination WhatsApp configuration");
  } else {
    console.log("skip global:site-settings; newer WhatsApp value preserved");
  }
}

const homepage = await payload.findGlobal({ slug: "homepage", depth: 0 });
const currentHero = homepage.hero && typeof homepage.hero === "object" ? homepage.hero : {};
const currentHeroPrimaryCta = currentHero.primaryCta && typeof currentHero.primaryCta === "object" ? currentHero.primaryCta : {};
const currentHeroSecondaryCta = currentHero.secondaryCta && typeof currentHero.secondaryCta === "object" ? currentHero.secondaryCta : {};
const currentDestinationCta = homepage.destinationCta && typeof homepage.destinationCta === "object" ? homepage.destinationCta : {};
const currentDestinationPrimaryCta = currentDestinationCta.primaryCta && typeof currentDestinationCta.primaryCta === "object" ? currentDestinationCta.primaryCta : {};
const currentDestinationSecondaryCta = currentDestinationCta.secondaryCta && typeof currentDestinationCta.secondaryCta === "object" ? currentDestinationCta.secondaryCta : {};
const oldHomepageHeadline = currentHero.headline === "Explore the world with LDC Travel";
const hasRequiredHeroContent = [currentHero.eyebrow, currentHero.headline, currentHero.supportingCopy, currentHeroPrimaryCta.label, currentHeroSecondaryCta.label].every((value) => typeof value === "string" && value.trim());
const hasRequiredDestinationCta = [currentDestinationPrimaryCta.label, currentDestinationSecondaryCta.label].every((value) => typeof value === "string" && value.trim());
const legacyHomepageCopy = [
  currentHero.supportingCopy === "Discover inspiring destinations and start a conversation with a team that helps you travel with confidence.",
  homepage.whyLdc?.description === "We make the first step feel easy: discover the places that fit your mood, ask the questions that matter, and move forward with a real person on your side.",
  homepage.inspiration?.description === "From old cities to open landscapes, follow the kind of experience you want more of.",
  currentDestinationCta.description === "Have a destination in mind or still choosing? Send a message and we will help you find the right direction.",
].every(Boolean);
const needsHomepageMigration = !hasRequiredHeroContent || oldHomepageHeadline || !homepage.whyLdc || !homepage.inspiration || !hasRequiredDestinationCta || legacyHomepageCopy;
const needsHomepageRelationships = !Array.isArray(homepage.featuredDestinations) || homepage.featuredDestinations.length === 0 || !Array.isArray(homepage.faqs) || homepage.faqs.length === 0;

if (needsHomepageMigration) {
  await payload.updateGlobal({ slug: "homepage", data: {
    hero: {
      eyebrow: "Travel farther, thoughtfully",
      headline: "Explore more. Travel better.",
      supportingCopy: "Explore six distinctive destinations, then talk with LDC Travel about the places, pace, and experiences you want to build around.",
      imageUrl: heroImagePath,
      primaryCta: { label: "Explore destinations", kind: "internal", url: "/destinations" },
      secondaryCta: { label: "Talk to LDC Travel", kind: "whatsapp" },
    },
    featuredDestinations: destinationSeeds.map(([slug]) => destinations[slug].id),
    whyLdc: {
      eyebrow: "Why travel with LDC",
      headline: "A clearer way to choose your next destination.",
      description: "Move from inspiration to a clearer destination conversation. Tell us what matters to you, ask the questions that matter, and take the next step with a real person.",
      items: [
        { title: "Start with the destination", description: "Begin with the landscape, culture, or pace you want to experience.", icon: "globe" },
        { title: "Guidance with context", description: "Share your priorities and get a useful direction for the next conversation.", icon: "compass" },
        { title: "A clear human follow-up", description: "Send your details or a WhatsApp message, and our team will respond with the next step.", icon: "message" },
      ],
    },
    inspiration: {
      eyebrow: "Find your kind of escape",
      headline: "Let the destination set the pace.",
      description: "From old cities to open landscapes, start with the kind of experience you want more of.",
      items: [
        { title: "Culture", label: "Stories in every street", description: "For travelers who want art, history, food, and a strong sense of place.", imageUrl: image("photo-1524231757912-21f4fe3a7200") },
        { title: "Nature", label: "Room to breathe", description: "Mountain air, green valleys, and landscapes that invite you to slow down.", imageUrl: image("photo-1569396116180-210c182bedb8") },
        { title: "Islands", label: "Blue-water days", description: "A warmer rhythm of coastlines, sunlight, and time well spent outdoors.", imageUrl: image("photo-1537996194471-e657df975ab4") },
        { title: "City energy", label: "A little more alive", description: "For the nights, neighborhoods, and small discoveries that stay with you.", imageUrl: image("photo-1508009603885-50cf7c579365") },
      ],
    },
    destinationCta: {
      eyebrow: "Your next chapter starts here",
      headline: "Tell us where you want to go.",
      description: "Have a destination in mind or still choosing? Send your details and the LDC Travel team will follow up with a useful direction.",
      primaryCta: { label: "Explore destinations", kind: "internal", url: "/destinations" },
      secondaryCta: { label: "Start a conversation", kind: "whatsapp" },
    },
    faqs: faqs.map((item) => item.id),
  } });
  console.log("migrate global:homepage to destination-first content");
} else {
  if (needsHomepageRelationships) {
    await payload.updateGlobal({ slug: "homepage", data: {
      ...(Array.isArray(homepage.featuredDestinations) && homepage.featuredDestinations.length ? {} : { featuredDestinations: destinationSeeds.map(([slug]) => destinations[slug].id) }),
      ...(Array.isArray(homepage.faqs) && homepage.faqs.length ? {} : { faqs: faqs.map((item) => item.id) }),
    } });
    console.log("enrich global:homepage with destination and FAQ relationships");
  } else {
    console.log("skip global:homepage; existing editorial homepage preserved");
  }
}

await payload.destroy();
console.log("LDC Travel destination-first demo seed complete. Legacy collections were not deleted.");
