import rawDestinations from "./destinations-data.json";

import type { ImageSource } from "./homepage-demo";

export type DestinationHighlight = {
  title: string;
  description: string;
  image: ImageSource;
};

export type DestinationExperience = {
  title: string;
  description: string;
  icon: string;
};

export type DestinationInformation = {
  label: string;
  value: string;
};

export type DestinationDetailViewModel = {
  slug: string;
  title: string;
  country: string;
  regionOrCity: string;
  eyebrow: string;
  summary: string;
  heroImage: ImageSource;
  overview: string;
  highlights: DestinationHighlight[];
  experiences: DestinationExperience[];
  bestTimeToVisit: string;
  usefulInformation: DestinationInformation[];
  gallery: ImageSource[];
  seoMetaTitle: string;
  seoMetaDescription: string;
  relatedDestinations: string[];
  faqs: { question: string; answer: string }[];
};

type RawDestination = {
  slug: string;
  title: string;
  country: string;
  regionOrCity: string;
  eyebrow: string;
  summary: string;
  overview: string;
  highlights: { title: string; description: string; image: string; alt: string }[];
  experiences: DestinationExperience[];
  bestTimeToVisit: string;
  usefulInformation: DestinationInformation[];
  gallery: { image: string; alt: string }[];
  seoMetaTitle: string;
  seoMetaDescription: string;
};

const raw = rawDestinations as RawDestination[];

const relationMap: Record<string, string[]> = {
  turkey: ["georgia", "russia"],
  russia: ["turkey", "georgia"],
  bali: ["indonesia", "thailand"],
  georgia: ["turkey", "russia"],
  indonesia: ["bali", "thailand"],
  thailand: ["bali", "turkey"],
};

const faqMap: Record<string, { question: string; answer: string }[]> = {
  turkey: [{ question: "Can I combine Istanbul with another Turkish region?", answer: "Yes. Tell us whether you prefer culture, landscapes, or the coast and we can help shape a route that gives each part enough time." }],
  russia: [{ question: "Can you help me choose between Moscow and Saint Petersburg?", answer: "Yes. Share the kind of cultural experience you want and we can help you decide whether one city or a combined route fits better." }],
  bali: [{ question: "Can Bali be planned around a slower pace?", answer: "Absolutely. We can focus your inquiry around wellness, culture, nature, beaches, or a balanced mix without making the route feel rushed." }],
  georgia: [{ question: "Can a Georgia journey include both cities and mountains?", answer: "Yes. Georgia works well as a contrast between Tbilisi and regional landscapes, with the route shaped around the season and your preferred pace." }],
  indonesia: [{ question: "How is Indonesia different from the Bali destination page?", answer: "Bali is presented as its own island destination. This page looks at broader Indonesia, including Java, Yogyakarta, and other regional possibilities." }],
  thailand: [{ question: "Can I combine Bangkok with beach time?", answer: "Yes. Tell us how much city, culture, nature, and coast you want and we can help you explore a balanced direction." }],
};

function toImage(image: string, alt: string): ImageSource {
  return { src: image, alt };
}

export const approvedDestinationSlugs = raw.map((destination) => destination.slug);

export const demoDestinations: DestinationDetailViewModel[] = raw.map((destination) => ({
  ...destination,
  heroImage: toImage(destination.highlights[0].image, destination.highlights[0].alt),
  highlights: destination.highlights.map((highlight) => ({
    title: highlight.title,
    description: highlight.description,
    image: toImage(highlight.image, highlight.alt),
  })),
  gallery: destination.gallery.map((image) => toImage(image.image, image.alt)),
  relatedDestinations: relationMap[destination.slug] ?? [],
  faqs: faqMap[destination.slug] ?? [],
}));

export function getDemoDestination(slug: string) {
  return demoDestinations.find((destination) => destination.slug === slug);
}
