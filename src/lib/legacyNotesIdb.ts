/**
 * One-time cleanup of the mock era's IndexedDB stores for /notes.
 *
 * This lives outside `src/pages/notes/` on purpose. FE-1's exit gate is that
 * `grep -r "idb-keyval" src/pages/notes/` returns nothing — the notes module
 * must have no local persistence left, not even a disused import. The rows
 * themselves still exist in every browser that ran the mock build, so the code
 * that drops them has to survive somewhere; here is where.
 *
 * Why cleared rather than migrated: local notes have `note_…` ids and wikiLink
 * chips embed those ids inside the document JSON, while server notes are UUIDs.
 * Adopting the old rows would mean rewriting every chip's `targetId`, and
 * getting it half-right silently orphans links. A one-time wipe plus
 * `POST /v1/dev/seed` is the honest trade.
 */

import { clear, createStore } from 'idb-keyval';

const LEGACY_STORES = ['ai-notes-notes', 'ai-notes-notebooks', 'ai-notes-meta'] as const;
const CLEARED_FLAG = 'notes:legacy-idb-cleared:v1';

/**
 * Idempotent and failure-tolerant: a browser with no IndexedDB (or a private
 * window that refuses it) must not stop `/notes` from loading.
 */
export async function clearLegacyNotesStores(): Promise<void> {
  try {
    if (localStorage.getItem(CLEARED_FLAG)) return;
  } catch {
    return; // No localStorage — nothing to remember, so skip rather than loop.
  }

  try {
    await Promise.all(
      LEGACY_STORES.map((name) => clear(createStore(name, 'kv')).catch(() => undefined)),
    );
  } catch {
    /* Best effort: stale rows are inert, they are just wasted bytes. */
  }

  try {
    localStorage.setItem(CLEARED_FLAG, new Date().toISOString());
  } catch {
    /* ignore */
  }
}
