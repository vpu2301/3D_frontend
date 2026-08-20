import { useMemo } from 'react';
import { Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PALETTE } from '../../_lib/palette';
import { parseUTC } from '../../_lib/time';
import type { CalendarEvent, SubCalendar } from '../../_lib/types';
import { format } from 'date-fns';

interface Props {
  event: CalendarEvent;
  calendar?: SubCalendar;
  variant?: 'grid' | 'month' | 'agenda' | 'allday';
  lane?: number;
  laneCount?: number;
  heightPx?: number;
  topPx?: number;
  onPointerDown?: (e: React.PointerEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  selected?: boolean;
  dragging?: boolean;
  conflict?: boolean;
}

export function EventChip({
  event,
  calendar,
  variant = 'grid',
  lane = 0,
  laneCount = 1,
  heightPx,
  topPx,
  onPointerDown,
  onClick,
  selected,
  dragging,
  conflict,
}: Props) {
  const palette = PALETTE[calendar?.colorToken ?? 'blue'];
  const start = useMemo(() => parseUTC(event.start), [event.start]);
  const end = useMemo(() => parseUTC(event.end), [event.end]);

  if (variant === 'month') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group flex w-full items-center gap-1.5 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[11px]',
          palette.chipBg,
          palette.chipText,
          'hover:brightness-95',
        )}
      >
        <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', palette.dot)} />
        <span className="truncate font-medium">{event.title}</span>
      </button>
    );
  }

  if (variant === 'agenda') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full items-center gap-3 border-b border-[var(--line-soft)] px-4 py-2.5 text-left transition last:border-b-0 hover:bg-[rgba(20,22,26,0.02)]',
          selected && 'bg-[rgba(20,22,26,0.04)]',
        )}
      >
        <span className={cn('h-8 w-[3px] rounded-full', palette.dot)} />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-[var(--ink)]">{event.title}</p>
          <p className="text-xs text-[var(--text-4)]">
            {format(start, 'h:mm a')} – {format(end, 'h:mm a')}
            {event.location ? ` · ${event.location}` : ''}
          </p>
        </div>
        {event.conferencing && <Video className="h-3.5 w-3.5 text-[var(--text-5)]" />}
      </button>
    );
  }

  if (variant === 'allday') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex h-5 items-center gap-1.5 truncate rounded-[6px] px-1.5 text-[11px]',
          palette.chipBg,
          palette.chipText,
          palette.chipBorder,
          'border',
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full', palette.dot)} />
        <span className="truncate">{event.title}</span>
      </button>
    );
  }

  // grid variant
  const widthPct = 100 / Math.max(1, laneCount);
  const leftPct = lane * widthPct;
  const narrow = (heightPx ?? 0) < 32;
  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      onClick={onClick}
      data-event-id={event.id}
      className={cn(
        'absolute overflow-hidden rounded-[8px] border text-left text-[11px] leading-tight transition',
        'select-none cursor-grab active:cursor-grabbing',
        event.isFocusBlock ? palette.focusHatch : palette.chipBg,
        palette.chipText,
        palette.chipBorder,
        selected && `ring-1 ${palette.ring}`,
        dragging && 'opacity-70 shadow-md',
        conflict && 'ring-1 ring-[var(--bad-fg)]',
      )}
      style={{
        top: topPx,
        height: heightPx,
        left: `calc(${leftPct}% + 2px)`,
        width: `calc(${widthPct}% - 4px)`,
      }}
    >
      <div className="flex h-full flex-col px-1.5 py-1">
        <div className="flex items-center gap-1">
          {event.isFocusBlock && (
            <span className="rounded-[4px] bg-white/70 px-1 text-[9px] font-semibold uppercase tracking-wide">
              Focus
            </span>
          )}
          <span className="truncate font-semibold">{event.title}</span>
        </div>
        {!narrow && (
          <p className="mt-0.5 truncate text-[10px] opacity-80">
            {format(start, 'h:mm a')} – {format(end, 'h:mm a')}
            {event.location ? ` · ${event.location}` : ''}
          </p>
        )}
      </div>
    </button>
  );
}
