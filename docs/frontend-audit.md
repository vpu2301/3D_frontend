# F0 — Frontend audit (`3D_frontend`)

Deliverable for **PR-1** of `02-FRONTEND-CUT-LIST.md` §6. No code changes. Every number below
was read from the working tree on branch `voice` (2026-09-08), not assumed.

It also supersedes nothing: `docs/app/FE0-audit.md` is the Block I inventory of the same repo
taken 2026-09-06. This file answers the cut list's four questions and records the keep/delete
decisions it asks the CTO to sign.

---

## 0. Read this first — the cut list's premise does not match this repo

The cut list was written by someone who can see Pincer's `dashboard/` but not `3D_frontend`, and
it assumes `3D_frontend` is "the product app": a modest voice product that grew some duplicate
screens. That is not what is here.

| Cut list assumes | Actually here |
|---|---|
| One product app, a handful of screens | **165 route entries / 164 unique paths** in one flat `src/App.tsx`, **788 TS/TSX files, 168 072 lines** |
| The duplication is dashboard ↔ product | The duplication is **three products in one bundle**: a ~90-route **marketing site**, a ~60-route **platform app suite** (Notes, Mail, Drive, Todo, Calendar, Contacts, Docs, Accounting, Dashboard), and the ~33-route **voice owner app** under `/telephony` |
| The product app still has mocks, hand-written types, polling-first transport, MOCK badges | Inside the voice app all of that is **already done**: `mock-count.lock = 0`, generated types in `src/lib/api/generated/schema.d.ts` pinned by `api-contract.lock`, SSE in `src/lib/api/owner/events.ts` with polling as fallback, hidden-until-served via `src/lib/features.ts` |
| Nine routes total is the target | The voice app **alone** is 33 routes and passed its own GA gate at that size (`docs/decisions/GA-v2-frontend.md`) |

**Consequence.** Section 1 of the cut list ("stop maintaining two apps") is directionally right but
points at the wrong second app. The second app it names — Pincer `dashboard/` — is not in this
repo and is not this repo's to delete ([[feedback_frontend_only_pincer]]). The second and third
apps that *are* in this bundle are the marketing site and the platform suite, and the cut list
never considered them because it could not see them.

So the four questions in §4 are the load-bearing part of the document here, and §2/§3's named
cuts are mostly already-done or not-applicable. Both are audited below.

---

## 1. The named cuts (§2, §3) checked against this repo

### §2 Pincer dashboard pages

Every row targets `pincerhq/pincer`'s `dashboard/`, a **different repository**. Nothing in this
table is actionable from `3D_frontend`; it is recorded so the deletion PR is not written twice.

| Cut list row | Status here |
|---|---|
| `pages/Dashboard.tsx`, `Costs.tsx`, `Conversations.tsx`, `Audit.tsx`, `Skills.tsx`, `IntegrationDetail.tsx`, `Doctor.tsx`, `Settings.tsx`, `VoiceOps.tsx`, `Login.tsx` | **Not in this repo.** These are `dashboard/src/pages/*` in the backend repo. `src/pages/VoiceOps.tsx` does not exist here — this repo's operator-flavoured voice page is `/telephony/calls/ops`, already scoped as "Erweitert" and gated on declared capabilities |
| "Port only `api/client.ts`, `formatters.ts`, `components/ui/*`, Tailwind tokens" | **Already resolved and the opposite way.** FE0 decided *not* to port `dashboard`'s ky client (`docs/app/FE0-audit.md` §1, row "Reuse from Pincer `dashboard/`"): this repo's `src/lib/api/client.ts` already carries URL normalisation and SPA-fallthrough that the dashboard's lacks. `formatters.ts` was adapted into `src/lib/format.ts` with `de-DE` + PII masking. `components/ui/*` (45 shadcn primitives) already exists here and is newer |
| `/ops` as one tabbed operator route | **Belongs in the backend repo.** Rule 9 of the Block I track already says operator surfaces stay in Pincer `dashboard/`; the FE track's job is that owner-facing surfaces never become dashboard pages. Merging Doctor + Audit + Costs into `/ops` is a `dashboard/` PR, not one here |

