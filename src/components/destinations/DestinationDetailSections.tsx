import Link from "next/link";

import type { DestinationDetailViewModel } from "../../content/destinations";
import type { DestinationViewModel } from "../../content/homepage-demo";
import { Icon, type IconName } from "../homepage/Icon";
import { SafeImage } from "../site/SafeImage";

const destinationIcons: IconName[] = ["city", "compass", "globe", "leaf", "message", "moon", "mountain", "sparkles", "utensils", "waves"];

function ExperienceIcon({ name }: { name: string }) {
  const icon = destinationIcons.includes(name as IconName) ? name as IconName : "sparkles";
  return <Icon name={icon} size={22} />;
}

export function DestinationHero({ destination, whatsappHref }: { destination: DestinationDetailViewModel; whatsappHref: string }) {
  return (
    <section className="destination-detail-hero" aria-labelledby="destination-detail-title">
      <div className="destination-detail-hero-image"><SafeImage src={destination.heroImage.src} alt={destination.heroImage.alt} priority sizes="(max-width: 767px) 100vw, 72vw" /></div>
      <div className="destination-detail-hero-wash" />
      <div className="site-container destination-detail-hero-inner">
        <nav className="destination-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/destinations">Destinations</Link><span aria-hidden="true">/</span><span aria-current="page">{destination.title}</span></nav>
        <div className="destination-detail-hero-copy">
          <p className="section-eyebrow">{destination.eyebrow}</p>
          <h1 id="destination-detail-title">{destination.title}</h1>
          <p>{destination.summary}</p>
          <div className="destination-detail-hero-actions">
            <a className="button button-light" href="#destination-inquiry">Plan This Trip <Icon name="arrow" size={16} /></a>
            <a className="button button-ghost-light" href={whatsappHref} target="_blank" rel="noopener noreferrer">Ask about {destination.title} <Icon name="arrow-up-right" size={16} /></a>
          </div>
        </div>
        <div className="destination-detail-hero-meta"><span>{destination.country}</span><span aria-hidden="true">·</span><span>{destination.regionOrCity}</span></div>
      </div>
    </section>
  );
}

export function DestinationOverview({ destination }: { destination: DestinationDetailViewModel }) {
  return (
    <section className="content-section destination-overview-section" aria-labelledby="destination-overview-heading">
      <div className="site-container destination-overview-grid">
        <div className="destination-overview-copy"><p className="section-eyebrow">A closer look</p><h2 id="destination-overview-heading">A destination with more than one story.</h2><p>{destination.overview}</p></div>
        <div className="destination-information-card"><p className="section-eyebrow">Useful to know</p><dl>{destination.usefulInformation.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>
      </div>
    </section>
  );
}

export function DestinationHighlights({ destination }: { destination: DestinationDetailViewModel }) {
  return (
    <section className="content-section destination-highlights-section" aria-labelledby="destination-highlights-heading">
      <div className="site-container"><div className="section-heading"><div><p className="section-eyebrow">Places to discover</p><h2 id="destination-highlights-heading">Make room for the details.</h2></div></div><div className="destination-highlights-grid">{destination.highlights.map((highlight, index) => <article className="destination-highlight-card" key={highlight.title}><div className="destination-highlight-image"><SafeImage src={highlight.image.src} alt={highlight.image.alt} sizes="(max-width: 767px) 100vw, (max-width: 1199px) 33vw, 30vw" /></div><div className="destination-highlight-copy"><span>0{index + 1}</span><h3>{highlight.title}</h3><p>{highlight.description}</p></div></article>)}</div></div>
    </section>
  );
}

export function DestinationExperiences({ destination }: { destination: DestinationDetailViewModel }) {
  return (
    <section className="content-section destination-experiences-section" aria-labelledby="destination-experiences-heading">
      <div className="site-container destination-experiences-grid"><div className="destination-experiences-intro"><p className="section-eyebrow">Travel by feeling</p><h2 id="destination-experiences-heading">Choose the moments you want more of.</h2><p>Use these ideas as a starting point. Your inquiry can be as specific or open-ended as you like.</p></div><div className="destination-experiences-list">{destination.experiences.map((experience, index) => <article className="destination-experience" key={experience.title}><span className="destination-experience-number">0{index + 1}</span><span className="destination-experience-icon"><ExperienceIcon name={experience.icon} /></span><div><h3>{experience.title}</h3><p>{experience.description}</p></div></article>)}</div></div>
    </section>
  );
}

export function DestinationSeasonSection({ destination }: { destination: DestinationDetailViewModel }) {
  return (
    <section className="content-section destination-season-section" aria-labelledby="destination-season-heading">
      <div className="site-container destination-season-card"><div><p className="section-eyebrow">Plan with context</p><h2 id="destination-season-heading">When might it suit you?</h2><p>{destination.bestTimeToVisit}</p></div><span className="destination-season-mark" aria-hidden="true"><Icon name="compass" size={38} strokeWidth={1.4} /></span></div>
    </section>
  );
}

export function DestinationGallery({ destination }: { destination: DestinationDetailViewModel }) {
  return (
    <section className="content-section destination-gallery-section" aria-labelledby="destination-gallery-heading">
      <div className="site-container"><div className="section-heading"><div><p className="section-eyebrow">A sense of place</p><h2 id="destination-gallery-heading">See where the story could take you.</h2></div></div><div className="destination-gallery-grid">{destination.gallery.slice(0, 4).map((image, index) => <div className={`destination-gallery-item destination-gallery-item-${index + 1}`} key={image.src}><SafeImage src={image.src} alt={image.alt} sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 42vw" /></div>)}</div></div>
    </section>
  );
}

export function RelatedDestinations({ destinations }: { destinations: DestinationViewModel[] }) {
  if (!destinations.length) return null;
  return <section className="content-section related-destinations-section" aria-labelledby="related-destinations-heading"><div className="site-container"><div className="section-heading"><div><p className="section-eyebrow">Keep exploring</p><h2 id="related-destinations-heading">You might also like.</h2></div><Link className="section-link" href="/destinations">View all destinations <Icon name="arrow" size={16} /></Link></div><div className="related-destinations-grid">{destinations.map((destination) => <Link className="related-destination-card" href={destination.href} key={destination.slug}><SafeImage src={destination.image.src} alt={destination.image.alt} sizes="(max-width: 767px) 100vw, 50vw" /><span className="card-scrim" /><span className="related-destination-copy"><small>{destination.country}</small><strong>{destination.title}</strong><span>Explore <Icon name="arrow-up-right" size={15} /></span></span></Link>)}</div></div></section>;
}
