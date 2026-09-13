# Consolidated API asks — status against the backend working tree (2026-09-07)

Source of truth for the backend contract is `api-contract.lock` + `src/lib/api/generated/openapi.json` (pincer `309f87f` + uncommitted C1–C3/B1/D1/D2). "Bound" = the app uses it today; "computed" = the app derives it in the browser and says so; "hidden" = the surface waits behind a capability flag.

| Addendum row | Endpoint / change | Status | Notes |
|---|---|---|---|
| FE0 | OpenAPI complete for voice routers; `make demo-seed` | partly | snapshot generated from the dirty tree; the lock says `+uncommitted-…` until the backend commits |
| FE1 | `status.capabilities` / `telephony` / `residency_mode`; `GET /api/voice/stats` | open / bound | capabilities undeclared → FE probes; stats bound as `/receptionist/stats` (sentiment) |
| FE2 | owner fields on calls (`intent`, `result_group`, `needs_attention`, `handled`, EUR); audited reveal; CSV | computed | `resultGroupOf`, attention and CSV computed in the browser; `handled` local |
| FE3 | version diff; holidays; voices with samples; self-test JSON | computed / bound | diff + holidays computed (`diffProfiles`, `computeGermanHolidays`); voices via `/profiles/meta`; TTS preview and self-test bound |
| FE4 | setup state; Google OAuth; MS365 device code; calendars; go-live + activate; number purchase | bound / open | all bound except number purchase |
| FE5 | clustered unanswered; upload cap; `/rules/validate`; batch dry-run; hit counts; autoprofile validation | computed / open | clustering in the browser; dry-run per sentence; the rest open |
| FE6 | residency JSON; retention GET/PUT; subject-export/erase; evidence export; compliance docs; trust API + PDF + share | bound / hidden | residency, canary, evidence per call, one-pager bound; the rest hidden until served |
| FE7 | tool labels/reasons; template versioning/preview; webhook secret-once/deliveries/replay; SSE + token | curated / hidden | labels curated in `src/content/tool-labels.ts`; follow-ups and webhooks hidden; SSE client ready, route missing (polling fallback) |
| FE8 | reports with `method`; attention GET/PUT + count; attendance; campaign drafts/validate/scrub; events | computed / hidden | report and KPIs computed with `method: estimated`; queue computed; campaigns hidden |
| FE9 | auth session/tenants/members/invites/impersonation; templates apply-as-draft; widget keys/settings/stats + `/w/*` | bound / app / hidden | tenants/members/tokens/impersonation bound (`/api/status.tenancy`); templates from the app; widget admin hidden, bundle real |
| FE10 | `capabilities.*` declarations; CSP; rollback drill; commit the tree | open | `~/Desktop/BACKEND-FE10-api-asks.md` |
| F0 cut list | `POST /api/voice/schedule` field semantics (`timeframe`, `location_or_meet`, `attendees`); undeclared response fields on `VoiceStatus`/`ActiveCall`/`CallSummary`/`CallDetail`/`Contact`/`ReceptionistStats`/`ScheduleAppointmentOut`; a model for the device-code response; where the ten operator routes land | open | `~/Desktop/BACKEND-F0-cutlist-asks.md`. The schedule bug is **fixed FE-side** (was a 422 on every appointment call); the field semantics are still a guess |
