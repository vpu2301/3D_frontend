/**
 * Markdown export, in one place because it now has two callers: the top bar's
 * `.md` button and the command palette's `note.export`.
 *
 * The Markdown comes from `GET /v1/notes/{id}/export.md` rather than the
 * client-side renderer in `@/pages/docs/_lib/export`. The server's output is
 * proven byte-identical to it (backend test N8), so going through the server
 * leaves exactly one renderer to keep correct.
 */

import { notesApi } from '@/pages/notes/_lib/apiClient';
import { deriveTitle } from '@/pages/notes/_lib/backlinks';
import { reportError } from '@/pages/notes/_lib/errors';
import { downloadBlob } from '@/pages/docs/_lib/export';
import type { Note } from '@/pages/notes/_lib/types';

export function exportFileName(note: Note): string {
  const stem = (deriveTitle(note) || 'note').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
  return `${stem.replace(/^-+|-+$/g, '') || 'note'}.md`;
}

export async function exportNoteAsMarkdown(note: Note): Promise<void> {
  try {
    const markdown = await notesApi.exportMarkdown(note.id);
    downloadBlob(exportFileName(note), 'text/markdown', markdown);
  } catch (error) {
    reportError(error, { title: 'Could not export the note' });
  }
}
