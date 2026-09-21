import Image from "next/image";
import Link from "next/link";

import type { SiteViewModel } from "../../content/homepage-demo";
import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { RevealHeading } from "../motion/RevealHeading";
import { Icon } from "../homepage/Icon";
import { DesignYourTripProvider, DesignYourTripTrigger } from "../site/DesignYourTripModal";
import { FloatingWhatsApp } from "../site/FloatingWhatsApp";
import { Footer } from "../site/Footer";
import { Header } from "../site/Header";

const helpItems = [
  {
    title: "Personalized planning",
    description: "Start with the destination, travel preferences, and ideas that matter to you.",
    icon: "compass" as const,
  },
  {
    title: "Destination guidance",
    description: "Explore carefully presented places and find a direction that feels right for your trip.",
    icon: "globe" as const,
  },
  {
    title: "Human support",
    description: "Your inquiry goes to the LDC Travel team, who continue the conversation directly with you.",
    icon: "message" as const,
  },
  {
    title: "Flexible travel ideas",
    description: "Have another destination in mind? Design Your Trip gives you a simple way to share it.",
    icon: "sparkles" as const,
  },
];

const destinationStories = [
  {
    title: "Turkey",
    label: "Culture and coastlines",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
    alt: "Istanbul skyline with mosque domes beside the Bosphorus",
    href: "/destinations/turkey",
  },
  {
    title: "Bali",
    label: "Island rhythm",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
    alt: "Balinese temple surrounded by tropical greenery",
    href: "/destinations/bali",
  },
  {
    title: "Georgia",
    label: "Mountain horizons",
    image: "https://images.unsplash.com/photo-1569396116180-210c182bedb8?auto=format&fit=crop&w=1200&q=85",
    alt: "Mountain landscape in Georgia under a clear sky",
    href: "/destinations/georgia",
  },
];

const processSteps = [
  { title: "Explore", description: "Browse destinations and find the places that match the kind of trip you want." },
  { title: "Tell us what you have in mind", description: "Use Design Your Trip, a destination inquiry, or contact LDC Travel on WhatsApp." },
  { title: "Continue with our team", description: "Our customer-service team follows up directly to continue planning your trip." },
];

export function AboutUnavailable() {
  return (
    <main className="error-shell">
      <div className="error-shell-inner">
        <p className="error-shell-mark">LDC Travel · About</p>
        <h1>We’re refreshing this page.</h1>
        <p>Our company information is temporarily unavailable. Please try again in a moment.</p>
        <Link className="button button-primary" href="/about">Try again</Link>
      </div>
    </main>
  );
}

