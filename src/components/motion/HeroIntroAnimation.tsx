"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export function HeroIntroAnimation({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".hero-eyebrow",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.5, clearProps: "transform,opacity,visibility" },
        )
        .fromTo(
          ".hero-copy h1",
          { autoAlpha: 0, y: 44 },
          { autoAlpha: 1, y: 0, duration: 0.68, clearProps: "transform,opacity,visibility" },
          "-=0.26",
        )
        .fromTo(
          ".hero-supporting-copy",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.52, clearProps: "transform,opacity,visibility" },
          "-=0.28",
        )
        .fromTo(
          ".hero-actions > *",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.46, stagger: 0.08, clearProps: "transform,opacity,visibility" },
          "-=0.18",
        );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="hero-copy">
      {children}
    </div>
  );
}
