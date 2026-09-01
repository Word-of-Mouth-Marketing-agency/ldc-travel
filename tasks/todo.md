# LDC Travel Foundation and Phase 1 Checklist

## Specification and scope

- [x] Review the approved homepage reference image.
- [x] Record the no-homepage-UI and no-newsletter constraints.
- [x] Record the Egypt-first / Saudi-ready market strategy.
- [x] Record the WhatsApp-first conversion model.
- [x] Record the deferred Inquiries recommendation.

## Foundation

- [x] Initialize Next.js with pnpm, TypeScript, App Router, Tailwind, and linting.
- [x] Add Payload, Lexical, PostgreSQL adapter, and image processing support.
- [x] Add Payload route wrappers and config path aliases.
- [x] Define admin users, media, market, editorial collections, and globals.
- [x] Add temporary frontend route only.

## Assets and documentation

- [x] Copy selected official logo variants into `public/brand/`.
- [x] Document every source asset inspected and intended usage.
- [x] Add `.env.example` with names only.
- [x] Add README with local setup and scope boundaries.
- [x] Add architecture and Phase 1 handoff notes.
- [x] Create/update the LDC Travel Brain project note.

## Phase 1 homepage

- [x] Replace the foundation placeholder with the approved homepage composition at `/`.
- [x] Implement responsive Header, Hero, Trust Benefits, Destinations, Programs, Offer, Events, Testimonials, Guides, FAQ, and Footer sections.
- [x] Use the shared WhatsApp helper for generic and contextual inquiry CTAs.
- [x] Add a CMS-backed homepage adapter with an isolated demo fallback.
- [x] Add optional remote demo image fields while preserving Payload Media relations.
- [x] Add a repeatable, non-destructive Egypt-only demo seed script.
- [x] Exclude newsletter, booking/search, contact form, Saudi public content, and all other public pages.
- [x] Validate responsive CSS, semantic landmarks, keyboard states, alt text, reduced motion, and scope exclusions.

## Stabilization pass

- [x] Keep demo homepage data development-only and render an explicit production unavailable state when CMS access is missing.
- [x] Align the supplied LDC contact details and social URLs across CMS defaults, demo data, seed data, footer, and docs.
- [x] Prefer uploaded Payload Media and safely reject malformed or unapproved remote image URLs.
- [x] Document the local PostgreSQL/Payload verification boundary without inventing credentials.

## Verification

- [x] Run dependency install successfully.
- [x] Run typecheck.
- [x] Run lint.
- [x] Run production build.
- [x] Inspect Git status.
- [ ] Create baseline commit if checks are coherent.
- [ ] Create separate Phase 1 commit after the foundation baseline exists and Git author identity is configured.
