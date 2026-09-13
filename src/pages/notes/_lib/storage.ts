/**
 * Notes storage façade.
 *
 * Notes and notebooks live on the server (`apiClient.ts`); nothing about them is
 * persisted in the browser, and this module holds no persistence code — the
 * mock era's IndexedDB cleanup moved to `@/lib/legacyNotesIdb` so that the notes
 * module carries no local-persistence dependency at all (FE-1, gate F13).
 *
 * What survives here is `newId`, the client-side id used for optimistic rows
 * and chat turns before the server hands back a real one. It used to be
 * re-exported from the Docs app; that app is gone, so it lives here now.
 */

/** A sortable, collision-resistant local id — never sent as a server key. */
export function newId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export { clearLegacyNotesStores } from '@/lib/legacyNotesIdb';
