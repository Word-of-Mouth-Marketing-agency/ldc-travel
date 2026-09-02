if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
  console.error("Seed requires DATABASE_URL and PAYLOAD_SECRET in the local environment.");
  process.exit(1);
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
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
  ["cairo", { title: "Cairo", country: "Egypt", regionOrCity: "Cairo", summary: "Layered history, generous hospitality, and a city that stays awake.", imageUrl: image("photo-1503177119275-0aa32b3a9368"), featured: true }],
  ["paris", { title: "Paris", country: "France", regionOrCity: "Paris", summary: "Art, food, and unforgettable city walks.", imageUrl: image("photo-1502602898657-3e91760cbb34"), featured: true }],
  ["maldives", { title: "Maldives", country: "Maldives", regionOrCity: "Malé Atoll", summary: "Slow mornings on clear water and white sand.", imageUrl: image("photo-1514282401047-d79a71a590e8"), featured: true }],
  ["dubai", { title: "Dubai", country: "United Arab Emirates", regionOrCity: "Dubai", summary: "Skyline energy, desert calm, and modern luxury.", imageUrl: image("photo-1512453979798-5ea266f8880c"), featured: true }],
  ["cappadocia", { title: "Cappadocia", country: "Türkiye", regionOrCity: "Göreme", summary: "Valleys, cave towns, and sunrise balloons.", imageUrl: image("photo-1528181304800-259b08848526"), featured: true }],
  ["bangkok", { title: "Bangkok", country: "Thailand", regionOrCity: "Bangkok", summary: "Temple mornings, street food, and river nights.", imageUrl: image("photo-1508009603885-50cf7c579365"), featured: true }],
  ["santorini", { title: "Santorini", country: "Greece", regionOrCity: "Cyclades", summary: "Blue domes, bright water, and unhurried island days.", imageUrl: image("photo-1570077188670-e3a8d69ac5ff"), featured: false }],
  ["zurich", { title: "Zurich", country: "Switzerland", regionOrCity: "Zurich", summary: "Lakeside calm with easy routes into the Alps.", imageUrl: image("photo-1530789253388-582c481c54b0"), featured: false }],
  ["bali", { title: "Bali", country: "Indonesia", regionOrCity: "Ubud", summary: "Green terraces, warm water, and room to breathe.", imageUrl: image("photo-1537996194471-e657df975ab4"), featured: false }],
  ["phuket", { title: "Phuket", country: "Thailand", regionOrCity: "Phuket", summary: "Bright beaches, private sightseeing, and easy island days.", imageUrl: image("photo-1507525428034-b723cf961d3e"), featured: false }],
  ["istanbul", { title: "Istanbul", country: "Turkey", regionOrCity: "Istanbul", summary: "Historic streets, Bosphorus views, and a well-paced city stay.", imageUrl: image("photo-1524231757912-21f4fe3a7200"), featured: false }],
  ["georgia", { title: "Georgia", country: "Georgia", regionOrCity: "Tbilisi, Batumi, and Bakuriani", summary: "A three-stop journey across Tbilisi, Batumi, and Bakuriani.", imageUrl: image("photo-1569396116180-210c182bedb8"), featured: false }],
  ["trabzon", { title: "Trabzon", country: "Turkey", regionOrCity: "Trabzon", summary: "Black Sea scenery, guided sightseeing, and a comfortable stay.", imageUrl: image("photo-1530789253388-582c481c54b0"), featured: false }],
  ["indonesia", { title: "Indonesia", country: "Indonesia", regionOrCity: "Jakarta and Bali", summary: "A Jakarta and Bali escape with two distinct stays.", imageUrl: image("photo-1537996194471-e657df975ab4"), featured: false }],
];

const destinations = {};
for (const [slug, data] of destinationSeeds) {
  destinations[slug] = await ensure("destinations", "slug", slug, { ...data, slug, status: "published", markets: [marketId] });
}

