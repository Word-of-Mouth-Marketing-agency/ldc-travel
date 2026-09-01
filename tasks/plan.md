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
