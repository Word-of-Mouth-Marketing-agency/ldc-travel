import Image from "next/image";
import Link from "next/link";

import type { SiteViewModel } from "../../content/homepage-demo";
import type { AboutPageViewModel } from "../../content/page-content-demo";
import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { RevealHeading } from "../motion/RevealHeading";
import { Icon } from "../homepage/Icon";
import { DesignYourTripProvider, DesignYourTripTrigger } from "../site/DesignYourTripModal";
import { FloatingWhatsApp } from "../site/FloatingWhatsApp";
import { Footer } from "../site/Footer";
import { Header } from "../site/Header";

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

export function AboutPage({ site, whatsappConfig, page }: { site: SiteViewModel; whatsappConfig: WhatsAppConfig; page: AboutPageViewModel }) {
  return (
    <DesignYourTripProvider whatsappHref={createWhatsAppUrl(whatsappConfig)}>
      <Header activePath="/about" site={site} />
      <main>
        <section className="page-title-section about-masthead" aria-labelledby="about-page-title">
          <div className="site-container page-title-inner about-masthead-inner">
            <div className="page-title-copy">
              <p className="section-eyebrow">{page.masthead.eyebrow}</p>
              <h1 id="about-page-title">{page.masthead.headline}</h1>
              <p>{page.masthead.description}</p>
            </div>
            <div className="about-masthead-mark" aria-hidden="true"><span>{site.name}</span><small>{site.tagline}</small></div>
          </div>
        </section>

        <section className="content-section about-who-section" aria-labelledby="about-who-heading">
          <div className="site-container about-who-grid">
            <RevealHeading className="about-copy-block">
              <p className="section-eyebrow" data-reveal-heading>{page.whoWeAre.eyebrow}</p>
              <h2 id="about-who-heading" data-reveal-heading>{page.whoWeAre.headline}</h2>
              {page.whoWeAre.paragraphs.map((paragraph) => <p key={paragraph} data-reveal-heading>{paragraph}</p>)}
            </RevealHeading>
            <div className="about-image-card">
              <Image src={page.whoWeAre.image.src} alt={page.whoWeAre.image.alt} fill sizes="(max-width: 767px) 100vw, 45vw" />
              <div className="about-image-card-caption"><span>{page.whoWeAre.imageCaption}</span><strong>{page.whoWeAre.imageTitle}</strong></div>
            </div>
          </div>
        </section>

        {page.approach.headline ? <section className="content-section about-approach-section" aria-labelledby="about-approach-heading">
          <div className="site-container about-approach-grid">
            <RevealHeading className="about-copy-block">
              <p className="section-eyebrow" data-reveal-heading>{page.approach.eyebrow}</p>
              <h2 id="about-approach-heading" data-reveal-heading>{page.approach.headline}</h2>
            </RevealHeading>
            <div className="about-approach-copy">
              <p>{page.approach.description}</p>
              <div className="about-principles" aria-label="LDC Travel approach">
                {page.approach.principles.map((principle) => <span key={principle}>{principle}</span>)}
              </div>
            </div>
          </div>
        </section> : null}

        {page.support.items.length ? <section className="content-section about-help-section" aria-labelledby="about-help-heading">
          <div className="site-container">
            <RevealHeading className="about-section-heading">
              <p className="section-eyebrow" data-reveal-heading>{page.support.eyebrow}</p>
              <h2 id="about-help-heading" data-reveal-heading>{page.support.headline}</h2>
            </RevealHeading>
            <div className="about-help-grid">
              {page.support.items.map((item, index) => (
                <article className="about-help-card" key={item.title}>
                  <span className="about-help-icon"><Icon name={item.icon as "compass" | "globe" | "message" | "sparkles"} size={22} /></span>
                  <span className="about-help-number" aria-hidden="true">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section> : null}

        {page.destinationStories.items.length ? <section className="about-destination-section" aria-labelledby="about-destination-heading">
          <div className="site-container about-destination-grid">
            <div className="about-destination-copy">
              <p className="section-eyebrow">{page.destinationStories.eyebrow}</p>
              <h2 id="about-destination-heading">{page.destinationStories.headline}</h2>
              <p>{page.destinationStories.description}</p>
              <div className="about-destination-links">
                {page.destinationStories.items.map((destination) => <Link key={destination.title} href={destination.href}>{destination.title}<Icon name="arrow" size={16} /></Link>)}
              </div>
              <Link className="button button-light" href="/destinations">Explore destinations <Icon name="arrow" size={16} /></Link>
            </div>
            <div className="about-story-grid">
              {page.destinationStories.items.slice(0, 3).map((destination, index) => (
                <Link className={`about-story-card about-story-card-${index + 1}`} href={destination.href} key={destination.title}>
                  <Image src={destination.image.src} alt={destination.image.alt} fill sizes="(max-width: 767px) 100vw, 32vw" />
                  <span className="about-story-card-scrim" />
                  <span className="about-story-card-copy"><small>{destination.label}</small><strong>{destination.title}</strong></span>
                </Link>
              ))}
            </div>
          </div>
        </section> : null}

        {page.process.steps.length ? <section className="content-section about-process-section" aria-labelledby="about-process-heading">
          <div className="site-container">
            <RevealHeading className="about-section-heading">
              <p className="section-eyebrow" data-reveal-heading>{page.process.eyebrow}</p>
              <h2 id="about-process-heading" data-reveal-heading>{page.process.headline}</h2>
            </RevealHeading>
            <ol className="about-process-list">
              {page.process.steps.map((step, index) => (
                <li className="about-process-item" key={step.title}>
                  <span className="about-process-number" aria-hidden="true">0{index + 1}</span>
                  <div><h3>{step.title}</h3><p>{step.description}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section> : null}

        {page.cta.headline ? <section className="about-cta-section" aria-labelledby="about-cta-heading">
          <div className="site-container about-cta-inner">
            <div><p className="section-eyebrow">{page.cta.eyebrow}</p><h2 id="about-cta-heading">{page.cta.headline}</h2><p>{page.cta.description}</p></div>
            <div className="about-cta-actions"><DesignYourTripTrigger className="button button-light" label={page.cta.primaryLabel} /><Link className="button button-outline-light" href="/destinations">{page.cta.secondaryLabel} <Icon name="arrow" size={16} /></Link></div>
          </div>
        </section> : null}
      </main>
      <Footer site={site} whatsappConfig={whatsappConfig} />
      <FloatingWhatsApp whatsappConfig={whatsappConfig} />
    </DesignYourTripProvider>
  );
}
