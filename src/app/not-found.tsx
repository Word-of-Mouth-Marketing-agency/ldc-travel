import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | LDC Travel",
  description: "The page you are looking for is not available.",
};

export default function NotFound() {
  return (
    <main
      style={{
        display: "grid",
        minHeight: "100svh",
        placeItems: "center",
        padding: "2rem",
        background: "var(--surface-muted)",
        color: "var(--ink)",
        fontFamily: "var(--font-ui)",
        textAlign: "center",
      }}
    >
      <div style={{ width: "min(100%, 34rem)" }}>
        <Image src="/brand/ldc-logo-navy.webp" alt="LDC Travel" width={176} height={112} priority style={{ width: "8.5rem", height: "auto", margin: "0 auto 2rem" }} />
        <p style={{ margin: 0, color: "var(--brand-navy)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>LDC Travel · Tourism Marketing</p>
        <h1 style={{ margin: "0.75rem 0 0", color: "var(--brand-navy-deep)", fontSize: "clamp(2.5rem, 10vw, 5rem)", letterSpacing: "-0.06em", lineHeight: 0.95 }}>This page took a wrong turn.</h1>
        <p style={{ margin: "1rem auto 0", maxWidth: "28rem", color: "var(--muted)", lineHeight: 1.7 }}>The destination you are looking for is not available here. Let’s get you back to the journey.</p>
        <Link href="/destinations" style={{ display: "inline-flex", marginTop: "1.75rem", padding: "0.9rem 1.25rem", borderRadius: "999px", background: "var(--brand-orange)", color: "var(--brand-navy-deep)", fontWeight: 700, textDecoration: "none" }}>
          Explore destinations
        </Link>
      </div>
    </main>
  );
}
