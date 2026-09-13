# Feature flags (FE10 T-FE10.6)

The owner app shows a surface when its backend exists. Two sources, in this order:

1. **Declared** — `GET /api/voice/status.capabilities.<key>` (`src/lib/capabilities.ts`): `voice`, `outbound`, `listen_in`, `campaigns`, `knowledge`, `sip`, `followups`, `widget`, `call_queues`, `call_controls`, `limits_api`, `residency_mode`. `false` hides (`isOff`); `true` shows even before the page probes (`isDeclared`); undeclared → the probe decides, except for the operator-only controls (`call_queues`, `call_controls`, `limits_api`, follow-up menu) which need an explicit `true`.
2. **Probed** — the page's own list request (`src/lib/features.ts`, `useFeatureFlags`, `useEndpointExists`): a 404/501 hides the section and the nav item (`followups`, `campaigns`) and lists it in `src/content/not-yet.ts`.

Nothing is faked in between: hidden means hidden, real means served. Fact chips (`InfoTag`: "berechnet im Browser", "nur dieser Browser", "aus der App") mark how real data was produced and are not counted as mocks.

| Flag | Hides | Shown when |
|---|---|---|
| `followups` | Nachfass nav + page cards, call-detail Nachfass tab, ops follow-up menu | E2 serves `/api/voice/followups/*` or declares it |
| `campaigns` | Kampagnen nav + page | F1 serves `/api/voice/campaigns` or declares it |
| `widget` (admin) | site keys, appearance, features sections | G3 serves `/api/widget/*` |
| webhooks/CRM (probe) | Integrationen cards except connected accounts | E3 serves `/api/webhooks`, `/api/integrations/crm` |
| `call_queues` | Queue tab in the call composer, local queues on Planned | declared |
| `call_controls` | inert controls in the live call window | declared |
| `limits_api` | limit / retention knob blocks on Policies | declared |
| probes | retention table, subject rights, documents, report archive/delivery, KPI disclosure, attendance, invites, server templates | the corresponding A4/G2/F2/C3/G1 route answers |
