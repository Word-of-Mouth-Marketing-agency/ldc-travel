import Link from "next/link";

import type { DestinationDetailViewModel } from "../../content/destinations";
import type { DestinationViewModel, SiteViewModel } from "../../content/homepage-demo";
import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { Icon } from "../homepage/Icon";
import { Footer } from "../site/Footer";
import { FloatingWhatsApp } from "../site/FloatingWhatsApp";
import { Header } from "../site/Header";
import { DestinationInquiryForm } from "./DestinationInquiryForm";
import { DestinationExperiences, DestinationGallery, DestinationHero, DestinationHighlights, DestinationOverview, DestinationSeasonSection, RelatedDestinations } from "./DestinationDetailSections";

export function DestinationDetailUnavailable() {
  return (
    <main className="error-shell">
      <div className="error-shell-inner">
        <p className="error-shell-mark">LDC Travel · Destination guide</p>
        <h1>We’re refreshing this destination.</h1>
        <p>The destination content is temporarily unavailable. Please try again in a moment.</p>
        <Link className="button button-primary" href="/destinations">Back to destinations</Link>
      </div>
    </main>
  );
}

function DestinationFaq({ destination }: { destination: DestinationDetailViewModel }) {
  if (!destination.faqs.length) return null;
  return <section className="content-section destination-faq-section" aria-labelledby="destination-faq-heading"><div className="site-container destination-faq-layout"><div><p className="section-eyebrow">Good to know</p><h2 id="destination-faq-heading">Questions about {destination.title}?</h2></div><div className="faq-list">{destination.faqs.map((item) => <details className="faq-item" key={item.question}><summary>{item.question}<Icon name="chevron" /></summary><p>{item.answer}</p></details>)}</div></div></section>;
}

function DestinationInquirySection({ destination, whatsappHref }: { destination: DestinationDetailViewModel; whatsappHref: string }) {
  return <section className="destination-inquiry-section" id="inquiry" aria-labelledby="destination-inquiry-section-heading"><div className="site-container destination-inquiry-grid"><div className="destination-inquiry-intro"><p className="section-eyebrow">Take the next step</p><h2 id="destination-inquiry-section-heading">A good journey starts with a useful conversation.</h2><p>Tell us where your curiosity is taking you. We will follow up to understand what you want from the destination.</p><div className="destination-inquiry-whatsapp"><span><Icon name="message" size={18} /></span><p><strong>Prefer a quick conversation?</strong><br />WhatsApp the LDC Travel team directly.</p><a href={whatsappHref} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <Icon name="arrow-up-right" size={15} /></a></div></div><DestinationInquiryForm destinationTitle={destination.title} slug={destination.slug} whatsappHref={whatsappHref} /></div></section>;
}

export function DestinationDetailPage({ destination, relatedDestinations, destinations, site, whatsappConfig }: { destination: DestinationDetailViewModel; relatedDestinations: DestinationViewModel[]; destinations: DestinationViewModel[]; site: SiteViewModel; whatsappConfig: WhatsAppConfig }) {
  const whatsappHref = createWhatsAppUrl(whatsappConfig, { title: destination.title });

  return (
    <>
      <Header activePath="/destinations" socialLinks={site.socialLinks} whatsappConfig={whatsappConfig} />
      <main>
        <DestinationHero destination={destination} whatsappHref={whatsappHref} />
        <DestinationOverview destination={destination} />
        <DestinationHighlights destination={destination} />
        <DestinationExperiences destination={destination} />
        <DestinationSeasonSection destination={destination} />
        <DestinationGallery destination={destination} />
        <DestinationInquirySection destination={destination} whatsappHref={whatsappHref} />
        <DestinationFaq destination={destination} />
        <RelatedDestinations destinations={relatedDestinations.length ? relatedDestinations : destinations.filter((item) => item.slug !== destination.slug).slice(0, 2)} />
      </main>
      <Footer site={site} whatsappConfig={whatsappConfig} />
      <FloatingWhatsApp whatsappConfig={whatsappConfig} />
    </>
  );
}
