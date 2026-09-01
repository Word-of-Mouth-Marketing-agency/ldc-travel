import { createWhatsAppUrl, type WhatsAppConfig } from "../lib/whatsapp";

export type ImageSource = {
  src: string;
  alt: string;
};

export type SocialLink = {
  label: string;
  url?: string;
};

export type Cta = {
  label: string;
  href: string;
  external?: boolean;
};

export type SiteViewModel = {
  name: string;
  tagline: string;
  office: string;
  whatsappDisplay: string;
  whatsappNumber: string;
  reservationsEmail: string;
  salesEmail: string;
  defaultMessage: string;
  contextTemplate: string;
  footerCopy: string;
  socialLinks: SocialLink[];
};

export type DestinationViewModel = {
  title: string;
  country: string;
  regionOrCity?: string;
  summary: string;
  image: ImageSource;
  href: string;
};

export type ProgramViewModel = {
  title: string;
  destination: string;
  summary: string;
  durationDays: number;
  amount: number;
  currency: string;
  unit: string;
  image: ImageSource;
  href: string;
};

export type OfferViewModel = {
  title: string;
  badge?: string;
  headline: string;
  description: string;
  discountLabel?: string;
  image?: ImageSource;
  cta: Cta;
};

export type EventViewModel = {
  title: string;
  location: string;
  summary: string;
  date: string;
  month: string;
  day: string;
  image: ImageSource;
  cta: Cta;
};

export type TestimonialViewModel = {
  displayName: string;
  location?: string;
  quote: string;
  rating: number;
};

export type GuideViewModel = {
  title: string;
  category?: string;
  excerpt: string;
  publishedAt?: string;
  image: ImageSource;
  href: string;
};

export type FaqViewModel = {
  question: string;
  answer: string;
};

