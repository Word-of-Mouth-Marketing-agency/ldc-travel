# LDC Travel Production Deployment Runbook

Status: preparation only. This runbook is not an authorization to deploy. Phase 6 performed no VPS mutation, database creation, DNS change, OpenLiteSpeed edit/reload, service creation, release upload, or production migration.

## Pre-deploy gate

Stop unless every item is confirmed:

- final HTTPS domain supplied and approved;
- DNS owner and records identified;
- dedicated LDC PostgreSQL architecture and credentials available through the approved secret channel;
- `PAYLOAD_SECRET` generated and stored securely;
- persistent media path and owner confirmed;
- localhost-only app port selected from a fresh `ss -ltnp` audit;
- process-manager owner confirmed;
- database and media backup destinations confirmed;
- free disk, RAM, swap, and current load reviewed during a low-traffic window;
- approval to alter the LDC OpenLiteSpeed vhost only, with no unrelated vhost changes.

## Read-only preparation

1. Record the current VPS hostname, OS, kernel, CPU, RAM, swap, disk, listeners, OLS version/status, Node versions, process-manager landscape, PostgreSQL/MariaDB/Redis ownership, and representative existing-site health.
2. Confirm the target application port is unused and bind the application only to `127.0.0.1`.
3. Confirm the LDC release commit, lockfile, Node version, pnpm version, migration list, and environment variable names.
4. Confirm the final domain is covered by the intended certificate plan. Do not request or replace certificates in this phase.

## Provisional architecture decisions

These recommendations are based on repository evidence plus stale historical server notes and must be reconfirmed by a fresh VPS audit before Phase 7:

- **Database:** prefer a dedicated isolated PostgreSQL service, bound to localhost, using a Payload-supported version aligned with the tested local PostgreSQL 17 runtime. The VPS's documented native PostgreSQL 13 is shared by an existing workload and has not been freshly audited for compatibility or capacity; do not reuse it without explicit compatibility evidence.
- **Process manager:** prefer one PM2 fork process for the native Next/Payload application, because the historical host pattern already includes PM2-managed Next.js and LDC does not require a multi-process cluster. Do not run PM2 and systemd/Docker for the same LDC process.
- **Build:** build on a Linux environment matching the approved production Node ABI, preferably off-server, then transfer a release artifact. Do not copy a Windows-built native dependency tree to AlmaLinux. If an equivalent Linux builder is unavailable, schedule the build during a low-traffic window and verify current host load first.
- **Proxy:** use the existing OpenLiteSpeed/CyberPanel per-vhost pattern: External App → `127.0.0.1:<PORT>` and a `/` proxy context. Exact config file ownership and syntax must be freshly inspected before any edit.
- **Logs:** keep application stdout/stderr under the selected process manager and use the host's established rotation mechanism. Retain operational errors without request bodies, inquiry text, passwords, cookies, tokens, or database URLs.

## Backup before release or migration

1. Take a logical custom-format dump of the dedicated LDC database: `pg_dump -Fc <LDC_DATABASE_URL> -f <backup>.dump`.
2. Verify the archive with `pg_restore --list <backup>.dump`.
3. Preserve the migration state and record the dump timestamp, source database, PostgreSQL major, and archive location.
4. Back up the relevant OpenLiteSpeed vhost configuration before any approved edit; do not back up or expose private keys.
5. Capture the current release identifier and preserve the persistent media path as part of the coordinated recovery set.

## Release structure

Use an atomic, release-independent layout consistent with the server's conventions:

```text
/srv/ldc-travel/
  releases/<release-id>/
  current -> releases/<release-id>/
  media/
  shared/.env
```

The exact root and owner require a fresh VPS audit. `shared/.env` and `media/` must not be copied into release folders. The application should read `PAYLOAD_MEDIA_DIR=/srv/ldc-travel/media`.

## Deploy application

1. Create the next release directory without touching `current`.
2. Copy the approved source/artifact for commit `a33a145` or the later approved release.
3. Link the reviewed environment file and persistent media path.
4. Run a locked dependency install using `pnpm-lock.yaml`; do not update dependencies.
5. Run `pnpm build` before exposing the release.
6. Run Payload migrations against the dedicated LDC database only, after the verified backup: `pnpm payload migrate`.
7. Start only the LDC application with `pnpm start -- -p <PORT>` and `UI_PREVIEW_MODE=false`.
8. Verify `http://127.0.0.1:<PORT>/api/health` and local public routes before proxy work.

## OpenLiteSpeed change gate

Only after the backend is healthy and an explicit change approval exists:

1. Back up the relevant generated/per-vhost configuration.
2. Add or update one External App proxy targeting `http://127.0.0.1:<PORT>` and one `/` proxy context, following the existing OpenLiteSpeed/CyberPanel ownership pattern.
3. Validate configuration with the installed OLS syntax-check command.
4. Obtain explicit approval before graceful reload; never hard-stop OLS.
5. Verify the LDC HTTPS domain and a representative sample of unrelated websites on the shared listener.

## Public verification

Check `/`, `/contact`, `/destinations`, all six destination pages, `/api/health`, `/robots.txt`, `/sitemap.xml`, `/icon.png`, `/apple-icon.png`, canonical/HTTPS behavior, WhatsApp links, social links, and the inquiry validation path. Check `/admin` separately and do not create a user without the approved production administrator email and password process.

Also verify application logs contain no secrets, passwords, inquiry message bodies, or unnecessary personal data. Check CPU, RAM, swap, disk, OLS status, database status, and representative existing websites after the release.

## Migration and seed policy

Never run the demo seed automatically on startup or every deploy. For the initial production content load, use an explicit approved operation after the database is created and backed up. Review the idempotent seed output and confirm manually edited CMS fields are preserved. Do not use the seed as a mechanism to overwrite editorial content.

## Rollback decision

If the application is unhealthy but the database schema remains compatible:

1. Stop or drain only the LDC process.
2. Point `current` to the previous known-good release.
3. Restart only the LDC process with the same persistent env/media paths.
4. Verify localhost health and public routes.

Do not restore the whole database for an application-only rollback. If a migration is incompatible, stop, inspect the migration's supported down/recovery path, preserve evidence, and restore a verified backup only after an explicit recovery decision. Persistent media remains outside the release tree and must survive either rollback path.

## Abort conditions

Abort before proxy or migration work if the domain is unknown, credentials are missing, the target database is not dedicated, the app binds publicly, media storage is ephemeral, the backup cannot be verified, the port conflicts, OLS ownership is unclear, or any unrelated service would need to be restarted.
