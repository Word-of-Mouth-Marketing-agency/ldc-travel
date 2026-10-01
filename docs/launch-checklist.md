# LDC Travel Launch Checklist

This checklist contains unresolved human inputs and final operator gates. Do not add secret values here.

## Latest gate status — 2026-10-01

Application/source readiness is reported complete at `ab856225549b0fb5482761a70b1c4886607df0a4`; local `HEAD` matched `origin/main` at audit start. Security discrepancy reconciled: GitHub Dependabot returned zero open alerts; nine historical alert records were all `fixed` on the current main revision, and the operator's `pnpm audit` exited 0 with no known vulnerabilities. No dependency remediation is pending. The production host was audited read-only, but deployment remains **NOT READY**: no LDC vhost/certificate mapping exists, production TLS hostname verification fails, production database/secrets/media/service/backups/admin are not provisioned/verified, and explicit change approval is still required. This status supersedes older notes that the read-only host audit was inaccessible.

## Human inputs required before Phase 7

- [x] Final production HTTPS domain supplied and approved: `https://ldc-tourism.com`.
- [ ] DNS records and owner confirmed.
- [ ] Production administrator email approved.
- [ ] Dedicated PostgreSQL strategy selected: native isolated database/user or isolated supported PostgreSQL service.
- [ ] Dedicated production database/user credentials delivered through the approved secret channel.
- [ ] Strong production `PAYLOAD_SECRET` generated and stored securely.
- [ ] Persistent media directory selected, created, owned, permissioned, and backed up by the approved operator.
- [ ] Backup location, retention, offsite policy, and restore owner confirmed.
- [ ] Production application port selected after a fresh listening-port audit.
- [ ] Process-manager method approved.
- [ ] Deployment window selected outside peak traffic.
- [ ] Explicit approval to alter the LDC OpenLiteSpeed vhost and reload OLS after config validation.

## Technical gates

- [ ] Worktree release commit identified and no secrets/tracked dumps present.
- [ ] Node and pnpm versions pinned and compatible with `package.json`.
- [ ] Locked install succeeds without dependency updates.
- [x] Dependency security gate reconciled for current main: operator `pnpm audit` exit 0/no known vulnerabilities; GitHub Dependabot API reports 0 open and 9 fixed alerts; no dependency changes pending. The earlier 1-high push notification reflects alert records subsequently marked fixed, not an unresolved current-main high advisory.
- [ ] Production build succeeds from the release.
- [ ] Database backup created and `pg_restore --list` succeeds for the exact target database.
- [ ] Every pending Payload migration is reviewed; migration status is known and migrations run only against the dedicated LDC database.
- [ ] Explicit demo seed is reviewed and run only with content-owner approval; repeated runs preserve editor changes and never create users/inquiries.
- [ ] First administrator is created through the approved secure setup path; credentials are never added to source control.
- [ ] Authenticated dashboard QA covers globals, destination/media editing, inquiry triage, accepted/rejected uploads, and access control.
- [ ] `UI_PREVIEW_MODE` is empty or `false`.
- [x] `NEXT_PUBLIC_SITE_URL` is documented as `https://ldc-tourism.com`; applying it remains a deployment operation.
- [ ] Application binds only to `127.0.0.1:<PORT>`.
- [ ] `PAYLOAD_MEDIA_DIR` points outside the release tree.
- [ ] Database, persistent media, and off-repo environment backups have a tested recovery owner and procedure.
- [ ] `/api/health` returns liveness without exposing secrets or database details.
- [ ] Localhost smoke test passes before OLS changes.
- [ ] OLS config backup and rollback path are recorded before any approved edit.
- [ ] Public HTTPS smoke test passes after approved proxy change.
- [ ] `/`, `/about`, `/contact`, `/destinations`, all six destination pages, `/admin`, WhatsApp, robots, sitemap, and favicons pass.
- [ ] Representative existing websites remain healthy.
- [ ] CPU, RAM, swap, disk, OLS, database, and application logs are reviewed after launch.

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
