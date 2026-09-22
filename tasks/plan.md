# LDC Travel Foundation and Phase 1 Implementation Plan

## Build order

1. Initialize the Next.js App Router project and package manager metadata.
2. Add Payload and PostgreSQL integration using the official same-codebase route structure.
3. Add reusable collection/global field factories and configure the CMS domain model.
4. Add the WhatsApp, market, and SEO seams without adding public UI behavior.
5. Copy and document approved brand assets; keep the reference source directory untouched.
6. Add developer documentation, environment template, scope guardrails, and phase-specific acceptance criteria.
7. Run typecheck, lint, and build. Fix only foundation issues revealed by those checks.
8. Inspect Git status and create the baseline commit if the repository is coherent.

## Phase 1 completion

9. Normalize the CMS homepage contract and add a safe demo view-model fallback.
10. Implement the homepage composition at `/` using server-first components and a small mobile navigation island.
11. Add non-destructive development seed data for the Egypt market and homepage relationships.
12. Validate generated Payload types, lint, production build, local HTTP output, scope exclusions, and Git state.

## Stabilization pass

13. Enforce development-only demo fallback and an explicit production CMS unavailable state.
14. Align verified contact/social data across defaults, seed, demo content, footer, and documentation.
15. Prefer Payload Media, validate approved remote demo image URLs, and document the image policy.
16. Re-run generated types and all repository checks; verify runtime boundaries without inventing database credentials.

## Homepage refinement pass

17. Remove the Trust/Benefits presentation and its dead CMS field without expanding homepage scope.
18. Standardize interface icons, recognizable social marks, and small CSS interactions with reduced-motion support.
19. Re-run Payload type generation and the full frontend validation suite; commit the refinement separately.

## Homepage motion polish

20. Add GSAP 3.15.0 selectively for coordinated hero and section-heading text entrance reveals, preserving server-first rendering and reduced-motion behavior.

## Contact page implementation

21. Add the focused `/contact` route using the established LDC visual system, Site Settings, shared navigation/footer, and WhatsApp conversion path.
22. Add the admin-only `Inquiries` collection and server-action submission boundary with bounded validation, honeypot protection, and explicit database-unavailable behavior.
23. Generate Payload types/import map, run the full validation suite, and record the local persistence limitation when credentials are unavailable.

## Parallelizable work

- Asset inventory/documentation can proceed independently from CMS field implementation.
- README/spec/task documentation can be written while package installation is running.
- Collection definitions are independent from the temporary frontend route once shared field factories exist.

## Sequential dependencies

- Next.js project initialization precedes Payload route integration.
- Payload package versions must be aligned before config and collection typechecking.
- Shared field factories precede collection/global definitions.
- Validation runs only after config, route files, and TypeScript paths are complete.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Next.js/Payload version mismatch | Pin the resolved versions and keep all `payload`/`@payloadcms/*` packages aligned. |
| No local PostgreSQL instance | Keep credentials out of the repo; make build independent of a live DB and document the exact local requirement. |
| Payload route boilerplate drift | Use the current official Payload route shape and isolate framework adapters from editorial modules. |
| Generic travel content does not convert | Measure WhatsApp click-through and review the first ten qualified conversations before adding complexity. |
| Future Saudi rollout leaks into Egypt UI | Require market visibility filtering at the server query seam and do not seed Saudi public records. |
| Image-heavy homepage becomes slow | Define card aspect ratios, responsive sizes, hero priority, and lazy loading before Phase 1 UI work. |

## Definition of done

The foundation and Phase 1 criteria in `specs/001-foundation/spec.md` are met, checks are recorded, the source asset folder is unchanged, only `/` is implemented, the source design direction is preserved, and no deployment work has started.

## Destination-first Phase 1 redesign

23. Review the existing homepage, mobile navigation, supplied logos, new navy/orange identity, and destination-only business model through the UI/UX design route.
24. Replace the public homepage composition with a destination-led hero, exactly six destinations, Why LDC, inspiration, destination CTA, FAQ, and footer.
25. Remove obsolete homepage CMS relationships and public preview data for programs, offers, events, testimonials, and guides without deleting their collections.
26. Add CMS fields for Why LDC, destination inspiration, destination CTA, and selected destinations; regenerate types/import map.
27. Copy supplied logo variants, update shared chrome, refresh SEO copy, scrollbar tokens, contact labels, and durable documentation.
28. Validate preview mode without PostgreSQL, strict production fallback behavior, responsive layouts, accessibility, typecheck, lint, build, and diff hygiene.

## Phase 2 destination system

