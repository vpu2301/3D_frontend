# GA v2 — Frontend gate (FE10)

Date: 2026-09-07 · App 1.0.0 · Widget 1.0.0 · Backend pinned: Pincer `309f87f` + uncommitted C1–C3/B1/D1/D2 working tree (contract lock).
Every §1 criterion of the FE10 spec is either **evidenced** (CI artifact, test, or measurement in this repo) or **dated-excepted** with an owner. Nothing is claimed that this repo cannot show.

## Completeness

| Criterion | Status | Evidence |
|---|---|---|
| `count-mocks` = 0 | ✅ | `mock-count.lock` = 0; `scripts/count-mocks.mjs` fails on > 0; scope = the voice/owner app (`src/pages/telephony`, `src/components/voice`). The platform's own demo sections (Dashboard, Brain, Tasks) are outside the owner app and untouched. |
| Remaining backend gaps hidden behind flags, listed in the "not yet" matrix | ✅ | `src/content/not-yet.ts` (13 rows) rendered on `/telephony/whats-new`; hiding is driven by declared `capabilities.*` or the page's own probe (`src/lib/features.ts`). Operator-only controls (call queues, live call controls, limit knobs, follow-up menu) show only when the backend declares `call_queues`, `call_controls`, `limits_api`, `followups`. |
| Ownership matrix implemented, screenshot per row | ⚠️ dated | All rows implemented (`docs/app/FE-BINDING.md`). Screenshots: to be captured from the pilot instance — owner E3, by 2026-09-14. |
| Backend acceptance criteria ticked in the backend specs with FE PR links | ⚠️ dated | Depends on the backend repo's spec files (read-only from here). Owner E2/E3, by 2026-09-14; the FE side is `docs/app/*.md` per sprint. |

## Language & formatting

| Criterion | Status | Evidence |
|---|---|---|
| `i18n:check` green, `en` complete, no literal strings | ✅ | CI `quality` job: `i18n:check` (23 namespaces), ESLint `i18next/no-literal-string` over `OWNER_APP_FILES`. |
| Native-speaker German review with signed screenshots | ⚠️ dated | Process item: founder + one pilot owner, T-FE10.2, by 2026-09-21. Copy is Sie-Form throughout; developer words removed in FE7–FE9 passes. |
| `Intl` de-DE everywhere; DST 2026-10-25 / 2027-03-28 | ✅ / ⚠️ | `src/lib/format.ts` (de-DE, tested in `format.test.ts` incl. DST cases); the hours editor uses wall-clock strings, never UTC. Live verification on the two dates: calendar reminder, owner E3. |

## Mobile

| Criterion | Status | Evidence |
|---|---|---|
| Core routes at 390 × 844, no horizontal scroll, wizard resumable | ✅ | `e2e/mobile.spec.ts` (5 core routes, scrollWidth ≤ clientWidth), `e2e/ga-suite.spec.ts` step 2 (wizard state from the server), `smoke.spec.ts` 390 px check. |
| Touch targets ≥ 44 px, reveal by touch | ✅ | `.owner-app-touch` rule (`src/styles/platform.css`) + `min-h-11` on primary controls; `mobile.spec.ts` asserts ≥ 44 px on the first 12 actionable controls per route and taps the reveal. |
| Real-device iOS Safari / Android Chrome checklist | ⚠️ dated | Emulation only in CI (WebKit iPhone 12 project). Real devices: pilot week 1, owner E3, by 2026-09-18. |

## Accessibility

| Criterion | Status | Evidence |
|---|---|---|
| axe 0 serious/critical on all routes | ✅ | `e2e/a11y.spec.ts` over 21 routes incl. wizard steps, both projects. |
| Lighthouse a11y ≥ 90 on core routes | ⚠️ dated | Not run in this environment (no Chrome headless Lighthouse in CI yet). Add `lhci` job; owner E3, by 2026-09-14. |
| Keyboard walkthroughs recorded; live regions | ⚠️ / ✅ | Live regions: status banner (`role=status`), queue `aria-live`, active-calls card. Recordings: with the native-speaker review, by 2026-09-21. |

## Performance

