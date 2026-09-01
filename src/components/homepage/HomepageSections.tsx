import Image from "next/image";
import Link from "next/link";

import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import type {
  DestinationViewModel,
  EventViewModel,
  FaqViewModel,
  GuideViewModel,
  ImageSource,
  OfferViewModel,
  ProgramViewModel,
  TestimonialViewModel,
} from "../../content/homepage-demo";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";

function CoverImage({ image, className = "" }: { image: ImageSource; className?: string }) {
  return <Image className={`cover-image ${className}`} src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 92vw, (max-width: 1279px) 30vw, 240px" />;
}

export function DestinationsSection({ items }: { items: DestinationViewModel[] }) {
  return (
    <section className="content-section destinations-section" aria-labelledby="destinations-heading">
      <div className="site-container">
        <SectionHeading id="destinations-heading" title="Featured destinations" linkLabel="View all destinations" linkHref="/destinations" />
        <div className="destination-grid">
          {items.slice(0, 5).map((destination) => (
            <Link className="destination-card" href={destination.href} key={`${destination.title}-${destination.country}`}>
              <CoverImage image={destination.image} />
              <span className="card-scrim" />
              <div className="destination-card-copy">
                <span className="destination-country"><Icon name="pin" /> {destination.country}</span>
                <h3>{destination.title}</h3>
                <p>{destination.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const formatPrice = (amount: number, currency: string) => `${currency} ${new Intl.NumberFormat("en-EG").format(amount)}`;

export function ProgramsSection({ items, whatsappConfig }: { items: ProgramViewModel[]; whatsappConfig: WhatsAppConfig }) {
  return (
    <section className="content-section programs-section" aria-labelledby="programs-heading">
      <div className="site-container">
        <SectionHeading id="programs-heading" title="Popular travel programs" linkLabel="View all programs" linkHref="/programs" />
        <div className="program-grid">
          {items.slice(0, 5).map((program) => (
            <article className="program-card" key={program.title}>
              <div className="program-image"><CoverImage image={program.image} /><span className="duration-badge"><Icon name="clock" size={15} />{program.durationDays} days</span></div>
              <div className="program-card-body">
                <p className="card-kicker">{program.destination}</p>
                <h3>{program.title}</h3>
                <p className="program-summary">{program.summary}</p>
                <div className="program-card-footer">
                  <p><span>From</span><strong>{formatPrice(program.amount, program.currency)}</strong><small>/ {program.unit}</small></p>
                  <a href={createWhatsAppUrl(whatsappConfig, { title: program.title })} target="_blank" rel="noreferrer" aria-label={`Ask about ${program.title}`}><Icon name="arrow" /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OfferSection({ offer }: { offer?: OfferViewModel }) {
  if (!offer) return null;
  return (
    <section className="site-container offer-section" aria-labelledby="offer-heading">
      <div className="offer-banner">
        {offer.image ? <Image className="offer-image" src={offer.image.src} alt={offer.image.alt} fill sizes="(max-width: 767px) 100vw, 60vw" /> : null}
        <div className="offer-overlay" />
        <div className="offer-copy">
          {offer.discountLabel ? <span className="offer-badge">{offer.discountLabel}</span> : null}
          <p className="section-eyebrow">{offer.badge ?? offer.title}</p>
          <h2 id="offer-heading">{offer.headline}</h2>
          <p>{offer.description}</p>
          <a className="button button-light" href={offer.cta.href} target={offer.cta.external ? "_blank" : undefined} rel={offer.cta.external ? "noreferrer" : undefined}>{offer.cta.label}<Icon name="arrow" /></a>
        </div>
      </div>
    </section>
  );
}

export function EventsSection({ items }: { items: EventViewModel[] }) {
  return (
    <section className="content-section" aria-labelledby="events-heading">
      <div className="site-container">
        <SectionHeading id="events-heading" title="Upcoming festivals and events" linkLabel="View all events" linkHref="/festivals" />
        <div className="event-grid">
          {items.slice(0, 5).map((event) => (
            <article className="event-card" key={event.title}>
              <div className="event-image"><CoverImage image={event.image} /><div className="date-tile"><span>{event.month}</span><strong>{event.day}</strong></div></div>
              <div className="event-card-body"><h3>{event.title}</h3><p className="event-date"><Icon name="calendar" /> {event.date}</p><p>{event.location}</p><p className="event-summary">{event.summary}</p><a href={event.cta.href} target={event.cta.external ? "_blank" : undefined} rel={event.cta.external ? "noreferrer" : undefined}>{event.cta.label} <Icon name="arrow" /></a></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection({ items }: { items: TestimonialViewModel[] }) {
  return (
    <section className="content-section testimonials-section" aria-labelledby="testimonials-heading">
      <div className="site-container">
        <SectionHeading id="testimonials-heading" title="A few kind words" linkLabel="View all reviews" linkHref="/about" />
        <div className="testimonial-grid">
          {items.slice(0, 3).map((testimonial) => (
            <figure className="testimonial-card" key={testimonial.displayName}>
              <Icon name="quote" className="quote-mark" size={38} strokeWidth={1.7} />
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption><span className="avatar-placeholder" aria-hidden="true">{testimonial.displayName.charAt(0)}</span><span><strong>{testimonial.displayName}</strong><small>{testimonial.location}</small></span><span className="rating" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>{Array.from({ length: testimonial.rating }).map((_, index) => <Icon name="star" className="rating-star" size={15} key={index} />)}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GuidesSection({ items }: { items: GuideViewModel[] }) {
  return (
    <section className="content-section guides-section" aria-labelledby="guides-heading">
      <div className="site-container">
        <SectionHeading id="guides-heading" title="Latest travel guides" description="A little inspiration for your next journey." linkLabel="Visit the travel journal" linkHref="/blog" />
        <div className="guide-grid">
          {items.slice(0, 3).map((guide) => (
            <article className="guide-card" key={guide.title}>
              <Link className="guide-image" href={guide.href}><CoverImage image={guide.image} /></Link>
              <div className="guide-card-body"><p className="card-kicker">{guide.category}</p><h3><Link href={guide.href}>{guide.title}</Link></h3><p>{guide.excerpt}</p><Link className="text-link" href={guide.href}>Read guide <Icon name="arrow" /></Link></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ items }: { items: FaqViewModel[] }) {
  return (
    <section className="content-section faq-section" aria-labelledby="faq-heading">
      <div className="site-container faq-layout">
        <div className="faq-intro"><p className="section-eyebrow">Need to know</p><h2 id="faq-heading">Questions, answered simply.</h2><p>Still planning? Start a conversation with the LDC Travel team on WhatsApp.</p></div>
        <div className="faq-list">
          {items.map((item, index) => <details className="faq-item" key={item.question} open={index === 0}><summary>{item.question}<Icon name="chevron" /></summary><p>{item.answer}</p></details>)}
        </div>
      </div>
    </section>
  );
}
