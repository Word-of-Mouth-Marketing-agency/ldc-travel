import Link from "next/link";

import { Icon } from "./Icon";

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
        <Link className="section-link" href={linkHref}>
          {linkLabel}
          <Icon name="arrow" />
        </Link>
      ) : null}
    </div>
  );
}
