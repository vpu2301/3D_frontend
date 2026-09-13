# Vertrauen (FE6 §2)

Route `/telephony/trust`. Components `src/pages/telephony/_components/trust/*` (`TrustView`, `ClaimCard`); namespace `voice-trust`. Rule: a claim renders only with the mechanism that makes it true; `ClaimCard` with `evidence={null}` shows the claim with a "Nachweis folgt" badge naming the unblocking sprint (`data-evidence="0"`), never an unbacked tick.

| Claim | Evidence today |
|---|---|
| KI-Hinweis vorlesen | disclosure template + hash from `/profiles/meta`, link to the greeting section; the "vorgelesen in x %" rate waits for A4 |
| Daten in der EU | manifest mode ≠ none and every leg allowed, last canary run; link to the privacy page |
| Keine erfundenen Fakten | count of open unanswered questions (30 d) from `/knowledge/unanswered`, link to Wissen |
| Nachrichten nur mit Einwilligung | needs consent stats on `GET /api/voice/trust` → badge E2 |
| Keine Terminlisten / Kontaktdaten Dritter | structural (tools return the caller's own appointment) + the doctor report being present |
| Keine Werbeanrufe ohne Rechtsgrundlage | campaigns (F1) not bound → badge G2 |

Numbers (last 30 days: answered, booked, messages, median duration) are `computeTrustNumbers` over the loaded call history and wear the "berechnet im Browser" badge; once the history is capped they are marked "geschätzt" (`method: estimated`). Nachweise: manifest JSON download, doctor summary, canary (privacy page), evidence per call (call detail); CI status and the trust-report PDF badged G2. "Link teilen" is disabled with a G2 badge — decision recorded: a public, signed, PII-free share link is wanted (FE6 §10) but must be minted by the server.
