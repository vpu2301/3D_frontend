# Backend-spec addendum — what the frontend track absorbed (status 2026-09-07)

The addendum re-assigns every backend "UI task" line to Block I. This is the FE side of that table: where each moved task lives now, and which backend delta it still waits for. Backend-side ticks (linking FE PRs in the backend spec files) belong to E1/E2/E3 in the Pincer repo.

| Backend line | FE sprint | Where in this repo | Still waiting for |
|---|---|---|---|
| A2 owner-facing manifest | FE6 | `privacy/ResidencySection.tsx` on `GET /api/voice/residency` | — |
| A4 deliverable 7 (`Privacy.tsx`) | FE6 | `privacy/*` (retention, subject rights, evidence, documents hidden until served) | subject-export / erase preview+confirm / evidence per period / compliance docs as HTTP |
| B1 guides + self-test UI | FE3/FE4 | `src/content/telephony-guides.ts`, `settings/telephony/SelfTestPanel.tsx`, wizard `StepTelephony` | — (self-test status JSON with `caller_id_lost` is bound) |
| B3 failover hint banner | FE1 | `shared/StatusBanner.tsx` via `telephonyFacts` | `status.telephony.failover_hint` (inferred until then) |
| C1 §3.3 `VoiceSetup.tsx`, TTS preview | FE3 | `settings/profile/*`, `useTtsPreview` | holidays and version diff are computed in the browser (`computeGermanHolidays`, `diffProfiles`) — endpoints optional |
| C2 i18n migration of the Pincer dashboard | dropped | German-first owner app (`src/i18n/voice.ts`, 23 namespaces) | — |
| C2 wizard, decision tree, test-call checklist | FE4 | `setup/*` on C2's thin API | number purchase API |
| C3 owner team/roles/switcher | FE9 | `settings/team/*`, `src/stores/session.ts` | `POST /api/auth/session`, invites |
| C4 customer-visible support log | FE10 | **decided: a "Support-Zugriffe" section on `/telephony/settings/privacy`** fed by `GET /api/audit?action=tenant_impersonate` (C3 records every impersonated request); plus "Was ist neu" on `/telephony/whats-new`. Hidden while the audit route is not exposed to the tenant token. | audit list readable with a tenant token |
| D1 `Knowledge.tsx` | FE5 | `knowledge/*` | clustered unanswered, upload cap, crawl progress fields |
| D2 `Rules.tsx`, dry-run, autoprofile | FE5 | `rules/*`, `settings/profile/AutoprofileReview.tsx` | `/rules/validate`, batch dry-run, `hit_count_7d`, per-field validation |
| E1 per-profile picker + owner labels | FE7 | `settings/tools/*`, `src/content/tool-labels.ts` | `display_name_de/en`, `summary_de/en` on the policy list |
| E2 `FollowUps.tsx` | FE7 | `followups/*` (hidden until served) | the whole follow-ups API |
| E3 `Integrations.tsx`, SSE | FE7 | `integrations/*`, `src/lib/api/owner/events.ts` | webhooks/deliveries/replay, `GET /api/events/stream` |
| F1 `Campaigns.tsx` | FE8 | `campaigns/*` (hidden until served) | campaign drafts/validate/import scrub/progress event |
| F2 no-show marking | FE8 | `attention/AttentionQueueView.tsx` (`AttendanceButtons`) | `PUT /calls/{sid}/appointment/attendance` |
| G2 owner history / trust / reports / attention | FE2 / FE6 / FE8 | `owner-calls/*`, `trust/*`, `reports/*`, `attention/*` (browser-computed with `method: estimated` until G2) | G2 backend (E1 wk 15–17) |
| G3 widget bundle + settings/preview | FE9 | `packages/widget/`, `settings/widget/WidgetView.tsx` | `api/widget.py`, public `/w/*` |
| H1 TH1.3 docs + "Was ist neu" | FE10 | `docs/app/*`, `docs/decisions/GA-v2-frontend.md`, `/telephony/whats-new` | — |

## Cross-cutting rules 6 and 9

- Rule 6 ("real data or a visible MOCK badge; the owner app's badge count is a CI number that must reach 0 by G2") is met: `mock-count.lock` = 0, the counter fails above 0, and what is not served is hidden behind capability flags (`docs/app/feature-flags.md`) and listed in `src/content/not-yet.ts`.
- Rule 9 ("owner-facing means 3days.ai; a backend sprint adds an API and an 'API asks' row") is how every FE sprint ran: the asks live in `~/Desktop/BACKEND-FE0…FE10-api-asks.md`, consolidated in `docs/app/api-asks.md`.
