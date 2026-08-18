# AI-Native Docs (frontend, mocked)

A Google Docs × Cursor × Notion AI surface, fully client-side. Drops in alongside the existing app at `/docs`. No real backend, no API keys — every AI call is a local async generator with artificial latency.

## Run it

```bash
npm install
npm run dev
# → open http://localhost:8080/docs
```

The first visit seeds 10 example docs across 3 folders. Everything persists to IndexedDB (`ai-docs-docs`, `ai-docs-folders`, `ai-docs-meta`).

## Demo path (≈2 min)

1. Land on `/docs`. You see a grid of seeded docs ("Welcome…", "Q2 kickoff…", "PRD — Inline AI commands…", and so on). Toggle between grid/list. Type in the search bar to filter by title or content. Drag a doc onto a folder in the sidebar to move it.
2. Open **"Welcome to your AI workspace"**. Notice the autosave indicator in the top-left ("Saved" / "Saving…").
3. Highlight a sentence. The bubble menu pops up. Click the wand icon → **Improve writing**. Watch the inline AI prompt stream a rewritten version. Click **Accept** — the selection is replaced.
4. Press **Cmd/Ctrl + J** anywhere in the doc. The inline prompt opens at the cursor with a fresh prompt box. Type `draft a short intro paragraph about diff-accept UX` and press Enter. Watch the output stream. Accept.
5. Press `/` on a new line. The slash menu opens. Search "ai" — you see **AI summary**, **AI outline**, **AI prompt block**. Insert **AI summary**. Click "Regenerate" — it streams a TL;DR of the doc above.
6. Click the **AI** button in the toolbar to open the right-hand sidebar. Type `rewrite this doc in three short bullets`. The assistant streams the answer, then renders it as a **diff** (insertions in green, deletions in red). Click **Accept all** — the entire doc is replaced. (Use `Cmd/Ctrl+Z` to undo if you want.)
7. Click **Export → Markdown**. A `.md` file downloads matching the current doc.
8. From the toolbar, open **History**. Snapshots are taken every 2 minutes (or on `Cmd/Ctrl+S`). Pick one and click **Restore this version**.

## Architecture

```
src/
  pages/docs/                 — DocsDashboard, DocsEditor, DocsHistory, DocsTrash, DocsSettings
  components/docs/
    shared/                   — DocsLayout, DocsSidebar (folder tree + nav)
    dashboard/                — DocCard, DocRow, SearchBar, TemplatesModal, BulkActionBar
    editor/                   — EditorToolbar, DocHeader, StatusBar, EditorBubbleMenu,
                                EditorFloatingMenu, SlashMenu, ShareModal, ShortcutsModal,
                                CommentsPanel
    ai/                       — InlineAiPrompt, AiSidebar, DiffView
  extensions/docs/            — Custom TipTap nodes:
                                aiSummary, aiOutline, aiPrompt, ghostText
  lib/docs/
    storage.ts                — idb-keyval wrappers (separate DBs for docs/folders/meta)
    mockAi.ts                 — streamCompletion, runPreset, generateSummary, generateOutline,
                                ghostComplete (configurable latency + failure rate)
    diff.ts                   — wordDiff / lineDiff / diffStats (wraps the `diff` package)
    export.ts                 — toMarkdown, toHtml, toPlainText, downloadBlob
    seed.ts                   — TEMPLATES + buildSeed()
  stores/
    docsStore.ts              — Zustand: docs, folders, snapshots, comments, CRUD,
                                exportAll/importAll, clearAll
    docsUiStore.ts            — view mode, filter, query, selection, modal toggles
    docsSettingsStore.ts      — persisted settings (theme/font/AI prefs/profile)
    docsAiStore.ts            — chat history per doc, active proposal
  types/docs.ts               — Doc, Folder, Snapshot, CommentThread, AiProposal,
                                PresetAction, OutlineNode, DocTemplate
  test/docs/                  — vitest suites (38 tests)
```

### Routes

Wired in `src/App.tsx`:

| Path                      | Component        | Notes                                  |
| ------------------------- | ---------------- | -------------------------------------- |
| `/docs`                   | DocsDashboard    | Grid/list, search, folders, templates  |
| `/docs/:id`               | DocsEditor       | TipTap + AI surfaces                   |
| `/docs/:id/history`       | DocsHistory      | Snapshot diff vs current               |
| `/docs/trash`             | DocsTrash        | Restore / permanent delete             |
| `/docs/settings`          | DocsSettings     | Profile, appearance, AI prefs, data    |

Routes are not wrapped in `ProtectedRoute` — the docs feature is a standalone demo and works without login.

### State + persistence

- **Zustand** for in-memory state (no Redux, no Context).
- **idb-keyval** for IndexedDB persistence. Separate databases per concern (`ai-docs-docs`, `ai-docs-folders`, `ai-docs-meta`) — needed because `idb-keyval`'s `createStore` can't add multiple object stores to the same DB without colliding on the upgrade callback.
- Settings store uses Zustand's `persist` middleware backed by `localStorage` (small, fits comfortably).
- Doc content is stored as TipTap JSON (`JSONContent`).
- Snapshots are capped at 20 per doc (FIFO).