29. Research Turkey, Russia, Bali, Georgia, Indonesia, and Thailand from official tourism and heritage sources; record concise source notes in `docs/destination-sources.md`.
30. Extend the Destinations collection with structured detail content while preserving legacy collections and production Media relationships.
31. Implement `/destinations` and one reusable `/destinations/[slug]` detail template with responsive hero, highlights, experiences, useful information, gallery, related destinations, FAQ, and inquiry CTA.
32. Reuse the protected Inquiries collection for destination-page leads with server-side Name, Email, and Phone validation, destination relation, source, and honeypot protection.
33. Update the centralized WhatsApp helper/configuration, homepage destination links, shared navigation/footer links, preview data, seed enrichment, and SEO metadata.
34. Validate preview and strict-mode behavior, form negative paths, generated Payload types/import map, typecheck, lint, build, responsive browser states, and diff hygiene.

## Phase 3 local CMS runtime validation

35. Confirm Docker Desktop's Linux engine and a free localhost-only database port without touching the native Windows PostgreSQL service or unrelated containers.
36. Create only the project-owned PostgreSQL service and ignored local environment, then verify database identity and health before any schema operation.
37. Generate/review/apply Payload migrations to the empty project database, run the existing seed twice, and prove idempotency with counts for destinations, globals, FAQs, and supporting records.
38. Verify the first-admin flow, CMS-backed homepage/destination/contact rendering, destination and contact inquiry persistence, admin-only inquiry access, media precedence, and logging boundaries.
39. Exercise strict CMS failure, preview-mode regression, scoped database stop/restart recovery, and the local `pg_dump -Fc` / `pg_restore --list` backup procedure.
40. Record the runtime evidence and commit only after all gates pass; production PostgreSQL and deployment remain deferred.

Phase 3 runtime evidence recorded 2026-09-21: migration, seed idempotency, strict CMS-backed routes, inquiry persistence/access control, preview regression, and public asset/link checks passed. Authenticated media/admin CRUD, database restart/recovery, and backup validation remain separate follow-up gates.

## Phase 4 editorial and SEO QA

41. Re-research and refine all six approved destination records using current official tourism, city, and UNESCO sources while retaining original concise copy.
42. Audit homepage, listing, detail, Contact, FAQ, CTA, image alt, and internal-link language for destination-first clarity and retired-model leakage.
43. Complete environment-driven metadata, canonicals, Open Graph, preview noindex, sitemap, robots, and limited truthful structured data.
44. Clarify Destination CMS editorial help text, preserve idempotent non-destructive seed behavior, update durable documentation, and validate the public route matrix.

## Phase 5 release-candidate browser QA

45. Run the responsive viewport matrix, representative visual review, route smoke checks, mobile drawer keyboard checks, form validation checks, image audit, link audit, and branded 404 regression checks.
46. Verify preview-mode rendering without database credentials, strict CMS-unavailable behavior without credentials, and CMS-backed rendering with the configured local PostgreSQL environment.
47. Fix only release-blocking regressions found during QA, regenerate Payload artifacts when relevant, and record final validation evidence without beginning deployment work.

Phase 5 release-candidate QA completed 2026-09-21: the public route matrix, responsive overflow checks, drawer focus trap, validation error paths, image loading, metadata, strict failure mode, preview mode, and local CMS-backed rendering passed. The only browser-tool limitation was direct entry into email/tel controls in the isolated in-app browser; server-side validation and prior local persistence evidence remain intact.

## Phase 6 operational hardening and deployment preparation

48. Audit the repository's production contract, media persistence model, startup/runtime versions, Payload security boundaries, and health behavior without changing production infrastructure.
49. Validate a local PostgreSQL custom-format backup and isolated restore, and record the recovery evidence without overwriting the active development database.
50. Create the production environment reference, deployment runbook, rollback strategy, and launch checklist; keep the final domain and production database choice as explicit human inputs.
51. Perform only an allowed read-only WOM-VPS-01 audit when access is available; otherwise report the access blocker and treat historical server notes as stale.

Phase 6 preparation completed 2026-09-21 without deployment. Local backup/restore passed, Payload admin validation stopped at first-user setup, the VPS SSH audit was unavailable, and the remaining production inputs are documented for Phase 7.

## Phase 6.5 deployment-prerequisite closure

52. Reconfirm the authoritative release candidate and upstream alignment without staging unrelated working-tree changes.
53. Re-run production-style preview and strict-CMS-failure route smoke tests against the current release candidate.
54. Recheck the latest destination inquiry placement/anchor and the simplified Contact regional social links after the UX refinement.
55. Record application-side gate results separately from the still-open operator, database, media, VPS, OpenLiteSpeed, DNS, and credential inputs; do not begin deployment.

Phase 6.5 application-side closure completed 2026-09-22 against `8187c61`. The local production build and public route smoke matrix passed, including `#destination-inquiry` placement and the simplified Contact social section. The public origin was not reachable from this environment, and all Phase 7 external deployment gates remain open.
