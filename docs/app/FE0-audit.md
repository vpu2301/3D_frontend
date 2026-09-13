# FE0 — Repo audit (`3D_frontend`, 2026-09-06)

Block I, sprint FE0, day 1–2 deliverable. Every line below was read from the repo, the running backend, or the `pincerhq/pincer` checkout at `309f87f` (branch `voice`); nothing is assumed. The decisions it feeds are in `FE-ADR-004-stack-binding.md`, the paths every later sprint references are in `FE-BINDING.md`.

**Headline.** The repo is far from thin: the voice app under `/telephony` already runs on real `/api/voice/*` data (call history, live calls, detail with transcript, threads, scheduled calls, receptionist messages, approvals over SSE, sentiment, listen-in player). It is English-only, developer-flavoured, and shares the platform's shell. FE0 therefore *binds into* the voice app rather than scaffolding a second app — the owner's instruction for this track is "build the frontend inside the voice app".

## 1. Inventory

| Question | Finding |
|---|---|
| **Framework & build** | Vite 5 + `@vitejs/plugin-react-swc`, React **18.3** (not 19), TypeScript 5.5. `tsconfig.app.json` has `strict: false`, `strictNullChecks: false`, `noImplicitAny: false`. Repo-wide `tsc --noEmit` has **15 pre-existing errors** in 6 files outside the voice app (`CreateWorkflow.tsx` ×10, `todo/_hooks/use-todo-store.ts`, `notes/NotesOpenItems.tsx`, `mail/_lib/storage.ts`, `drive/…/PreviewBody.tsx`, `components/Partnerships.tsx`). FE0 adds `tsconfig.voice.json` (strict null checks + noImplicitAny) covering the owner-app files, which is clean; the repo-wide check runs in CI as a warning until those six files are fixed. |
| **Package manager** | Three lockfiles exist: `bun.lock` + `bun.lockb` (2026-03-24) and `package-lock.json` (2026-08-29). README says npm; `package-lock.json` is the newest. **npm is the binding**; the bun lockfiles are stale and should be deleted in a housekeeping PR (not FE0's — outside the owner app). |
| **Routing** | `react-router-dom` 6.26, one flat `<Routes>` in `src/App.tsx` (164 unique paths, see §2). Lazy-loaded route chunks for the platform apps (`TelephonyHome`, `NotesHome`, `MailHome`, …); marketing pages are imported eagerly. Voice app: `/telephony/*` paths are registered in a list and `TelephonyHome` switches on `pathname`. FE0 moves that list to `src/pages/telephony/_lib/routes.ts`. |
| **Styling** | Tailwind **3.4** (not v4), shadcn/ui (`components.json`, `src/components/ui/*`, 45 primitives incl. `sheet`, `table`, `skeleton`, `sonner`, `sidebar`). Design tokens: `src/styles/platform.css` (`.plat` scope, `--ink`, `--paper`, `--sand`, `--blue`, `--text-1…5`, `--ok/warn/bad-*`, `--line`; radii ≤ 14 px) and `src/index.css` (shadcn HSL tokens with a `.dark` block). Fonts: Plus Jakarta Sans self-hosted for the site, Sora for the platform. **Dark mode:** `ThemeContext` toggles `html.dark`, shadcn tokens have dark values, but the `.plat` token family is light-only — the voice app renders light regardless of the theme. Owners in offices use light; a dark `.plat` set is a FE10 item. |
| **Existing 3days.ai surfaces** | Marketing site (`/`, `/pricing`, `/features`, `/solutions/*`, `/leistungen/:slug`, …): **works**. Owner web chat at `/chat` (`pincerClient.streamChat` → `POST /api/chat/stream`, `X-Pincer-User`): **works**. Login at `/login`: **works, but** the email/password pair is compared in the browser against `VITE_AUTH_*` (see `.env.example`: "on their way out"); the second form on the page connects a Pincer URL + bearer token. Voice app at `/telephony/*`: **works on real data** (see `docs/voice-app.md` v1–v8 for the inventory), with these badged demo views: `/telephony/numbers`, `/telephony/usage`, `/telephony/audit`, `/telephony/calls/:callSid` (old mock explorer), queues on `/telephony/planned`, call controls, hard-limit settings. Notes, Mail, Drive, Todo, Calendar, Contacts, Docs, Accounting: platform apps, out of scope, untouched. |
| **API client & auth** | `src/lib/pincerClient.ts`: `{apiUrl, token}` in `localStorage["pincer.web.auth"]` (or `VITE_PINCER_API_URL` + `VITE_PINCER_TOKEN`), per-browser UUID in `localStorage["pincer.web.userId"]` sent as `X-Pincer-User`, `Authorization: Bearer`. `src/lib/api/voice.ts` (1 737 lines) had its own `apiFetch` copy of the request logic plus **hand-written types** mirroring `api/voice.py`. No `ky`. No dev proxy for `/api` (only `/notes-api`); the browser calls the backend origin directly, so CORS on the backend must list the dev origin (`:3000`). Auth diagram in `FE-ADR-004`. |
| **i18n** | `i18next` 26 + `react-i18next` 17 + browser detector, single `translation` namespace, `en` fallback, `de` complete for marketing (1 131 lines). Detection order localStorage → navigator; fr/es/it/nl/pt/pl/sv/da/uk fall back to English content. **The voice app used no i18n at all** — every label was an English literal. |
| **State** | TanStack Query 5 (`src/lib/queryClient.ts`, polling via `REFETCH_INTERVALS`), zustand 5 (used by notes/todo stores), React context for theme. Matches the FE-ADR-004 default. |
| **Tests & CI** | vitest 4 + Testing Library + jsdom (`vitest.config.ts` pins `TZ=Europe/Berlin`), 74 test files / 757 tests green before FE0. `src/test/voice/mockInventory.test.ts` pins the Voice page's badge count from source. **No Playwright, no `.github/` at all** — nothing ran on PRs. |
| **Deployment** | No Dockerfile, no `base` in `vite.config.ts`, no hosting config in the repo; README documents local setup only ("npm run dev"). Vite dev server on **:3000** (`strictPort`). Backend `api/server.py` lists `http://localhost:8080` as `PINCER_WEB_CHAT_URL`/CORS origin — that is the backend's own port here, not this app's. Production hosting is undecided (see ADR §2 decision 2). **Bundle:** `index-*.js` is 566 KB gz because `App.tsx` imports ~150 marketing/platform pages eagerly; `TelephonyHome-*.js` is 85 KB gz. The 250 KB budget is enforced on the owner-app chunk; the platform entry is reported, not gated, until the platform lazy-loads its pages. |
| **Reuse from Pincer `dashboard/`** | `dashboard/src/api/client.ts` (ky): **skip** — this repo's fetch wrapper already carries the URL-normalising and SPA-fallthrough rules the dashboard lacks; FE0 formalises it as `src/lib/api/client.ts`. Tailwind v4 tokens: **skip** (repo is Tailwind 3; migrating is not an FE0 job). shadcn new-york: **already present**. `MockBadge` idea: **already present and stricter** (`MockedBadge.tsx` + inventory test). `formatters.ts`: **adapt** → `src/lib/format.ts` with `de-DE` and masking. `ROUTES` constants pattern: **copy** → `_lib/routes.ts`. `ErrorBoundary.tsx`: **adapt** → `ViewErrorBoundary.tsx`. `listenIn.ts`/`mulaw.ts`: **already ported** (`components/voice/listen`). |
| **A11y found on the way** | The shared platform sidebar (`src/components/dashboard/AppSidebar.tsx`, notification bell) has an icon-only button without a name — axe `button-name`, critical. Platform file, not touched; the e2e a11y suite scopes to the owner app and this is an **ask to the platform owner** (one `aria-label`). |

## 2. Route inventory — keep / migrate / delete

164 unique paths in `App.tsx`. Nothing is deleted in FE0 (MUST NOT); the column records the decision.

| Group | Paths | Decision |
|---|---|---|
| Marketing | `/`, `/home`, `/about`, `/pricing`, `/features`, `/how-it-works`, `/careers`, `/contact`, `/company`, `/demos`, `/watch-demo`, `/schedule-demo`, `/get-started`, `/start-free-trial`, `/help`, `/docs` (public), `/platform-overview`, `/platform/*` (5), `/plattform/:slug`, `/leistungen/:slug`, `/loesungen/:slug`, `/segments/:slug`, `/product/*` (6), `/solutions/*` (15), `/roles/*` (6), `/use-cases/*` (6), `/customers/*` (4), `/resources/*` (5), `/support/*` (4), `/dev/*` (3), `/integrations` (marketing), `/ai-agents`, `/ai-employees`, `/ai-fine-tuning` | **keep** — untouched, covered by the e2e smoke on `/` |
| Auth | `/login`, `/signup`, `/forgot-password` | **keep** (FE1 replaces the browser-compared login; `/login` gained `?returnTo=` handling in FE0) |
| Owner chat | `/chat` | **keep**; becomes the "Assistent" nav item inside the owner app in FE1 (recommendation in ADR §10) |
| Platform apps | `/dashboard`, `/company-brain/*`, `/notes/*` (11), `/mail/*` (15), `/drive/*` (10), `/todo/*` (13), `/calendar/*`, `/contacts/*` (9), `/docs/:id*` (3), `/accounting/*` (7), `/tasks`, `/teams/*`, `/staff/*`, `/workflows/*`, `/channels`, `/skills-hub`, `/billing`, `/profile`, `/settings`, `/ai-assistants/:id*` | **keep** — other product tracks, never modified by FE sprints |
| Voice app, real | `/telephony`, `/telephony/calls`, `/telephony/calls/live`, `/telephony/calls/pending-approval`, `/telephony/messages`, `/telephony/planned`, `/telephony/policies`, `/telephony/settings`, `/telephony/threads/:threadId` | **migrate** in place: German labels, owner framing, masked numbers (FE2), profile/telephony split (FE3) |
| Voice app, badged | `/telephony/numbers`, `/telephony/usage`, `/telephony/audit`, `/telephony/calls/:callSid` | **migrate** → `/telephony/settings/telephony` (FE3), `/telephony/reports` (FE8), operator audit stays in Pincer dashboard (delete the view at FE8), real call detail route (FE2) |
| Owner surfaces, new in FE0 | `/telephony/overview`, `/attention`, `/setup`, `/knowledge`, `/rules`, `/followups`, `/integrations`, `/reports`, `/campaigns`, `/trust`, `/settings/{profile,telephony,privacy,tools,team,widget}` | **placeholders** with a `data-mock` badge naming the sprint that replaces each |

## 3. Auth today (diagram)

```
browser ──(email+password compared in JS against VITE_AUTH_*)──▶ localStorage.isAuthenticated=true ──▶ <ProtectedRoute>
browser ──(/login second form: apiUrl + bearer)──▶ pingStatus(/api/status) ──▶ localStorage["pincer.web.auth"]={apiUrl,token}
every API call: Authorization: Bearer <token>, X-Pincer-User: <uuid from localStorage>, (X-Tenant-Id only when session.tenantId, FE0)
401 ──▶ client.onUnauthorized ──▶ session.disconnect("unauthorized") ──▶ VoiceAuthGuard ──▶ /login?returnTo=<owner-app path>
```

## 4. Contract reality (the running server vs. the pinned commit)

`GET /api/openapi.json` does **not** exist — FastAPI serves the document at **`/openapi.json`** (docs at `/api/docs`). The pipeline uses that. The backend running locally on :8080 during the audit was **older than the `voice` branch checkout**: 58 paths vs 62, missing `/api/voice/calls/scheduled*`, `/api/voice/residency`, `/api/public/demo-call`, and the `listen_*` fields. `npm run check:api` reports exactly that delta, which is the drift check working as specified. The committed snapshot and types are generated from source at `309f87f` — from a `git archive` of that commit, **not** the working tree: the backend checkout carried uncommitted voice changes (`/api/voice/residency`, later `/api/voice/numbers`) that are not in the pinned commit. The first FE0 snapshot was taken from the dirty tree and showed 62 paths; FE1 corrected it to the commit's 60. **After C2 landed (uncommitted on the backend working tree at the time)** the snapshot was regenerated from that tree — 93 paths — and the lock records `309f87f…+uncommitted-C1-C2-B1`; CI's contract job will pass again once the backend commits and the lock is bumped to that hash (`npm run gen:api`).

Two endpoints the frontend already calls are **not in the contract** and answer 404 on this backend: `GET /api/voice/receptionist/profile` (`voice.ts:1179`) and `GET /api/voice/approvals/pending` (the contract has `/api/voice/approvals`). Both are listed in §7.

## 5. Mock inventory after FE0

`node scripts/count-mocks.mjs` → **16** badge usages in source at the end of FE0, pinned in `mock-count.lock`. FE1 moved it to **17**: the Übersicht placeholder went (−1) and the two spec-mandated "berechnet im Browser" badges arrived (+2, Heute and Braucht Sie, until `/api/voice/stats` and `needs_attention` exist). Recorded here because the rule says the count only goes down; the two badges are the spec's own instruction and disappear with the FE1 API asks. Note the DOM-level pin for the Voice page in `mockInventory.test.ts` is unchanged at zero sections.

## 6. Gates as they stand

| Gate | Command | State |
|---|---|---|
| Lint, owner app (incl. `no-literal-string`) | `npm run lint:voice` | green (0 errors) |
| Lint, whole repo | `npm run lint` | **86 pre-existing errors** in todo/notes/contacts/docs/support pages and tests, none in owner-app files → CI warning, same treatment as the type-check |
| Types, owner app, strict null checks | `npm run type-check:voice` | green |
| Types, whole repo | `npm run type-check` | 15 pre-existing errors → CI warning |
| Unit | `npm test` | 77 files / 787 tests green |
| i18n parity de↔en | `npm run i18n:check` | green (10 unused-key warnings: table/actions/language keys reserved for FE1–FE2) |
| Mock count | `npm run count-mocks` | 16 = lock |
| Contract | `npm run check:api` | green against the pinned commit's spec (60 paths); red against the stale local server (correct) |
| e2e + axe, Chromium + iPhone 12 | `npm run e2e` | 18 passed, 2 skipped (backend-only) |
| Bundle | `node scripts/bundle-report.mjs` | owner chunk 85 KB gz ≤ 250; platform entry 566 KB reported |

## 7. API asks raised by FE0

Full text with owners and reasons is in `~/Desktop/BACKEND-FE0-api-asks.md` (backend work never lands from this repo). Summary:

1. Serve the OpenAPI document at `/api/openapi.json` as the spec states (alias of `/openapi.json`) — or amend the spec. Owner: E2.
2. `GET /api/voice/status.capabilities` `{campaigns, knowledge, sip, followups, widget, residency_mode}` — FE1 gating. Owner: E2.
3. `GET /api/voice/receptionist/profile` and `GET /api/voice/approvals/pending` are called by the FE but absent from the contract — add or confirm the intended paths. Owner: E2.
4. Typed response models on `GET /api/health`, `/api/status`, `/api/integrations*`, `/api/schedules`, `/api/costs/*` (currently `dict`/untyped). Owner: E2/E3.
5. `make demo-seed` — deterministic 1 profile / 25 calls / 3 unanswered questions for the e2e job. Owner: E2.
6. CORS: add the app's dev origin `http://localhost:3000` (and the production origin once decided) to `PINCER_WEB_CHAT_URL`/allowed origins. Owner: E2.
