import {
  Bell,
  ChevronDown,
  Folder,
  History,
  Loader2,
  Pin,
  RotateCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { useCommandRunner } from '@/pages/notes/_hooks/use-notes-commands';
import type { Note } from '@/pages/notes/_lib/types';
import { deriveTitle } from '@/pages/notes/_lib/backlinks';
import { exportNoteAsMarkdown } from '@/pages/notes/_lib/exportNote';
import { ConfirmDialog } from '@/pages/notes/_components/shared/NotesDialog';
import NoteVersionHistory from './NoteVersionHistory';
import { cn } from '@/lib/utils';

interface Props {
  note: Note;
  saveStatus: 'saved' | 'saving' | 'error';
  /** When the server last confirmed a write — ms epoch. */
  savedAt: number;
  onRetrySave: () => void;
  onAskAi: () => void;
}

function ago(ms: number): string {
  const seconds = Math.max(0, Math.round(ms / 1000));
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/**
 * The trust surface (P8).
 *
 * "Saved" is only ever shown for a write the server acknowledged, and it says
 * *when*, because a permanent green "Saved" is indistinguishable from a stuck
 * one. The failure state is the only one that offers an action, and it says
 * plainly that nothing was written.
 */
function SaveIndicator({
  status,
  savedAt,
  onRetry,
}: {
  status: Props['saveStatus'];
  savedAt: number;
  onRetry: () => void;
}) {
  // Re-render on a slow tick so "Saved 3s ago" becomes "Saved 1m ago" without
  // the editor re-rendering on every keystroke to keep a clock honest.
  const [, tick] = useState(0);
  useEffect(() => {
    if (status !== 'saved') return;
    const timer = window.setInterval(() => tick((n) => n + 1), 10_000);
    return () => window.clearInterval(timer);
  }, [status]);

  if (status === 'saving') {
    return (
      <span
        className="flex items-center gap-1 text-[11px]"
        style={{ color: 'var(--text-4)' }}
        role="status"
      >
        <Loader2 className="h-3 w-3 animate-spin" /> Saving…
      </span>
    );
  }

  if (status === 'error') {
    return (
      <button
        type="button"
        data-command-exempt="inline retry for the failed save it is reporting; not an app-wide action"
        onClick={onRetry}
        className="flex items-center gap-1 rounded-[8px] px-1.5 py-0.5 text-[11px] font-medium text-[var(--bad-fg)] hover:bg-[rgba(179,56,46,0.08)]"
        role="status"
      >
        <RotateCw className="h-3 w-3" /> Not saved — retry
      </button>
    );
  }

  return (
    <span
      className="flex items-center gap-1 text-[11px]"
      style={{ color: 'var(--text-4)' }}
      role="status"
    >
      Saved {ago(Date.now() - savedAt)}
    </span>
  );
}

export default function NoteEditorTopBar({
  note,
  saveStatus,
  savedAt,
  onRetrySave,
  onAskAi,
}: Props) {
  const moveToNotebook = useNotesStore((s) => s.moveToNotebook);
  const trash = useNotesStore((s) => s.trashNote);
  const notebooks = useNotesStore((s) => s.notebooks);
  const { aiSidebarOpen, setAiSidebarOpen, historyOpen, setHistoryOpen } = useNotesUiStore();
  const run = useCommandRunner();
  const navigate = useNavigate();
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const onExport = async () => {
    setExporting(true);
    try {
      await exportNoteAsMarkdown(note);
    } finally {
      setExporting(false);
    }
  };

  const currentNotebook = note.notebookId ? notebooks[note.notebookId] : null;

  return (
    <header className="flex items-center justify-between gap-2 border-b border-[var(--line-soft)] px-4 py-2">
      <div className="flex items-center gap-2">
        <SaveIndicator status={saveStatus} savedAt={savedAt} onRetry={onRetrySave} />
        {note.daily && (
          <span className="plat-pill plat-pill-mute !px-2 !py-0.5 !text-[10px]">
            Daily note
          </span>
        )}
        <div className="relative">
          <button
            type="button"
            data-command="note.move"
            onClick={() => setNotebookOpen((o) => !o)}
            className="flex items-center gap-1 rounded-[8px] px-2 py-0.5 text-[11px] text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          >
            <Folder
              className="h-3 w-3"
              style={currentNotebook ? { color: currentNotebook.color } : undefined}
            />
            {currentNotebook?.name ?? 'No notebook'}
            <ChevronDown className="h-3 w-3" />
          </button>
          {notebookOpen && (
            <div
              className="absolute left-0 top-full z-20 mt-1 w-44 rounded-[12px] border border-[var(--line)] bg-white p-1 shadow-lg"
              onMouseLeave={() => setNotebookOpen(false)}
            >
              <button
                type="button"
                data-command-exempt="argument for note.move, not an action of its own"
                onClick={() => {
                  moveToNotebook(note.id, null);
                  setNotebookOpen(false);
                }}
                className={cn(
                  'block w-full rounded-[8px] px-2 py-1 text-left text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)]',
                  !note.notebookId && 'bg-[rgba(20,22,26,0.06)] font-medium text-[var(--ink)]',
                )}
              >
                No notebook
              </button>
              {Object.values(notebooks)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((nb) => (
                  <button
                    key={nb.id}
                    type="button"
                    data-command-exempt="argument for note.move, not an action of its own"
                    onClick={() => {
                      moveToNotebook(note.id, nb.id);
                      setNotebookOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-[8px] px-2 py-1 text-left text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)]',
                      note.notebookId === nb.id && 'bg-[rgba(20,22,26,0.06)] font-medium text-[var(--ink)]',
                    )}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: nb.color }}
                    />
                    {nb.name}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          data-command="note.reminder"
          onClick={() => run('note.reminder')}
          className="rounded-[10px] p-1.5 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Add reminder (mirrors to Calendar)"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          data-command="note.pin"
          onClick={() => run('note.pin')}
          className="rounded-[10px] p-1.5 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title={note.pinned ? 'Unpin' : 'Pin'}
        >
          <Pin className={cn('h-4 w-4', note.pinned && 'fill-amber-500 text-amber-500')} />
        </button>
        <button
          type="button"
          data-command="note.history"
          onClick={() => run('note.history')}
          className="rounded-[10px] p-1.5 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Version history"
        >
          <History className="h-4 w-4" />
        </button>
        <button
          type="button"
          data-command="note.export"
          onClick={onExport}
          disabled={exporting}
          className="rounded-[10px] px-2 py-1 text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)] disabled:opacity-50"
          title="Export as Markdown"
        >
          {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '.md'}
        </button>
        <button
          type="button"
          data-command="view.ai"
          onClick={onAskAi}
          className="plat-btn !h-7 !gap-1 !px-3 !text-xs"
          title="Ask AI (⌘J)"
        >
          <Sparkles className="h-3.5 w-3.5" /> Ask AI
        </button>
        <button
          type="button"
          data-command="view.ai"
          onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
          className={cn(
            'flex items-center gap-1 rounded-[10px] px-2 py-1 text-xs font-medium transition-colors',
            aiSidebarOpen
              ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]'
              : 'text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
          )}
        >
          <Sparkles className="h-3.5 w-3.5" /> AI
        </button>
        <button
          type="button"
          data-command="note.trash"
          onClick={() => setTrashOpen(true)}
          className="rounded-[10px] p-1.5 text-[var(--text-4)] transition-colors hover:bg-[rgba(179,56,46,0.08)] hover:text-[var(--bad-fg)]"
          title="Move to trash"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <NoteVersionHistory noteId={note.id} open={historyOpen} onOpenChange={setHistoryOpen} />

      <ConfirmDialog
        open={trashOpen}
        onOpenChange={setTrashOpen}
        icon={Trash2}
        title="Move to trash?"
        description={`"${deriveTitle(note)}" stays restorable from Trash until the trash is emptied.`}
        confirmLabel="Move to trash"
        tone="danger"
        onConfirm={() => {
          trash(note.id);
          navigate('/notes');
        }}
      />
    </header>
  );
}
