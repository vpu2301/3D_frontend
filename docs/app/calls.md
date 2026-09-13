# Anrufe — history, live calls, call detail (FE2)

Routes: `/telephony/calls` (history), `/telephony/calls/:sid` (detail), `/telephony/attention` (inbox v1.5), `/telephony/calls/ops` (the operator voice page, under Erweitert). Data: `src/lib/api/owner/calls.ts`. Components: `src/pages/telephony/_components/owner-calls/*`. Namespace: `voice-calls`.

## What an owner sees

**History.** Desktop table / phone cards (`DataTable`), newest first: time (`Heute 14:32` / `Mo 01.09. 09:05`), direction, contact (name from `/api/voice/contacts` matched on the normalised number, else the masked number), **Ergebnis** chip, intent (inbound) or the briefing's first 60 characters (outbound), duration, appointment and attention marks. Filters are URL-synced and PII-free (period, direction, result, intent, language, with-appointment, needs-you, name query); a phone number typed into the search is matched exactly after normalisation and never written to the address. "CSV exportieren" writes the current filter with masked numbers and a date-only file name.

**Ergebnis chip** (`resultGroupOf`, one chip per call, raw codes only under Details):

| Backend | Chip |
|---|---|
| live status (`in-progress`, `ringing`, `queued`, …) | Läuft |
| any `failure_code`, or `status=failed` | Fehlgeschlagen (tooltip; `briefing_lost` → "Systemfehler, nicht Ihr Fehler") |
| `outcome.outcome` declined/rejected | Abgelehnt |
| `no-answer`, `busy`, `voicemail`, `canceled` (status or outcome) | Nicht erreicht |
| appointment `calendar_created` / `invitations_sent` / `confirmed` | Termin gebucht |
| `inbound_intent=message` or outcome `message_taken` | Nachricht hinterlassen |
| `inbound_intent=human` or outcome transferred/handoff | Weitergeleitet |
| everything else completed | Erledigt |

**Live section.** Active calls above the list. Listen-in: the owner-app player is deferred (decision §11); where `listen_available` is reported the control links to the ops console (`<apiUrl>/voiceops`) with a badge "nach GA".

**Detail.** Header (contact, direction, time, duration, chip, language, cost, "Als erledigt markieren", "Zurückrufen" when outbound is enabled), the Summary card (outcome paragraph, Zugesagt, Wichtige Fakten, nächste Schritte with copy), then tabs — an accordion on phones: Verlauf, Termin (when present), Aktionen (badge FE7), Nachfass (badge FE7), Auftrag (outbound), Details (`?debug` only).

**Verlauf.** Speech lines with `Anrufer` / `Assistent`; SYSTEM lines as timeline events (Auftrag, Sprachwechsel, KI-Hinweis, Werkzeug, Weiterleitung). Phone-number-like tokens are masked client-side (`maskTranscriptText`). "Vollständig anzeigen" appears only when the backend reports `capabilities.transcript_reveal_audited` — until then the page says the full view follows once reveals are audited.

**Aufmerksamkeit v1.5.** The inbox: message text, masked callback number (owner reveal), when they called, `Erledigt` = the real `POST /api/voice/messages/{id}/read`, `Zurückrufen` (outbound-gated, prefilled). Derived call items (handoff failed, wanted a person, unanswered) sit below with a local, badged Erledigt (FE8). In-call approvals stay under Betrieb › Freigaben.

## Badges after FE2

`count-mocks` now counts **usages** of the badge components (`MockedBadge`, `MockedSection`, `MockedRouteBanner`, `ComputedBadge`, `SprintBadge`), not their definitions, so a wrapper never hides one. On that basis FE1 ends at 18 and FE2 at **23**: −1 (the old mocked call explorer is gone) +5 (`SprintBadge`: Aktionen FE7, Nachfass FE7, listen-in nach GA, handled-local FE8 on the detail and on the inbox). The spec's budget of +3 did not count the handled-local badge it also mandates; every badge names its sprint.

## API asks (→ `~/Desktop/BACKEND-FE2-api-asks.md`)

1. Server-side history filters (`period`, `result_group`, `intent`, `has_appointment`, `needs_attention`, `language`, `search_name`) and `contact_name`, `needs_attention`, `handled` on `CallSummary`.
2. `cost_total_eur` on the detail (owners see USD today).
3. `GET /calls/{sid}/transcript?masked=…` with a server audit of `masked=0` and `capabilities.transcript_reveal_audited=true` when it exists.
4. CSV export endpoint respecting masking + audit.
5. Confirm the inbox wire shape (FE1 ask 7).