### AI mock

`src/lib/docs/mockAi.ts` is the entire "model." Each public function:

- Adds 200–800 ms of artificial latency (configurable in Settings → "Mock failure rate" and via `configureMockAi`).
- Streams output token-by-token (15–40 ms per chunk) so the UI looks alive.
- Has a default 5 % synthetic failure rate so error UI is exercised.

Public surface:

```ts
streamCompletion(prompt, context, opts?) // AsyncIterable<string>
runPreset(preset, text, opts?)            // AsyncIterable<string>
generateSummary(content, opts?)           // Promise<string>
generateOutline(json, opts?)              // Promise<OutlineNode[]>
ghostComplete(precedingText, opts?)       // Promise<string | null>
generateTitle(content, opts?)             // Promise<string>
```

### AI surfaces — where each one lives

| Surface              | Trigger                                 | File                                       |
| -------------------- | --------------------------------------- | ------------------------------------------ |
| Inline AI prompt     | `Cmd/Ctrl + J` or "Ask AI" in bubble    | `components/docs/ai/InlineAiPrompt.tsx`    |
| Selection presets    | Bubble menu → wand → preset             | `components/docs/editor/EditorBubbleMenu.tsx` |
| Continue writing     | Ghost text on idle, `Tab` to accept     | `extensions/docs/ghostText.ts` + editor    |
| AI sidebar (chat)    | Toolbar → AI button (or Cmd+Shift+I)    | `components/docs/ai/AiSidebar.tsx`         |
| Diff-accept          | Sidebar response with rewrite intent    | `components/docs/ai/DiffView.tsx`          |
| AI summary block     | `/ai-summary` slash command             | `extensions/docs/aiSummary.tsx`            |
| AI outline block     | `/ai-outline`                            | `extensions/docs/aiOutline.tsx`            |
| AI prompt block      | `/ai-prompt`                             | `extensions/docs/aiPrompt.tsx`             |

## What's faked (and where the real backend would slot in)

| Faked                        | Today's stand-in                      | Real-world replacement                                                                        |
| ---------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------- |
| LLM inference                | `mockAi.ts` async generators          | Server endpoint that streams via SSE/WebSocket from Anthropic/OpenAI/etc.                     |
| Document storage             | `idb-keyval` (IndexedDB)              | `docsStorage` is a single module; swap for `fetch('/api/docs/...')` with the same shape.      |
| Auth & user identity         | Single mock user (name in settings)   | Real session; replace `profileName/profileAvatar` with the authenticated user's profile.      |
| Real-time collaboration      | Not present                           | Yjs/Liveblocks/Convex on top of TipTap's collaboration extension. Schema is already JSON.     |
| Comments / @-mentions        | Anchors stored as `from-to` strings   | Replace with stable mark IDs in ProseMirror; broadcast over the same realtime channel.        |
| Sharing / link permissions   | UI-only modal                         | Server-side ACL; the share dialog already collects the right shape (email + access role).    |
| Version history              | Snapshots in the doc record           | Server-side append-only log; same `Snapshot` type works.                                      |
| `.docx` / `.pdf` export      | "Coming soon" toast                   | Server endpoint (e.g., Pandoc) — keep the client-side `.md`/`.html`/`.txt` paths unchanged.   |
| AI persona / tone defaults   | Local settings, used in mock          | Send as `system` instructions or per-request metadata to the real LLM call.                   |

## Acceptance criteria status

- [x] `npm run dev` boots; `/` → `/docs` with seed data visible.
- [x] CRUD (create/rename/delete/restore/move/star) — all persist across reload.
- [x] Editor: headings 1–3, bold/italic/underline/strike, inline+block code, lists (bullet/ordered/task), blockquote, hr, links, tables, images (paste/drop as base64), embeds via image fallback. Slash menu, bubble menu, floating menu, markdown shortcuts.
- [x] Five AI surfaces wired to `mockAi.ts` with visible streaming.
- [x] Diff-accept flow.
- [x] Auto-save (500 ms debounce); version history; restore.
- [x] Comments — add/reply/resolve.
- [x] Export `.md`, `.html`, `.txt`. `.docx`/`.pdf` show toast.
- [x] Settings persist.
- [x] Vitest suite (38 tests, 4 files: `diff`, `docsStore`, `export`, `mockAi`).

## Stretch (not implemented)

- Drag-to-resize images
- Find & replace
- Multiplayer cursor simulation
- Voice dictation
- Global command palette (`Cmd/Ctrl + K`)

## Keyboard shortcuts

`Cmd/Ctrl + /` opens the full cheatsheet inside the editor. Highlights:

- `Cmd/Ctrl + J` — Inline AI prompt
- `Cmd/Ctrl + Shift + I` — Toggle AI sidebar
- `Cmd/Ctrl + S` — Force snapshot
- `/` — Slash menu (block insert)
- `Tab` — Accept ghost-text completion
- `Esc` — Dismiss ghost text or close menus
