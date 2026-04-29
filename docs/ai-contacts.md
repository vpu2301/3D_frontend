# AI-Native Contacts (frontend, mocked) — the identity layer

Contacts is a sibling module to **Docs**, **Notes**, **Drive**, **Calendar**, **Todo**, and the still-to-build **Mail**. Unlike the other modules, Contacts is *both* a destination and a **provider**: every email sender, meeting attendee, doc collaborator, file share, task assignee, and `@mention` in the platform resolves through this store, and the four shared components (`ContactAvatar`, `ContactChip`, `ContactCard`, `ContactPicker`) are designed to be consumed by every other module.

Privacy stance: **no external enrichment, no scraping, no third-party APIs even mocked.** All AI insights are derived from the user's own platform data. State this in the UI; mean it.

## Run it

```bash
npm install
npm run dev
# → http://localhost:8080/contacts
```

First visit seeds ~40 contacts including:
- 7 internal collaborators referenced by Docs/Notes/Drive/Todo seed data (Sam, Priya, Jules, Emma, Alex, Nora, Omar) so interaction-driven AI surfaces have signal on first run.
- Customers/partners (Sarah at Acme, Diana at Atlas Ventures, Yusuf at Apollo) that exercise the External smart view.
- Family/friends/utility contacts in the Family and Friends groups.
- 5 deliberately stale contacts so the Staleness view has signal on first run.
- **3 duplicate pairs** (Maria Hernandez × 2 with name+org match, Chris/Christopher Wells with shared email, Sofia/S. Russo with similar-name + same org) so the Duplicates page has signal on first run.

## Demo path (≈3 min)

1. **Open Contacts** from the right-rail Apps bar. Land on `/contacts` showing the list view with 35 active contacts.
2. **Open a rich contact** (Sam Patel). Header has avatar + inline-editable name/title/org. Identity card lists emails/phones/URLs. Tabs: **About** (AI summary + Ask AI), **Mail** (placeholder), **Meetings**, **Shared** (docs/notes/drive cross-module hits), **Timeline** (unified chronological feed pulled live from Docs/Notes/Drive/Todo seed), **Activity**.
3. **Right rail.** **Relationship strength** computes deterministically from frequency × recency × reply-ratio × meeting-attendance and shows the score, label (strong/active/cooling/quiet), and per-factor breakdown. **Last interaction** card. **Suggested actions** (mock AI). **AI enrichment** with diff-accept chips.
4. **AI summary.** Click **Generate** in the About tab — mock AI streams a summary keyed off the contact's interactions.
5. **Resolve a duplicate.** Sidebar → **Duplicates**. Side-by-side comparison cards for each pair with confidence + reason. Per-field choice between A and B (with "union" for multi-value fields). Click **Merge** — references in groups + linked-contacts + smart-view fileIds are rewritten atomically inside Contacts.
6. **Staleness.** Sidebar → **Going stale**. 5 contacts with decay reasons, one-click **Draft check-in** (mailto), **Schedule**, **Snooze**, **Mark expected** (set per-contact cadence). Recompute reruns the heuristic via mock AI.
7. **Smart Views.** Sidebar → **Smart views** → pick *External*, *VIPs*, *Top correspondents*, etc. Each renders the matching contacts. **+ Smart view** (deferred) lets you write a custom NL definition.
8. **Import a CSV.** Sidebar → **Import**. Drop a CSV — mock AI proposes a column mapping (with rule-based fallback). Diff-accept the mapping. Pre-import duplicate check flags clashes against existing contacts. Confirm → land back in Contacts.
9. **Cross-module proof.** Open `/notes/note_q2_kickoff` — `@sam` style mentions in the body register as note-mention interactions for Sam, which feed his Timeline tab and his relationship-strength score.

## Architecture

```
src/components/contacts/
  ContactAvatar.tsx       ← image-or-initials with deterministic boring-avatars fallback
  ContactChip.tsx         ← small pill, hover reveals ContactCard
  ContactCard.tsx         ← full hover-card preview (name + role + emails + tags + AI summary + strength)
  ContactPicker.tsx       ← autocomplete input with "+ create new contact from email"

src/pages/contacts/
  ContactsHome.tsx        ← list/grid + search + filter + sort + AI ask-strip
  ContactDetail.tsx       ← header + identity + 6 tabs + right rail
  ContactsDuplicates.tsx  ← per-field merge UI with diff-accept
  ContactsStaleness.tsx   ← per-contact decay reasons + cadence settings
  ContactsSmartView.tsx   ← /contacts/views/:id (6 default + custom)
  ContactsImport.tsx      ← CSV/vCard/JSON wizard with column-mapping diff-accept
  ContactsTimeline.tsx    ← cross-contact unified interaction feed
  ContactsTrash.tsx
  _components/
    shared/ContactsLayout.tsx
    sidebar/ContactsMiniRail.tsx
  _hooks/
    use-contacts-store.ts        ← Zustand: CRUD, multi-value fields, groups, smart views,
                                    enrichment accept/reject, duplicate detection,
                                    deterministic merge with platform-internal ref-rewrite
    use-contacts-ui-store.ts
  _lib/
    types.ts
    storage.ts                   ← idb-keyval (6 separate dbs); re-exports newId
    seed.ts                      ← ~40 contacts + 4 groups + 6 smart views + cross-links
    relationshipStrength.ts      ← deterministic heuristic (freq × recency × replies × meetings)
    duplicateDetect.ts           ← shared-email / same-name / short-name+same-org pairs
    interactions.ts              ← cross-module aggregator (reads live from docs/notes/drive/todo)
    contactImport.ts             ← CSV/vCard parsers + serializers (no external deps)
```

