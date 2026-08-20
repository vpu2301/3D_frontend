/**
 * The matter page — P3, "preparation is manual archaeology".
 *
 * A matter is a projection, not a new entity: it is a tag or a notebook the user
 * already had, promoted by BE-2 once it has three notes and one obligation.
 * Nothing to configure, no taxonomy to maintain. That is the whole reason it is
 * usable on day one.
 *
 * **One request, six sections, fixed order, no customization.** Six sections must
 * not be six spinners, and the order is an argument rather than a layout:
 *
 *   1. Open obligations — the first question before any call
 *   2. Recent decisions — "what did we agree?"
 *   3. Summary — the ten-second version, *after* the facts
 *   4. Notes — the raw record
 *   5. Documents — "did we get the contract?"
 *   6. Upcoming — what's next
 *
 * The summary sits third and not first on purpose. The five factual sections
 * stand alone: a firm that never switches AI on, or whose budget is spent, or
 * whose local model is slow, still gets the entire value of this page. When the
 * summary is absent the page does not apologise and does not show a spinner
 * where a paragraph would be — it simply is not there.
 *
 * "Prepare for the meeting" is the reason the page exists. Without it this is a
 * dashboard; with it, it is a workflow that ends in a note you can write in.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarClock,
  FileText,
  Hash,
  ListChecks,
  NotebookPen,
  Paperclip,
  Scale,
  Sparkles,
  StickyNote,
} from 'lucide-react';
import NotesLayout from '@/pages/notes/_components/shared/NotesLayout';
import NotesMiniRail from '@/pages/notes/_components/sidebar/NotesMiniRail';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import {
  notesApi,
  type MatterOutcome,
  type MatterView,
} from '@/pages/notes/_lib/apiClient';
import { reportError } from '@/pages/notes/_lib/errors';
import { dueToneClass, dueBucket, formatDue, ownerLabel } from '@/pages/notes/_lib/outcomes';
import { prepareMeetingDocument } from '@/pages/notes/_lib/prepareMeeting';
import { cn } from '@/lib/utils';

export default function NotesMatter() {
  const { key = '' } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const createNote = useNotesStore((s) => s.createNote);
  const loadNotes = useNotesStore((s) => s.load);
  const setSelectedNoteId = useNotesUiStore((s) => s.setSelectedNoteId);

  const [view, setView] = useState<MatterView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    // One request. Every section below reads from this response.
    notesApi
      .matter(key)
      .then((response) => {
        if (!cancelled) setView(response);
      })
      .catch((failure) => {
        if (cancelled) return;
        setError('This matter could not be opened.');
        reportError(failure, { title: 'Could not open the matter' });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const prepare = async () => {
    if (!view) return;
    setPreparing(true);
    try {
      const note = await createNote({
        title: `Preparation — ${view.matter.label}`,
        tags: view.matter.kind === 'tag' ? [view.matter.key] : [],
        notebookId: view.matter.kind === 'notebook' ? view.matter.key : null,
        content: prepareMeetingDocument(view),
      });
      setSelectedNoteId(note.id);
      navigate(`/notes/${note.id}`);
    } catch {
      /* the store already toasted */
    } finally {
      setPreparing(false);
    }
  };

  const openNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    navigate(`/notes/${noteId}`);
  };

  const mine = view?.openObligations?.mine ?? [];
  const theirs = view?.openObligations?.theirs ?? [];

  return (
    <NotesLayout>
      <div className="flex flex-1 overflow-hidden">
        <NotesMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line-soft)] px-8 pt-6 pb-4">
            <div className="min-w-0">
              <p className="plat-crumb">3days.notes</p>
              <h1 className="mt-1.5 flex items-center gap-2 truncate text-[22px]">
                {view?.matter.kind === 'notebook' ? (
                  <NotebookPen aria-hidden className="h-5 w-5" style={{ color: 'var(--text-4)' }} />
                ) : (
                  <Hash aria-hidden className="h-5 w-5" style={{ color: 'var(--text-4)' }} />
                )}
                {view?.matter.label ?? key}
              </h1>
              {view && (
                <p className="mt-1 text-xs" style={{ color: 'var(--text-4)' }}>
                  {view.matter.noteCount} note{view.matter.noteCount === 1 ? '' : 's'} ·{' '}
                  {view.matter.openTasks} open
                  {view.matter.lastActivityAt
                    ? ` · last touched ${new Date(view.matter.lastActivityAt).toLocaleDateString()}`
                    : ''}
                </p>
              )}
            </div>
            <button
              type="button"
              data-command-exempt="builds a note from the matter view this page already loaded; a palette form would have to ask which matter and then fetch it, which is navigate-then-click by another name"
              disabled={!view || preparing}
              onClick={() => void prepare()}
              className="plat-btn shrink-0 !h-9 !px-4"
            >
              <NotebookPen className="h-3.5 w-3.5" /> Prepare for a meeting
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-8 py-5">
            {loading ? (
              <MatterSkeleton />
            ) : error || !view ? (
              <div
                className="rounded-[14px] border bg-white p-4 text-sm"
                style={{ borderColor: 'rgba(179,56,46,0.25)', color: 'var(--bad-fg)' }}
              >
                {error ?? 'This matter could not be opened.'}
              </div>
            ) : (
              <div className="space-y-7 pb-16">
                <Section icon={ListChecks} title="Open items">
                  {mine.length === 0 && theirs.length === 0 ? (
                    <Empty>Nothing outstanding on either side.</Empty>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      <ObligationColumn title="I owe" items={mine} onOpen={openNote} />
                      <ObligationColumn title="Promised to me" items={theirs} onOpen={openNote} />
                    </div>
                  )}
                </Section>

                <Section icon={Scale} title="Recent decisions">
                  {view.recentDecisions.length === 0 ? (
                    <Empty>No decisions recorded yet.</Empty>
                  ) : (
                    <ul className="plat-list">
                      {view.recentDecisions.map((decision) => (
                        <li
                          key={decision.id}
                          className="border-b border-[var(--line-soft)] px-4 py-2.5 last:border-b-0"
                        >
                          <button
                            type="button"
                            data-command-exempt="opens the note a decision was recorded in; navigation"
                            onClick={() => openNote(decision.noteId)}
                            className="w-full text-left text-sm text-[var(--ink)] hover:underline"
                          >
                            {decision.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </Section>

                {/* Third, and never the first thing: the facts above are more
                    trustworthy than the paragraph, and the page is complete
                    without it. */}
                <MatterSummary summary={view.summary} />

                <Section icon={StickyNote} title="Notes">
                  {view.notes.length === 0 ? (
                    <Empty>No notes carry this matter yet.</Empty>
                  ) : (
                    <ul className="plat-list">
                      {view.notes.map((note) => (
                        <li
                          key={note.id}
                          className="border-b border-[var(--line-soft)] last:border-b-0"
                        >
                          <button
                            type="button"
                            data-command-exempt="opens one note from the matter's record; navigation"
                            onClick={() => openNote(note.id)}
                            className="w-full px-4 py-2.5 text-left transition-colors hover:bg-[rgba(20,22,26,0.03)]"
                          >
                            <div className="flex items-baseline justify-between gap-3">
                              <span className="truncate text-sm font-medium text-[var(--ink)]">
                                {note.title || 'Untitled'}
                              </span>
                              <span className="shrink-0 text-[10px]" style={{ color: 'var(--text-5)' }}>
                                {new Date(note.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                            {note.snippet && (
                              <p className="mt-0.5 line-clamp-1 text-xs" style={{ color: 'var(--text-4)' }}>
                                {note.snippet}
                              </p>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </Section>

                <Section icon={Paperclip} title="Documents">
                  {view.documents.length === 0 ? (
                    <Empty>Nothing attached to these notes.</Empty>
                  ) : (
                    <ul className="plat-list">
                      {view.documents.map((document) => (
                        <li
                          key={document.id}
                          className="flex items-center gap-2 border-b border-[var(--line-soft)] px-4 py-2.5 text-sm last:border-b-0"
                          style={{ color: 'var(--text-1)' }}
                        >
                          <FileText aria-hidden className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-4)' }} />
                          <span className="min-w-0 flex-1 truncate">
                            {document.filename ?? 'Attachment'}
                          </span>
                          <span className="shrink-0 text-[10px]" style={{ color: 'var(--text-5)' }}>
                            {Math.max(1, Math.round(document.sizeBytes / 1024))} kB
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Section>

                <Section icon={CalendarClock} title="Upcoming">
                  {view.upcoming.length === 0 ? (
                    <Empty>Nothing scheduled.</Empty>
                  ) : (
                    <ul className="plat-list">
                      {view.upcoming.map((entry) => (
                        <li
                          key={entry.reminderId}
                          className="flex items-center gap-2 border-b border-[var(--line-soft)] px-4 py-2.5 text-sm last:border-b-0"
                        >
                          <CalendarClock aria-hidden className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-4)' }} />
                          <button
                            type="button"
                            data-command-exempt="opens the note a reminder belongs to; navigation"
                            onClick={() => openNote(entry.noteId)}
                            className="min-w-0 flex-1 truncate text-left text-[var(--text-1)] hover:underline"
                          >
                            {new Date(entry.dueAt).toLocaleString(undefined, {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </button>
                          {!entry.calendarEventId && (
                            <span className="shrink-0 text-[10px] italic" style={{ color: 'var(--text-5)' }}>
                              mirroring…
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </Section>
              </div>
            )}
          </div>
        </main>
      </div>
    </NotesLayout>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title}>
      <h2 className="plat-eyebrow mb-2 flex items-center gap-1.5">
        <Icon aria-hidden className="h-3 w-3" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="rounded-[12px] border border-dashed px-3 py-3 text-xs"
      style={{ borderColor: 'rgba(20,22,26,0.12)', color: 'var(--text-4)' }}
    >
      {children}
    </p>
  );
}

function ObligationColumn({
  title,
  items,
  onOpen,
}: {
  title: string;
  items: MatterOutcome[];
  onOpen: (noteId: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-1.5 text-[11px] font-medium" style={{ color: 'var(--text-4)' }}>
        {title}
      </h3>
      {items.length === 0 ? (
        <Empty>Nothing.</Empty>
      ) : (
        <ul className="plat-list">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 border-b border-[var(--line-soft)] px-4 py-2 last:border-b-0"
            >
              <button
                type="button"
                data-command-exempt="opens the note this obligation came from; navigation"
                onClick={() => onOpen(item.noteId)}
                className="min-w-0 flex-1 truncate text-left text-sm text-[var(--ink)] hover:underline"
              >
                {item.text}
              </button>
              {item.owedBy && (
                <span className="plat-pill plat-pill-mute shrink-0 !px-1.5 !py-0.5 !text-[10px] !font-medium">
                  {ownerLabel(item.owedBy)}
                </span>
              )}
              {formatDue(item) && (
                <span className={cn('shrink-0 text-[11px]', dueToneClass(dueBucket(item.dueAt)))}>
                  {formatDue(item)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * The generated paragraph.
 *
 * Absent is a valid, silent state — no spinner, no "AI unavailable" banner, no
 * apology. The label has to be unmistakable without being alarming, which is why
 * it says what produced it and offers a way to fold it away rather than shouting
 * a warning colour at a paragraph that is usually correct.
 */
function MatterSummary({ summary }: { summary: MatterView['summary'] }) {
  const [open, setOpen] = useState(true);
  if (!summary?.text) return null;

  return (
    <section aria-label="Summary">
      <h2 className="plat-eyebrow mb-2 flex items-center gap-1.5">
        <Sparkles aria-hidden className="h-3 w-3" />
        Summary
        <span className="font-normal normal-case tracking-normal">
          · written by the model from the sections above
        </span>
        <button
          type="button"
          data-command-exempt="folds this page's summary away; a display preference"
          onClick={() => setOpen((current) => !current)}
          className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-normal normal-case tracking-normal transition-colors hover:bg-[rgba(20,22,26,0.04)]"
          style={{ color: 'var(--text-4)' }}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </h2>
      {open && (
        <div className="plat-panel !px-4 !py-3">
          {summary.stale && (
            <p className="mb-1 flex items-center gap-1 text-[11px]" style={{ color: 'var(--warn-fg)' }}>
              <AlertTriangle aria-hidden className="h-3 w-3" />
              Written before the latest changes.
            </p>
          )}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
            {summary.text}
          </p>
        </div>
      )}
    </section>
  );
}

function MatterSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading the matter">
      {Array.from({ length: 3 }).map((_, section) => (
        <div key={section} className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );
}
