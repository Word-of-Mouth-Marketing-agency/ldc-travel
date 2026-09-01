import Image from "next/image";
import Link from "next/link";

import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { Icon } from "../homepage/Icon";
import type { SiteViewModel } from "../../content/homepage-demo";

const groups = [
  { title: "Explore", links: [{ label: "Destinations", href: "/destinations" }, { label: "Travel Programs", href: "/programs" }, { label: "Offers", href: "/offers" }] },
  { title: "Discover", links: [{ label: "Festivals & Events", href: "/festivals" }, { label: "Travel Guides", href: "/blog" }, { label: "About Us", href: "/about" }] },
  { title: "Connect", links: [{ label: "Contact Us", href: "/contact" }, { label: "Our Services", href: "/services" }] },
];

export function Footer({ site, whatsappConfig }: { site: SiteViewModel; whatsappConfig: WhatsAppConfig }) {
  return (
    <footer className="site-footer">
      <div className="footer-wave" aria-hidden="true" />
      <div className="site-container footer-main">
        <div className="footer-brand-column">
          <Image src="/brand/white-logo.webp" alt="LDC Travel" width={88} height={88} className="footer-logo" />
          <p className="footer-tagline">{site.tagline}</p>
          <p>{site.footerCopy}</p>
          <div className="social-links" aria-label="LDC Travel social links">
            {site.socialLinks.map((social) => social.url ? (
              <a key={social.label} href={social.url} aria-label={social.label} target="_blank" rel="noreferrer">
                {social.label.slice(0, 2)}
              </a>
            ) : (
              <span key={social.label} aria-label={`${social.label} link pending`}>{social.label.slice(0, 2)}</span>
            ))}
          </div>
        </div>
        {groups.map((group) => (
          <div className="footer-link-column" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </div>
        ))}
        <div className="footer-contact-column">
          <h2>Egypt office</h2>
          <p><Icon name="pin" /> {site.office}</p>
          <a href={createWhatsAppUrl(whatsappConfig)} target="_blank" rel="noreferrer"><Icon name="chat" /> {site.whatsappDisplay}</a>
          <a href={`mailto:${site.reservationsEmail}`}><Icon name="arrow" /> {site.reservationsEmail}</a>
          <a href={`mailto:${site.salesEmail}`}><Icon name="arrow" /> {site.salesEmail}</a>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <p>© {new Date().getFullYear()} LDC Travel. All rights reserved.</p>
        <p>Made for travelers with care <span aria-hidden="true">♥</span></p>
      </div>
    </footer>
  );
}
