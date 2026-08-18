import {
  Pin,
  Trash2,
  Sparkles,
  Bell,
  Cloud,
  CloudOff,
  Loader2,
  Folder,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Editor } from '@tiptap/react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import type { Note } from '@/pages/notes/_lib/types';
import { deriveTitle } from '@/pages/notes/_lib/backlinks';
import { downloadBlob, toMarkdown } from '@/pages/docs/_lib/export';
import { cn } from '@/lib/utils';

interface Props {
  note: Note;
  editor: Editor | null;
  saveStatus: 'saved' | 'saving' | 'error';
  onAskAi: () => void;
}

function SaveIndicator({ status }: { status: Props['saveStatus'] }) {
  if (status === 'saving')
    return (
      <span className="flex items-center gap-1 text-[11px] text-gray-500">
        <Loader2 className="h-3 w-3 animate-spin" /> Saving…
      </span>
    );
  if (status === 'error')
    return (
      <span className="flex items-center gap-1 text-[11px] text-red-600">
        <CloudOff className="h-3 w-3" /> Save failed
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-[11px] text-gray-500">
      <Cloud className="h-3 w-3" /> Saved
    </span>
  );
}

export default function NoteEditorTopBar({ note, editor, saveStatus, onAskAi }: Props) {
  const togglePin = useNotesStore((s) => s.togglePin);
  const trash = useNotesStore((s) => s.trashNote);
  const moveToNotebook = useNotesStore((s) => s.moveToNotebook);
  const addReminder = useNotesStore((s) => s.addReminder);
  const notebooks = useNotesStore((s) => s.notebooks);
  const { aiSidebarOpen, setAiSidebarOpen } = useNotesUiStore();
  const navigate = useNavigate();
  const [notebookOpen, setNotebookOpen] = useState(false);

  const onReminder = async () => {
    const when = window.prompt('Reminder when? (e.g. "tomorrow 9am" — mock parses ISO datetimes)');
    if (!when) return;
    const dueAt = parseRoughTime(when);
    if (!dueAt) {
      alert('Could not parse — try an ISO datetime like 2026-04-30T09:00');
      return;
    }
    const r = await addReminder(note.id, dueAt);
    editor
      ?.chain()
      .focus()
      .insertContent({
        type: 'reminder',
        attrs: { dueAt: r.dueAt, reminderId: r.id },
      })
      .run();
  };

  const onExport = () => {
    const md = toMarkdown(note.content);
    const safeName = (deriveTitle(note) || 'note')
      .replace(/[^a-z0-9-_]+/gi, '-')
      .toLowerCase();
    downloadBlob(`${safeName}.md`, 'text/markdown', md);
  };

  const currentNotebook = note.notebookId ? notebooks[note.notebookId] : null;

  return (
    <header className="flex items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-2">
      <div className="flex items-center gap-2">
        <SaveIndicator status={saveStatus} />
        {note.daily && (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
            Daily note
          </span>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotebookOpen((o) => !o)}
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] text-gray-600 hover:bg-gray-100"
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
              className="absolute left-0 top-full z-20 mt-1 w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
              onMouseLeave={() => setNotebookOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  moveToNotebook(note.id, null);
                  setNotebookOpen(false);
                }}
                className={cn(
                  'block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100',
                  !note.notebookId && 'bg-gray-100 font-medium',
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
                    onClick={() => {
                      moveToNotebook(note.id, nb.id);
                      setNotebookOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs hover:bg-gray-100',
                      note.notebookId === nb.id && 'bg-gray-100 font-medium',
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
          onClick={onReminder}
          className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
          title="Add reminder (mirrors to Calendar)"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => togglePin(note.id)}
          className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
          title={note.pinned ? 'Unpin' : 'Pin'}
        >
          <Pin className={cn('h-4 w-4', note.pinned && 'fill-amber-500 text-amber-500')} />
        </button>
        <button
          type="button"
          onClick={onExport}
          className="rounded-md px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
          title="Export as Markdown"
        >
          .md
        </button>
        <button
          type="button"
          onClick={onAskAi}
          className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
          title="Ask AI (⌘J)"
        >
          <Sparkles className="h-3.5 w-3.5" /> Ask AI
        </button>
        <button
          type="button"
          onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
          className={cn(
            'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
            aiSidebarOpen
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
          )}
        >
          <Sparkles className="h-3.5 w-3.5" /> AI
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm('Move this note to trash?')) {
              trash(note.id);
              navigate('/notes');
            }
          }}
          className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
          title="Move to trash"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function parseRoughTime(s: string): number | null {
  // Try ISO first
  const iso = Date.parse(s);
  if (!Number.isNaN(iso)) return iso;
  const now = new Date();
  const lower = s.toLowerCase().trim();
  if (lower === 'today') return now.setHours(17, 0, 0, 0);
  if (lower === 'tomorrow') {
    const t = new Date(now);
    t.setDate(t.getDate() + 1);
    t.setHours(9, 0, 0, 0);
    return t.getTime();
  }
  return null;
}