const programSeeds = [
  ["phuket-thailand", { title: "Phuket", summary: "Andakira Hotel Phuket Patong · Breakfast · 4 private sightseeing tours", destinations: [destinations.phuket.id], durationDays: 6, durationLabel: "6 nights", startingPrice: { amount: 35800, currency: "EGP", unit: "group", note: "For 2 people" }, priceNote: "EGP 17,900 per person", accommodation: "Andakira Hotel Phuket Patong", included: [{ item: "Accommodation with Breakfast" }, { item: "4 Private Sightseeing Tours" }, { item: "Airport Pick-up & Drop-off" }], imageUrl: image("photo-1507525428034-b723cf961d3e"), featured: true }],
  ["istanbul-package", { title: "Istanbul Package", summary: "Hotel + breakfast · Airport service · 4 sightseeing tours", destinations: [destinations.istanbul.id], durationDays: 8, durationLabel: "8 days / 7 nights", startingPrice: { amount: 50900, currency: "EGP", unit: "group", note: "For 2 people" }, included: [{ item: "Hotel accommodation with breakfast" }, { item: "Welcome & farewell airport service" }, { item: "4 sightseeing tours" }], imageUrl: image("photo-1524231757912-21f4fe3a7200"), featured: true }],
  ["georgia", { title: "Georgia", summary: "Tbilisi · Batumi · Bakuriani", destinations: [destinations.georgia.id], durationDays: 7, durationLabel: "7 days", startingPrice: { amount: 53000, currency: "EGP", unit: "group", note: "For 2 people" }, itinerary: [{ day: 1, title: "Tbilisi", description: "3 days in Tbilisi." }, { day: 4, title: "Batumi", description: "3 days in Batumi." }, { day: 7, title: "Bakuriani", description: "1 day in Bakuriani." }], included: [{ item: "Private car with driver daily for transfers & tours" }, { item: "Free travel insurance" }, { item: "Free SIM card" }, { item: "Accommodation with breakfast" }], imageUrl: image("photo-1569396116180-210c182bedb8"), featured: true }],
  ["trabzon", { title: "Trabzon", summary: "Hotel + breakfast · Airport service · 4 sightseeing tours", destinations: [destinations.trabzon.id], durationDays: 8, durationLabel: "8 days / 7 nights", startingPrice: { amount: 57700, currency: "EGP", unit: "group", note: "For 2 people" }, priceNote: "One person in a double room from EGP 28,800", included: [{ item: "Hotel with Breakfast" }, { item: "Welcome and Farewell Service" }, { item: "4 Sightseeing Tours" }], imageUrl: image("photo-1530789253388-582c481c54b0"), featured: true }],
  ["indonesia", { title: "Indonesia", summary: "Jakarta · Bali private pool villa · Prime-location hotel", destinations: [destinations.indonesia.id], durationDays: 6, durationLabel: "6 days", startingPrice: { amount: 63000, currency: "EGP", unit: "group", note: "For 2 people" }, itinerary: [{ day: 1, title: "Jakarta", description: "3 days in Jakarta." }, { day: 4, title: "Bali private pool villa", description: "1 day in Bali at a private pool villa." }, { day: 5, title: "Bali prime location hotel", description: "2 days in Bali at a hotel in a prime location." }], included: [{ item: "Private car with driver daily for transfers & tours" }, { item: "Free travel insurance" }, { item: "Free SIM card" }, { item: "Accommodation with breakfast" }], imageUrl: image("photo-1537996194471-e657df975ab4"), featured: true }],
];

const programs = {};
for (const [slug, data] of programSeeds) {
  programs[slug] = await ensure("travel-programs", "slug", slug, { ...data, slug, status: "published", markets: [marketId] });
}

const legacyProgramSlugs = new Set(["nile-and-pyramids-escape", "greek-islands-ease", "dubai-city-break", "switzerland-panorama", "bali-slow-days"]);

const offer = await ensure("offers", "slug", "summer-escape", {
  title: "Summer Escape",
  slug: "summer-escape",
  badge: "Seasonal offer",
  headline: "Make this summer one to remember",
  description: "Save up to 20% on selected programs when you start planning early.",
  discountLabel: "Up to 20% off",
  imageUrl: image("photo-1507525428034-b723cf961d3e"),
  ctaLabel: "Explore the offer",
  status: "published",
  markets: [marketId],
});

