import type {
  Cta,
  DestinationViewModel,
  FaqViewModel,
  ImageSource,
  InspirationItem,
  HomepageViewModel,
} from "../../content/homepage-demo";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";
import { PlaceholderLink } from "../site/PlaceholderLink";
import { SafeImage } from "../site/SafeImage";
import { WhatsAppIcon } from "../site/WhatsAppIcon";
import { RevealHeading } from "../motion/RevealHeading";

function CoverImage({ image, className = "" }: { image: ImageSource; className?: string }) {
  return <SafeImage className={`cover-image ${className}`} src={image.src} alt={image.alt} sizes="(max-width: 767px) 92vw, (max-width: 1199px) 44vw, 31vw" />;
}

function CtaLink({ cta, primary = false }: { cta: Cta; primary?: boolean }) {
  const className = `button ${primary ? "button-primary" : "button-light"}`;
  if (cta.external) {
    return <a className={className} href={cta.href} target="_blank" rel="noopener noreferrer">{cta.label}<WhatsAppIcon size={16} /></a>;
  }

  return <a className={className} href={cta.href}>{cta.label}<Icon name="arrow" /></a>;
}

export function DestinationsSection({ items }: { items: DestinationViewModel[] }) {
  return (
    <section className="content-section destinations-section" id="destinations" aria-labelledby="destinations-heading">
      <div className="site-container">
        <SectionHeading
          eyebrow="The world, in focus"
          id="destinations-heading"
          title="Choose a place that feels like you."
          description="Six destinations to start with, each offering a different way to see more of the world."
        />
        <div className="destination-grid">
          {items.slice(0, 6).map((destination, index) => (
            <PlaceholderLink className={`destination-card destination-card-${index + 1}`} key={`${destination.title}-${destination.country}`} aria-label={`Explore ${destination.title}`}>
              <CoverImage image={destination.image} />
              <span className="card-scrim" />
              <span className="destination-index">0{index + 1}</span>
              <div className="destination-card-copy">
                <span className="destination-country">{destination.country}{destination.regionOrCity ? <><span aria-hidden="true">·</span>{destination.regionOrCity}</> : null}</span>
                <h3>{destination.title}</h3>
                <p>{destination.summary}</p>
                <span className="destination-card-link">Explore destination <Icon name="arrow-up-right" size={16} /></span>
              </div>
            </PlaceholderLink>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyLdcSection({ content }: { content: HomepageViewModel["whyLdc"] }) {
  return (
    <section className="content-section why-section" id="why-ldc" aria-labelledby="why-heading">
      <div className="site-container why-layout">
        <RevealHeading className="why-intro">
          <p className="section-eyebrow" data-reveal-heading>{content.eyebrow}</p>
          <h2 id="why-heading" data-reveal-heading>{content.headline}</h2>
          <p data-reveal-heading>{content.description}</p>
        </RevealHeading>
        <div className="why-list">
          {content.items.slice(0, 3).map((item, index) => (
            <article className="why-item" key={item.title}>
              <span className="why-item-number">0{index + 1}</span>
              <span className="why-item-icon"><Icon name={item.icon as "globe" | "compass" | "message"} size={22} /></span>
              <div><h3>{item.title}</h3><p>{item.description}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InspirationCard({ item, featured = false }: { item: InspirationItem; featured?: boolean }) {
  return (
    <PlaceholderLink className={`inspiration-card${featured ? " inspiration-card-featured" : ""}`} aria-label={`Explore ${item.title} inspiration`}>
      <CoverImage image={item.image} />
      <span className="card-scrim" />
      <div className="inspiration-card-copy">
        <span className="card-kicker">{item.label}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <span className="text-link">Discover the feeling <Icon name="arrow-up-right" size={16} /></span>
      </div>
    </PlaceholderLink>
  );
}

export function InspirationSection({ content }: { content: HomepageViewModel["inspiration"] }) {
  return (
    <section className="content-section inspiration-section" id="inspiration" aria-labelledby="inspiration-heading">
      <div className="site-container">
        <SectionHeading eyebrow={content.eyebrow} id="inspiration-heading" title={content.headline} description={content.description} />
        <div className="inspiration-grid">
          {content.items.slice(0, 4).map((item, index) => <InspirationCard key={item.title} item={item} featured={index === 0} />)}
        </div>
      </div>
    </section>
  );
}

export function DestinationCtaSection({ content }: { content: HomepageViewModel["destinationCta"] }) {
  return (
    <section className="destination-cta-section" aria-labelledby="destination-cta-heading">
      <div className="site-container">
        <div className="destination-cta">
          <div className="destination-cta-copy">
            <p className="section-eyebrow">{content.eyebrow}</p>
            <h2 id="destination-cta-heading">{content.headline}</h2>
            <p>{content.description}</p>
          </div>
          <div className="destination-cta-actions">
            <CtaLink cta={content.primaryCta} primary />
            <CtaLink cta={content.secondaryCta} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ items }: { items: FaqViewModel[] }) {
  return (
    <section className="content-section faq-section" aria-labelledby="faq-heading">
      <div className="site-container faq-layout">
        <RevealHeading className="faq-intro">
          <p className="section-eyebrow" data-reveal-heading>Good to know</p>
          <h2 id="faq-heading" data-reveal-heading>Questions, answered simply.</h2>
          <p data-reveal-heading>Still choosing? Start a conversation with the LDC Travel team.</p>
        </RevealHeading>
        <div className="faq-list">
          {items.map((item, index) => <details className="faq-item" key={item.question} open={index === 0}><summary>{item.question}<Icon name="chevron" /></summary><p>{item.answer}</p></details>)}
        </div>
      </div>
    </section>
  );
}
