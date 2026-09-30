import { createWhatsAppUrl, type WhatsAppConfig } from "../lib/whatsapp";
import { createPublicWhatsAppConfig, publicContact, publicWhatsAppCopy } from "../lib/public-contact";
import { demoDestinations } from "./destinations";

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
  saudiOffice: string;
  whatsappDisplay: string;
  whatsappNumber: string;
  egyptWhatsappDisplay: string;
  egyptWhatsappNumber: string;
  email: string;
  defaultMessage: string;
  contextTemplate: string;
  footerCopy: string;
  socialLinks: SocialLink[];
};

export type DestinationViewModel = {
  slug: string;
  title: string;
  country: string;
  regionOrCity?: string;
  summary: string;
  image: ImageSource;
  href: string;
};

export type WhyLdcItem = {
  title: string;
  description: string;
  icon: string;
};

export type InspirationItem = {
  title: string;
  label: string;
  description: string;
  destinationSlug: string;
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
  whyLdc: {
    eyebrow: string;
    headline: string;
    description: string;
    items: WhyLdcItem[];
  };
  inspiration: {
    eyebrow: string;
    headline: string;
    description: string;
    items: InspirationItem[];
  };
  destinationCta: {
    eyebrow: string;
    headline: string;
    description: string;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
  faqs: FaqViewModel[];
};

const heroImage = (id: string, alt: string): ImageSource => ({
  src: `https://images.unsplash.com/${id}`,
  alt,
});

const demoWhatsappConfig: WhatsAppConfig = createPublicWhatsAppConfig(publicContact.whatsapp.saudi.number);

const whatsappCta = (label: string, title?: string): Cta => ({
  label,
  href: createWhatsAppUrl(demoWhatsappConfig, title ? { title } : undefined),
  external: true,
});

function destinationHeroImage(slug: string): ImageSource {
  const destination = demoDestinations.find((item) => item.slug === slug);
  if (!destination) throw new Error(`Missing destination imagery for ${slug}.`);
  return destination.heroImage;
}

export const demoHomepage: HomepageViewModel = {
  site: {
    name: "LDC Travel",
    tagline: "Tourism Marketing",
    office: publicContact.office,
    saudiOffice: publicContact.saudiOffice,
    whatsappDisplay: publicContact.whatsapp.saudi.display,
    whatsappNumber: publicContact.whatsapp.saudi.number,
    egyptWhatsappDisplay: publicContact.whatsapp.egypt.display,
    egyptWhatsappNumber: publicContact.whatsapp.egypt.number,
    email: publicContact.email,
    defaultMessage: publicWhatsAppCopy.defaultMessage,
    contextTemplate: publicWhatsAppCopy.contextTemplate,
    footerCopy: "Thoughtful destination guidance for travelers ready to see more of the world.",
    socialLinks: [
      { label: "Instagram", url: "https://www.instagram.com/ldctravels.eg/" },
      { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61591627376189" },
      { label: "TikTok", url: "https://www.tiktok.com/@ldc.travel.agency" },
      { label: "LinkedIn", url: "https://www.linkedin.com/company/ldctravel/" },
    ],
  },
  whatsappConfig: demoWhatsappConfig,
  hero: {
    eyebrow: "Travel farther, thoughtfully",
    headline: "Explore more. Travel better.",
    supportingCopy: "Explore six distinctive destinations, then talk with LDC Travel about the places, pace, and experiences you want to build around.",
    image: heroImage("photo-1534008897995-27a23e859048", "Turquoise water and limestone cliffs of Maya Bay, Phi Phi Islands, Thailand"),
    primaryCta: { label: "Explore destinations", href: "/destinations" },
    secondaryCta: whatsappCta("Talk to LDC Travel"),
  },
  destinations: [
    { slug: "turkey", title: "Turkey", country: "Türkiye", regionOrCity: "Istanbul and beyond", summary: "Where layered history meets bright coastlines and generous hospitality.", image: destinationHeroImage("turkey"), href: "/destinations/turkey" },
    { slug: "russia", title: "Russia", country: "Russia", regionOrCity: "Moscow and St Petersburg", summary: "Grand city squares, rich culture, and stories around every corner.", image: destinationHeroImage("russia"), href: "/destinations/russia" },
    { slug: "bali", title: "Bali", country: "Indonesia", regionOrCity: "Ubud and the coast", summary: "A restorative mix of green terraces, temple calm, and island energy.", image: destinationHeroImage("bali"), href: "/destinations/bali" },
    { slug: "georgia", title: "Georgia", country: "Georgia", regionOrCity: "Tbilisi and the Caucasus", summary: "Mountain horizons, warm streets, and a culture made for slow discovery.", image: destinationHeroImage("georgia"), href: "/destinations/georgia" },
    { slug: "indonesia", title: "Indonesia", country: "Indonesia", regionOrCity: "Java, Bali, and beyond", summary: "Island landscapes, ancient places, and vivid everyday life.", image: destinationHeroImage("indonesia"), href: "/destinations/indonesia" },
    { slug: "thailand", title: "Thailand", country: "Thailand", regionOrCity: "Bangkok and the islands", summary: "Street-side flavor, temple mornings, and blue-water escapes.", image: destinationHeroImage("thailand"), href: "/destinations/thailand" },
  ],
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
      { title: "Culture", label: "Stories in every street", description: "For travelers who want art, history, food, and a strong sense of place.", destinationSlug: "turkey", image: destinationHeroImage("turkey"), href: "/destinations" },
      { title: "Nature", label: "Room to breathe", description: "Mountain air, green valleys, and landscapes that invite you to slow down.", destinationSlug: "georgia", image: destinationHeroImage("georgia"), href: "/destinations/georgia" },
      { title: "Islands", label: "Blue-water days", description: "A warmer rhythm of coastlines, sunlight, and time well spent outdoors.", destinationSlug: "bali", image: destinationHeroImage("bali"), href: "/destinations/bali" },
      { title: "City energy", label: "A little more alive", description: "For the nights, neighborhoods, and small discoveries that stay with you.", destinationSlug: "thailand", image: destinationHeroImage("thailand"), href: "/destinations/thailand" },
    ],
  },
  destinationCta: {
    eyebrow: "Your next chapter starts here",
    headline: "Tell us where you want to go.",
    description: "Have a destination in mind or still choosing? Send your details and the LDC Travel team will follow up with a useful direction.",
      primaryCta: { label: "Explore destinations", href: "/destinations" },
    secondaryCta: whatsappCta("Start a conversation"),
  },
  faqs: [
    { question: "How do I start planning with LDC Travel?", answer: "Start with a WhatsApp message or the contact form. Tell us which destination interests you and what kind of experience you are imagining." },
    { question: "Can you help if I am still choosing a destination?", answer: "Yes. Share the mood, pace, and kind of places you enjoy, and our team can suggest a useful direction to explore." },
    { question: "Do you arrange custom travel requests?", answer: "We can discuss a destination-specific request and the details that matter to you before outlining the next step." },
    { question: "What happens after I send an inquiry?", answer: "A member of the LDC Travel team will follow up directly to understand your request and answer your questions." },
    { question: "Can I ask about a destination that is not listed yet?", answer: "Absolutely. The destinations shown here are our current focus, but you can still message us with another idea and we will let you know how we can help." },
  ],
};
