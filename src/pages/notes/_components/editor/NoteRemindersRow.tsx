import { Bell, X, CalendarClock } from 'lucide-react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import type { Note } from '@/pages/notes/_lib/types';

function formatDue(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NoteRemindersRow({ note }: { note: Note }) {
  const dismiss = useNotesStore((s) => s.dismissReminder);
  const active = note.reminders.filter((r) => !r.dismissed);
  if (active.length === 0) return null;
  return (
    <div className="mx-10 mt-3 flex flex-wrap items-center gap-1.5">
      {active.map((r) => (
        <span
          key={r.id}
          className="group inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-900"
        >
          <Bell className="h-3 w-3" />
          {formatDue(r.dueAt)}
          {r.calendarEventId && (
            <span className="inline-flex items-center gap-0.5 text-amber-700" title="Mirrored to Calendar">
              <CalendarClock className="h-2.5 w-2.5" />
            </span>
          )}
          <button
            type="button"
            onClick={() => dismiss(note.id, r.id)}
            className="ml-0.5 opacity-0 hover:text-red-500 group-hover:opacity-100"
            aria-label="Dismiss reminder"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
    </div>
  );
}