export function AboutPage({ site, whatsappConfig }: { site: SiteViewModel; whatsappConfig: WhatsAppConfig }) {
  return (
    <DesignYourTripProvider whatsappHref={createWhatsAppUrl(whatsappConfig)}>
      <Header activePath="/about" socialLinks={site.socialLinks} />
      <main>
        <section className="page-title-section about-masthead" aria-labelledby="about-page-title">
          <div className="site-container page-title-inner about-masthead-inner">
            <div className="page-title-copy">
              <p className="section-eyebrow">About LDC Travel</p>
              <h1 id="about-page-title">Travel, shaped around you.</h1>
              <p>LDC Travel helps travelers discover international destinations and turn ideas into thoughtfully planned trips with personal support from our travel team.</p>
            </div>
            <div className="about-masthead-mark" aria-hidden="true"><span>LDC</span><small>Destination-led<br />travel guidance</small></div>
          </div>
        </section>

        <section className="content-section about-who-section" aria-labelledby="about-who-heading">
          <div className="site-container about-who-grid">
            <RevealHeading className="about-copy-block">
              <p className="section-eyebrow" data-reveal-heading>Who we are</p>
              <h2 id="about-who-heading" data-reveal-heading>A more personal place to begin.</h2>
              <p data-reveal-heading>LDC Travel is a destination-focused travel company built around a simple idea: planning a trip should feel clear, personal, and exciting from the beginning.</p>
              <p data-reveal-heading>Rather than asking travelers to choose from rigid online options, we help them explore destinations, share what they have in mind, and connect with our team to shape the right next step.</p>
            </RevealHeading>
            <div className="about-image-card">
              <Image src="/hero-travel.webp" alt="Calm alpine village beside a clear mountain lake" fill sizes="(max-width: 767px) 100vw, 45vw" />
              <div className="about-image-card-caption"><span>Start with the place</span><strong>Let the destination set the pace.</strong></div>
            </div>
          </div>
        </section>

        <section className="content-section about-approach-section" aria-labelledby="about-approach-heading">
          <div className="site-container about-approach-grid">
            <RevealHeading className="about-copy-block">
              <p className="section-eyebrow" data-reveal-heading>Our approach</p>
              <h2 id="about-approach-heading" data-reveal-heading>Travel planning, made personal.</h2>
            </RevealHeading>
            <div className="about-approach-copy">
              <p>Every traveler starts with a different idea. Some know exactly where they want to go. Others are still exploring. LDC Travel gives both the same thing: a simple way to discover destinations, share what they are looking for, and continue planning with a real travel specialist.</p>
              <div className="about-principles" aria-label="LDC Travel approach">
                <span>Destination first</span>
                <span>Human follow-up</span>
                <span>Clear next steps</span>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section about-help-section" aria-labelledby="about-help-heading">
          <div className="site-container">
            <RevealHeading className="about-section-heading">
              <p className="section-eyebrow" data-reveal-heading>What we help with</p>
              <h2 id="about-help-heading" data-reveal-heading>Useful guidance for the trip ahead.</h2>
            </RevealHeading>
            <div className="about-help-grid">
              {helpItems.map((item, index) => (
                <article className="about-help-card" key={item.title}>
                  <span className="about-help-icon"><Icon name={item.icon} size={22} /></span>
                  <span className="about-help-number" aria-hidden="true">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-destination-section" aria-labelledby="about-destination-heading">
          <div className="site-container about-destination-grid">
            <div className="about-destination-copy">
              <p className="section-eyebrow">Start with where you want to go</p>
              <h2 id="about-destination-heading">Six directions to begin exploring.</h2>
              <p>Our current destination focus includes Turkey, Russia, Bali, Georgia, Indonesia, and Thailand. If another place is already on your mind, Design Your Trip gives you room to tell us about it.</p>
              <div className="about-destination-links">
                {destinationStories.map((destination) => <Link key={destination.title} href={destination.href}>{destination.title}<Icon name="arrow" size={16} /></Link>)}
              </div>
              <Link className="button button-light" href="/destinations">Explore destinations <Icon name="arrow" size={16} /></Link>
            </div>
            <div className="about-story-grid">
              {destinationStories.map((destination, index) => (
                <Link className={`about-story-card about-story-card-${index + 1}`} href={destination.href} key={destination.title}>
                  <Image src={destination.image} alt={destination.alt} fill sizes="(max-width: 767px) 100vw, 32vw" />
                  <span className="about-story-card-scrim" />
                  <span className="about-story-card-copy"><small>{destination.label}</small><strong>{destination.title}</strong></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section about-process-section" aria-labelledby="about-process-heading">
          <div className="site-container">
            <RevealHeading className="about-section-heading">
              <p className="section-eyebrow" data-reveal-heading>How it works</p>
              <h2 id="about-process-heading" data-reveal-heading>From first idea to next conversation.</h2>
            </RevealHeading>
            <ol className="about-process-list">
              {processSteps.map((step, index) => (
                <li className="about-process-item" key={step.title}>
                  <span className="about-process-number" aria-hidden="true">0{index + 1}</span>
                  <div><h3>{step.title}</h3><p>{step.description}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="about-cta-section" aria-labelledby="about-cta-heading">
          <div className="site-container about-cta-inner">
            <div><p className="section-eyebrow">Ready when you are</p><h2 id="about-cta-heading">Have a trip in mind?</h2><p>Tell us where you want to go and a member of the LDC Travel team will continue the planning with you.</p></div>
            <div className="about-cta-actions"><DesignYourTripTrigger className="button button-light" /><Link className="button button-outline-light" href="/destinations">Explore destinations <Icon name="arrow" size={16} /></Link></div>
          </div>
        </section>
      </main>
      <Footer site={site} whatsappConfig={whatsappConfig} />
      <FloatingWhatsApp whatsappConfig={whatsappConfig} />
    </DesignYourTripProvider>
  );
}
