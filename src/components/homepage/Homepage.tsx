import Image from "next/image";
import Link from "next/link";

import type { HomepageViewModel } from "../../content/homepage-demo";
import { Header } from "../site/Header";
import { Footer } from "../site/Footer";
import { FloatingWhatsApp } from "../site/FloatingWhatsApp";
import { PlaceholderLink } from "../site/PlaceholderLink";
import { WhatsAppIcon } from "../site/WhatsAppIcon";
import { Icon } from "./Icon";
import { HeroIntroAnimation } from "../motion/HeroIntroAnimation";
import { DestinationsSection, EventsSection, FaqSection, GuidesSection, OfferSection, ProgramsSection, TestimonialsSection } from "./HomepageSections";

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

export function Homepage({ data }: { data: HomepageViewModel }) {
  const [headlineLead, headlineTail] = data.hero.headline.split(" with ");

  return (
    <>
      <Header socialLinks={data.site.socialLinks} whatsappConfig={data.whatsappConfig} />
      <main>
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-photo"><Image src={data.hero.image.src} alt={data.hero.image.alt} fill priority sizes="(max-width: 767px) 100vw, 58vw" /></div>
          <div className="hero-wash" />
          <div className="site-container hero-inner">
            <HeroIntroAnimation>
              <p className="hero-eyebrow" data-hero-eyebrow><Icon name="plane" /> {data.hero.eyebrow}</p>
              <h1 id="hero-heading" data-hero-heading>{headlineTail ? <>{headlineLead} <span>with {headlineTail}</span></> : data.hero.headline}</h1>
              <p className="hero-supporting-copy" data-hero-supporting>{data.hero.supportingCopy}</p>
              <div className="hero-actions">
                <a className="button button-primary" data-hero-action href={data.hero.primaryCta.external ? data.hero.primaryCta.href : "#"} target={data.hero.primaryCta.external ? "_blank" : undefined} rel={data.hero.primaryCta.external ? "noopener noreferrer" : undefined}><WhatsAppIcon />{data.hero.primaryCta.label}</a>
                {data.hero.secondaryCta.external ? <a className="button button-secondary" data-hero-action href={data.hero.secondaryCta.href} target="_blank" rel="noopener noreferrer">{data.hero.secondaryCta.label}<Icon name="arrow" /></a> : <PlaceholderLink className="button button-secondary" data-hero-action>{data.hero.secondaryCta.label}<Icon name="arrow" /></PlaceholderLink>}
              </div>
            </HeroIntroAnimation>
          </div>
        </section>
        <DestinationsSection items={data.destinations} />
        <ProgramsSection items={data.programs} whatsappConfig={data.whatsappConfig} />
        <OfferSection offer={data.offer} />
        <EventsSection items={data.events} />
        <TestimonialsSection items={data.testimonials} />
        <GuidesSection items={data.guides} />
        <FaqSection items={data.faqs} />
      </main>
      <Footer site={data.site} whatsappConfig={data.whatsappConfig} />
      <FloatingWhatsApp whatsappConfig={data.whatsappConfig} />
    </>
  );
}
