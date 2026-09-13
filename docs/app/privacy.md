# Datenschutz (FE6 §1)

Route `/telephony/settings/privacy`. Components `src/pages/telephony/_components/privacy/*`; data `src/lib/api/owner/privacy.ts`; namespace `voice-privacy`. The page states facts the server can prove and nothing else — the app carries no compliance prose (a vitest grep over the owner-app files fails on `DSGVO`/`GDPR`/`konform`/`compliant` in JSX; the words live in the server's documents).

| Section | Source | State |
|---|---|---|
| Datenstandort | `GET /api/voice/residency` → manifest `{mode, generated_at, config_hash, ok, legs:[{leg, vendor, host, region, vendor_hq, basis, allowed, note}], violations}` (60 s) · `GET /api/ops/canary?limit=1` (5 min) | real. `manifestRows` orders carrier · stt · tts · llm · storage · embed and keeps every violating leg as a red row with the engine's reason plus "Behebung durch Ihre Betreuung". Mode `none`/unset → amber banner here and on the Übersicht (`ResidencyNoneBanner`). "Bericht (JSON)" downloads the manifest verbatim. |
| Auftragsverarbeiter | derived from the manifest's vendors (`subprocessorsOf`, local legs skipped) | real; Markdown download built from the same rows |
| Aufbewahrung | `GET/PUT /api/voice/retention` (ask) · last purge from `GET /api/audit?action=retention_purge` | badge A4 until the server serves the classes; editing validates `min ≤ days ≤ max` (`validateRetentionDays`) and confirms; "Audit-Protokoll: nie gelöscht" is a fixed statement of the server's rule |
| Aufzeichnung & Einwilligung | recording flag of the active profile (link to the profile editor) · `consent_mode`, disclosure template + hash from `GET /api/voice/profiles/meta` | real; "Hinweis vorgelesen" rate badged A4 (the server only has `disclosure_played_at` per call) |
| Betroffenenrechte | `POST /api/voice/subject-export {number}` → ZIP · `POST /api/voice/erase/preview {number}` → counts · `POST /api/voice/erase {number, confirm}` (all asks; the CLI `erase_number`/`subject_export` exist) | the number is normalised in the browser (`normalizeSubjectNumber`, E.164) and sent only in a POST body, never in a URL; erase needs the preview **and** the typed word (`canErase`); a 404 turns the section into an A4 badge |
| Nachweis exportieren | `GET /api/voice/evidence/{call_sid}` → ZIP (manifest at call time, call.json, masked transcript, audit rows) | real, also the "Nachweis exportieren" button on every call detail (`EvidenceButton`); export per period badged A4 |
| Dokumente | `GET /api/voice/compliance?lang=de|en` → `{mode, file, markdown}` | the mode one-pager downloads as Markdown; subprocessors / retention concept / AI transparency are rendered by the backend's `render_all` but not served → badge A4 |

Query keys: `["voice","residency"]`, `["voice","residency","check"]`, `["voice","compliance",lang]`, `["audit",action,limit]`, `["voice","retention"]`, `["voice","trust"]`.

Tests: `src/test/voice/privacy.test.tsx` (manifest rows incl. red, subprocessors, retention bounds, number normalisation, erase gate, ClaimCard, trust numbers, CI grep) and `e2e/privacy.spec.ts` (manifest table, evidence download, erase preview → 404 → badge with the number kept out of the URL, violation row + `none` banner on both pages).
