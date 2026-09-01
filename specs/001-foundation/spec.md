# LDC Travel Foundation Specification

## Status

Foundation and Phase 1 homepage implementation complete. The approved homepage screenshot is the visual direction and review reference for the shipped `/` route.

## Assumptions and decisions

- LDC Travel is launching in Egypt only. The public site must not expose Saudi Arabia yet.
- The product is a tourism marketing and lead-generation site. There is no booking engine, checkout, payment system, customer account, or customer login.
- WhatsApp is the primary conversion. The future Contact page may add a contact form as a secondary conversion.
- English is the only public language in this phase. Content and layout must leave room for later Arabic/RTL support without adding an i18n UI now.
- Payload CMS and the public Next.js site live in one modular monolith backed by PostgreSQL.
- Admin users are the only CMS role needed now. Public CMS registration is disabled.
- Remote demo travel imagery is permitted through explicitly configured image hosts. Assets supplied in `A:/Projects/Travel-content` are reference/source assets and remain untouched.
- The current implementation phase includes the production homepage route, CMS view-model adapter, repeatable demo seed, responsive UI, and validation. Other public routes remain out of scope.

## Pre-build reality check

Verdict: **Build small**.

The scope is bounded around an existing business, a defined launch market, a real WhatsApp inquiry path, and a homepage-first delivery plan. The largest product risk is not whether the site can be built; it is whether a generic travel proposition earns qualified inquiries. The Phase 1 validation loop should instrument WhatsApp CTA clicks, qualified inquiry context, and source/landing-section attribution, then review the first ten conversations with the business before expanding content or interaction complexity.

## Objectives

1. Establish a maintainable Next.js + Payload + PostgreSQL production foundation.
2. Make the homepage's content and relationships editable through Payload from day one.
3. Model markets as data so Saudi Arabia can be added later without duplicating entire collections or hardcoding Egypt into application logic.
4. Establish a reusable WhatsApp CTA helper with optional program/destination context.
5. Prepare technical SEO, responsive accessibility, performance, and remote image boundaries before UI implementation.
6. Preserve the visual language of `A:/Projects/Travel-content/homepage-design.png` for the Phase 1 implementation handoff.

## Non-goals

- Do not implement destinations, programs, festivals, offers, services, about, blog, or contact pages now.
- Do not build booking/search widgets, date pickers, traveler selectors, checkout, payments, accounts, or public registration.
- Do not expose Saudi Arabia in public navigation, content, or seeded public data.
- Do not include a newsletter section or subscription flow.
- Do not choose or deploy the final VPS/reverse-proxy/container/process architecture.
- Do not install GSAP, Supabase, Firebase, Prisma, a separate hosted CMS, or unnecessary state-management libraries.

## User and conversion flow

1. A visitor lands on the homepage from search, social, or referral.
2. The hero establishes the LDC Travel proposition and sends the visitor to WhatsApp or the Programs route when that route is available.
3. Destination/program/event/offer content builds confidence through photography, structured details, trust benefits, and testimonials.
4. Contextual WhatsApp CTAs open a prefilled message containing the relevant content title where useful.
5. A future Contact page adds a validated server-side inquiry form; the foundation does not implement that page or an Inquiries collection.

## Approved homepage direction for Phase 1

Source: `A:/Projects/Travel-content/homepage-design.png`.

The composition to preserve:

1. Header/navigation with LDC logo, compact desktop navigation, and a prominent WhatsApp CTA.
2. Hero with large destination photography, strong navy/orange headline treatment, supporting copy, primary WhatsApp CTA, and secondary Programs CTA.
3. Trust/benefits strip overlapping the hero transition.
4. Featured Destinations.
5. Popular Travel Programs.
6. Promotional/seasonal offer banner.
7. Upcoming Festivals & Events.
8. Testimonials.
9. Latest Travel Guides.
10. FAQ.
11. Footer with contact and social links.

Implementation quality criteria for the Phase 1 implementation:

- Mobile-first layouts with intentional stacking and touch-sized controls.
- Semantic headings, landmarks, alt text, keyboard states, visible focus, and reduced-motion handling.
- Real CMS-driven content and realistic crops using responsive `next/image` sizing.
- Accessible contrast for navy, orange, teal, coral, and photography overlays.
- No booking/search widget and no newsletter section, even though the screenshot contains a newsletter block.

## Architecture

### Runtime

