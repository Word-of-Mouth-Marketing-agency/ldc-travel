import Link from "next/link";

import type { DestinationViewModel } from "../../content/homepage-demo";
import { Icon } from "../homepage/Icon";
import { SafeImage } from "../site/SafeImage";

export function DestinationCard({ destination, index }: { destination: DestinationViewModel; index: number }) {
  return (
    <Link className="destination-list-card" href={destination.href} aria-label={`Explore ${destination.title}`}>
      <div className="destination-list-card-image">
        <SafeImage src={destination.image.src} alt={destination.image.alt} sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw" />
        <span className="destination-list-card-index">0{index + 1}</span>
      </div>
      <div className="destination-list-card-copy">
        <p className="destination-country">{destination.country}<span aria-hidden="true">·</span>{destination.regionOrCity}</p>
        <h2>{destination.title}</h2>
        <p>{destination.summary}</p>
        <span className="text-link">Explore destination <Icon name="arrow-up-right" size={16} /></span>
      </div>
    </Link>
  );
}