### §3 Components and infrastructure

| Cut list row | Status here | Action |
|---|---|---|
| Delete every `MOCK`-badged section and its fixtures | **Done at FE10.** `npm run count-mocks` = 0 over `src/pages/telephony` + `src/components/voice`; `mock-count.lock` pins 0 and CI fails above it. Gaps are hidden behind `src/lib/features.ts` and listed on `/telephony/whats-new` from `src/content/not-yet.ts` | none |
| Polling as primary transport | **Done at FE7.** `src/lib/api/owner/events.ts` (`useEventStream`) is mounted in `TelephonyHome`; `useLiveInterval` turns polling off while SSE is up. Polling remains only as the fallback the cut list explicitly allows | none |
| Client-side computed metrics | **Partially open, deliberately.** Browser-computed values still exist for reports and the attention queue where G2/F-block endpoints do not exist, but they are labelled (`method: estimated` → "geschätzt", `InfoTag` fact chips) rather than presented as server truth. Removing them means shipping the API asks in `docs/app/api-asks.md`, not deleting UI | keep, tracked as asks |
| Hand-written response types | **Open in one file.** `src/lib/api/voice.ts` still declares **71** local interfaces/types mirroring `api/voice.py`, 1 737 lines. `src/lib/api/owner/*` is generated-typed against `src/lib/api/generated/schema.d.ts`. This is the single largest live instance of the disease the cut list names | **cut candidate — real** |
| zustand stores holding server data | **Clean.** One store, `src/stores/session.ts`, session + tenant + UI only. TanStack Query owns server state | none |
| Owner-facing web chat | **Present and intentional.** `/chat` is mounted as "Assistent" at `/telephony/assistant` (FE1 decision). The cut list says remove the surface from the voice product; the Block I spec says the opposite | **decision needed** |
| Live listen-in player | **Present.** `src/components/voice/listen/` — `listenClient.ts`, `mulaw.ts`, `audioSink.ts`, `ListenIn.tsx`. The cut list deletes it because backend `monitor.py` is being deleted | **cut candidate — real, pending backend confirmation** |
| Approvals inbox UI | **Present.** `src/components/voice/ApprovalCard.tsx` + `VoiceApprovalHost.tsx`, mounted at app root (S11 §6.5: the owner is rarely on the Voice page when the agent asks and the callee is on hold) | **decision needed — spec conflict** |
| Charts before F4 | **3 files import `recharts`:** `src/components/ui/chart.tsx` (the shadcn primitive), `src/pages/telephony/_components/reports/KpiTiles.tsx` (FE8 Berichte), `src/pages/notes/_components/settings/AiSpendChart.tsx` (platform app). The voice app ships one chart, in the reports surface the cut list itself defers charts *to* | keep |
| Marketing routes in the app bundle | **The single biggest live hit.** ~90 marketing paths are imported **eagerly** in `App.tsx`; the platform entry chunk is **565 KB gz** against the owner app's 74.5 KB gz. Already recorded as known debt in the Block I track | **cut candidate — real, highest value** |
| Dark + light dual theming | `ThemeContext` toggles `html.dark` and shadcn tokens have dark values, but the `.plat` token family is light-only — **the voice app already renders one theme** regardless | none for the voice app |
| Storybook / playgrounds | **Absent.** No `.storybook`, no dependency. But `/dev/playground`, `/dev/api`, `/dev/docs` and `/demos` are four protected routes serving the same purpose | **cut candidate — real** |
| i18n of operator screens | **Correct already.** German-first with `en` complete covers the owner app; `/telephony/calls/ops` is the operator surface and is inside that same i18n scope, which is *more* than the cut list asks, not less | none |

---

## 2. The four questions, applied

One "no" is a delete. Answers are recorded per group; the fourth column is the verdict the rule
produces, the fifth is what I actually recommend and why it differs.

