/**
 * A saved view's results.
 *
 * The rows come from `GET /v1/views/{id}/results`, which runs the stored query
 * server-side — so a semantic view keeps finding notes written after it was
 * saved. That is the retrieval claim no folder-based tool can make, and it is
 * why this page renders the server's answer rather than filtering a local list.
 *
 * The `warning` field is shown rather than swallowed: the server re-validates a
 * stored query on read, and a grammar change should surface as "this view needs
 * a look" instead of as quietly wrong rows.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, Bookmark, Pencil, Trash2 } from 'lucide-react';
import NotesLayout from '@/pages/notes/_components/shared/NotesLayout';
import NotesMiniRail from '@/pages/notes/_components/sidebar/NotesMiniRail';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/pages/notes/_components/shared/NotesDialog';
import ViewBuilder from '@/pages/notes/_components/views/ViewBuilder';
import { useSavedViewsStore } from '@/pages/notes/_hooks/use-saved-views-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { notesApi, type QueryResults } from '@/pages/notes/_lib/apiClient';
import { describeQuery } from '@/pages/notes/_lib/queryDsl';
import { reportError } from '@/pages/notes/_lib/errors';

export default function NotesSavedView() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const views = useSavedViewsStore((s) => s.views);
  const loadViews = useSavedViewsStore((s) => s.load);
  const removeView = useSavedViewsStore((s) => s.remove);
  const setSelectedNoteId = useNotesUiStore((s) => s.setSelectedNoteId);

  const [results, setResults] = useState<QueryResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const view = views.find((entry) => entry.id === id);

  useEffect(() => {
    void loadViews();
  }, [loadViews]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    notesApi
      .viewResults(id)
      .then((page) => {
        if (!cancelled) setResults(page);
      })
      .catch((error) => {
        if (!cancelled) reportError(error, { title: 'Could not run that view' });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, view?.updatedAt]);

  const open = (noteId: string) => {
    setSelectedNoteId(noteId);
    navigate(`/notes/${noteId}`);
  };

  return (
    <NotesLayout>
      <div className="flex flex-1 overflow-hidden">
        <NotesMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line-soft)] px-8 pt-6 pb-4">
            <div className="min-w-0">
              <p className="plat-crumb">3days.notes</p>
              <h1 className="mt-1.5 flex items-center gap-2 truncate text-[22px]">
                <Bookmark aria-hidden className="h-5 w-5" style={{ color: 'var(--text-4)' }} />
                {view?.name ?? 'View'}
              </h1>
              {view && (
                <p className="mt-1 truncate text-xs" style={{ color: 'var(--text-4)' }}>
                  {describeQuery(view.query)}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                data-command-exempt="edits the query of the view on screen; there is nothing to edit from elsewhere"
                onClick={() => setEditing(true)}
                className="plat-btn-ghost !h-8 !gap-1 !px-3.5 !text-[11px]"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button
                type="button"
                data-command-exempt="deletes the view on screen; scoped to it"
                onClick={() => setConfirmDelete(true)}
                className="plat-btn-ghost !h-8 !gap-1 !px-3.5 !text-[11px]"
                style={{ color: 'var(--bad-fg)', borderColor: 'rgba(179,56,46,0.28)' }}
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </header>

          {view?.warning && (
            <div
              className="mx-8 mt-3 flex items-start gap-2 rounded-[12px] border px-3 py-2 text-xs"
              style={{
                borderColor: 'rgba(154,83,18,0.22)',
                background: 'var(--warn-bg)',
                color: 'var(--warn-fg)',
              }}
            >
              <AlertTriangle aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{view.warning}</span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-8 py-4">
            {loading ? (
              <div className="space-y-2" aria-busy="true">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-full" />
                ))}
              </div>
            ) : !results || results.items.length === 0 ? (
              <div className="plat-list py-16 text-center">
                <Bookmark aria-hidden className="mx-auto mb-3 h-7 w-7" style={{ color: 'var(--text-5)' }} />
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                  Nothing matches this view right now.
                </p>
                <p className="mx-auto mt-1 max-w-sm text-xs" style={{ color: 'var(--text-4)' }}>
                  It keeps running as you write — a note saved tomorrow can appear here without
                  anyone touching the view.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-2 text-[11px]" style={{ color: 'var(--text-5)' }}>
                  {results.total} note{results.total === 1 ? '' : 's'}
                  {results.closest && ' · closest matches, nothing exact'}
                </p>
                <ul className="plat-list">
                  {results.items.map((item) => (
                    <li key={item.id} className="border-b border-[var(--line-soft)] last:border-b-0">
                      <button
                        type="button"
                        data-command-exempt="opens a note from this view's results; navigation"
                        onClick={() => open(item.id)}
                        className="w-full px-4 py-2.5 text-left transition-colors hover:bg-[rgba(20,22,26,0.03)]"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="truncate text-sm font-medium text-[var(--ink)]">
                            {item.title || 'Untitled'}
                          </span>
                          <span className="shrink-0 text-[10px]" style={{ color: 'var(--text-5)' }}>
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {item.snippet && (
                          <p className="mt-0.5 line-clamp-1 text-xs" style={{ color: 'var(--text-4)' }}>
                            {item.snippet}
                          </p>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </main>
      </div>

      {view && <ViewBuilder view={view} open={editing} onOpenChange={setEditing} />}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        icon={Trash2}
        title="Delete this view?"
        description={`"${view?.name ?? 'This view'}" is removed. The notes it found are untouched.`}
        confirmLabel="Delete view"
        tone="danger"
        onConfirm={async () => {
          await removeView(id);
          navigate('/notes');
        }}
      />
    </NotesLayout>
  );
}