### Reuse from earlier modules

| Existing primitive | Reused as-is |
| --- | --- |
| `pages/docs/_lib/mockAi.ts` | Same module — *extended* with `summarizeContact`, `suggestContactEnrichment`, `suggestContactGroups`, `askAboutContact`, `askAcrossContacts`, `suggestContactNextActions`, `detectContactStaleness`, `mapImportColumns`, `parseContactNlSearch`, `populateContactSmartView`. |
| `pages/docs/_lib/storage.ts` | Re-exports `newId`. Contacts adds 6 IDB stores of its own. |
| Docs/Notes/Drive/Todo stores | Read live by `interactions.ts` for the unified Timeline tab + the relationship-strength heuristic. |
| `components/dashboard/{AppSidebar, PlatformAppsBar}` + `SidebarProvider` + `SidebarInset` | Identical platform shell. The Contacts tile in `PlatformAppsBar` flipped from `comingSoon` to `href: '/contacts'`. |

### Routes (added to existing `App.tsx`)

| Path | Component |
| --- | --- |
| `/contacts` | ContactsHome (list/grid) |
| `/contacts/contact/:id` | ContactDetail with 6 tabs |
| `/contacts/group/:id` | ContactsHome scoped to a group |
| `/contacts/views/:id` | ContactsSmartView |
| `/contacts/duplicates` | ContactsDuplicates |
| `/contacts/staleness` | ContactsStaleness |
| `/contacts/import` | ContactsImport |
| `/contacts/timeline` | ContactsTimeline |
| `/contacts/trash` | ContactsTrash |

All wrapped in `ProtectedRoute`.

### Identity-layer contract: the four shared components

Every other module is expected to consume these instead of rolling its own:

```tsx
import ContactAvatar from '@/components/contacts/ContactAvatar';
import ContactChip from '@/components/contacts/ContactChip';
import ContactCard from '@/components/contacts/ContactCard';
import ContactPicker from '@/components/contacts/ContactPicker';
```

- **`<ContactAvatar />`** — image-or-initials with a deterministic boring-avatars fallback. Used in every list row, every chip, every header.
- **`<ContactChip />`** — avatar + name pill. Used in recipient/attendee/share UIs. Hovers reveal the full `<ContactCard />`.
- **`<ContactCard />`** — full preview (~280px). Includes role, emails, phones, tags, AI summary, and relationship strength label. Used as a hover-card by `<ContactChip />` and standalone in many places.
- **`<ContactPicker />`** — type-ahead autocomplete input. Supports "+ create new contact" inline when the input looks like an email. Used by Mail compose, Calendar attendees, Drive share, Notes mention, Docs share, Todo assignee.

These components only depend on `useContactsStore` (read-only resolution + create-on-demand) and `react-router-dom`. They are intentionally framework-light to keep the consumer modules' bundles minimal.

### Cross-module integration

