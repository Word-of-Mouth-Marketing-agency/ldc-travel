if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
  console.error("Seed requires DATABASE_URL and PAYLOAD_SECRET in the local environment.");
  process.exit(1);
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const heroImagePath = "/hero-travel.webp";
const { default: config } = await import("../payload.config.ts");
const { getPayload } = await import("payload");

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
    whatsapp: "+20 12 11118118",
  },
});

const marketId = egypt.id;
const destinationSeeds = [
  ["turkey", { title: "Turkey", country: "Türkiye", regionOrCity: "Istanbul and beyond", summary: "Where layered history meets bright coastlines and generous hospitality.", imageUrl: image("photo-1524231757912-21f4fe3a7200"), featured: true }],
  ["russia", { title: "Russia", country: "Russia", regionOrCity: "Moscow and St Petersburg", summary: "Grand city squares, rich culture, and stories around every corner.", imageUrl: image("photo-1513326738677-b964603b136d"), featured: true }],
  ["bali", { title: "Bali", country: "Indonesia", regionOrCity: "Ubud and the coast", summary: "A restorative mix of green terraces, temple calm, and island energy.", imageUrl: image("photo-1537996194471-e657df975ab4"), featured: true }],
  ["georgia", { title: "Georgia", country: "Georgia", regionOrCity: "Tbilisi and the Caucasus", summary: "Mountain horizons, warm streets, and a culture made for slow discovery.", imageUrl: image("photo-1569396116180-210c182bedb8"), featured: true }],
  ["indonesia", { title: "Indonesia", country: "Indonesia", regionOrCity: "Java, Bali, and beyond", summary: "Island landscapes, ancient places, and vivid everyday life.", imageUrl: image("photo-1548013146-72479768bada"), featured: true }],
  ["thailand", { title: "Thailand", country: "Thailand", regionOrCity: "Bangkok and the islands", summary: "Street-side flavor, temple mornings, and blue-water escapes.", imageUrl: image("photo-1508009603885-50cf7c579365"), featured: true }],
];

const destinations = {};
for (const [slug, data] of destinationSeeds) {
  destinations[slug] = await ensure("destinations", "slug", slug, { ...data, slug, status: "published", markets: [marketId] });
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
  contextTemplate: "Hi LDC Travel, I'm interested in exploring {{title}}. Please share more information.",
};

if (!siteSettings.siteName) {
  await payload.updateGlobal({ slug: "site-settings", data: {
    siteName: "LDC Travel",
    tagline: "Tourism Marketing",
    defaultMarket: marketId,
    canonicalUrl: siteUrl,
    contact: { whatsappDisplay: "+20 12 11118118", whatsappNumber: "201211118118", office: "15 Mahmoud Essmat Hamdy, Sheraton", reservationsEmail: "reservations@ldc-tourism.com", salesEmail: "sales@ldc-tourism.com" },
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
  const legacyMessage = `${currentWhatsapp.defaultMessage ?? ""} ${currentWhatsapp.contextTemplate ?? ""}`.toLowerCase();
  if (legacyMessage.includes("program") || legacyMessage.includes("package")) {
    await payload.updateGlobal({ slug: "site-settings", data: { whatsapp: destinationWhatsapp } });
    console.log("migrate global:site-settings whatsapp copy");
  } else {
    console.log("skip global:site-settings");
  }
}

const homepage = await payload.findGlobal({ slug: "homepage", depth: 0 });
const currentHero = homepage.hero && typeof homepage.hero === "object" ? homepage.hero : {};
const oldHomepageHeadline = currentHero.headline === "Explore the world with LDC Travel";
const needsHomepageMigration = !homepage.hero || oldHomepageHeadline || !homepage.whyLdc || !homepage.inspiration;

if (needsHomepageMigration) {
  await payload.updateGlobal({ slug: "homepage", data: {
    hero: {
      eyebrow: "Travel farther, thoughtfully",
      headline: "Explore more. Travel better.",
      supportingCopy: "Discover inspiring destinations and start a conversation with a team that helps you travel with confidence.",
      imageUrl: heroImagePath,
      primaryCta: { label: "Explore destinations", kind: "internal", url: "#destinations" },
      secondaryCta: { label: "Talk to LDC Travel", kind: "whatsapp" },
    },
    featuredDestinations: destinationSeeds.map(([slug]) => destinations[slug].id),
    whyLdc: {
      eyebrow: "Why travel with LDC",
      headline: "A clearer way to choose your next destination.",
      description: "We make the first step feel easy: discover the places that fit your mood, ask the questions that matter, and move forward with a real person on your side.",
      items: [
        { title: "Destination-first thinking", description: "Start with the feeling, landscape, and culture you want to experience.", icon: "globe" },
        { title: "Guidance that feels personal", description: "Share your priorities and get a thoughtful starting point for your journey.", icon: "compass" },
        { title: "A simple human conversation", description: "No complicated process. Just clear answers when you are ready.", icon: "message" },
      ],
    },
    inspiration: {
      eyebrow: "Find your kind of escape",
      headline: "Let the destination set the pace.",
      description: "From old cities to open landscapes, follow the kind of experience you want more of.",
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
      description: "Have a destination in mind or still choosing? Send a message and we will help you find the right direction.",
      primaryCta: { label: "Explore destinations", kind: "internal", url: "#destinations" },
      secondaryCta: { label: "Start a conversation", kind: "whatsapp" },
    },
    faqs: faqs.map((item) => item.id),
  } });
  console.log("migrate global:homepage to destination-first content");
} else {
  console.log("skip global:homepage; existing editorial homepage preserved");
}

await payload.destroy();
console.log("LDC Travel destination-first demo seed complete. Legacy collections were not deleted.");
