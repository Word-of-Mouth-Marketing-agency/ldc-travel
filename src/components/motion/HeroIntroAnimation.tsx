"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export function HeroIntroAnimation({ children, className = "hero-copy" }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          "[data-hero-eyebrow]",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.5, clearProps: "transform,opacity,visibility" },
        )
        .fromTo(
          "[data-hero-heading]",
          { autoAlpha: 0, y: 44 },
          { autoAlpha: 1, y: 0, duration: 0.68, clearProps: "transform,opacity,visibility" },
          "-=0.26",
        )
        .fromTo(
          "[data-hero-supporting]",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.52, clearProps: "transform,opacity,visibility" },
          "-=0.28",
        )
        .fromTo(
          "[data-hero-action]",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.46, stagger: 0.08, clearProps: "transform,opacity,visibility" },
          "-=0.18",
        );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
