"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function RevealHeading({ children, className = "section-heading" }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = gsap.utils.toArray<HTMLElement>("[data-reveal-heading]", root);
    if (!targets.length) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          ease: "power3.out",
          stagger: 0.07,
          clearProps: "transform,opacity,visibility",
          immediateRender: false,
          scrollTrigger: {
            trigger: root,
            start: "top 86%",
            once: true,
          },
        },
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
