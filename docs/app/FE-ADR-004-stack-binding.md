# FE-ADR-004 — Stack binding for the 3days.ai owner app

**Status:** accepted (FE0, 2026-09-06) · **Supersedes:** the default stack list in Block I §1 for this repo · **Context:** `docs/app/FE0-audit.md`

## 1. Stack — keep the repo's, add only what is missing

| Concern | Bound to | Note |
|---|---|---|
| Framework | Vite 5 + React 18.3 + TypeScript | Not React 19; no reason to upgrade mid-track. |
| Styling | Tailwind 3.4 + shadcn/ui (`components/ui`) + `.plat` tokens | Not Tailwind 4. The Pincer dashboard's v4 tokens are *not* shared; only ideas are (see audit §1 reuse row). |
| Server state | TanStack Query 5 | Query keys `['voice', …]` as in `voice.ts`. |
| UI/session state | zustand 5 (`src/stores/session.ts`) | Nothing server-derived goes in a store. |
| Forms | react-hook-form 7 + zod 3 | Already installed. |
| i18n | i18next 26 + react-i18next 17, owner namespaces `voice-*` | German default via `useVoiceT` (see §4). |
| Unit tests | vitest 4 + Testing Library | Existing. |
| e2e | Playwright (added), Chromium + iPhone 12 (WebKit), axe | `e2e/`. |
| Contract | openapi-typescript 7 (added) | `src/lib/api/generated/`, `api-contract.lock`. |
| Lint | ESLint 9 flat config + `eslint-plugin-i18next` (added) | `no-literal-string` only on owner-app files. |
| Package manager | npm (`package-lock.json`) | Stale bun lockfiles to be removed by the platform owner. |

## 2. App vs. site split — inside the voice app, under `/telephony`

The owner app is **the voice app**, mounted at `/telephony/*` inside the existing platform shell (`ProtectedRoute` → `TelephonyLayout` → rail/tabs → view). It is not a separate entry, not `/app/*`, not a subdomain. Reasons: the owner's instruction for this track; the voice app already holds the real call surfaces; the platform shell provides login, the apps bar and the theme. Consequences:

- Marketing stays at `/` and is untouched by FE sprints (e2e smoke guards it).
- The widget (FE9) is still a separate build target (`packages/widget`), unchanged.
- Production hosting is undecided; nothing in the code depends on the choice. **Decision to confirm with the founder (Block I §10):** `app.3days.ai` (subdomain, recommended for cookies/CORS) vs. path. Dev is a path.

## 3. API base & auth transport

- Base URL: the stored `apiUrl` (`localStorage["pincer.web.auth"]`) or `VITE_PINCER_API_URL`; requests go to the backend origin directly. **No Vite `/api` proxy** — the platform's chat and notes clients call the origin the same way and a proxy would make dev and prod differ. CORS on the backend must list the app origin (API ask 6).
- Headers: `Authorization: Bearer <token>`, `X-Pincer-User: <uuid>` (existing), `X-Tenant-Id` **only when** `session.tenantId` is set (reserved for C3; `src/lib/api/tenant.ts`).
- Errors: `ApiError { status, detail, fields? }`; `detail` is shown verbatim; 422 `loc` → `fields`; 401 → `onUnauthorized` → session logout → `/login?returnTo=`.
- Token storage stays in localStorage for phase 1 because `/chat` and the notes service read the same record (ADR 0001). Moving to memory + sessionStorage is part of FE1's owner login. The token never appears in a URL; `safeReturnTo` rejects any path carrying one.

## 4. Route slugs English, labels German

Paths are English (`/telephony/calls`, `/telephony/settings/privacy`), labels are German (`Anrufe`, `Datenschutz`) and live in `src/i18n/locales/{de,en}/voice/*.json`. The owner app's locale is resolved by `resolveVoiceLocale`: an explicit choice (`localStorage["voice.locale"]`) wins, otherwise `de` unless the browser language starts with `en`. It is independent of the platform's detected language so a `uk`/`fr` browser gets German here and English marketing there. `Intl` uses `de-DE`/`en-GB` (`src/lib/format.ts`). Sie-Form throughout; the i18n test rejects du-forms in common copy.

## 5. Design tokens

The `.plat` family (`src/styles/platform.css`) is the owner app's palette: radii ≤ 14 px, one ambient gradient shared by sidebar and page, Sora. It is light-only today; shadcn's `.dark` tokens exist, so the dark set for `.plat` is a FE10 polish item, not a blocker (owners in offices use light). Components added in FE0 (`EmptyState`, `DataTable`) use `.plat` variables only.

## 6. Consequences

- Every later FE spec's "route / component / query key" line resolves via `FE-BINDING.md`; a sprint that needs a new path adds it to `_lib/routes.ts`, which `App.tsx` registers automatically.
- Legacy voice views keep their English literals until the sprint that owns them migrates them; the `no-literal-string` file list in `eslint.config.js` grows with each sprint and never shrinks.
- The repo-wide `tsc` stays a warning in CI until the six legacy files are fixed by their owners.
