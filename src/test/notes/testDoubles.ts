/**
 * Re-exports for tests, so a test file imports the seam it is driving rather
 * than three modules that happen to contain the pieces.
 */

export { setFetcher, resetFetcher } from '@/pages/notes/_lib/apiClient';
export { setActiveEditor, clearActiveEditor } from '@/pages/notes/_lib/editorBridge';
export type { ActiveEditor } from '@/pages/notes/_lib/editorBridge';