**Legend.** 1 Entity · 2 Real API · 3 In the demo / keeps a customer alive · 4 Only screen for that entity.

| Group | Paths | 1 | 2 | 3 | 4 | Rule says | Recommended |
|---|---|:--:|:--:|:--:|:--:|---|---|
| **Voice owner app — core** `/telephony`, `/calls`, `/calls/:sid`, `/attention`, `/setup/*`, `/settings/profile`, `/settings/telephony` | 20 | ✓ | ✓ | ✓ | ✓ | **keep** | **keep** |
| **Voice owner app — supporting** `/knowledge`, `/rules`, `/reports`, `/trust`, `/settings/{privacy,tools,team,widget,profile/templates}`, `/whats-new` | 11 | ✓ | ✓ | ✓ | ✓ | **keep** | keep — each passed the FE10 hidden-until-served gate |
| **Voice owner app — no backend** `/followups`, `/integrations`, `/campaigns[/new,/:id]` | 4 | ✓ | ✗ | ✓ | ✓ | **delete** | **hide, do not delete.** They are already hidden behind capability probes and render a banner on 404. Deleting them re-does F-block work when E2/E3 ship; the rule's intent (nothing fake ships) is satisfied |
| **Voice app — operator** `/telephony/calls/ops`, `/calls/live`, `/calls/pending-approval`, `/messages`, `/planned`, `/numbers`, `/usage`, `/policies`, `/audit`, `/settings` | 10 | ✓ | mixed | ✗ | ✗ | **delete / move** | **move to Pincer `dashboard/`.** These duplicate owner screens for an operator audience — exactly the §4 Q4 duplication. Not deletable from here alone; needs the `dashboard/` side first |
| **Owner chat** `/chat` mounted as `/telephony/assistant` | 1 | ✗ | ✓ | ? | ✓ | **delete from this product** | **decision needed.** Block I FE1 put it in the nav on purpose; the cut list removes it. One of the two documents is wrong |
| **Auth** `/login`, `/signup`, `/forgot-password`, `/telephony/login` | 4 | ✗ | ✓ | ✓ | ✗ | **consolidate** | keep `/telephony/login` (magic link, org-aware) + `/login`. `/signup` and `/forgot-password` have no backend behind them |
| **Marketing site** `/`, `/pricing`, `/solutions/*` (15), `/product/*` (6), `/platform/*` (5), `/use-cases/*` (6), `/roles/*` (6), `/customers/*` (4), `/resources/*` (5), `/support/*` (4), `/segments/:slug`, `/leistungen/:slug`, … | ~90 | ✗ | ✗ | ✗ | n/a | **move out of the bundle** | **move, do not delete.** The cut list says "static site or nothing" and it is right about the *bundle*: eager imports here cost 565 KB gz. The content is the company's shop window and is not the cut list's to delete |
| **Platform app suite** `/dashboard`, `/notes/*` (11), `/mail/*` (15), `/drive/*` (10), `/todo/*` (13), `/contacts/*` (9), `/docs/*` (3), `/calendar/*` (2), `/accounting/*`, `/tasks`, `/teams/*`, `/staff/*`, `/workflows/*`, `/billing`, `/profile`, `/settings`, `/channels`, `/skills-hub`, `/ai-*` | ~60 | ✗ | mixed | ✗ | ✗ | **delete** | **out of scope of this document.** ~56 000 lines belonging to other product tracks. The cut list never saw them and its four questions — written for voice entities — return "no" on every non-voice product by construction. This needs its own decision, not this rule |
| **Dev toys** `/dev/playground`, `/dev/api`, `/dev/docs`, `/demos` | 4 | ✗ | ✗ | ✗ | ✗ | **delete** | **delete.** Four "no"s honestly. This is the §3 "component playground" row under a different name |

### What the rule kills that the cut list did not anticipate

Applied literally, questions 1–4 mark **~154 of 164 paths for deletion**, because ~150 of them
belong to products the cut list's author did not know were in this bundle. That is not a mandate
to delete them — it is evidence the rule's scope needs stating: **the four questions are a rule
for the voice product's route table, not for the repository.**