**Provider side (this module)**:
- `aggregateInteractionsForContact(id, emails)` reads live from Docs (sharedWith), Notes (links + body mentions), Drive (sharedWith on items), Todo (attachments referencing the contact's source ids). Mail interactions are placeholder-only since no Mail module exists yet — the shape is in place.
- The deterministic relationship-strength heuristic in `relationshipStrength.ts` runs on every contact-detail render, refreshing `contact.relationshipStrength`.

**Consumer side (deferred — see below)**:
- Mail/Docs/Notes/Drive/Todo retrofits to use `ContactChip`/`ContactCard`/`ContactPicker` for their share modals, attendee pickers, mention autocomplete, etc. Components are exported and stable; touching each consumer module is intentional out-of-scope per prior precedent.

### Deferred / would-need other-module touches

- **Mail tab** in ContactDetail. No Mail module exists; the placeholder is a single-line empty state in the right place.
- **Atomic merge propagation across modules.** `mergeContacts()` already rewrites references inside Contacts (groups, linked contacts, smart views, duplicate-group resolution). When merging a contact into a survivor, references stored in *other module stores* (Doc.sharedWith, Note.links by contact id, Drive.sharedWith.userId, Todo.attachments where targetId matches the contact id) are not yet rewritten, because that would require write-access to those modules. Each is a small loop in the appropriate store; adding it later is the natural next step.
- **Save-as-contact from Mail / Calendar.** The data hook (`createContact` with `source: 'auto-from-email'`) is in place; the inline UI in those modules is deferred.
- **Calendar event creation from "Schedule" buttons** (Staleness, ContactDetail). Buttons are wired to placeholder handlers; landing in Calendar's composer requires a calendar-side change.
- **Birthday auto-create Calendar events** (stretch).
- **Network graph view** (stretch).
- **Settings page Contacts section** (Settings page UI was deleted earlier).
- **Global command palette additions** (Cmd+K New contact / Find person / Open contact <name>) — touches the existing palette.
- **Global search** rolling Contacts in alongside other module results.

### Mock AI extensions (in `pages/docs/_lib/mockAi.ts`)

```ts
summarizeContact(contact, interactions)              // -> string, keyed off interactions
suggestContactEnrichment(contact, signals)           // -> EnrichmentSuggestion[] (title/org from signatures)
suggestContactGroups(contacts, interactions)         // -> GroupSuggestion[] by org-cluster (3+)
askAboutContact(question, contact, interactions)     // streams; cites interaction ids
askAcrossContacts(question, contacts, interactions)  // streams; cites contact ids
suggestContactNextActions(contact, interactions)     // -> { kind, reason }[]
detectContactStaleness(contact, interactions, cadence) // -> StalenessSignal | null
mapImportColumns(headers, sampleRows)                // -> { mapping, reasoning } for CSV import
parseContactNlSearch(query)                          // -> ContactSearchFilters (org / tag / external / minStrength)
populateContactSmartView(definition, contacts, _)    // -> ranked contact ids
```

`computeRelationshipStrengthSync` and `findDuplicateGroupsSync` live in `_lib/` (not `mockAi.ts`) because they must be **deterministic** given the same input — the user expects these to be trustworthy signals, not flakey AI vibes.

## State + persistence

- **`useContactsStore`**: contacts/groups/smartViews/enrichment/duplicates dicts. Full CRUD. Multi-value field helpers (`addEmail`, `setPrimaryEmail`, etc.) preserve `primary` semantics. Group operations keep both sides in sync. Smart views update task ids on recompute. Enrichment goes through accept/reject with the field only being written when blank. Duplicates are recomputed on demand and resolved entries (merged / not-duplicate) are preserved across recomputes. Merge rewrites group/linked/smart-view references atomically inside the Contacts store.
- **`useContactsUiStore`**: view, sort, filter, query, selection, ask sheet open.
- **Persistence**: `idb-keyval` with **six** separate databases — `ai-contacts-{contacts,groups,smart,enrichment,dupes,meta}`.

## Acceptance status

- [x] Contacts tile active in the global apps bar; `/contacts` lands with seed data.
- [x] Contacts UI uses the platform shell, design tokens, and shadcn primitives — visually consistent with the other modules.
- [x] Contact CRUD works (create, edit inline, multi-value fields, delete, restore) and persists.
- [x] Contact detail page shows all tabs (About, Mail empty-state, Meetings, Shared, Timeline, Activity) populated from the other modules' seed data via the live aggregator.
- [x] AI summary, relationship strength (deterministic), and staleness signal all render and refresh on demand.
- [x] AI enrichment suggests fields from platform-internal sources only and routes through diff-accept; the source citation is visible.
- [x] Duplicate detection surfaces seeded duplicate pairs; per-field merge works and reattaches references inside Contacts.
- [x] Groups CRUD works.
- [x] Smart Views work (6 default + ability to mark precomputed for AI population).
- [x] Staleness view renders with mock decay reasons and one-click actions (mailto wired; Calendar/snooze/expected wired to store).
- [x] NL search and "Ask AI across contacts" stream answers with citation chips.
- [x] Import wizard handles CSV (with column-mapping diff-accept), vCard, and JSON; pre-import duplicate check works.
- [x] Export — `contactsToCsv` and `contactToVCard` ready for a download button (UI button TODO; helpers tested).
- [x] **Provided components** are present and ready: `<ContactAvatar />`, `<ContactChip />`, `<ContactCard />`, `<ContactPicker />`. Used internally by Contacts; consumed by other modules in a future pass.
- [x] Vitest covers the store (CRUD, merge integrity, group sync, dupe lifecycle, enrichment accept), the deterministic relationship-strength heuristic, the duplicate-detection heuristic, the CSV/vCard import + export round-trip, and the new mock AI methods. **39 new tests, 185 total platform-wide.**

## Stretch (not implemented)

- Birthday & anniversary reminders auto-creating Calendar events
- Recipient context card in Mail compose (when Mail ships)
- "How we met" AI auto-fill across the platform
- Network graph view
- Per-contact privacy levels (exclude from AI summarization)
- vCard QR code

## Privacy

- No third-party API integrations, mocked or otherwise. Every AI insight is derived from the user's own platform data.
- The relationship-strength heuristic and the duplicate-detection heuristic are **deterministic** — they are not "AI vibes," they are functions you can audit.
- AI mutations to a contact record (enrichment suggestions, merges, group suggestions) always go through diff-accept. Nothing modifies a contact silently.