- Next.js App Router with TypeScript and Tailwind CSS.
- Payload CMS embedded in the same Next.js application.
- PostgreSQL through Payload's official `@payloadcms/db-postgres` adapter.
- Lexical rich text for editorial fields.
- `sharp` for Payload media resizing/focal-point support.
- Server Components by default; client components only for interactive navigation, FAQ disclosure, or other browser-only behavior.
- Motion is deferred until a concrete interaction earns it. GSAP is not part of the foundation.

### Deep modules and seams

- `src/lib/whatsapp.ts`: one small interface for building safe contextual WhatsApp URLs.
- `src/lib/seo.ts`: shared metadata and canonical URL rules.
- `src/lib/markets.ts`: market visibility and default-market policy; public callers do not hardcode country names.
- `src/collections/*`: one collection implementation per editorial domain.
- `src/globals/*`: global configuration implementations for site-wide and homepage content.
- `src/components/*`: homepage presentation modules with narrow content props; server-rendered by default with a small client navigation island.

The public page layer should depend on normalized content view models rather than Payload response shapes. Payload is the CMS adapter at the seam, not the shape every UI caller must understand.

## Project structure

```text
.
├── app/
│   ├── (frontend)/page.tsx          # temporary foundation route
│   └── (payload)/                  # Payload admin/API route handlers
├── src/
│   ├── collections/                # Users, Media, Markets, editorial collections
│   ├── globals/                    # Site Settings and Homepage
│   ├── lib/                        # deep modules and shared configuration
│   └── components/                 # future homepage modules
├── public/brand/                   # copied official LDC variants
├── docs/                           # architecture and asset decisions
├── specs/001-foundation/           # this spec and implementation plan
├── tasks/                          # plan and dependency-ordered checklist
├── payload.config.ts
├── next.config.mjs
├── .env.example
└── README.md
```

## CMS model

### Collections

- **Users** — Payload auth collection for admin users only; no public registration.
- **Media** — upload collection with alt text, focal point, and image sizes.
- **Markets** — code, name, locale, currency, default/active state, public visibility, contact/WhatsApp overrides, and SEO defaults.
- **Destinations** — title, slug, country, region/city, summaries, rich content, cover/gallery, featured flag, market availability, related programs, SEO.
- **Travel Programs** — title, slug, publishing status, short/long descriptions, destination relation, cover/gallery, duration, pricing/currency, itinerary, highlights, included/not included, accommodation notes, featured flag, market availability, optional offer relation, CTA message override, SEO.
- **Events** — title, slug, location, optional destination relation, start/end dates, summary/content, cover, featured flag, market availability, SEO.
- **Services** — title, slug, summary/content, icon key, cover, featured flag, market availability, SEO.
- **Offers** — title, slug, status, badge, headline, description, discount label, date window, image, CTA label, optional program relation, market availability, SEO.
- **Guides** — title, slug, excerpt/content, category, cover, related destinations, published date, featured flag, market availability, SEO.
- **Testimonials** — display name, supplied location, quote, optional avatar, rating, featured flag, and internal demo-content marker.
- **FAQs** — question, answer, order, enabled state, optional category.

### Globals

- **Site Settings** — site name/tagline, default market, canonical URL, contact details, WhatsApp settings, social links, default SEO, and footer copy.
- **Homepage** — hero eyebrow/headline/copy/image and two CTAs; trust benefits; selected featured destinations/programs; selected active offer; upcoming events; testimonials; guides; FAQs.

### Market strategy

Use shared collections with a `markets` relationship for availability and market-scoped fields for values likely to vary. The first public query is constrained to the active/default market, currently Egypt, by server-side configuration. Contact/WhatsApp, currency, pricing, offers, availability, and SEO can be overridden through market-linked records/settings. This avoids duplicating every collection while preserving an explicit seam for future market-specific content. Saudi Arabia is not seeded into public content in this phase.

### Inquiries recommendation

Defer the `Inquiries` collection until the Contact page is implemented. The current product has only a WhatsApp conversion and no form submission contract, retention policy, spam controls, or admin workflow to justify storing inquiries now. The WhatsApp helper and site settings establish the necessary seam without creating unused personal-data storage.

## WhatsApp architecture

Store the base number and default message in Site Settings. Expose a single helper that accepts a small context object such as `{ subjectType, subjectTitle }`, normalizes the phone number, encodes the message, and returns a `wa.me` URL. UI modules call that helper instead of embedding repeated URLs. The helper must not log message content or secrets.

## SEO architecture

