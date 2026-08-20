/**
 * Trash.
 *
 * The server has no per-note purge — `DELETE /v1/notes/{id}` is the soft delete
 * and `DELETE /v1/trash` empties the whole thing. So "Delete forever" per row is
 * gone and replaced by one "Empty trash" action, which is the operation that
 * actually exists. Pretending otherwise would mean a button that quietly did
 * something other than what it said.
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, StickyNote, Trash2, Loader2 } from 'lucide-react';
import NotesLayout from '@/pages/notes/_components/shared/NotesLayout';
import NotesMiniRail from '@/pages/notes/_components/sidebar/NotesMiniRail';
import { ConfirmDialog } from '@/pages/notes/_components/shared/NotesDialog';
import { useNotesStore, selectNotesMap } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { useCommandRunner } from '@/pages/notes/_hooks/use-notes-commands';
import { deriveTitle } from '@/pages/notes/_lib/backlinks';

export default function NotesTrash() {
  const load = useNotesStore((s) => s.load);
  const loading = useNotesStore((s) => s.loading);
  const loadError = useNotesStore((s) => s.loadError);
  const notesMap = useNotesStore(selectNotesMap);
  const restore = useNotesStore((s) => s.restoreNote);
  const emptyTrash = useNotesStore((s) => s.emptyTrash);
  const navigate = useNavigate();
  const run = useCommandRunner();
  // Shared with the palette's `trash.empty`, so the confirmation is the same
  // one whether the user clicked the button or typed the command.
  const emptyOpen = useNotesUiStore((s) => s.emptyTrashOpen);
  const setEmptyOpen = useNotesUiStore((s) => s.setEmptyTrashOpen);

  useEffect(() => {
    load();
  }, [load]);

  const trashed = useMemo(
    () =>
      Object.values(notesMap)
        .filter((n) => n.trashed)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [notesMap],
  );

  return (
    <NotesLayout>
      <div className="flex flex-1 overflow-hidden">
        <NotesMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-start justify-between border-b border-[var(--line-soft)] px-8 pt-6 pb-4">
            <div>
              <p className="plat-crumb">3days.notes</p>
              <h1 className="mt-1.5 text-[22px]">
                Trash{' '}
                <span className="text-[15px] font-normal" style={{ color: 'var(--text-5)' }}>
                  ({trashed.length})
                </span>
              </h1>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-4)' }}>
                Soft-deleted notes. Restore them, or empty the trash to purge every one.
              </p>
            </div>
            {trashed.length > 0 && (
              <button
                type="button"
                data-command="trash.empty"
                onClick={() => run('trash.empty')}
                className="plat-btn-ghost shrink-0 !h-8 !px-3.5 !text-[11px]"
                style={{ color: 'var(--bad-fg)', borderColor: 'rgba(179,56,46,0.28)' }}
              >
                <Trash2 className="h-3.5 w-3.5" /> Empty trash
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-5">
            {loadError ? (
              <div
                className="rounded-[14px] border bg-white p-4 text-sm"
                style={{ borderColor: 'rgba(179,56,46,0.25)', color: 'var(--bad-fg)' }}
              >
                {loadError}
              </div>
            ) : loading && trashed.length === 0 ? (
              <div
                className="flex items-center gap-2 py-16 text-sm"
                style={{ color: 'var(--text-4)' }}
              >
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : trashed.length === 0 ? (
              <div className="plat-list py-16 text-center">
                <Trash2 className="mx-auto mb-3 h-7 w-7" style={{ color: 'var(--text-5)' }} />
                <p className="text-sm" style={{ color: 'var(--text-4)' }}>
                  Trash is empty.
                </p>
              </div>
            ) : (
              <div className="plat-list">
                {trashed.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between gap-4 border-b border-[var(--line-soft)] px-4 py-3 transition-colors last:border-b-0 hover:bg-[rgba(20,22,26,0.02)]"
                  >
                    <button
                      type="button"
                      data-command-exempt="opens one trashed note; the command form is nav.find-note"
                      onClick={() => navigate(`/notes/${n.id}`)}
                      className="flex min-w-0 items-center gap-2.5 text-left"
                    >
                      <StickyNote className="h-4 w-4 shrink-0" style={{ color: 'var(--text-5)' }} />
                      <span className="truncate text-sm text-[var(--ink)]">{deriveTitle(n)}</span>
                      <span className="shrink-0 text-xs" style={{ color: 'var(--text-4)' }}>
                        · trashed {new Date(n.updatedAt).toLocaleDateString()}
                      </span>
                    </button>
                    <button
                      type="button"
                      data-command-exempt="restores this row's note; a palette form would need a note argument the trash view does not have"
                      onClick={() => restore(n.id)}
                      className="plat-btn-ghost shrink-0 !h-7 !gap-1 !px-3 !text-[11px]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={emptyOpen}
        onOpenChange={setEmptyOpen}
        icon={Trash2}
        title="Empty the trash?"
        description={`All ${trashed.length} note${
          trashed.length === 1 ? '' : 's'
        } in the trash are deleted permanently. This cannot be undone.`}
        confirmLabel="Delete permanently"
        tone="danger"
        onConfirm={emptyTrash}
      />
    </NotesLayout>
  );
}
