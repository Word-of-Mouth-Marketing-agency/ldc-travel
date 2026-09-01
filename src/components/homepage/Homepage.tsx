import Image from "next/image";
import Link from "next/link";

import type { HomepageViewModel } from "../../content/homepage-demo";
import { Header } from "../site/Header";
import { Footer } from "../site/Footer";
import { Icon } from "./Icon";
import { DestinationsSection, EventsSection, FaqSection, GuidesSection, OfferSection, ProgramsSection, TestimonialsSection, TrustBenefits } from "./HomepageSections";

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
      <Header whatsappConfig={data.whatsappConfig} />
      <main>
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-photo"><Image src={data.hero.image.src} alt={data.hero.image.alt} fill priority sizes="(max-width: 767px) 100vw, 58vw" /></div>
          <div className="hero-wash" />
          <div className="hero-ribbon hero-ribbon-teal" aria-hidden="true" /><div className="hero-ribbon hero-ribbon-orange" aria-hidden="true" />
          <div className="site-container hero-inner">
            <div className="hero-copy">
              <p className="hero-eyebrow"><Icon name="plane" /> {data.hero.eyebrow}</p>
              <h1 id="hero-heading">{headlineTail ? <>{headlineLead} <span>with {headlineTail}</span></> : data.hero.headline}</h1>
              <p className="hero-supporting-copy">{data.hero.supportingCopy}</p>
              <div className="hero-actions">
                <a className="button button-primary" href={data.hero.primaryCta.href} target={data.hero.primaryCta.external ? "_blank" : undefined} rel={data.hero.primaryCta.external ? "noreferrer" : undefined}>{data.hero.primaryCta.label}<Icon name="arrow" /></a>
                <Link className="button button-secondary" href={data.hero.secondaryCta.href}>{data.hero.secondaryCta.label}<Icon name="arrow" /></Link>
              </div>
            </div>
          </div>
        </section>
        <TrustBenefits benefits={data.trustBenefits} />
        <DestinationsSection items={data.destinations} />
        <ProgramsSection items={data.programs} whatsappConfig={data.whatsappConfig} />
        <OfferSection offer={data.offer} />
        <EventsSection items={data.events} />
        <TestimonialsSection items={data.testimonials} />
        <GuidesSection items={data.guides} />
        <FaqSection items={data.faqs} />
      </main>
      <Footer site={data.site} whatsappConfig={data.whatsappConfig} />
    </>
  );
}
