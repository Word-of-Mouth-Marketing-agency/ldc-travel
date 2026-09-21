import Link from "next/link";

import type { DestinationViewModel, SiteViewModel } from "../../content/homepage-demo";
import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { Icon } from "../homepage/Icon";
import { Footer } from "../site/Footer";
import { FloatingWhatsApp } from "../site/FloatingWhatsApp";
import { Header } from "../site/Header";
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

export function DestinationsListingPage({ destinations, site, whatsappConfig }: { destinations: DestinationViewModel[]; site: SiteViewModel; whatsappConfig: WhatsAppConfig }) {
  const whatsappHref = createWhatsAppUrl(whatsappConfig, { message: "Hi LDC Travel, I'd like help choosing a destination." });

  return (
    <>
      <Header activePath="/destinations" socialLinks={site.socialLinks} whatsappConfig={whatsappConfig} />
      <main>
        <section className="page-title-section destinations-masthead" aria-labelledby="destinations-page-title">
          <div className="site-container page-title-inner destinations-masthead-inner">
            <div className="page-title-copy">
              <p className="section-eyebrow">The LDC destination guide</p>
              <h1 id="destinations-page-title">Find a place that feels like you.</h1>
              <p>Explore six distinct destinations, then ask the LDC Travel team for a thoughtful starting point.</p>
            </div>
            <div className="destinations-masthead-mark" aria-hidden="true"><span>06</span><small>destinations<br />to begin with</small></div>
          </div>
        </section>
        <section className="content-section destinations-listing-section" aria-labelledby="destinations-listing-heading">
          <div className="site-container">
            <div className="listing-section-heading">
              <div><p className="section-eyebrow">Choose your direction</p><h2 id="destinations-listing-heading">Six ways to see more of the world.</h2></div>
              <p>From city stories and mountain air to island days and cultural depth, start with the destination that speaks to you.</p>
            </div>
            <div className="destination-listing-grid">
              {destinations.slice(0, 6).map((destination, index) => <DestinationCard key={destination.slug} destination={destination} index={index} />)}
            </div>
          </div>
        </section>
        <section className="destination-support-section" aria-labelledby="destination-support-heading">
          <div className="site-container destination-support-card">
            <div><p className="section-eyebrow">Still choosing?</p><h2 id="destination-support-heading">Tell us what you want to feel.</h2><p>Share your ideas with LDC Travel and we will help you find the right direction.</p></div>
            <a className="button button-light" href={whatsappHref} target="_blank" rel="noopener noreferrer">Talk to LDC Travel <Icon name="arrow-up-right" size={16} /></a>
          </div>
        </section>
      </main>
      <Footer site={site} whatsappConfig={whatsappConfig} />
      <FloatingWhatsApp whatsappConfig={whatsappConfig} />
    </>
  );
}