---

## 3. Route map §5, reconciled

| Cut list's new route | Where it already is here |
|---|---|
| `/` Übersicht | `/telephony` (Übersicht, FE1) |
| `/orgs` Firmen | `/telephony/settings/team` (FE9, tenants on `/api/tenants/*`) |
| `/numbers` Rufnummern | `/telephony/settings/telephony` (FE3) — `/telephony/numbers` is the old operator view |
| `/agents` Assistenten | `/telephony/settings/profile` (FE3) + `/telephony/setup/*` (FE4) |
| `/contacts` Kontakte | **gap in the voice app.** `/contacts/*` is the platform CRM, a different product. DNC lives in `/telephony/rules` |
| `/campaigns` Kampagnen | `/telephony/campaigns` (FE8, F1 has no HTTP surface) |
| `/live` Live | `/telephony/calls/live` |
| `/calls` Anrufe | `/telephony/calls` + `/telephony/calls/:sid` (FE2) |
| `/settings/*` | `/telephony/settings/{profile,telephony,privacy,tools,team,widget}` — **six pages, not three** |
| `/ops` | Pincer `dashboard/` (different repo) + `/telephony/calls/ops` here |

The nine-route target is not reachable without merging six settings pages into three and dropping
Wissen, Regeln, Berichte, Vertrauen, Nachfass, Integrationen, Aufmerksamkeit and the setup wizard —
all of which shipped against real endpoints and are in the Block I spec. **A nine-entry CI gate
would fail on the current app on day one.**

---

## 4. Guard rails (§6) — current state

| Cut list guard rail | State |
|---|---|
| CI fails if the route table exceeds nine entries without an ADR | **not implemented, and would fail today** (164 paths; 33 in the voice app alone) |
| CI fails if `count-mocks` increases against `main` | **implemented and stricter** — `npm run count-mocks` against `mock-count.lock` = 0, in `ci:voice` |
| CI fails on hand-written types shadowing generated ones | **implemented in PR-2** — `npm run check:types` (`scripts/check-types.mjs`), in `ci:voice` and the CI quality job |
| PR template question | **not present** (`.github/` has only `workflows/frontend-ci.yml`) |

Gates that exist beyond the cut list's list: `check:api` (contract drift against the pinned
Pincer commit), `i18n:check` (de↔en parity), `lint:voice` incl. `no-literal-string`,
`type-check:voice` (strict null checks), `check:bundle`, `build:widget` ≤ 40 KB gz, Playwright +
axe on Chromium and iPhone 12.

---

## 5. PR-2 — what shipped

Scope confirmed by the owner on 2026-09-08: **the voice product's route table**, not the
repository. Items 1–3 are done; 4–5 are handed to the backend.

1. ✅ **Lazy-loaded the pages in `App.tsx`.** 124 page imports became `lazy()` chunks; `Login`
   and `NotFound` stay eager. `PublicLayout` holds its own `<Suspense>` so the marketing
   header and footer survive a page change, and one boundary above `<Routes>` covers the rest.
   **Entry chunk 567.7 → 227.8 KB gz (−60%)**, measured by building both trees.
2. ✅ **Deleted `/dev/playground`, `/dev/api`, `/dev/docs`, `/demos`** and `src/pages/dev/` +
   `src/pages/Demos.tsx`. Nothing linked to them — four "no"s and no inbound references.
3. ✅ **Retired the hand-written types.** Details below; **`npm run check:types` is the gate**.
4. ⏭ **The ten operator routes** — handed off: they cannot leave here until Pincer `dashboard/`
   has somewhere for them to go (`~/Desktop/BACKEND-F0-cutlist-asks.md` §4).
5. ⏭ **Listen-in player and the approvals host** — still load-bearing. Same handoff, §4.

### 5.1 What the type work found

