# LDC Travel Production Environment Contract

This is a variable-name-only contract for the future WOM-VPS-01 deployment. Never store real values, passwords, tokens, or connection strings in this document or in Git.

| Variable | Required | Secret | Production meaning | Safe example shape |
|---|---:|---:|---|---|
| `DATABASE_URL` | Yes | Yes | Dedicated LDC PostgreSQL database only; never reuse another workload's database or credentials. | `postgresql://<LDC_DB_USER>:<PASSWORD>@127.0.0.1:<PORT>/ldc_travel_prod` |
| `PAYLOAD_SECRET` | Yes | Yes | Long, random Payload auth/session secret stored in the deployment secret store. | `<GENERATED_RANDOM_SECRET>` |
| `NEXT_PUBLIC_SITE_URL` | Yes | No | Final canonical HTTPS origin. The confirmed production domain is not yet supplied. | `https://<FINAL_HTTPS_DOMAIN>` |
| `PAYLOAD_MEDIA_DIR` | Yes | No | Persistent media directory outside release folders. | `/srv/ldc-travel/media` |
| `PORT` | Yes | No | Localhost-only application port selected after a fresh VPS port audit. | `31xx` |
| `HOSTNAME` | Optional | No | Keep the app bound to loopback; the current start script explicitly passes `127.0.0.1`. | `127.0.0.1` |
| `NODE_ENV` | Yes | No | Must be `production`. | `production` |
| `UI_PREVIEW_MODE` | Yes | No | Must be empty or `false` in real production. `true` is only for the temporary database-free UI preview. | `false` |
| `NEXT_PUBLIC_LAUNCH_MARKET_CODE` | Optional | No | Leave unset unless the launch market needs an explicit deployment override; the app currently resolves the configured launch market. | `EG` |

## Required production invariants

- `NEXT_PUBLIC_SITE_URL` remains blocked until the client supplies the real HTTPS domain.
- `DATABASE_URL` points to an LDC-owned database/user and does not reuse Graquamarine, MariaDB, Redis, or another application's database.
- `PAYLOAD_MEDIA_DIR` is persistent across releases and rollbacks, owned by the application runtime user, and included in the media backup scope.
- The Node process listens only on `127.0.0.1:<PORT>` and is reachable publicly only through the existing OpenLiteSpeed HTTPS vhost.
- `UI_PREVIEW_MODE=true` is never enabled on the real production site.
- Secrets are injected by the deployment environment and are never committed, echoed, or placed in release directories.

## Current application contract

The repository requires Node `>=20.9.0` and pnpm `11.1.1` through `package.json`. The exact current development runtime was Node `v24.13.1`; production should use a pinned supported Node LTS release, preferably Node 20 or another explicitly approved compatible version, rather than inheriting the workstation version. The app uses Payload `3.88.0`, Next `16.3.3`, and the PostgreSQL adapter `@payloadcms/db-postgres` `3.88.0`.

The start command is `pnpm start -- -p <PORT>`, and the package script forces `--hostname 127.0.0.1`. The production flow is therefore: locked install → `pnpm build` → process manager starts `pnpm start -- -p <PORT>` with the production environment.

## Media policy

Payload currently uses local storage with `PAYLOAD_MEDIA_DIR` or the development fallback `media`. Payload Media is preferred over remote demo URLs. Production should use a path such as `/srv/ldc-travel/media`, with ownership and permissions limited to the app runtime and deployment operators. Back up the database before media changes, then capture the persistent media tree as part of the same recovery set. Never store uploads inside a release directory.

The Media collection currently accepts raster web images and generates thumbnail, card, and hero derivatives. Payload's documented default multipart limits are 20 MiB per file and 50 MiB per request; before launch, validate a version-compatible lower application/server limit appropriate for this 2-vCPU host. No upload test was run because admin authentication is not yet available.

## Security audit findings

- Payload Users and Inquiries are not publicly readable; anonymous inquiry creation returns `403`, and Inquiries create access is explicitly disabled because public submissions use server actions with `overrideAccess`.
- Homepage and Site Settings are intentionally public-read because the server-rendered site consumes them. Their update operations require an authenticated Payload user.
- The `/admin` and Payload `/api` surfaces remain application routes. Production must provide the real HTTPS origin so Payload CORS/CSRF configuration is constrained, and the OLS vhost/process policy must not expose the Node listener directly.
- The current local database exposes only the seeded public destination/market read surfaces; legacy collections were empty during the audit. If legacy records are ever repopulated, their public API read policy should be reviewed before launch because those collections are no longer part of the public product model.
- Media uploads now allow raster web images only (`jpeg`, `png`, `webp`, `avif`); SVG was removed from the accepted list to avoid an unnecessary active-content surface. A lower version-compatible file-size limit remains a pre-launch configuration gate.

## Sources

The Payload/Postgres adapter and migration model follow the official [Postgres adapter documentation](https://payloadcms.com/docs/database/postgres), [migration documentation](https://payloadcms.com/docs/database/migrations), and [production deployment guidance](https://payloadcms.com/docs/production/deployment). Payload documents Node.js `20.9.0+` as a supported baseline.
