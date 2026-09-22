# Phase 5 Release Candidate QA

Date: 2026-09-21

## Scope

Final browser, responsive, accessibility, SEO, regression, and runtime checks for the destination-first public site. No deployment, VPS, production database, or schema migration work was performed.

## Browser evidence

The available browser surface was the isolated Codex in-app Chromium browser. Chrome, Edge, and Firefox connectors were not available. The responsive matrix covered 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1366, 1440, and 1920px widths. The document had no horizontal overflow, interactive labels were not clipped, and representative desktop/mobile screenshots were reviewed.

The mobile drawer passed focus trapping, Escape close, backdrop/link close, body scroll lock, and focus return. The homepage, Contact page, destination listing, and all six destination details rendered in preview mode. Invalid routes now use a branded not-found experience.

## Runtime evidence

- `UI_PREVIEW_MODE=true`: all public routes rendered without database credentials and showed the designed demo content.
- Strict mode with empty `DATABASE_URL` and `PAYLOAD_SECRET`: homepage, Contact, listing, and detail routes showed branded CMS-unavailable states without demo leakage.
- Strict mode with the configured local PostgreSQL environment: homepage, listing, Turkey detail, and Contact rendered from CMS-backed content.
- Public route image audit completed after normal scrolling with no broken images. The two obsolete broken demo image IDs were replaced, and the seed refreshes only those exact legacy URLs when encountered.

## Accessibility and regression evidence

The drawer keyboard path, native links/buttons, form labels, validation messages, `aria-invalid`, live regions, image alt text, reduced-motion paths, and heading/main landmark structure were audited. Each public route had one H1. Runtime link audit found no stale `#` or JavaScript links. Retired public concepts such as programs, prices, events, booking, checkout, payments, and newsletter were absent from the public route matrix.

The in-app browser could not reliably populate `email` and `tel` controls through its automation API; text-field preservation and all server-side validation paths were verified. No new persistent inquiry records were created during this QA pass.

## Release checks

- Payload type generation: passed.
- Payload import-map generation: passed; no new imports required.
- Typecheck: passed.
- Lint: passed with four pre-existing warnings in the initial migration file.
- Production build: passed.
- `git diff --check`: passed; only normal CRLF conversion warnings were reported by Git.

Remaining operational follow-ups are authenticated Media/admin CRUD, database restart/recovery, and backup validation. Those are separate from this public-site release-candidate QA pass.

## Phase 6.5 destination/contact UX follow-up

Date: 2026-09-22

The current release candidate is `8187c61` (`fix: simplify social and destination page ux`). This follow-up preserved the release candidate's latest destination and Contact UX while closing the application-side smoke-test prerequisites:

- Preview-mode production build passed with empty `DATABASE_URL` and `PAYLOAD_SECRET` overrides.
- `/`, `/about`, `/contact`, `/destinations`, all six destination detail routes, `/api/health`, `/robots.txt`, `/sitemap.xml`, `/icon.png`, and `/apple-icon.png` returned successfully in the local production server.
- All six destination routes use the shared reduced template, place the inquiry section immediately after the overview, keep Name/Email/Phone only, and expose the semantic `Plan This Trip` anchor to `#destination-inquiry`.
- Contact keeps the simplified regional social presentation with exactly Instagram and Facebook for Egypt and Saudi Arabia; no TikTok, LinkedIn, placeholder, or legacy regional link was present. The corrected Instagram SVG rendered with explicit dimensions and stroke attributes.
- Strict mode with empty CMS credentials continued to render branded CMS-unavailable states for the homepage, Contact, and destination detail route; demo content did not leak into normal production behavior.
- Typecheck, lint, production build, and `git diff --check` passed. Lint retains eight pre-existing unused-parameter warnings in the two migration files and no errors.

The public production origin could not be smoke-tested from this environment because requests to `https://ldc-tourism.com` were refused by the local network/proxy path. No production deployment or infrastructure mutation was performed.
