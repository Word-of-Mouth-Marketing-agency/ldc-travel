import { Icon } from "./Icon";
import { PlaceholderLink } from "../site/PlaceholderLink";

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
    <div className="section-heading">
      <div>
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h2 id={id}>{title}</h2>
        {description ? <p className="section-heading-copy">{description}</p> : null}
      </div>
      {linkLabel && linkHref ? (
        <PlaceholderLink className="section-link">
          {linkLabel}
          <Icon name="arrow" />
        </PlaceholderLink>
      ) : null}
    </div>
  );
}
