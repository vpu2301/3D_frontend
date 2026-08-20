/**
 * Reminder badges (Sprint 2 §4.4).
 *
 * Three states, because the mirror is a real asynchronous service now rather
 * than a fabricated `cal_mock_…` id:
 *
 *   pending  — the row exists, the Calendar Mirror has not run yet
 *   mirrored — `calendarEventId` came back, the event exists in Calendar
 *   dismissed — hidden here; the badge is for what is still due
 *
 * "Mirroring…" is not a spinner-for-its-own-sake: until it resolves, the user's
 * calendar does not show the reminder, and that is worth saying.
 */

import { Bell, X, CalendarClock, Loader2 } from 'lucide-react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import type { Note, Reminder } from '@/pages/notes/_lib/types';

function formatDue(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MirrorState({ reminder }: { reminder: Reminder }) {
  if (reminder.calendarEventId) {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-[var(--warn-fg)]"
        title="Mirrored to Calendar"
      >
        <CalendarClock className="h-2.5 w-2.5" />
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[var(--text-4)]"
      title="Waiting for the Calendar Mirror — not in your calendar yet"
    >
      <Loader2 className="h-2.5 w-2.5 animate-spin" />
      <span className="text-[10px]">Mirroring…</span>
    </span>
  );
}

export default function NoteRemindersRow({ note }: { note: Note }) {
  const dismiss = useNotesStore((s) => s.dismissReminder);
  const active = (note.reminders ?? []).filter((r) => !r.dismissed);
  if (active.length === 0) return null;

  const now = Date.now();

  return (
    <div className="mx-10 mt-3 flex flex-wrap items-center gap-1.5">
      {active.map((r) => {
        const overdue = r.dueAt < now;
        return (
          <span
            key={r.id}
            className={
              overdue
                ? 'group inline-flex items-center gap-1 rounded-full border border-[rgba(179,56,46,0.25)] bg-[#fdf3f2] px-2 py-0.5 text-[11px] font-medium text-[var(--bad-fg)]'
                : 'group inline-flex items-center gap-1 rounded-full border border-[rgba(154,83,18,0.2)] bg-[var(--warn-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--warn-fg)]'
            }
          >
            <Bell className="h-3 w-3" />
            {formatDue(r.dueAt)}
            {r.location && <span className="text-[10px] opacity-75">· {r.location}</span>}
            <MirrorState reminder={r} />
            <button
            data-command-exempt="dismisses one reminder on this note; the palette form is note.reminder"
              type="button"
              onClick={() => dismiss(note.id, r.id)}
              className="ml-0.5 opacity-0 transition-opacity hover:text-[var(--bad-fg)] group-hover:opacity-100"
              aria-label="Dismiss reminder"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        );
      })}
    </div>
  );
}
