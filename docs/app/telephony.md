# Einrichtung › Telefonie (FE3)

Route `/telephony/settings/telephony`. Components `src/pages/telephony/_components/settings/telephony/*`; data `src/lib/api/owner/telephony.ts`; guides `src/content/telephony-guides.ts` (condensed from `pincer/docs/guides/telephony/*.md`); namespace `voice-telephony`.

- **Ihre Nummer**: `GET /api/voice/numbers` → masked number, mode chip (Rufumleitung / BYOC / SIP / "Cloud-Nummer (EU-Rechenzentrum)" — the vendor name is not shown to owners, decision §10), profile, status (`statusOf`: geprüft / Anrufernummer wird nicht übermittelt / Selbsttest läuft / registriert / getrennt / noch nicht geprüft), "Zuletzt geändert von … am …" when the record carries it.
- **Modus wählen**: cards for Rufumleitung, BYOC/SIP and Neue Nummer.
- **Rufumleitung einrichten**: provider select → owner-facing steps with the reception number filled in and a copy button, caller-ID note, pitfalls; a form registers the business number (`POST /api/voice/numbers`, never in the URL).
- **Selbsttest**: `POST /api/voice/numbers/{id}/selftest` opens the window (`{e164, window_s, selftest_until, instructions}`), then a 2 s poll of `GET …/{id}/status` (`status: pending|untested|verified`, `caller_id_lost`, `caller_id_hint`, `selftest_from`); phases waiting → ok / **caller_id_lost** (shown honestly with the server's carrier hint) / timeout. Five-minute window.
- **BYOC / SIP**: providers from `GET /api/voice/sip/providers`, registration from `GET /api/voice/sip/status`, and the account form → `POST /api/voice/sip/accounts` (`name, provider, kind, username, password_env, registrar, numbers`). The password is named by its environment variable on the server; the secret never travels (rule 7).
- **Neue Nummer**: the regulatory bundle form → `POST /api/voice/regulatory-bundles` (company, address, register id, contact, document name); submissions list with their status (`in_review` until the provider approves).
- **Testanruf-Checkliste**: five items, remembered per browser; reused by FE4.

On an older backend without B1 the page says the server is too old; guides and checklist still work.
