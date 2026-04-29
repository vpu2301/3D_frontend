import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Bell, X } from 'lucide-react';

function ReminderView({ node, deleteNode }: NodeViewProps) {
  const dueAt = Number(node.attrs.dueAt);
  const location = (node.attrs.location as string) || '';
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
      <div className="flex items-center justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm" contentEditable={false}>
        <div className="flex items-center gap-2 text-amber-900">
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
          <span className="ml-2 rounded-full border border-amber-300 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-700">
            Mirrored to Calendar
          </span>
        </div>
        <button
          type="button"
          onClick={() => deleteNode()}
          className="rounded p-1 text-amber-700 hover:bg-amber-100"
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
