import Image from "next/image";
import Link from "next/link";

import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { Icon } from "../homepage/Icon";
import { SocialIcon } from "./SocialIcon";
import { PlaceholderLink } from "./PlaceholderLink";
import { WhatsAppIcon } from "./WhatsAppIcon";
import type { SiteViewModel } from "../../content/homepage-demo";

const groups = [
  { title: "Explore", links: [{ label: "Destinations", href: "#" }, { label: "Travel Programs", href: "#" }, { label: "Offers", href: "#" }] },
  { title: "Discover", links: [{ label: "Festivals & Events", href: "#" }, { label: "Travel Guides", href: "#" }, { label: "About Us", href: "#" }] },
  { title: "Connect", links: [{ label: "Contact Us", href: "/contact" }, { label: "Our Services", href: "#" }] },
];

export function Footer({ site, whatsappConfig }: { site: SiteViewModel; whatsappConfig: WhatsAppConfig }) {
  return (
    <footer className="site-footer">
      <div className="site-container footer-main">
        <div className="footer-brand-column">
          <Image src="/brand/white-logo.webp" alt="LDC Travel" width={88} height={88} className="footer-logo" />
          <p className="footer-tagline">{site.tagline}</p>
          <p>{site.footerCopy}</p>
          <div className="social-links" aria-label="LDC Travel social links">
            {site.socialLinks.map((social) => social.url ? (
              <a key={social.label} href={social.url} aria-label={social.label} target="_blank" rel="noreferrer">
                <SocialIcon label={social.label} />
              </a>
            ) : (
              <span key={social.label} aria-label={`${social.label} link pending`}><SocialIcon label={social.label} /></span>
            ))}
          </div>
        </div>
        {groups.map((group) => (
          <div className="footer-link-column" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((link) => link.href === "#" ? <PlaceholderLink key={link.label}>{link.label}</PlaceholderLink> : <Link key={link.label} href={link.href}>{link.label}</Link>)}
          </div>
        ))}
        <div className="footer-contact-column">
          <h2>Egypt office</h2>
          <p><Icon name="pin" /> {site.office}</p>
          <a href={createWhatsAppUrl(whatsappConfig)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> {site.whatsappDisplay}</a>
          <a href={`mailto:${site.reservationsEmail}`}><Icon name="mail" /> {site.reservationsEmail}</a>
          <a href={`mailto:${site.salesEmail}`}><Icon name="mail" /> {site.salesEmail}</a>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <p>© {new Date().getFullYear()} LDC Travel. All rights reserved.</p>
        <p>Powered by <a className="word-of-mouth-credit" href="https://wordofmoutheg.com" target="_blank" rel="noopener noreferrer">WORD OF MOUTH</a></p>
      </div>
    </footer>
  );
}