export type HomepageViewModel = {
  site: SiteViewModel;
  whatsappConfig: WhatsAppConfig;
  hero: {
    eyebrow: string;
    headline: string;
    supportingCopy: string;
    image: ImageSource;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
  destinations: DestinationViewModel[];
  programs: ProgramViewModel[];
  offer?: OfferViewModel;
  events: EventViewModel[];
  testimonials: TestimonialViewModel[];
  guides: GuideViewModel[];
  faqs: FaqViewModel[];
};

const image = (id: string, alt: string) => ({
  src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`,
  alt,
});

const demoWhatsappConfig: WhatsAppConfig = {
  phoneNumber: "201211118118",
  defaultMessage: "Hi LDC Travel, I would like to know more about your travel programs.",
  contextTemplate: "Hi LDC Travel, I'm interested in {{title}} and would like more information.",
};

const whatsappCta = (label: string, context?: string): Cta => ({
  label,
  href: createWhatsAppUrl(demoWhatsappConfig, context ? { title: context } : undefined),
  external: true,
});

export const demoHomepage: HomepageViewModel = {
  site: {
    name: "LDC Travel",
    tagline: "Tourism Marketing",
    office: "15 Mahmoud Essmat Hamdy, Sheraton",
    whatsappDisplay: "+20 12 11118118",
    whatsappNumber: "201211118118",
    reservationsEmail: "reservations@ldc-tourism.com",
    salesEmail: "sales@ldc-tourism.com",
    defaultMessage: demoWhatsappConfig.defaultMessage,
    contextTemplate: demoWhatsappConfig.contextTemplate ?? "",
    footerCopy: "Your trusted travel partner for thoughtful journeys, memorable experiences, and places worth returning to.",
    socialLinks: [
      { label: "Instagram", url: "https://www.instagram.com/ldctravels.eg/" },
      { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61591627376189" },
      { label: "TikTok", url: "https://www.tiktok.com/@ldc.travel.agency" },
      { label: "LinkedIn", url: "https://www.linkedin.com/company/ldctravel/" },
    ],
  },
  whatsappConfig: demoWhatsappConfig,
  hero: {
    eyebrow: "Make room for the extraordinary",
    headline: "Explore the world with LDC Travel",
    supportingCopy: "Discover unforgettable destinations, thoughtful travel programs, and memories that last a lifetime.",
    image: image("photo-1570077188670-e3a8d69ac5ff", "Whitewashed island homes above the Aegean Sea at sunset"),
    primaryCta: whatsappCta("Inquire on WhatsApp"),
    secondaryCta: { label: "Explore programs", href: "/programs" },
  },
  destinations: [
    { title: "Paris", country: "France", summary: "Art, food, and unforgettable city walks.", image: image("photo-1502602898657-3e91760cbb34", "Eiffel Tower at golden hour in Paris"), href: "/destinations" },
    { title: "Maldives", country: "Maldives", summary: "Slow mornings on clear water and white sand.", image: image("photo-1514282401047-d79a71a590e8", "Turquoise water and villas in the Maldives"), href: "/destinations" },
    { title: "Dubai", country: "United Arab Emirates", summary: "Skyline energy, desert calm, and modern luxury.", image: image("photo-1512453979798-5ea266f8880c", "Dubai skyline with Burj Khalifa"), href: "/destinations" },
    { title: "Cappadocia", country: "Türkiye", summary: "Valleys, cave towns, and sunrise balloons.", image: image("photo-1528181304800-259b08848526", "Hot air balloons above Cappadocia"), href: "/destinations" },
    { title: "Bangkok", country: "Thailand", summary: "Temple mornings, street food, and river nights.", image: image("photo-1508009603885-50cf7c579365", "Golden temple roof in Bangkok"), href: "/destinations" },
  ],
  programs: [
    { title: "Nile and Pyramids Escape", destination: "Cairo and Luxor", summary: "Ancient wonders paired with relaxed river days.", durationDays: 7, amount: 28500, currency: "EGP", unit: "person", image: image("photo-1503177119275-0aa32b3a9368", "The Great Pyramids of Giza under a clear sky"), href: "/programs" },
    { title: "Greek Islands Ease", destination: "Santorini and Athens", summary: "A bright island escape with time to wander.", durationDays: 8, amount: 42000, currency: "EGP", unit: "person", image: image("photo-1570077188670-e3a8d69ac5ff", "Blue domes and white homes in Santorini"), href: "/programs" },
    { title: "Dubai City Break", destination: "Dubai", summary: "Shopping, skyline views, and desert evenings.", durationDays: 6, amount: 33500, currency: "EGP", unit: "person", image: image("photo-1512453979798-5ea266f8880c", "Dubai skyline at blue hour"), href: "/programs" },
    { title: "Switzerland Panorama", destination: "Zurich and the Alps", summary: "Scenic rail journeys, lakeside stays, and mountain air.", durationDays: 10, amount: 69500, currency: "EGP", unit: "person", image: image("photo-1530789253388-582c481c54b0", "Mountain lake and alpine landscape in Switzerland"), href: "/programs" },
    { title: "Bali Slow Days", destination: "Ubud and the coast", summary: "Green rice terraces, warm water, and room to breathe.", durationDays: 9, amount: 51500, currency: "EGP", unit: "person", image: image("photo-1537996194471-e657df975ab4", "Tropical temple and greenery in Bali"), href: "/programs" },
  ],
  offer: {
    title: "Summer Escape",
    badge: "Seasonal offer",
    headline: "Make this summer one to remember",
    description: "Save up to 20% on selected programs when you start planning early.",
    discountLabel: "Up to 20% off",
    image: image("photo-1507525428034-b723cf961d3e", "Travelers enjoying a sunny beach escape"),
    cta: whatsappCta("Explore the offer", "Summer Escape"),
  },
  events: [
    { title: "Cairo Jazz Festival", location: "Cairo, Egypt", summary: "An easygoing evening of live music and city energy.", date: "October 10, 2026", month: "OCT", day: "10", image: image("photo-1514525253161-7a46d19cd819", "Crowd enjoying a live music festival"), cta: whatsappCta("Ask about this event", "Cairo Jazz Festival") },
    { title: "Giza Pyramids Sound and Light", location: "Giza, Egypt", summary: "A memorable night beside one of the world's great landmarks.", date: "October 18, 2026", month: "OCT", day: "18", image: image("photo-1539650116574-75c0c6d73f6e", "The pyramids of Giza at dusk"), cta: whatsappCta("Ask about this event", "Giza Pyramids Sound and Light") },
    { title: "El Gouna Film Festival", location: "El Gouna, Egypt", summary: "Cinema, sea air, and a lively Red Sea atmosphere.", date: "October 23, 2026", month: "OCT", day: "23", image: image("photo-1540575467063-178a50c2df87", "Audience at an outdoor cultural event"), cta: whatsappCta("Ask about this event", "El Gouna Film Festival") },
    { title: "Siwa Oasis Season", location: "Siwa, Egypt", summary: "A slower cultural escape through palms, salt lakes, and desert light.", date: "November 5, 2026", month: "NOV", day: "05", image: image("photo-1539650116574-75c0c6d73f6e", "Desert landscape at sunset"), cta: whatsappCta("Ask about this event", "Siwa Oasis Season") },
    { title: "Nile Valley Festival", location: "Luxor, Egypt", summary: "Local stories, open skies, and warm evenings along the Nile.", date: "November 20, 2026", month: "NOV", day: "20", image: image("photo-1500534623283-312aade485b7", "Warm evening light over a travel landscape"), cta: whatsappCta("Ask about this event", "Nile Valley Festival") },
  ],
  testimonials: [
    { displayName: "Mariam E.", location: "Cairo, Egypt", quote: "The team listened carefully and made every part of our trip feel easy. We came home with wonderful memories.", rating: 5 },
    { displayName: "Omar K.", location: "Alexandria, Egypt", quote: "Thoughtful suggestions, clear communication, and a program that fit our family perfectly.", rating: 5 },
    { displayName: "Noura S.", location: "Giza, Egypt", quote: "From the first WhatsApp message, the planning felt personal, calm, and genuinely helpful.", rating: 5 },
  ],
  guides: [
    { title: "How to plan a first trip to Egypt", category: "Destination guide", excerpt: "A relaxed starting point for choosing cities, pacing your days, and leaving room for discovery.", publishedAt: "2026-08-18", image: image("photo-1503177119275-0aa32b3a9368", "The Great Pyramids of Giza in soft morning light"), href: "/blog/how-to-plan-a-first-trip-to-egypt" },
    { title: "What to pack for a Red Sea escape", category: "Travel tips", excerpt: "The practical essentials that keep beach days, boat trips, and evenings comfortable.", publishedAt: "2026-07-29", image: image("photo-1507525428034-b723cf961d3e", "Clear blue water and a sandy beach"), href: "/blog/what-to-pack-for-a-red-sea-escape" },
    { title: "A slower weekend in Siwa", category: "Inspiration", excerpt: "Think palms, salt lakes, local food, and a little more space in the itinerary.", publishedAt: "2026-07-10", image: image("photo-1548013146-72479768bada", "Palm trees and warm desert light"), href: "/blog/a-slower-weekend-in-siwa" },
  ],
  faqs: [
    { question: "How do I start planning with LDC Travel?", answer: "Send us a WhatsApp message with the kind of trip you have in mind. We will ask a few useful questions and suggest a starting direction." },
    { question: "Can you tailor a program for my family or group?", answer: "Yes. Our programs are a starting point, and we can shape the pace, destinations, accommodation style, and experiences around your group." },
    { question: "Do you offer travel programs outside Egypt?", answer: "Yes. We curate selected international journeys for travelers departing from Egypt. Message us with your preferred destination and dates." },
    { question: "Do I need to book online?", answer: "No. This website is for exploring ideas and starting a conversation. Program details and next steps are handled directly with the LDC Travel team." },
    { question: "Can I ask about a destination that is not listed?", answer: "Absolutely. Tell us where you would like to go and we will let you know how we can help." },
  ],
};
