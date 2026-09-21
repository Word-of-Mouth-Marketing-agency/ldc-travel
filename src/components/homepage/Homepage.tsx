import Image from "next/image";
import Link from "next/link";

import type { HomepageViewModel } from "../../content/homepage-demo";
import { Header } from "../site/Header";
import { Footer } from "../site/Footer";
import { FloatingWhatsApp } from "../site/FloatingWhatsApp";
import { DesignYourTripProvider } from "../site/DesignYourTripModal";
import { WhatsAppIcon } from "../site/WhatsAppIcon";
import { Icon } from "./Icon";
import { HeroIntroAnimation } from "../motion/HeroIntroAnimation";
import { DestinationsSection, FaqSection, InspirationSection, DestinationCtaSection, WhyLdcSection } from "./HomepageSections";
import { createWhatsAppUrl } from "../../lib/whatsapp";

export function HomepageUnavailable() {
  return (
    <main className="error-shell">
      <div className="error-shell-inner">
        <p className="error-shell-mark">LDC Travel · Tourism Marketing</p>
        <h1>We’re refreshing this page.</h1>
        <p>Our travel content is temporarily unavailable. Please try again in a moment.</p>
        <Link className="button button-primary" href="/">Try again</Link>
      </div>
    </main>
  );
}

function HeroCta({ cta, primary = false }: { cta: HomepageViewModel["hero"]["primaryCta"]; primary?: boolean }) {
  const className = `button ${primary ? "button-primary" : "button-secondary"}`;
  if (cta.external) {
    return <a className={className} data-hero-action href={cta.href} target="_blank" rel="noopener noreferrer">{primary ? <Icon name="arrow-up-right" /> : <WhatsAppIcon />}{cta.label}</a>;
  }

  return <a className={className} data-hero-action href={cta.href}>{cta.label}<Icon name="arrow" /></a>;
}

export function Homepage({ data }: { data: HomepageViewModel }) {
  return (
    <DesignYourTripProvider whatsappHref={createWhatsAppUrl(data.whatsappConfig)}>
      <Header socialLinks={data.site.socialLinks} />
      <main>
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-photo"><Image src={data.hero.image.src} alt={data.hero.image.alt} fill priority sizes="(max-width: 767px) 100vw, 62vw" /></div>
          <div className="hero-wash" />
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="site-container hero-inner">
            <HeroIntroAnimation>
              <p className="hero-eyebrow" data-hero-eyebrow><Icon name="sparkles" /> {data.hero.eyebrow}</p>
              <h1 id="hero-heading" data-hero-heading>{data.hero.headline}</h1>
              <p className="hero-supporting-copy" data-hero-supporting>{data.hero.supportingCopy}</p>
              <div className="hero-actions">
                <HeroCta cta={data.hero.primaryCta} primary />
                <HeroCta cta={data.hero.secondaryCta} />
              </div>
              <p className="hero-note" data-hero-supporting><span aria-hidden="true" /> Explore destinations from Egypt with LDC Travel.</p>
            </HeroIntroAnimation>
          </div>
          <div className="hero-bottom-note" aria-hidden="true"><span>01</span><span>Destinations worth going farther for</span></div>
        </section>
        <DestinationsSection items={data.destinations} />
        <WhyLdcSection content={data.whyLdc} />
        <InspirationSection content={data.inspiration} />
        <DestinationCtaSection content={data.destinationCta} />
        <FaqSection items={data.faqs} />
      </main>
      <Footer site={data.site} whatsappConfig={data.whatsappConfig} />
      <FloatingWhatsApp whatsappConfig={data.whatsappConfig} />
    </DesignYourTripProvider>
  );
}