const eventSeeds = [
  ["cairo-jazz-festival", "Cairo Jazz Festival", "Cairo, Egypt", "2026-10-10", "An easygoing evening of live music and city energy.", "photo-1514525253161-7a46d19cd819"],
  ["giza-pyramids-sound-and-light", "Giza Pyramids Sound and Light", "Giza, Egypt", "2026-10-18", "A memorable night beside one of the world's great landmarks.", "photo-1503177119275-0aa32b3a9368"],
  ["el-gouna-film-festival", "El Gouna Film Festival", "El Gouna, Egypt", "2026-10-23", "Cinema, sea air, and a lively Red Sea atmosphere.", "photo-1540575467063-178a50c2df87"],
  ["siwa-oasis-season", "Siwa Oasis Season", "Siwa, Egypt", "2026-11-05", "A slower cultural escape through palms, salt lakes, and desert light.", "photo-1516026672322-bc52d61a55d5"],
  ["nile-valley-festival", "Nile Valley Festival", "Luxor, Egypt", "2026-11-20", "Local stories, open skies, and warm evenings along the Nile.", "photo-1500534623283-312aade485b7"],
];
const events = [];
for (const [slug, title, location, startDate, summary, imageId] of eventSeeds) {
  events.push(await ensure("events", "slug", slug, { title, slug, location, startDate, summary, imageUrl: image(imageId), featured: true, status: "published", markets: [marketId] }));
}

const testimonialSeeds = [
  ["Mariam E.", "Cairo, Egypt", "The team listened carefully and made every part of our trip feel easy. We came home with wonderful memories."],
  ["Omar K.", "Alexandria, Egypt", "Thoughtful suggestions, clear communication, and a program that fit our family perfectly."],
  ["Noura S.", "Giza, Egypt", "From the first WhatsApp message, the planning felt personal, calm, and genuinely helpful."],
];
const testimonials = [];
for (const [displayName, location, quote] of testimonialSeeds) {
  const existing = await payload.find({ collection: "testimonials", where: { displayName: { equals: displayName } }, limit: 1, depth: 0 });
  testimonials.push(existing.docs[0] ?? await payload.create({ collection: "testimonials", data: { displayName, location, quote, rating: 5, featured: true, isDemoContent: true } }));
}

const guideSeeds = [
  ["how-to-plan-a-first-trip-to-egypt", "How to plan a first trip to Egypt", "Destination guide", "A relaxed starting point for choosing cities, pacing your days, and leaving room for discovery.", "photo-1503177119275-0aa32b3a9368"],
  ["what-to-pack-for-a-red-sea-escape", "What to pack for a Red Sea escape", "Travel tips", "The practical essentials that keep beach days, boat trips, and evenings comfortable.", "photo-1507525428034-b723cf961d3e"],
  ["a-slower-weekend-in-siwa", "A slower weekend in Siwa", "Inspiration", "Think palms, salt lakes, local food, and a little more space in the itinerary.", "photo-1548013146-72479768bada"],
];
const guides = [];
for (const [slug, title, category, excerpt, imageId] of guideSeeds) {
  guides.push(await ensure("guides", "slug", slug, { title, slug, summary: excerpt, excerpt, category, imageUrl: image(imageId), publishedAt: "2026-08-18", featured: true, status: "published", markets: [marketId] }));
}