Of the 31 hand-written types with a same-named or same-shaped contract component,
**only 4 matched**. Aliasing the rest blindly would have introduced the very lie the cut
list is trying to remove, so each was diffed first:

| Outcome | Count | Types |
|---|---|---|
| **Aliased** — identical to the contract | 8 | `InitiateCallIn`, `TurnModelChoice`, `VoiceConfig`, `ScheduleCallIn`, `SipAccountIn`, `BundleIn`, `InitiateCallOut`, `ScheduleAppointmentIn` |
| **Aliased** — pure wire duplicates under another name | 4 | `CommitmentWire`→`CommitmentOut`, `ThreadWire`→`ThreadOut`, `ThreadCallWire`→`ThreadCallOut`, `ThreadDetailWire`→`ThreadDetail` |
| **Aliased** — the FE promised fields the contract calls optional | 8 | `TranscriptLine`, `SentimentDistribution`, `DoNotCallEntry`, `CanaryRun`, `CallAnalytics`, `CallBriefing`, `CallAction`, `ScheduledCall` |
| **Kept, tagged `@derives`** — real view models and deliberately-stricter request bodies | 10 | `VoiceStatus`, `ActiveCall`, `CallSummary`, `CallDetail`, `Contact`, `ReceptionistStats`, `ThreadDetail`, `ScheduleAppointmentOut`, `DemoCallIn`, `NumberIn` |
| **Renamed** — a name collision, not a duplicate | 1 | `DeviceCodeStart` → `DeviceCodeSession` (the contract's `DeviceCodeStart` is the *request*) |

The third row surfaced **9 latent null-handling bugs** in consuming code, all fixed:
`toDate` treated `null` as the epoch, four transcript timestamps, a narrowing lost inside
an async handler, two optional tool names, and an undated schedule confirmation.

**And one live bug.** `POST /api/voice/schedule` declares `contact_name` **required**;
`StartCallModal` sent `target_name`, plus `timeframe_start`/`timeframe_end` where the
endpoint reads one `timeframe` string, `create_meet_link` where it reads
`location_or_meet`, and an `attendees` array where it reads a string. **Every "Call & book"
returned 422.** Nothing caught it because every test mocks the hook — which is exactly
what a hand-written request type buys you. Fixed, with
`src/test/voice/scheduleAppointmentContract.test.tsx` asserting the body against
`generated/openapi.json` itself. Four field semantics need backend confirmation
(`~/Desktop/BACKEND-F0-cutlist-asks.md` §1).

### 5.2 The gate

`scripts/check-types.mjs` (`npm run check:types`, in `ci:voice` and the CI quality job)
fails on two things across `src/lib/api`, `src/pages/telephony` and `src/components/voice`:

1. a declaration **named** after a contract component that is not that component; and
2. a declaration whose **property set is exactly** some component's — the check that
   catches a `ThreadWire` hiding beside a `ThreadOut`.

A type that deliberately differs declares `@derives <Component>` in its doc comment and
says why. The tag is what tells a decision apart from a drift.

Not in PR-2: deleting the marketing site or the platform app suite.

Those are business decisions with ~56 000 lines and other product tracks behind them, and this
document does not have the standing to make them. The marketing site is now lazy-loaded rather
than removed, which takes the bundle cost the cut list objected to without taking the pages.

---

## 6. Open decisions for the CTO

1. **Scope.** Does the cut list govern the whole repository, or the voice product's route table?
   Everything in §2 above turns on this.
2. **Nine routes.** The voice app is 33 and each route shipped against a real endpoint under a GA
   gate. Either the gate number changes or eight shipped surfaces get merged away.
3. **`/chat` as "Assistent".** Block I FE1 mounts it; the cut list cuts it. Pick one.
4. **In-call approvals.** Cut list: "with 8 curated read-mostly tools there is nothing to approve."
   S11 §6.5 and the shipped `VoiceApprovalHost` say otherwise. Pick one.
5. **Operator surfaces.** Confirm Pincer `dashboard/` is where they land, so the ten routes here
   can be deleted rather than duplicated.
