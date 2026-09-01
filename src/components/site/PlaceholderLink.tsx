"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type PlaceholderLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  children: ReactNode;
};

export function PlaceholderLink({ children, ...props }: PlaceholderLinkProps) {
  return (
    <a {...props} href="#" onClick={(event) => event.preventDefault()}>
      {children}
    </a>
  );
}