const faqSeeds = [
  ["How do I start planning with LDC Travel?", "Send us a WhatsApp message with the kind of trip you have in mind. We will ask a few useful questions and suggest a starting direction."],
  ["Can you tailor a program for my family or group?", "Yes. Our programs are a starting point, and we can shape the pace, destinations, accommodation style, and experiences around your group."],
  ["Do you offer travel programs outside Egypt?", "Yes. We curate selected international journeys for travelers departing from Egypt. Message us with your preferred destination and dates."],
  ["Do I need to book online?", "No. This website is for exploring ideas and starting a conversation. Program details and next steps are handled directly with the LDC Travel team."],
  ["Can I ask about a destination that is not listed?", "Absolutely. Tell us where you would like to go and we will let you know how we can help."],
];
const faqs = [];
for (const [index, [question, answer]] of faqSeeds.entries()) {
  const existing = await payload.find({ collection: "faqs", where: { question: { equals: question } }, limit: 1, depth: 0 });
  faqs.push(existing.docs[0] ?? await payload.create({ collection: "faqs", data: { question, answer: lexical(answer), order: index, enabled: true, category: "Homepage" } }));
}

const siteSettings = await payload.findGlobal({ slug: "site-settings", depth: 0 });
if (!siteSettings.siteName) {
  await payload.updateGlobal({ slug: "site-settings", data: {
    siteName: "LDC Travel",
    tagline: "Tourism Marketing",
    defaultMarket: marketId,
    canonicalUrl: siteUrl,
    contact: { whatsappDisplay: "+20 12 11118118", whatsappNumber: "201211118118", office: "15 Mahmoud Essmat Hamdy, Sheraton", reservationsEmail: "reservations@ldc-tourism.com", salesEmail: "sales@ldc-tourism.com" },
    whatsapp: { defaultMessage: "Hi LDC Travel, I would like to know more about your travel programs.", contextTemplate: "Hi LDC Travel, I'm interested in {{title}} and would like more information." },
    footerCopy: "Your trusted travel partner for thoughtful journeys, memorable experiences, and places worth returning to.",
    socialLinks: [
      { label: "Instagram", url: "https://www.instagram.com/ldctravels.eg/" },
      { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61591627376189" },
      { label: "TikTok", url: "https://www.tiktok.com/@ldc.travel.agency" },
      { label: "LinkedIn", url: "https://www.linkedin.com/company/ldctravel/" },
    ],
  } });
  console.log("create global:site-settings");
} else {
  console.log("skip global:site-settings");
}

const homepage = await payload.findGlobal({ slug: "homepage", depth: 0 });
const currentProgramIds = Array.isArray(homepage.popularPrograms)
  ? homepage.popularPrograms.map((item) => typeof item === "object" && item !== null ? item.id : item).filter(Boolean).map(String)
  : [];
const legacyPrograms = await payload.find({ collection: "travel-programs", where: { slug: { in: Array.from(legacyProgramSlugs) } }, limit: 50, depth: 0 });
const legacyProgramIds = new Set(legacyPrograms.docs.map((item) => String(item.id)));
const canReplaceLegacyHomepagePrograms = currentProgramIds.length === 0 || currentProgramIds.every((id) => legacyProgramIds.has(id));
if (!homepage.hero) {
  await payload.updateGlobal({ slug: "homepage", data: {
    hero: {
      eyebrow: "Make room for the extraordinary",
      headline: "Explore the world with LDC Travel",
      supportingCopy: "Discover unforgettable destinations, thoughtful travel programs, and memories that last a lifetime.",
      imageUrl: image("photo-1580225495234-00e84e19c85e"),
      primaryCta: { label: "Inquire on WhatsApp", kind: "whatsapp" },
      secondaryCta: { label: "Explore programs", kind: "internal", url: "/programs" },
    },
    featuredDestinations: Object.values(destinations).map((item) => item.id),
    popularPrograms: Object.values(programs).map((item) => item.id),
    activeOffer: offer.id,
    upcomingEvents: events.map((item) => item.id),
    featuredTestimonials: testimonials.map((item) => item.id),
    latestGuides: guides.map((item) => item.id),
    faqs: faqs.map((item) => item.id),
  } });
  console.log("create global:homepage");
} else if (canReplaceLegacyHomepagePrograms) {
  await payload.updateGlobal({ slug: "homepage", data: { popularPrograms: Object.values(programs).map((item) => item.id) } });
  console.log("update global:homepage popularPrograms");
} else {
  console.log("skip global:homepage");
}

await payload.destroy();
console.log("LDC Travel demo seed complete. Existing records were preserved.");
