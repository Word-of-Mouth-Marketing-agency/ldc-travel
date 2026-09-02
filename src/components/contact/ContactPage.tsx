import Image from "next/image";
import Link from "next/link";

import type { SiteViewModel } from "../../content/homepage-demo";
import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { HeroIntroAnimation } from "../motion/HeroIntroAnimation";
import { Icon } from "../homepage/Icon";
import { Footer } from "../site/Footer";
import { FloatingWhatsApp } from "../site/FloatingWhatsApp";
import { Header } from "../site/Header";
import { SocialIcon } from "../site/SocialIcon";
import { WhatsAppIcon } from "../site/WhatsAppIcon";
import { ContactForm } from "./ContactForm";

const contactHeroImage = "https://images.unsplash.com/photo-1580225495234-00e84e19c85e?auto=format&fit=crop&w=1800&q=85";

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

function ContactMethods({ site, whatsappHref }: { site: SiteViewModel; whatsappHref: string }) {
  return (
    <section className="content-section contact-methods-section" aria-labelledby="contact-methods-heading">
      <div className="site-container">
        <div className="contact-section-intro">
          <p className="section-eyebrow">Reach us directly</p>
          <h2 id="contact-methods-heading">Choose the easiest way to connect.</h2>
        </div>
        <div className="contact-methods-grid">
          <a className="contact-method contact-method-primary" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <span className="contact-method-icon"><WhatsAppIcon size={25} /></span>
            <span><strong>WhatsApp</strong><small>Chat with our travel team</small></span>
            <Icon name="arrow" />
          </a>
          <a className="contact-method" href={`mailto:${site.reservationsEmail}`}>
            <span className="contact-method-icon"><Icon name="mail" size={25} /></span>
            <span><strong>Reservations</strong><small>Trip and program inquiries</small></span>
            <Icon name="arrow" />
          </a>
          <a className="contact-method" href={`mailto:${site.salesEmail}`}>
            <span className="contact-method-icon"><Icon name="mail" size={25} /></span>
            <span><strong>Sales</strong><small>Partnerships and group requests</small></span>
            <Icon name="arrow" />
          </a>
          <div className="contact-method contact-method-static">
            <span className="contact-method-icon"><Icon name="pin" size={25} /></span>
            <span><strong>Egypt office</strong><small>{site.office}</small></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactDetails({ site, whatsappHref }: { site: SiteViewModel; whatsappHref: string }) {
  return (
    <aside className="contact-details" aria-labelledby="contact-details-heading">
      <p className="section-eyebrow">Good to know</p>
      <h2 id="contact-details-heading">A thoughtful trip starts with a thoughtful conversation.</h2>
      <p>Tell us what matters to you: the destination, pace, occasion, or people you’re traveling with. We’ll help turn the idea into a clear plan.</p>
      <dl className="contact-details-list">
        <div><dt>Egypt office</dt><dd><Icon name="pin" />{site.office}</dd></div>
        <div><dt>WhatsApp</dt><dd><WhatsAppIcon /><a href={whatsappHref} target="_blank" rel="noopener noreferrer">{site.whatsappDisplay}</a></dd></div>
        <div><dt>Email</dt><dd><Icon name="mail" /><a href={`mailto:${site.reservationsEmail}`}>{site.reservationsEmail}</a></dd><dd className="contact-details-secondary"><Icon name="mail" /><a href={`mailto:${site.salesEmail}`}>{site.salesEmail}</a></dd></div>
      </dl>
      <div className="contact-details-note"><strong>Prefer a quick answer?</strong><span>WhatsApp is the fastest way to start.</span><a className="text-link" href={whatsappHref} target="_blank" rel="noopener noreferrer">Chat with us <Icon name="arrow" /></a></div>
    </aside>
  );
}

function SocialConnect({ socialLinks }: { socialLinks: SiteViewModel["socialLinks"] }) {
  const visibleSocials = socialLinks.filter((social) => social.url && ["instagram", "facebook", "tiktok", "linkedin"].includes(social.label.toLowerCase()));

  return (
    <section className="contact-social-section" aria-labelledby="contact-social-heading">
      <div className="site-container contact-social-inner">
        <div><p className="section-eyebrow">Stay connected</p><h2 id="contact-social-heading">Find a little more inspiration.</h2></div>
        <div className="contact-social-links">
          {visibleSocials.map((social) => <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`Follow LDC Travel on ${social.label}`}><SocialIcon label={social.label} /><span>{social.label}</span></a>)}
        </div>
      </div>
    </section>
  );
}

export function ContactPage({ site, whatsappConfig }: { site: SiteViewModel; whatsappConfig: WhatsAppConfig }) {
  const whatsappHref = createWhatsAppUrl(whatsappConfig, { message: "Hi LDC Travel, I'd like to ask about a travel inquiry." });

  return (
    <>
      <Header activePath="/contact" socialLinks={site.socialLinks} whatsappConfig={whatsappConfig} />
      <main>
        <section className="contact-hero" aria-labelledby="contact-hero-heading">
          <div className="contact-hero-image"><Image src={contactHeroImage} alt="White Cycladic buildings and blue domes above the Aegean Sea" fill priority sizes="(max-width: 767px) 100vw, 50vw" /></div>
          <div className="contact-hero-overlay" />
          <div className="site-container contact-hero-inner">
            <HeroIntroAnimation className="contact-hero-copy">
              <p className="contact-hero-eyebrow" data-hero-eyebrow>Get in touch <Icon name="plane" /></p>
              <h1 id="contact-hero-heading" data-hero-heading>Let’s plan your next journey.</h1>
              <p className="contact-hero-supporting-copy" data-hero-supporting>Talk to LDC Travel about your next trip, travel program, festival, or custom travel request.</p>
              <div className="contact-hero-actions">
                <a className="button button-primary" data-hero-action href={whatsappHref} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Chat on WhatsApp</a>
                <a className="button button-light" data-hero-action href="#inquiry">Send an inquiry <Icon name="arrow" /></a>
              </div>
            </HeroIntroAnimation>
          </div>
        </section>
        <ContactMethods site={site} whatsappHref={whatsappHref} />
        <section className="content-section contact-inquiry-section" id="inquiry" aria-labelledby="inquiry-heading">
          <div className="site-container contact-inquiry-grid">
            <ContactForm whatsappHref={whatsappHref} />
            <ContactDetails site={site} whatsappHref={whatsappHref} />
          </div>
        </section>
        <section className="contact-whatsapp-section" aria-labelledby="contact-whatsapp-heading">
          <div className="site-container contact-whatsapp-card">
            <div><p className="section-eyebrow">Need a quick conversation?</p><h2 id="contact-whatsapp-heading">Your next journey can start with one message.</h2></div>
            <a className="button button-light" href={whatsappHref} target="_blank" rel="noopener noreferrer">Prefer WhatsApp? Chat with us <Icon name="arrow" /></a>
          </div>
        </section>
        <SocialConnect socialLinks={site.socialLinks} />
      </main>
      <Footer site={site} whatsappConfig={whatsappConfig} />
      <FloatingWhatsApp whatsappConfig={whatsappConfig} />
    </>
  );
}
