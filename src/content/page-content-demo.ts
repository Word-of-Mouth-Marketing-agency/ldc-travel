import { demoDestinations } from "./destinations";
import type { ImageSource } from "./homepage-demo";

export type SeoViewModel = {
  metaTitle: string;
  metaDescription: string;
  socialImage?: string;
};

export type AboutPageViewModel = {
  masthead: { eyebrow: string; headline: string; description: string };
  whoWeAre: { eyebrow: string; headline: string; paragraphs: string[]; image: ImageSource; imageCaption: string; imageTitle: string };
  approach: { eyebrow: string; headline: string; description: string; principles: string[] };
  support: { eyebrow: string; headline: string; items: { title: string; description: string; icon: string }[] };
  destinationStories: { eyebrow: string; headline: string; description: string; items: { title: string; label: string; image: ImageSource; href: string }[] };
  process: { eyebrow: string; headline: string; steps: { title: string; description: string }[] };
  cta: { eyebrow: string; headline: string; description: string; primaryLabel: string; secondaryLabel: string };
  seo: SeoViewModel;
};

export type ContactPageViewModel = {
  masthead: { eyebrow: string; headline: string; description: string };
  form: { eyebrow: string; headline: string; description: string; submitLabel: string };
  details: { eyebrow: string; headline: string; description: string; noteHeadline: string; noteDescription: string; noteCtaLabel: string };
  social: { eyebrow: string; headline: string; description: string };
  seo: SeoViewModel;
};

export type DestinationsPageViewModel = {
  masthead: { eyebrow: string; headline: string; description: string; markLabel: string };
  listing: { eyebrow: string; headline: string; description: string };
  support: { eyebrow: string; headline: string; description: string; ctaLabel: string };
  seo: SeoViewModel;
};

const destination = (slug: string) => {
  const record = demoDestinations.find((item) => item.slug === slug);
  if (!record) throw new Error(`Missing demo destination ${slug}.`);
  return record;
};

export const demoAboutPage: AboutPageViewModel = {
  masthead: {
    eyebrow: "About LDC Travel",
    headline: "Travel, shaped around you.",
    description: "LDC Travel helps travelers discover international destinations and turn ideas into thoughtfully planned trips with personal support from our travel team.",
  },
  whoWeAre: {
    eyebrow: "Who we are",
    headline: "A more personal place to begin.",
    paragraphs: [
      "LDC Travel is a destination-focused travel company built around a simple idea: planning a trip should feel clear, personal, and exciting from the beginning.",
      "Rather than asking travelers to choose from rigid online options, we help them explore destinations, share what they have in mind, and connect with our team to shape the right next step.",
    ],
    image: { src: "/hero-travel.webp", alt: "Calm alpine village beside a clear mountain lake", width: 2000, height: 1024 },
    imageCaption: "Start with the place",
    imageTitle: "Let the destination set the pace.",
  },
  approach: {
    eyebrow: "Our approach",
    headline: "Travel planning, made personal.",
    description: "Every traveler starts with a different idea. Some know exactly where they want to go. Others are still exploring. LDC Travel gives both the same thing: a simple way to discover destinations, share what they are looking for, and continue planning with a real travel specialist.",
    principles: ["Destination first", "Human follow-up", "Clear next steps"],
  },
  support: {
    eyebrow: "What we help with",
    headline: "Useful guidance for the trip ahead.",
    items: [
      { title: "Personalized planning", description: "Start with the destination, travel preferences, and ideas that matter to you.", icon: "compass" },
      { title: "Destination guidance", description: "Explore carefully presented places and find a direction that feels right for your trip.", icon: "globe" },
      { title: "Human support", description: "Your inquiry goes to the LDC Travel team, who continue the conversation directly with you.", icon: "message" },
      { title: "Flexible travel ideas", description: "Have another destination in mind? Design Your Trip gives you a simple way to share it.", icon: "sparkles" },
    ],
  },
  destinationStories: {
    eyebrow: "Start with where you want to go",
    headline: "Six directions to begin exploring.",
    description: "Our current destination focus includes Turkey, Russia, Bali, Georgia, Indonesia, and Thailand. If another place is already on your mind, Design Your Trip gives you room to tell us about it.",
    items: [
      { title: destination("turkey").title, label: "Culture and coastlines", image: destination("turkey").heroImage, href: "/destinations/turkey" },
      { title: destination("bali").title, label: "Island rhythm", image: destination("bali").heroImage, href: "/destinations/bali" },
      { title: destination("georgia").title, label: "Mountain horizons", image: destination("georgia").heroImage, href: "/destinations/georgia" },
    ],
  },
  process: {
    eyebrow: "How it works",
    headline: "From first idea to next conversation.",
    steps: [
      { title: "Explore", description: "Browse destinations and find the places that match the kind of trip you want." },
      { title: "Tell us what you have in mind", description: "Use Design Your Trip, a destination inquiry, or contact LDC Travel on WhatsApp." },
      { title: "Continue with our team", description: "Our customer-service team follows up directly to continue planning your trip." },
    ],
  },
  cta: {
    eyebrow: "Ready when you are",
    headline: "Have a trip in mind?",
    description: "Tell us where you want to go and a member of the LDC Travel team will continue the planning with you.",
    primaryLabel: "Design Your Trip",
    secondaryLabel: "Explore destinations",
  },
  seo: {
    metaTitle: "About LDC Travel",
    metaDescription: "Discover LDC Travel's destination-led approach to thoughtful travel planning and personal follow-up.",
  },
};

export const demoContactPage: ContactPageViewModel = {
  masthead: { eyebrow: "Get in touch", headline: "Contact Us", description: "Let’s talk about your next journey." },
  form: { eyebrow: "Start a conversation", headline: "Tell us what you’re planning.", description: "Share a few details and we’ll help shape the right next step.", submitLabel: "Send inquiry" },
  details: {
    eyebrow: "Good to know",
    headline: "A thoughtful trip starts with a thoughtful conversation.",
    description: "Tell us what matters to you: the destination, pace, occasion, or people you’re traveling with. We’ll help turn the idea into a clear plan.",
    noteHeadline: "Prefer a quick answer?",
    noteDescription: "WhatsApp is the fastest way to start.",
    noteCtaLabel: "Chat with us",
  },
  social: { eyebrow: "Stay connected", headline: "Find a little more inspiration.", description: "Follow LDC Travel for travel ideas and updates." },
  seo: {
    metaTitle: "Contact LDC Travel",
    metaDescription: "Contact LDC Travel about Turkey, Russia, Bali, Georgia, Indonesia, or Thailand. Send an inquiry and our team will follow up by WhatsApp or email.",
  },
};

export const demoDestinationsPage: DestinationsPageViewModel = {
  masthead: {
    eyebrow: "The LDC destination guide",
    headline: "Find a place that feels like you.",
    description: "Explore six distinct destinations, then ask the LDC Travel team for a thoughtful starting point.",
    markLabel: "destinations to begin with",
  },
  listing: {
    eyebrow: "Choose your direction",
    headline: "Six ways to see more of the world.",
    description: "From city stories and mountain air to island days and cultural depth, start with the destination that speaks to you.",
  },
  support: {
    eyebrow: "Still choosing?",
    headline: "Tell us what you want to feel.",
    description: "Share your ideas with LDC Travel and we will help you find the right direction.",
    ctaLabel: "Talk to LDC Travel",
  },
  seo: {
    metaTitle: "Destinations | LDC Travel",
    metaDescription: "Explore Turkey, Russia, Bali, Georgia, Indonesia, and Thailand with LDC Travel. Find a destination that fits the way you want to travel.",
  },
};