- Shared metadata builder for title, description, canonical URL, and Open Graph/Twitter image.
- Editable SEO group on public editorial records and global defaults in Site Settings.
- Clean slugs and server-rendered semantic headings.
- Add `sitemap.ts` and `robots.ts` when public routes are implemented.
- Add JSON-LD only for content types with a truthful schema fit (for example, Organization, Article, Event, FAQPage where the visible page content supports it).
- No SEO package unless a concrete framework gap appears.

## Responsive, accessibility, and performance approach

- Mobile-first CSS; avoid fixed desktop card grids and horizontal overflow.
- Use logical CSS properties where practical so later RTL support does not require structural rewrites.
- Keep navigation, CTA, accordions, and carousels keyboard-operable with visible focus.
- Respect `prefers-reduced-motion` and avoid animation-only communication.
- Use meaningful CMS alt text, not filenames.
- Prioritize only the hero image; lazy-load below-the-fold media.
- Use `next/image` with explicit responsive sizes and an allowlist of remote hosts.
- Keep content sections server-rendered and avoid unnecessary client state.
- Define image aspect-ratio/crop guidance per card type before homepage implementation.

## Security and quality

- Keep `PAYLOAD_SECRET`, `DATABASE_URL`, and other secrets in environment variables only.
- Do not expose admin credentials or enable public registration.
- Validate editorial inputs at the CMS boundary and future form inputs server-side.
- Keep remote image hosts explicit; do not disable image optimization globally.
- Use Payload's authentication hardening and production secure-cookie settings when deployment is later planned.
- Keep the application a modular monolith until real scale or fault-isolation requirements justify separation.

## Acceptance criteria for the foundation and Phase 1 pass

- The project is initialized with pnpm, Next.js App Router, TypeScript, Tailwind, Payload, and PostgreSQL adapter configuration.
- The root route implements the approved Phase 1 homepage composition and remains the only public page implemented in this pass.
- Payload has admin auth, media uploads, all required editorial collections, and Site Settings/Homepage globals wired into its config.
- The CMS schema includes market-aware visibility without public Saudi content.
- Official logo variants are copied into `public/brand/` and documented with intended usage.
- `.env.example` contains variable names only.
- README includes local setup, PostgreSQL requirement, admin setup, and current scope.
- `tasks/plan.md` and `tasks/todo.md` are committed.
- Typecheck, lint, and build are run and their outcomes are recorded honestly.
- The repository is initialized and has a baseline commit if checks are coherent.

## Phase 1 implementation status

- [x] Header, responsive mobile navigation, hero, trust benefits, destinations, programs, offer, events, testimonials, guides, FAQ, and footer implemented at `/`.
- [x] Homepage sections consume a normalized Payload-backed view model with an isolated demo fallback when local CMS configuration is unavailable.
- [x] Demo fallback is development-only; production CMS/configuration failures render an explicit unavailable state and never silently serve demo content.
- [x] CMS image fields support approved remote demo imagery while preserving Payload Media upload relations for production editors.
- [x] Uploaded Payload Media is preferred over optional remote demo image URLs, and remote URLs are restricted to the configured Unsplash/Pexels hosts.
- [x] Repeatable seed mechanism added for Egypt-only demo content, homepage relationships, globals, and clearly marked placeholder testimonials.
- [x] Shared WhatsApp helper used for generic, program, event, and offer inquiry CTAs.
- [x] No newsletter, booking/search widget, contact form, checkout, Saudi public content, or additional public page implemented.
- [x] Responsive, accessibility, remote-image, type, lint, build, and local HTTP checks completed where infrastructure allowed.
- [ ] Payload admin/database seed runtime verification remains pending a local `DATABASE_URL` and `PAYLOAD_SECRET`.

## Stabilization status

- Official LDC contact and social details are aligned across Site Settings defaults, development demo data, seed data, and the homepage footer.
- PostgreSQL is available locally, but Payload admin, seed, and CMS-backed homepage behavior remain pending safe local credentials; no credentials were invented.
- The ignored `next-scaffold` temporary directory could not be removed because its contents remain locked; it is left untouched.

## Phase 1 homepage implementation scope

Phase 1 ships only `/` using CMS-driven sections in this order: Header, Hero, TrustBenefits, FeaturedDestinations, PopularPrograms, ActiveOffer, UpcomingEvents, Testimonials, LatestGuides, FAQ, Footer. It includes the reusable WhatsApp CTA, responsive behavior at phone/tablet/desktop widths, accessible interaction states, metadata, and remote image configuration. All other routes remain navigation targets/placeholders until separately scoped.
