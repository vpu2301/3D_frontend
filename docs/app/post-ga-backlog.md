# Post-GA frontend backlog (FE10 T-FE10.8)

Ranked by expected pilot evidence; re-rank after pilot week 3 with `pilot_findings` counts.

| # | Item | Why (evidence to collect) | Depends on |
|---|---|---|---|
| 1 | ~~Platform shell code splitting (`App.tsx` lazy routes)~~ | **done 2026-09-08** (F0 cut list PR-2): entry 567.7 → 227.8 KB gz, first paint of `/telephony` 330.2 KB gz | — |
| 2 | Owner-app listen-in player | pilots asking to hear a live call from the phone (today: ops console) | backend monitor fork stable |
| 3 | Push notifications for Aufmerksamkeit (web push, PWA shell) | time-to-callback KPI; staff on the go | service worker + E3 events |
| 4 | Server-side handled state, attendance, reports (un-hide "not yet" rows) | the browser-computed report/KPIs are estimates today | G2/F2 |
| 5 | WebRTC voice in the widget | website visitors asking to "just call" | G3 phase 2 |
| 6 | Agency / multi-tenant console | founder onboarding time per pilot | C3 phase 2 |
| 7 | SSO | enterprise pilots | Phase 3 |
