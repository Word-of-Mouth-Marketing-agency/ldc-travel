"use client";

import Image from "next/image";
import { useRef } from "react";
import { useEffect, useState } from "react";

import type { SocialLink } from "../../content/homepage-demo";
import { Icon } from "../homepage/Icon";
import { SocialIcon } from "./SocialIcon";
import { WhatsAppIcon } from "./WhatsAppIcon";

type NavItem = { label: string; href: string };

export function MobileNav({ activePath = "/", items, socialLinks, whatsappHref }: { activePath?: string; items: NavItem[]; socialLinks: SocialLink[]; whatsappHref: string }) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      if (!wasOpenRef.current) return undefined;
      wasOpenRef.current = false;
      const frame = window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      return () => window.cancelAnimationFrame(frame);
    }

    wasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="mobile-nav">
      <button
        ref={menuButtonRef}
        type="button"
        className="mobile-menu-button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-haspopup="dialog"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
      {open ? (
        <>
          <button type="button" className="mobile-menu-backdrop" tabIndex={-1} aria-label="Close navigation menu" onClick={() => setOpen(false)} />
          <aside id="mobile-navigation" ref={drawerRef} className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="LDC Travel navigation">
            <div className="mobile-menu-header">
              <Image src="/brand/main-logo.webp" alt="LDC Travel" width={82} height={82} className="mobile-menu-logo" />
              <button ref={closeButtonRef} type="button" className="mobile-menu-close" aria-label="Close navigation menu" onClick={() => setOpen(false)}>
                <Icon name="close" size={21} />
              </button>
            </div>
            <nav aria-label="Mobile navigation">
              {items.map((item) => (
                <a key={item.label} className={item.href === activePath ? "active" : ""} href={item.href} aria-current={item.href === activePath ? "page" : undefined} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              ))}
            </nav>
            <a className="button button-primary mobile-menu-cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Inquire on WhatsApp
            </a>
            <div className="mobile-menu-social">
              <p>Follow LDC Travel</p>
              <div className="mobile-menu-social-links">
                {socialLinks.filter((social) => social.url && ["instagram", "facebook", "tiktok", "linkedin"].includes(social.label.toLowerCase())).map((social) => (
                  <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`Follow LDC Travel on ${social.label}`}>
                    <SocialIcon label={social.label} />
                  </a>
                ))}
              </div>
            </div>
            <div className="mobile-menu-footer">
              <strong>LDC Travel</strong>
              <span>Tourism Marketing</span>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
