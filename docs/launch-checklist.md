# LDC Travel Launch Checklist

This checklist contains unresolved human inputs and final operator gates. Do not add secret values here.

## Latest gate status — 2026-10-02 (production live)

**PRODUCTION LIVE: YES. DEPLOYMENT HEALTHY: YES.** Approved commit `1c6344b2f87e8407414a849a43fb3e87a9dceaab` is deployed on WOM-VPS-01. Public HTTPS smoke, protected-site regression, form QA, and final DB backup passed. Remaining operator follow-ups are first Payload admin creation and authenticated media QA. Details: `docs/production-environment.md`.

Historical gate status from 2026-10-01 (read-only audit; now superseded by live production): application/source readiness was complete at `ab856225549b0fb5482761a70b1c4886607df0a4`; the production host was audited read-only, but deployment was then **NOT READY** because no LDC vhost/certificate mapping existed yet.

## Human inputs required before Phase 7

- [x] Final production HTTPS domain supplied and approved: `https://ldc-tourism.com`.
- [x] DNS records and owner confirmed: apex A → `72.60.47.33`, www CNAME → apex; preserved.
- [ ] Production administrator email approved. Owner must create the first Payload admin manually after launch.
- [x] Dedicated PostgreSQL strategy selected: isolated Docker PostgreSQL 17 container.
- [x] Dedicated production database/user credentials delivered through the approved secret channel (values not stored in this repo).
- [x] Strong production `PAYLOAD_SECRET` generated and stored securely in the protected environment (value not stored in this repo).
- [x] Persistent media directory selected, created, owned, permissioned, and backed up: `/var/www/ldc-travel/shared/media`.
- [x] Backup location confirmed: `/var/backups/ldc-travel/`. Off-host encrypted copy and restore-owner schedule remain follow-ups.
- [x] Production application port selected after a fresh listening-port audit: `3150`.
- [x] Process-manager method approved: dedicated systemd unit `ldc-travel.service`.
- [x] Deployment window used: 2026-10-02 cutover completed.
- [x] Explicit approval to alter the LDC OpenLiteSpeed vhost and reload OLS after config validation: granted and executed via one graceful reload.

## Technical gates

- [x] Worktree release commit identified and no secrets/tracked dumps present: `1c6344b2f87e8407414a849a43fb3e87a9dceaab`.
- [x] Node and pnpm versions pinned and compatible with `package.json` for the approved off-host Linux artifact.
- [x] Locked install succeeds without dependency updates in the approved release artifact.
- [x] Dependency security gate reconciled for current main: operator `pnpm audit` exit 0/no known vulnerabilities; GitHub Dependabot API reports 0 open and 9 fixed alerts; no dependency changes pending. The earlier 1-high push notification reflects alert records subsequently marked fixed, not an unresolved current-main high advisory.
- [x] Production build succeeds from the release: approved Linux artifact rebuilt with `NEXT_PUBLIC_SITE_URL=https://ldc-tourism.com` and launch market EG.
- [x] Database backup created and `pg_restore --list` succeeds for the exact target database: final post-deploy dump verified rc=0.
- [x] Every pending Payload migration is reviewed; migration status is known and migrations ran only against the dedicated LDC database (all six previously applied; not rerun).
- [x] Explicit demo seed reviewed and run once with content-owner approval; persisted production content verified; seed not rerun.
- [ ] First administrator is created through the approved secure setup path; credentials are never added to source control. **Owner action remains.**
- [ ] Authenticated dashboard QA covers globals, destination/media editing, inquiry triage, accepted/rejected uploads, and access control. **Pending first admin.**
- [x] `UI_PREVIEW_MODE` is empty or `false` in production.
- [x] `NEXT_PUBLIC_SITE_URL` applied as `https://ldc-tourism.com`.
- [x] Application binds only to `127.0.0.1:3150`.
- [x] `PAYLOAD_MEDIA_DIR` points outside the release tree: `/var/www/ldc-travel/shared/media`.
- [x] Database and media backups exist on `/var/backups/ldc-travel/`. Tested restore drill and off-host copy remain follow-ups.
- [x] `/api/health` returns liveness without exposing secrets or database details.
- [x] Localhost smoke test passed before OLS changes.
- [x] OLS config backup and rollback path recorded before the approved edit.
- [x] Public HTTPS smoke test passed after the approved proxy change.
- [x] `/`, `/about`, `/contact`, `/destinations`, all six destination pages, `/admin` shell, robots, sitemap, and favicons passed.
- [x] Representative existing websites (SleepyWear, Arise, Tejaru) remained healthy after reload.
- [x] CPU, RAM, swap, disk, OLS, database, and application state reviewed after launch; host remains shared/known AMBER on swap but LDC-specific health is green.

## Explicit non-goals

- No production deployment, DNS change, OLS reload, production database creation, process-manager creation, package installation, firewall change, SSL change, or release upload is authorized by this checklist alone.

## Read-only host findings and remaining deployment gates

- [x] Fresh strict-host-key, key-only SSH identity check and read-only WOM-VPS-01 audit completed 2026-10-01; no server state changed.
- [x] Record host baseline and point-in-time capacity: AlmaLinux 9.8, 2 vCPU, 7.5 GiB RAM, 3.4 GiB swap occupied, root filesystem 76% used / 4% inodes, with variable CPU steal.
- [x] Record OpenLiteSpeed 1.9.0/CyberPanel conventions, current DNS records, existing-site baselines, database topology, and candidate app ports in `docs/release-qa.md`.
- [ ] Resolve the production certificate hostname mismatch and create/verify the LDC vhost/proxy only after explicit approval.
- [ ] Approve/provision isolated PostgreSQL 17, database/user and secrets through the secure operator path; never reuse shared/other-app databases.
- [ ] Approve/provision dedicated unprivileged LDC systemd service, selected loopback port (3150 was free only in the audit snapshot), release root, persistent media, and off-host backups.
- [ ] Confirm backup retention/RPO/RTO and demonstrate a recoverable database+media restore; host-wide scheduled backup coverage remains unknown.
- [ ] Confirm production admin owner/email, create the first admin manually after HTTPS deployment, and complete authenticated CMS/media QA.
- [ ] Select a deployment window and obtain explicit authorization for the release, LDC-only OpenLiteSpeed configuration/reload, DNS/TLS work if needed, and public smoke testing.
