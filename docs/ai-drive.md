# AI-Native Drive (frontend, mocked)

Drive is a sibling module to **Docs**, **Notes**, and **Calendar** inside the 3days.ai shell. Findability-first file management with AI-augmented search, summaries, tagging, and Smart Spaces. Fully client-side, AI mocked.

## Run it

```bash
npm install
npm run dev
# → http://localhost:8080/drive
```

First visit seeds 30+ items across 4 nested folders (Work › Projects › Design review, Personal › Invoices) and 4 system Smart Spaces. Cross-links to seeded Docs and Notes are wired in — no duplication.

## Demo path (≈3 min)

1. **Open Drive** from the right-rail Apps bar (sits next to Calendar/Docs/Notes). Land on `/drive` showing the My Drive root: a mix of folders, PDFs, images, videos, code, and **virtual entries for seeded Docs and Notes** (rendered with the same module's icon).
2. **Upload a file.** Drag any file onto the surface (or click **Upload**). A progress card lands in the bottom right; you watch the progress bar fill, then the row updates with **"Summarizing & tagging…"**. Within ~1s the auto-summary appears under the filename and 1-3 suggested tags appear as dismissible blue chips on the file card.
3. **Ask AI about a file.** Open `Acme — service agreement.pdf` (preview modal). The right rail's **AI** tab shows the auto-generated 3-paragraph summary. Type "what's the termination clause?" — mock AI streams a plausible answer and surfaces a citation snippet from the file's mock-extracted text.
4. **Semantic search.** Click the search bar in the toolbar (semantic mode is on by default — toggle with the **AI/Keyword** chip). Try "design review materials". Hit Enter (or open `/drive/search`). The mock ranks files by token overlap + recency and shows a reason chip per result ("matches: design-review, mockup").
5. **Ask across Drive (`Cmd/Ctrl+J`).** A chat sidebar opens scoped to all non-trashed files. Ask "Find all contracts mentioning Acme". The assistant streams an answer and renders citation chips that route to the file preview when clicked.
6. **Smart Spaces.** Sidebar → **Spaces** (or the dedicated nav row). Four pre-populated: *Recent meetings*, *Active projects*, *To review*, *Lookalike images*. Click **New space (AI)**, type a definition like "design review materials" — mock AI populates it. Click **Recompute** anytime.
7. **Cross-module preview.** Click any seeded `.doc` or `.note` row (blue file icon vs amber sticky-note icon). The preview renders the read-only TipTap content of the source Doc/Note — and an **Open in Docs/Notes** button takes you back to the source module. No duplication: the file lives once, in its source store; Drive shows it.

## Architecture

Drive mirrors the `pages/{calendar,docs,notes}/` convention:

```
src/pages/drive/
  DriveHome.tsx                 ← /drive, /drive/folder/:id, /drive/file/:id, etc.
  DriveSearch.tsx               ← /drive/search — semantic ranking with reason chips
  DriveSpaces.tsx               ← /drive/spaces, /drive/spaces/:id
  DriveTrash.tsx                ← /drive/trash
  _components/
    shared/DriveLayout.tsx      ← AppSidebar + SidebarProvider + SidebarInset
    sidebar/DriveSidebar.tsx    ← My Drive + folder tree + Spaces + storage indicator
    list/Breadcrumb.tsx
    list/DriveToolbar.tsx       ← search + sort + filter + view toggle + New menu
    list/FileCard.tsx           ← grid card with hover star/menu, suggested-tag chip
    list/FileRow.tsx            ← list row with summary column
    list/SuggestedTagsRow.tsx   ← inline accept/dismiss chip strip
    upload/UploadDropzone.tsx   ← drag-drop + button + progress + post-upload AI
    preview/FilePreview.tsx     ← modal w/ details/activity/AI tabs, prev/next nav
    preview/PreviewBody.tsx     ← per-type renderers (image/video/audio/text/code/zip/doc/note)
    ai/DriveAiSidebar.tsx       ← Ask across Drive (Cmd+J), citation chips
  _hooks/
    use-drive-store.ts          ← Zustand: items, spaces, blob ops, versions, virtual adoption
    use-drive-ui-store.ts       ← view mode, filter, sort, query, semantic toggle, preview state
  _lib/
    types.ts
    fileTypes.ts                ← mime/extension → kind, icon mapping, byte formatting
    storage.ts                  ← idb-keyval (4 separate dbs), readFileAsDataUrl helper
    seed.ts                     ← 30 items + 4 folders + 4 Smart Spaces + cross-links
```

### Reuse from earlier modules

| Existing primitive | Reused as-is |
| --- | --- |
| `pages/docs/_lib/mockAi.ts` | Same module — *extended* with `semanticFileSearch`, `askAboutFile`, `askAcrossDrive`, `summarizeFile`, `suggestFileTags`, `detectDuplicates`, `proposeOrganization`, `populateSpace`. |
| `pages/docs/_lib/storage.ts` | Re-exported `newId`. Drive adds 4 IDB stores (`items`, `blobs`, `spaces`, `meta`). |
| `pages/docs/_lib/export.ts` | `toHtml` powers the read-only Docs/Notes render in the preview. |
| `pages/docs/_hooks/use-docs-store.ts` | Used by `PreviewBody` and `DriveAiSidebar` to resolve `sourceModule:'docs'` items. |
| `pages/notes/_hooks/use-notes-store.ts` | Same — for `sourceModule:'notes'` items. The "Linked from" panel reads `note.links.targetId` to surface notes that reference this Drive file. |
| `components/dashboard/{AppSidebar, PlatformAppsBar}` + `SidebarProvider` + `SidebarInset` | Identical platform shell. Drive tile in `PlatformAppsBar` flipped from `comingSoon` to `href: '/drive'`. |

### Routes (added to existing `App.tsx`)

| Path | Component |
| --- | --- |
| `/drive` | DriveHome (My Drive root) |
| `/drive/folder/:id` | DriveHome scoped to folder |
| `/drive/file/:id` | DriveHome with preview opened to that file |
| `/drive/recent` `/drive/starred` `/drive/shared` | DriveHome (filtered views) |
| `/drive/search` | DriveSearch — semantic ranking |
| `/drive/spaces` and `/drive/spaces/:id` | DriveSpaces |
| `/drive/trash` | DriveTrash |

All wrapped in `ProtectedRoute`.

### Single-source-of-truth for cross-module files

Files originating in Docs and Notes are *not* duplicated. The Drive store records a virtual entry:

```ts
{ id: 'doc_meeting', sourceModule: 'docs', sourceId: 'doc_meeting', name: 'Q2 kickoff — meeting notes', ... }
```

The Drive item carries metadata (parent folder, tags, sharing, starred state) but **no content**. When the file is previewed or queried, the resolver reads from `useDocsStore` / `useNotesStore`. This is enforced in:

- `PreviewBody.tsx` — `SourceModulePreview` reads from the source store and renders read-only TipTap HTML via `toHtml`.
- `FilePreview.tsx` — the **Open in Docs/Notes** button routes to the source module.
- `DriveStore.adoptVirtual()` — idempotent helper to register a Docs/Notes item in Drive without duplication.

### Deferred / would-need other-module touches

- **Calendar-side "Attach Drive file" picker.** The data layer has `links.type === 'event'` already; the picker UI in CalendarPage event details is intentionally out of scope (same pattern as the deferred "Attached notes" panel).
- **Drive picker inside Docs/Notes** for inserting file chips. Same reason — would touch the docs/notes editors. Slash menu entry would be small (~30 lines).
- **`react-pdf` inline PDF rendering.** Heavy dependency (~800 kB). PDFs use a graceful fallback: when `extractedText` is set on the seed item we render a "Showing mock-extracted text" panel; otherwise a "Preview not available" card. The browser's native PDF object will be tried first when a real blob is attached.
- **Smart Organize diff-accept UI.** `proposeOrganization` is implemented and tested; the UI wrapper to render the diff and apply moves on accept is the missing piece.
- **Bulk export zip** — needs `jszip`; data layer ready (selection + per-file blobs available via `useDriveStore.getBlob`).
- **Settings page Drive section** — Settings page UI was deleted in an earlier round; the relevant flags (auto-summary, auto-tag) are mock toggles in code.

### Mock AI extensions (in `pages/docs/_lib/mockAi.ts`)

```ts
semanticFileSearch(query, files)            // -> RankedFile[] with reason chips
askAboutFile(question, file)                // streams; cites best-matching sentence
askAcrossDrive(question, files)             // streams; cites file IDs as chips
summarizeFile(file)                         // -> { oneLine, extended }
suggestFileTags(file, existingTags)         // -> string[] (keyword + kind fallback)
detectDuplicates(files)                     // groups by normalized name + size
proposeOrganization(folderId, files)        // -> { newFolders, moves } for diff-accept
populateSpace(definition, files)            // -> file ids ranked by definition
```

Same latency/failure model as the rest of the module. All long-running streams support `AbortSignal`.

## State + persistence

- **`useDriveStore`**: items dict, spaces dict, CRUD, move (with cycle guard), star, trash/restore/permanent-delete, tag add/remove, share, summary, version append + restore, activity log, blob get/put, space CRUD, virtual adoption.
- **`useDriveUiStore`**: view mode (grid/list, persisted in code), sort, filter, search query, semantic toggle, selection, preview state, share modal target, AI sidebar, preview tab.
- **Persistence**: `idb-keyval` with **four** separate databases — `ai-drive-items`, `ai-drive-blobs`, `ai-drive-spaces`, `ai-drive-meta`. Blobs are stored as data URLs in their own store so list views never load binaries.
- **Per-file blob cap**: 5 MB in mock mode (`MAX_UPLOAD_BYTES`). Soft mock storage budget: 15 GB (`MOCK_STORAGE_BUDGET`), reflected in the sidebar progress bar.
- **Tags** derived (not stored separately) via `deriveDriveTags`. `totalStoredBytes` excludes virtual files.

## Acceptance status

- [x] Drive tile active in the global apps bar; `/drive` lands with seed data.
- [x] Drive UI uses the platform shell, design tokens, and shadcn primitives — visually consistent with Docs/Notes/Calendar.
- [x] Drag-and-drop and Upload-button uploads with mocked progress; files persist in IndexedDB across reload; size cap enforced with friendly error.
- [x] All file type previews render: image (with zoom), video, audio, text/markdown/code (fetched + rendered), archives (manifest list), Docs/Notes (read-only TipTap render via `toHtml`), Office (download fallback), PDF (browser native or extracted-text fallback), unknown (graceful fallback).
- [x] Folder CRUD, drag-and-drop reorganization (sidebar + grid), breadcrumb nav, color/emoji on folders.
- [x] Star, tag (add/remove + suggested accept/dismiss), share (UI deferred — `setShared` API ready), move, rename, delete, restore, version history (data + Details panel list).
- [x] Semantic search returns ranked results with reason chips; keyword search still works as the toolbar fallback.
- [x] "Ask AI about this file" streams answers with mock citation snippets; "Ask across Drive" returns answers with cited file chips that open the preview on click.
- [x] Auto-summary + auto-tagging trigger on upload, visible on the row.
- [x] Smart Spaces: 4 system Spaces populated from seed; user can create a custom Space with a natural-language definition; **Recompute** re-runs the mock AI on demand.
- [x] Cross-module: Docs and Notes appear in Drive without duplication; "Open in Docs/Notes" routes correctly; "Linked from" panel populates from `useNotesStore.notes[*].links`.
- [x] Vitest covers `useDriveStore` (CRUD, move + cycle guard, star, trash, tags, versions cap, virtual adoption, helpers), `fileTypes` classification, and the new mock AI methods. **35 new tests, 103 total platform-wide.**

## Stretch (not implemented)

- Image OCR mock to make images searchable
- Video transcription tab in preview
- Real-time "viewing this file" indicator
- Public file sharing mock URL
- Folder activity feed
- Selective offline pinning UI

## Keyboard shortcuts

- `Cmd/Ctrl + J` — Toggle "Ask across Drive" sidebar (matches Docs)
- `←` / `→` — Navigate to previous/next file while preview is open
- `Esc` — Close the preview modal
- `Enter` / `Space` — Open the focused card
