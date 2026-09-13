# Changelog — 3days.ai owner app

The owner-facing version of this file is the "Was ist neu" page in the app (`src/content/changelog.ts`).

## 1.0.0 — 2026-09-07 (GA v2 frontend gate, FE10)

- Every owner surface real or hidden behind a capability flag; `count-mocks` = 0 in the voice app; the "Noch nicht" matrix lists what waits for the backend (`src/content/not-yet.ts`).
- Team & Rollen (C3), Branchenvorlagen (as drafts), Website-Widget 1.0.0 (`packages/widget`, ≤ 40 KB gz, size gate in CI).
- Route-level code splitting for every view; bundle budget script (`npm run check:bundle`).
- New e2e gates: GA scenario, mobile, privacy-network, roles, network flake, error boundary; axe on every route.
- Rollback: the previous static build stays deployable (`dist/` is immutable per version; the widget is pinnable as `w.<version>.js`).
