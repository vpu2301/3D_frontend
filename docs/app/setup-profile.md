# Einrichtung › Unternehmensprofil (FE3)

Route `/telephony/settings/profile`. Components `src/pages/telephony/_components/settings/profile/*`; data, schema and helpers `src/lib/api/owner/profile.ts`; namespace `voice-profile`.

**Structure.** Eight sections as vertical steps with completeness (`3/5 Pflichtfelder`), a sticky anchor rail on desktop: Unternehmen · Öffnungszeiten · Leistungen · Terminbuchung · Ansprechpartner & Eskalation · Begrüßung & Stimme · Schnellantworten · Datenschutz.

**Form engine.** react-hook-form + zod (`profileSchema` is the form's own draft model; `fromWire`/`toWire` in `src/lib/api/owner/profile.ts` translate to the backend's `BusinessProfile` v2 — hours as `"08:00-12:00"` strings, one `transfer.target` plus `escalation.handoff_numbers`, `service_items`, `hours_exceptions`, `holidays: "de"` with `business.state`; the round trip is tested). zod messages are keys under `errors.*`; a server 422 (`{detail: {errors: [{field, message}]}}`) lands on its field verbatim. Autosave 3 s after the last change to `PUT /api/voice/profiles/{id}` with `activate=false` — each save is a new inactive version (note "autosave"); indicator "Entwurf gespeichert 14:32". Leaving with unsaved changes: the browser prompt guards a hard leave and an in-app route change flushes the pending autosave on unmount. The spec's in-app dialog needs react-router's `useBlocker`, which requires a data router; the platform mounts a plain `BrowserRouter`, so that dialog waits for the platform's router migration (recorded as platform debt).

**Aktivieren.** Validates, opens the diff dialog against the active version (`diffProfiles` on the wire shapes, client-side — the backend has `diff_profiles` but no route yet), then saves with `activate=true` → "Ab dem nächsten Anruf aktiv". Versions drawer lists `GET …/versions` (no data) and loads `GET …/versions/{v}` on demand for diff and "Wiederherstellen".

**Öffnungszeiten.** Weekly grid with up to four ranges per day (split shifts), overlap and inverted-range rejection, copy Monday to Mon–Fri, Bundesland select → holiday list (`computeGermanHolidays`, badged "im Browser berechnet" until `GET /api/voice/holidays` exists), exceptions (date range, closed or altered hours). Live line "Jetzt: geöffnet bis 17:00 · Nächster Feiertag …". Plain inputs and buttons only — keyboard-complete.

**Begrüßung.** The disclosure is the server's fixed sentence (`GET /api/voice/profiles/meta` → `disclosure[lang].template`, e.g. „Guten Tag, hier ist der digitale Assistent von {business_name}."), rendered as a locked block *before* one editable tail; the wire carries only the tail (`greeting.text`, ≤ 300) and `disclosure_hash` from meta, which the backend verifies. A tail that starts with the disclosure is refused by the server (`disclosure_fixed`). Voice picker from `meta.voices` (per language: provider, quality, voice id); "Vorschau anhören" → `POST /api/voice/tts-preview {text, language, voice}` → audio bytes → inline player.

**Without the C1 API** (an older backend) the page says the server is too old; nothing is kept locally and nothing is faked.

## API asks → `~/Desktop/BACKEND-FE3-api-asks.md`
