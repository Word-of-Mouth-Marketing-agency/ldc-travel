import Link from "next/link";

import type { SiteViewModel, SocialLink } from "../../content/homepage-demo";
import type { ContactPageViewModel } from "../../content/page-content-demo";
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

function ContactDetails({ site, page, whatsappHref, egyptWhatsappHref }: { site: SiteViewModel; page: ContactPageViewModel; whatsappHref: string; egyptWhatsappHref: string }) {
  return (
    <aside className="contact-details" aria-labelledby="contact-details-heading">
      <p className="section-eyebrow">{page.details.eyebrow}</p>
      <h2 id="contact-details-heading">{page.details.headline}</h2>
      <p>{page.details.description}</p>
      <dl className="contact-details-list">
        <div><dt>{site.egyptOfficeLabel} office</dt><dd><Icon name="pin" />{site.office}</dd></div>
        <div><dt>{site.saudiOfficeLabel} office</dt><dd className="contact-office-address"><Icon name="pin" /><span>{site.saudiOffice}</span></dd></div>
        <div><dt>{site.egyptOfficeLabel} WhatsApp</dt><dd><WhatsAppIcon /><a href={egyptWhatsappHref} target="_blank" rel="noopener noreferrer">{site.egyptWhatsappDisplay}</a></dd></div>
        <div><dt>{site.saudiOfficeLabel} WhatsApp</dt><dd><WhatsAppIcon /><a href={whatsappHref} target="_blank" rel="noopener noreferrer">{site.whatsappDisplay}</a></dd></div>
        <div><dt>Email</dt><dd><Icon name="mail" /><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
      </dl>
      <div className="contact-details-note"><strong>{page.details.noteHeadline}</strong><span>{page.details.noteDescription}</span><a className="text-link" href={whatsappHref} target="_blank" rel="noopener noreferrer">{page.details.noteCtaLabel} <Icon name="arrow" /></a></div>
    </aside>
  );
}

function RegionalSocialLinks({ market, links }: { market: string; links: readonly SocialLink[] }) {
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

function SocialConnect({ page, site }: { page: ContactPageViewModel; site: SiteViewModel }) {
  if (!site.regionalSocials.egypt.length && !site.regionalSocials.saudi.length) return null;
  return (
    <section className="contact-social-section" aria-labelledby="contact-social-heading">
      <div className="site-container contact-social-inner">
        <div className="contact-social-heading">
          <p className="section-eyebrow">{page.social.eyebrow}</p>
          <h2 id="contact-social-heading">{page.social.headline}</h2>
          <p>{page.social.description}</p>
        </div>
        <div className="contact-social-markets">
          <RegionalSocialLinks market={site.egyptOfficeLabel} links={site.regionalSocials.egypt} />
          <RegionalSocialLinks market={site.saudiOfficeLabel} links={site.regionalSocials.saudi} />
        </div>
      </div>
    </section>
  );
}

export function ContactPage({ site, whatsappConfig, page }: { site: SiteViewModel; whatsappConfig: WhatsAppConfig; page: ContactPageViewModel }) {
  const whatsappHref = createWhatsAppUrl(whatsappConfig, { message: "Hi LDC Travel, I'd like to ask about a travel inquiry." });
  const egyptWhatsappHref = createWhatsAppUrl(createPublicWhatsAppConfig(site.egyptWhatsappNumber), { message: "Hi LDC Travel, I'd like to ask about a travel inquiry." });

  return (
    <DesignYourTripProvider whatsappHref={createWhatsAppUrl(whatsappConfig)}>
      <Header activePath="/contact" site={site} />
      <main>
        <section className="page-title-section" aria-labelledby="contact-page-title">
          <div className="site-container page-title-inner">
            <div className="page-title-copy">
              <p className="section-eyebrow">{page.masthead.eyebrow}</p>
              <h1 id="contact-page-title">{page.masthead.headline}</h1>
              <p>{page.masthead.description}</p>
            </div>
          </div>
        </section>
        <section className="content-section contact-inquiry-section" id="inquiry" aria-labelledby="inquiry-heading">
          <div className="site-container contact-inquiry-grid">
            <ContactForm whatsappHref={whatsappHref} copy={page.form} />
            <ContactDetails site={site} page={page} whatsappHref={whatsappHref} egyptWhatsappHref={egyptWhatsappHref} />
          </div>
        </section>
        <SocialConnect page={page} site={site} />
      </main>
      <Footer site={site} whatsappConfig={whatsappConfig} />
      <FloatingWhatsApp whatsappConfig={whatsappConfig} />
    </DesignYourTripProvider>
  );
}
