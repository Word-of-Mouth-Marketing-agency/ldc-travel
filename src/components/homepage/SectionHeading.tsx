import { Icon } from "./Icon";
import { PlaceholderLink } from "../site/PlaceholderLink";
import { RevealHeading } from "../motion/RevealHeading";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  id?: string;
  description?: string;
  linkLabel?: string;
  linkHref?: string;
};

export function SectionHeading({ eyebrow, title, id, description, linkLabel, linkHref }: SectionHeadingProps) {
  return (
    <RevealHeading>
      <div>
        {eyebrow ? <p className="section-eyebrow" data-reveal-heading>{eyebrow}</p> : null}
        <h2 id={id} data-reveal-heading>{title}</h2>
        {description ? <p className="section-heading-copy" data-reveal-heading>{description}</p> : null}
      </div>
      {linkLabel && linkHref ? (
        <PlaceholderLink className="section-link" data-reveal-heading>
          {linkLabel}
          <Icon name="arrow" />
        </PlaceholderLink>
      ) : null}
    </RevealHeading>
  );
}
