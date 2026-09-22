import Image from "next/image";
import Link from "next/link";

import { createPublicWhatsAppConfig } from "../../lib/public-contact";
import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { Icon } from "../homepage/Icon";
import { PlaceholderLink } from "./PlaceholderLink";
import { WhatsAppIcon } from "./WhatsAppIcon";
import type { SiteViewModel } from "../../content/homepage-demo";

const groups = [
  { title: "Explore", links: [{ label: "Destinations", href: "/destinations" }, { label: "About", href: "/about" }, { label: "Why LDC Travel", href: "/#why-ldc" }, { label: "Inspiration", href: "/#inspiration" }] },
  { title: "Company", links: [{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }] },
];

export function Footer({ site, whatsappConfig }: { site: SiteViewModel; whatsappConfig: WhatsAppConfig }) {
  const egyptWhatsappHref = createWhatsAppUrl(createPublicWhatsAppConfig(site.egyptWhatsappNumber));

  return (
    <footer className="site-footer">
      <div className="site-container footer-main">
        <div className="footer-brand-column">
          <Image src="/brand/ldc-logo-orange.webp" alt="LDC Travel" width={176} height={112} className="footer-logo" />
          <p className="footer-tagline">{site.tagline}</p>
          <p>{site.footerCopy}</p>
        </div>
        {groups.map((group) => (
          <div className="footer-link-column" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((link) => link.href === "#" ? <PlaceholderLink key={link.label}>{link.label}</PlaceholderLink> : <Link key={link.label} href={link.href}>{link.label}</Link>)}
          </div>
        ))}
        <div className="footer-contact-column">
          <h2>Our offices</h2>
          <div className="footer-office-group">
            <p className="footer-office-label">Egypt</p>
            <p><Icon name="pin" /> {site.office}</p>
            <a href={egyptWhatsappHref} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={16} /> {site.egyptWhatsappDisplay}</a>
          </div>
          <div className="footer-office-group">
            <p className="footer-office-label">Saudi Arabia</p>
            <a href={createWhatsAppUrl(whatsappConfig)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={16} /> {site.whatsappDisplay}</a>
          </div>
          <a href={`mailto:${site.email}`}><Icon name="mail" /> {site.email}</a>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <p>© {new Date().getFullYear()} LDC Travel. All rights reserved.</p>
        <p>Powered by <a className="word-of-mouth-credit" href="https://wordofmoutheg.com" target="_blank" rel="noopener noreferrer">WORD OF MOUTH</a></p>
      </div>
    </footer>
  );
}
