"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Icon } from "../homepage/Icon";

type NavItem = { label: string; href: string };

export function MobileNav({ items, whatsappHref }: { items: NavItem[]; whatsappHref: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-menu-button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
      {open ? (
        <div id="mobile-navigation" className="mobile-menu-panel">
          <nav aria-label="Mobile navigation">
            {items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <a className="button button-primary mobile-menu-cta" href={whatsappHref} target="_blank" rel="noreferrer">
            <Icon name="chat" />
            Inquire on WhatsApp
          </a>
        </div>
      ) : null}
    </div>
  );
}
