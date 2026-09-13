# Aufmerksamkeit (FE8 §2)

Route `/telephony/attention`. Components `src/pages/telephony/_components/attention/AttentionQueueView.tsx` (`ItemRow`, `AttendanceButtons`, bulk bar); data `src/lib/api/owner/attention.ts`; namespace `voice-attention`. Replaces the FE2 interim inbox.

- **Queue** — `GET /api/voice/attention?filter=all` → server rows when G2 answers (`kind, priority, number, summary, at, call_sid, message_id, handled_by/at, note, appointment`). On 404 the queue is `computeAttention()` over calls + messages, plus read messages as handled rows, with the browser-local handled map (`useHandledCalls`, now with timestamps) for call items; the page says so with a G2 badge. Sorted by handled, priority (backend or the FE weight), recency. Filters offen / erledigt / alle; `j/k/e` on desktop (ignored while typing); checkbox selection with a bulk "Alle Erledigt" that confirms first.
- **Handled** — `useMarkHandled()` PUTs `/api/voice/attention/{id} {handled, note}` with an optimistic `withHandled()` step and rollback (pure and tested). Without the server the message path stays the real `POST /messages/{id}/read` and the call path the local map.
- **Count** — `useAttentionCount()` feeds the rail and the mobile tab (SSE `attention.changed` invalidates `['voice','attention']`, 30 s poll fallback).
- **No-show** — appointment items whose slot passed show Erschienen / Nicht erschienen → `PUT /api/voice/calls/{sid}/appointment/attendance {attended, attendance}`; a 404 turns the buttons into an F2 badge.
- Actions per kind: Zurückrufen (outbound allowed), Antwort hinzufügen (unanswered → Wissen), Termin ansehen, Anruf öffnen, Erledigt / Wieder öffnen. Numbers masked with reveal.
- The Übersicht card keeps its computed badge until G2 serves the queue.
