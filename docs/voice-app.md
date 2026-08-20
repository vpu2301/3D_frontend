# Voice app (`/telephony`) — real data and the mock contract

The Voice page is the telephony app's default screen and runs on **real data**
from `/api/voice/*` on the connected Pincer backend (`src/lib/pincerClient.ts`
owns the token; `src/lib/api/voice.ts` owns the types and hooks). Nothing on it
is demo data unless it is wearing a badge.

## The contract

> Real data or a visible `MOCK` badge — with the reason, and the follow-up that
> will replace it.

Badged surfaces stay on the page rather than being hidden: an operator needs to
know the capability is planned, and a reviewer needs to see what is not wired
yet. `src/components/voice/MockedBadge.tsx` provides the three variants
(`MockedBadge`, `MockedSection`, `MockedRouteBanner`); the two containers carry
`data-mock="true"` so the inventory is countable from the DOM and from a grep.

**The count is pinned by a test** — `src/test/voice/mockInventory.test.ts`.
De-mocking something is a deliberate edit to that list, so a badge can neither
linger on a real feature nor quietly vanish from a fake one.

## Mock inventory

| Section | State | Why |
|---|---|---|
| Call history, active calls, transcripts, actions | **real** | `/api/voice/calls`, `/active`, `/calls/{sid}` |
| Outbound call | **real** | `POST /api/voice/calls` |
| Appointment scheduling | **real** | `POST /api/voice/schedule` (Sprint 6 T6.1) |
| Per-call cost | **real** — badge removed in v2 | `call_costs` (Sprint 9 T9.1) |
| Turn latency | **real** | `TURN_LATENCY` events (Sprint 5 T5.1) |
| Outcome / failure code | **real** | Sprint 3 T3.1, Sprint 9 T9.3 |
| Daily limit · quiet hours · opt-out list | **real** (read-only) | Sprint 8 T8.3 |
| Agent call summary | **real** | `/api/chat/message` under an isolated summarizer identity |
| **Live listen-in / waveform** | `MOCK` | No audio reaches the browser — needs a media proxy |
| **Sentiment & talk ratio** | `MOCK` | Neither is computed anywhere in the pipeline yet |
| Call controls (mute/hold/transfer) | `MOCK` | Inert — needs the media proxy plus a control endpoint |
| Call queue · locally planned calls | `MOCK` | No call-queue endpoint; entries persist in `localStorage` |
| Follow-up task · call tag | `MOCK` | No task/tag endpoints; persisted in `localStorage` |

## Degrading gracefully

Every field v2 added is optional on the wire. Against a backend that predates
them the page renders exactly the v1 table — columns, chips, filters and panels
appear per-field, the moment data for them starts arriving. Consequences worth
knowing:

- Filter dropdowns are built from the loaded history, so they only ever offer
  outcomes, failure codes and languages that actually occur. No dead options.
- Sorting by latency or cost sinks rows that have no value to the bottom in both
  directions — an unpriced call is not the cheapest call.
- The cost total in the stats strip is labelled with how many rows it covers
  when some are unpriced, so a partial sum never reads as the whole bill.
- A failed calendar write is never rendered as a booked appointment. See
  `AppointmentPanel` and `src/test/voice/appointmentPanel.test.tsx`.

## Files

| File | Role |
|---|---|
| `src/lib/api/voice.ts` | Types + TanStack Query hooks for every `/api/voice/*` call |
| `_components/voice/VoicePage.tsx` | The page: header, active calls, history table, detail rail |
| `_components/voice/StartCallModal.tsx` | Composer — Schedule appointment / Free-form call / Queue |
| `_components/voice/AppointmentPanel.tsx` | Candidates, agreed slot, status timeline, retries |
| `_components/voice/LatencyPanel.tsx` | Per-turn STT / LLM-TTFT / TTS bars against the Sprint 5 targets |
| `_components/voice/CallOutcomePanel.tsx` | Outcome card + follow-up toolbox |
| `_components/voice/LimitsStrip.tsx` | Daily limit, quiet hours, read-only opt-out list |
| `_components/voice/CallChips.tsx` | Language flag, outcome/latency chips, cost, appointment marks |
| `_lib/voiceMeta.ts` | Language table, language-switch parsing, outcome taxonomy, formatting |

## v3 — in-call tools (S11) and the receptionist (S12)

Two operational surfaces were added, both near-real-time.

**Live approvals.** A `user`-mode tool call parks server-side and the dashboard
decides it *while the caller is on hold* (S11 default timeout: 25s). The card is
mounted at the app root, not on the Voice page, because the owner is almost
never on /telephony when it fires. Delivery is SSE-first
(`/api/approvals/stream`, event `voice_approval`) with a 3s poll of
`/api/voice/approvals/pending` as the fallback — the fallback is what makes a
dead stream slow rather than silent. The countdown is computed from the
server's `expires_at` on every tick: a card that renders late shows the time
that is actually left, not a fresh window.

**Receptionist.** Profile, inbound stats and blocklist on the Voice page; the
messages the receptionist took at `/telephony/messages`, with the unread count
in the rail. Open/closed is evaluated in the *business's* timezone (the profile
carries an IANA zone) — never the browser's.

Both degrade to nothing: no endpoint, no surface. The receptionist panel says
"not configured" on a 404 rather than rendering empty numbers.

| File | Role |
|---|---|
| `src/components/voice/VoiceApprovalHost.tsx` | Root-mounted stack of live approval cards + the sound preference |
| `src/components/voice/ApprovalCard.tsx` | One approval: countdown ring, args preview, approve/deny, terminal states |
| `_components/voice/MessagesView.tsx` | Messages inbox — list, drawer, mark-read, callback prefill |
| `_components/voice/ReceptionistPanel.tsx` | Business profile, inbound stats strip, blocklist |
| `_components/voice/PolicyPanel.tsx` | Read-only resolved tool policy (Settings → Voice) |
| `_components/voice/CallActionsTimeline.tsx` | Actions v2: tier/mode chips, deny reasons, autonomy disclosure |
| `src/lib/sse.ts` | The app-level `text/event-stream` reader |

Deny-reason codes map to sentences in **both UI languages** in `_lib/voiceMeta.ts`;
an unmapped code renders as the raw code rather than a wrong sentence.

Open backend asks live in `~/Desktop/BACKEND-voice-v3.md` (this task),
`~/Desktop/BACKEND-voice-v2.md` and `~/Desktop/BACKEND-voice-call-history.md`.
