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
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-[12px] border border-[var(--line)] bg-white px-3 py-2 text-xs shadow-[0_10px_30px_rgba(20,22,26,0.12)]"
    >
      <AlertTriangle className="h-3.5 w-3.5 text-[var(--bad-fg)]" />
      <span className="text-[var(--text-1)]">Overlaps with {label}.</span>
      <button
        type="button"
        onClick={onMoveIt}
        className="rounded-full bg-[var(--ink)] px-2.5 py-1 text-[11px] font-semibold text-white transition hover:opacity-85"
      >
        Move it
      </button>
      <button
        type="button"
        onClick={onStackBoth}
        className="rounded-full border border-[var(--line)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-2)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
      >
        Stack both
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full px-2 py-1 text-[11px] font-semibold text-[var(--text-4)] transition hover:text-[var(--ink)]"
      >
        Cancel
      </button>
    </div>
  );
}