| Criterion | Status | Evidence |
|---|---|---|
| Owner app initial JS ≤ 250 KB gz | ✅ | `npm run check:bundle` (CI): TelephonyHome 25.2 KB + shared 49.4 KB = **74.5 KB gz**; every view is a lazy chunk (`TelephonyHome.tsx`). |
| Platform shell before the owner app | ✅ closed 2026-09-08 | Was a dated exception at **565 KB gz** (every platform and marketing page imported eagerly in `App.tsx`). The founder's go came with the F0 cut list scope decision: 124 page imports are now `lazy()` chunks and the entry is **227.8 KB gz**. First paint of `/telephony` is 330.2 KB gz. See `docs/frontend-audit.md` §5 item 1. |
| Widget ≤ 40 KB gz | ✅ | 7.6 KB gz, `scripts/widget-size.mjs` in CI. |
| Lighthouse performance ≥ 80 throttled | ⚠️ dated | Same `lhci` job as above. |
| No layout shift on list load | ✅ | Skeletons on every list and the lazy-view fallback (`ViewSkeleton`). |
| SSE reconnect / polling fallback under flaky network, bounded requests | ✅ | `e2e/network-flake.spec.ts` (aborted stream + flapping list: ≤ 6 stream attempts and ≤ 10 polls in 8 s). |

## Security & privacy

| Criterion | Status | Evidence |
|---|---|---|
| No PII in URLs, title, console; token never in URL after load | ✅ | `e2e/privacy-network.spec.ts` (request URLs, title, console; magic link scrubbed), `smoke.spec.ts` history check. |
| Secrets write-only | ✅ | Webhook secret and tenant tokens shown once (`secretReducer`, e2e asserts the DOM is clean afterwards); SIP passwords by env name. |
| CSP for app and widget | ⚠️ dated | The widget bundle is CSP-compatible (no eval, checked by `widget-size.mjs`) and the snippet carries an `integrity` hash. The app's CSP header is a deploy setting (E1/E2), by 2026-09-14. |
| Dependency audit criticals 0 | ⚠️ dated | `npm audit` to be run in CI (`audit` step to add); owner E3, by 2026-09-10. |
| Role matrix suite, tenant switch cache-clear, transcript reveal audited | ✅ | `e2e/roles.spec.ts`, `src/test/voice/fe9.test.tsx` (`switchTenant` clears the cache), reveal gated on `capabilities.transcript_reveal_audited` (FE2). |

## Reliability

| Criterion | Status | Evidence |
|---|---|---|
| GA scenario on every PR, 2 weeks green, flake < 2 % | ✅ / ⚠️ | `e2e/ga-suite.spec.ts` in the `e2e` job; the two-week window starts 2026-09-07. Known flake: `src/test/notes/viewBuilder.test.tsx` (platform notes, timing) — quarantine candidate. |
| Error boundary per route; seeded 500 → retryable banner | ✅ | `ViewErrorBoundary` per route; `network-flake.spec.ts` seeds a 500 on the call list → banner with "Erneut laden" → recovers. Attention queue has the same banner. |

## Pilot evidence (H1)

| Criterion | Status |
|---|---|
| ≥ 3 pilots daily for 3 weeks, findings fixed or dated, onboarding ≤ 30 min | ⚠️ dated — pilot weeks 26–28 (from 2026-09-14); `pilot_findings` tagged `frontend` reviewed daily (T-FE10.7). |
| Founder onboards pilot #2+ without an engineer | ⚠️ dated — same window. |

## Release engineering

- Versions: app `1.0.0` (`package.json`), widget `1.0.0` (`packages/widget/package.json`); owner-facing notes on `/telephony/whats-new` (`src/content/changelog.ts`) and `CHANGELOG.md`.
- Rollback: static builds are immutable per version; the previous `dist/` is redeployed as-is (no data migration in the frontend). Widget pinnable via `w.<version>.js`. A rollback drill is a deploy task (E1/E2) — to be run once before GA, by 2026-09-14.
- Feature flags: `docs/app/feature-flags.md`.
- Post-GA backlog: `docs/app/post-ga-backlog.md`.

## Addendum items decided here

- C4 §2.3 customer-visible support log → a "Support-Zugriffe" section on `/telephony/settings/privacy` (`privacy/SupportLogSection.tsx`) fed by `GET /api/audit?action=tenant_impersonate`; hidden while the audit route is not readable with a tenant token (ask). "Was ist neu" is `/telephony/whats-new`. Details: `docs/app/addendum-deltas.md`, consolidated asks: `docs/app/api-asks.md`.

## Backend asks that unblock "not yet" rows
`~/Desktop/BACKEND-FE10-api-asks.md` — chiefly `capabilities.*` declarations on `/api/voice/status` so hiding is explicit, plus the FE5–FE9 asks that remain open.
