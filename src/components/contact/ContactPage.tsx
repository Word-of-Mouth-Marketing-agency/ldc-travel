import Link from "next/link";

import { regionalSocialLinks, type RegionalSocialLink } from "../../content/regional-social";
import type { SiteViewModel } from "../../content/homepage-demo";
import { createPublicWhatsAppConfig } from "../../lib/public-contact";
import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { Icon } from "../homepage/Icon";
import { Footer } from "../site/Footer";
import { FloatingWhatsApp } from "../site/FloatingWhatsApp";
import { Header } from "../site/Header";
import { SocialIcon } from "../site/SocialIcon";
import { WhatsAppIcon } from "../site/WhatsAppIcon";
import { ContactForm } from "./ContactForm";
import { DesignYourTripProvider } from "../site/DesignYourTripModal";

export function ContactUnavailable() {
  return (
    <main className="error-shell">
      <div className="error-shell-inner">
        <p className="error-shell-mark">LDC Travel · Tourism Marketing</p>
        <h1>We’re refreshing this page.</h1>
        <p>Our contact details are temporarily unavailable. Please try again in a moment.</p>
        <Link className="button button-primary" href="/contact">Try again</Link>
      </div>
    </main>
  );
}

function ContactDetails({ site, whatsappHref, egyptWhatsappHref }: { site: SiteViewModel; whatsappHref: string; egyptWhatsappHref: string }) {
  return (
    <aside className="contact-details" aria-labelledby="contact-details-heading">
      <p className="section-eyebrow">Good to know</p>
      <h2 id="contact-details-heading">A thoughtful trip starts with a thoughtful conversation.</h2>
      <p>Tell us what matters to you: the destination, pace, occasion, or people you’re traveling with. We’ll help turn the idea into a clear plan.</p>
      <dl className="contact-details-list">
        <div><dt>Egypt office</dt><dd><Icon name="pin" />{site.office}</dd></div>
        <div><dt>Egypt WhatsApp</dt><dd><WhatsAppIcon /><a href={egyptWhatsappHref} target="_blank" rel="noopener noreferrer">{site.egyptWhatsappDisplay}</a></dd></div>
        <div><dt>Saudi WhatsApp</dt><dd><WhatsAppIcon /><a href={whatsappHref} target="_blank" rel="noopener noreferrer">{site.whatsappDisplay}</a></dd></div>
        <div><dt>Email</dt><dd><Icon name="mail" /><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
      </dl>
      <div className="contact-details-note"><strong>Prefer a quick answer?</strong><span>WhatsApp is the fastest way to start.</span><a className="text-link" href={whatsappHref} target="_blank" rel="noopener noreferrer">Chat with us <Icon name="arrow" /></a></div>
    </aside>
  );
}

function RegionalSocialLinks({ market, links }: { market: string; links: readonly RegionalSocialLink[] }) {
  return (
    <div className="contact-social-market">
      <h3>{market}</h3>
      <div className="contact-social-links">
        {links.map((social) => (
          <a key={social.label} className="contact-social-link" href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`LDC Travel ${market} on ${social.label}`}>
            <SocialIcon label={social.label} />
            <span>{social.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function SocialConnect() {
  return (
    <section className="contact-social-section" aria-labelledby="contact-social-heading">
      <div className="site-container contact-social-inner">
        <div className="contact-social-heading">
          <p className="section-eyebrow">Stay connected</p>
          <h2 id="contact-social-heading">Find a little more inspiration.</h2>
          <p>Follow LDC Travel for travel ideas and updates.</p>
        </div>
        <div className="contact-social-markets">
          <RegionalSocialLinks market="Egypt" links={regionalSocialLinks.Egypt} />
          <RegionalSocialLinks market="Saudi Arabia" links={regionalSocialLinks["Saudi Arabia"]} />
        </div>
      </div>
    </section>
  );
}

export function ContactPage({ site, whatsappConfig }: { site: SiteViewModel; whatsappConfig: WhatsAppConfig }) {
  const whatsappHref = createWhatsAppUrl(whatsappConfig, { message: "Hi LDC Travel, I'd like to ask about a travel inquiry." });
  const egyptWhatsappHref = createWhatsAppUrl(createPublicWhatsAppConfig(site.egyptWhatsappNumber), { message: "Hi LDC Travel, I'd like to ask about a travel inquiry." });

  return (
    <DesignYourTripProvider whatsappHref={createWhatsAppUrl(whatsappConfig)}>
      <Header activePath="/contact" socialLinks={site.socialLinks} />
      <main>
        <section className="page-title-section" aria-labelledby="contact-page-title">
          <div className="site-container page-title-inner">
            <div className="page-title-copy">
              <p className="section-eyebrow">Get in touch</p>
              <h1 id="contact-page-title">Contact Us</h1>
              <p>Let’s talk about your next journey.</p>
            </div>
          </div>
        </section>
        <section className="content-section contact-inquiry-section" id="inquiry" aria-labelledby="inquiry-heading">
          <div className="site-container contact-inquiry-grid">
            <ContactForm whatsappHref={whatsappHref} />
            <ContactDetails site={site} whatsappHref={whatsappHref} egyptWhatsappHref={egyptWhatsappHref} />
          </div>
        </section>
        <SocialConnect />
      </main>
      <Footer site={site} whatsappConfig={whatsappConfig} />
      <FloatingWhatsApp whatsappConfig={whatsappConfig} />
    </DesignYourTripProvider>
  );
}
