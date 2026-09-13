# Owner login (FE1)

Route: `/telephony/login` (`ROUTES.LOGIN`) — outside the platform's `ProtectedRoute`, because it is what creates the session. Component: `src/pages/telephony/OwnerLoginPage.tsx`. Store: `src/stores/session.ts`.

## Flows

**Magic link (pilots).** The founder sends `https://<app>/telephony/login?t=<token>` (optionally `&api=<backend origin>` when the app is not served by the backend; otherwise `VITE_PINCER_API_URL`, then the page origin, is used). On the first render `consumeMagicLink()` reads `t`/`api` and rewrites the address with `history.replaceState` **before anything else runs** — the token is never in the address bar, the history entry, or a referrer after load. The token is then validated with `GET /api/voice/status`; a 401 shows "ungültig oder abgelaufen" and the manual form, a network failure shows "nicht erreichbar".

**Manual key.** Paste field with "Wo finde ich das?" help. "Erweitert" reveals the server address for instances that are not same-origin.

**Remember this device.** Off by default (shared reception PCs; the copy says so). Off → token in memory + `sessionStorage`; on → `localStorage`. The platform's `isAuthenticated` flag is written to the same storage so both expire together. Logout (user menu / "Mehr" sheet) clears both storages and the flag.

## Rules

- Every request goes through the FE0 client with `Authorization: Bearer`; a 401 anywhere calls `session.disconnect("unauthorized")`, which clears the token and stores the current owner-app path as `returnTo`; `VoiceAuthGuard` redirects to `/telephony/login?returnTo=…` and the login returns there. `safeReturnTo` rejects anything that is not a same-origin path or that carries a `t=`/`token=` parameter.
- `can(action)` / `useCan(action)` gate nav rows and buttons; phase 1 role is `owner`. Actions: `view_full_number`, `copy_full_number`, `view_transcript_full`, `change_settings`, `view_costs`, `manage_team`, `start_call`. C3 adds `staff` by editing `ROLE_ACTIONS` only.
- No client-side expiry in phase 1. Phase 2 hook: `session.setTenant()` / `setRole()` already exist for `POST /api/auth/session` → `{tenant_id, role, expires_at}`.

## What the platform login still does

`/login` (platform) remains for the other apps; it gained `?returnTo=` handling in FE0. The owner app never links to it.
