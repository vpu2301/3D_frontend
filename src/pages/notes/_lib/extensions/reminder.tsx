import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Bell, X, CalendarClock, Loader2 } from 'lucide-react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';

/**
 * The badge reports the mirror's actual state.
 *
 * It used to say "Mirrored to Calendar" unconditionally, which was true of a
 * mock that invented the calendar id inline. The Calendar Mirror is a real
 * asynchronous service now: until it has run, the reminder is not in anyone's
 * calendar, and saying otherwise is the kind of small lie that costs someone a
 * meeting.
 */
function MirrorBadge({ reminderId }: { reminderId: string }) {
  const reminder = useNotesStore((s) => {
    if (!reminderId) return undefined;
    for (const note of Object.values(s.notes)) {
      const match = note.reminders?.find((r) => r.id === reminderId);
      if (match) return match;
    }
    return undefined;
  });

  // No server row: an old document from the mock era, or a node whose reminder
  // was deleted. Claiming nothing is better than claiming a mirror.
  if (!reminder) {
    return (
      <span className="ml-2 rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--text-4)]">
        Not scheduled
      </span>
    );
  }

  if (reminder.dismissed) {
    return (
      <span className="ml-2 rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--text-4)]">
        Dismissed
      </span>
    );
  }

  if (reminder.calendarEventId) {
    return (
      <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-[rgba(154,83,18,0.25)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--warn-fg)]">
        <CalendarClock className="h-2.5 w-2.5" />
        In Calendar
      </span>
    );
  }

  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--text-4)]">
      <Loader2 className="h-2.5 w-2.5 animate-spin" />
      Mirroring…
    </span>
  );
}

function ReminderView({ node, deleteNode }: NodeViewProps) {
  const dueAt = Number(node.attrs.dueAt);
  const location = (node.attrs.location as string) || '';
  const reminderId = (node.attrs.reminderId as string) || '';
  const display = dueAt
    ? new Date(dueAt).toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Set a time';

  return (
    <NodeViewWrapper className="my-2">
      <div
        className="flex items-center justify-between gap-2 rounded-[10px] border border-[var(--line)] bg-[var(--sand)] px-3 py-2 text-sm"
        contentEditable={false}
      >
        <div className="flex items-center gap-2 text-[var(--text-2)]">
          <Bell className="h-4 w-4" />
          <span className="font-medium">Reminder</span>
          <span>·</span>
          <span>{display}</span>
          {location && (
            <>
              <span>·</span>
              <span>{location}</span>
            </>
          )}
          <MirrorBadge reminderId={reminderId} />
        </div>
        <button
            data-command-exempt="inline chip inside the document; shows the reminder it represents"
          type="button"
          onClick={() => deleteNode()}
          className="rounded-[8px] p-1 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
          aria-label="Remove reminder"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </NodeViewWrapper>
  );
}

export const ReminderNode = Node.create({
  name: 'reminder',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      dueAt: { default: 0 },
      location: { default: '' },
      reminderId: { default: '' },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-reminder]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-reminder': 'true' })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ReminderView);
  },
});
