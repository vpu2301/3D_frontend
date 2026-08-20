/**
 * Notes storage façade.
 *
 * Notes and notebooks live on the server (`apiClient.ts`); nothing about them is
 * persisted in the browser, and this module holds no persistence code — the
 * mock era's IndexedDB cleanup moved to `@/lib/legacyNotesIdb` so that the notes
 * module carries no local-persistence dependency at all (FE-1, gate F13).
 *
 * What survives here is one import path: `newId` and `docsStorage` are used
 * across the notes app and are re-exported from a single place.
 */

export { newId, docsStorage } from '@/pages/docs/_lib/storage';
export { clearLegacyNotesStores } from '@/lib/legacyNotesIdb';
