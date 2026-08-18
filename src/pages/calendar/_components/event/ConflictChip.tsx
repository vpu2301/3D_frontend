import { AlertTriangle } from 'lucide-react';
import type { CalendarEvent } from '../../_lib/types';

interface Props {
  targets: CalendarEvent[];
  onMoveIt: () => void;
  onStackBoth: () => void;
  onCancel: () => void;
}

export function ConflictChip({ targets, onMoveIt, onStackBoth, onCancel }: Props) {
  const label =
    targets.length === 1
      ? `"${targets[0].title}"`
      : `${targets.length} focus blocks`;
  return (
    <div
      role="alertdialog"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs shadow-lg"
    >
      <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
      <span className="text-gray-700">Overlaps with {label}.</span>
      <button
        type="button"
        onClick={onMoveIt}
        className="rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white hover:bg-gray-800"
      >
        Move it
      </button>
      <button
        type="button"
        onClick={onStackBoth}
        className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
      >
        Stack both
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md px-2 py-1 text-[11px] font-medium text-gray-500 hover:text-gray-700"
      >
        Cancel
      </button>
    </div>
  );
}
