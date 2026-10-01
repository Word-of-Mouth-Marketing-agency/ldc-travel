import Link from "next/link";

import type { DestinationViewModel, SiteViewModel } from "../../content/homepage-demo";
import type { DestinationsPageViewModel } from "../../content/page-content-demo";
import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { Icon } from "../homepage/Icon";
import { Footer } from "../site/Footer";
import { FloatingWhatsApp } from "../site/FloatingWhatsApp";
import { Header } from "../site/Header";
import { DesignYourTripProvider } from "../site/DesignYourTripModal";
import { DestinationCard } from "./DestinationCard";

export function DestinationsUnavailable() {
  return (
    <main className="error-shell">
      <div className="error-shell-inner">
        <p className="error-shell-mark">LDC Travel · Destinations</p>
        <h1>We’re refreshing our destination guide.</h1>
        <p>Destination content is temporarily unavailable. Please try again in a moment.</p>
        <Link className="button button-primary" href="/destinations">Try again</Link>
      </div>
    </main>
  );
}

export function DestinationsListingPage({ destinations, site, whatsappConfig, page }: { destinations: DestinationViewModel[]; site: SiteViewModel; whatsappConfig: WhatsAppConfig; page: DestinationsPageViewModel }) {
  const whatsappHref = createWhatsAppUrl(whatsappConfig, { message: "Hi LDC Travel, I'd like help choosing a destination." });

  return (
    <DesignYourTripProvider whatsappHref={createWhatsAppUrl(whatsappConfig)}>
      <Header activePath="/destinations" site={site} />
      <main>
        <section className="page-title-section destinations-masthead" aria-labelledby="destinations-page-title">
          <div className="site-container page-title-inner destinations-masthead-inner">
            <div className="page-title-copy">
              <p className="section-eyebrow">{page.masthead.eyebrow}</p>
              <h1 id="destinations-page-title">{page.masthead.headline}</h1>
              <p>{page.masthead.description}</p>
            </div>
            <div className="destinations-masthead-mark" aria-hidden="true"><span>{String(destinations.length).padStart(2, "0")}</span><small>{page.masthead.markLabel}</small></div>
          </div>
        </section>
        <section className="content-section destinations-listing-section" aria-labelledby="destinations-listing-heading">
          <div className="site-container">
            <div className="listing-section-heading">
              <div><p className="section-eyebrow">{page.listing.eyebrow}</p><h2 id="destinations-listing-heading">{page.listing.headline}</h2></div>
              <p>{page.listing.description}</p>
            </div>
            <div className="destination-listing-grid">
              {destinations.slice(0, 6).map((destination, index) => <DestinationCard key={destination.slug} destination={destination} index={index} />)}
            </div>
          </div>
        </section>
        <section className="destination-support-section" aria-labelledby="destination-support-heading">
          <div className="site-container destination-support-card">
            <div><p className="section-eyebrow">{page.support.eyebrow}</p><h2 id="destination-support-heading">{page.support.headline}</h2><p>{page.support.description}</p></div>
            <a className="button button-light" href={whatsappHref} target="_blank" rel="noopener noreferrer">{page.support.ctaLabel} <Icon name="arrow-up-right" size={16} /></a>
          </div>
        </section>
      </main>
      <Footer site={site} whatsappConfig={whatsappConfig} />
      <FloatingWhatsApp whatsappConfig={whatsappConfig} />
    </DesignYourTripProvider>
  );
}
