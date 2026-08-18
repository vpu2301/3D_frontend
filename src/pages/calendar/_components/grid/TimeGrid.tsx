import { useEffect, useMemo, useRef, useState } from 'react';
import { addMinutes, format, isSameDay, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { calendarStore, useCalendar } from '../../_hooks/use-calendar-store';
import { layoutDay } from '../../_lib/conflict';
import {
  MINUTES_PER_DAY,
  PX_PER_MINUTE,
  SLOT_MINUTES,
  SNAP_MINUTES,
  eventMinutesOnDay,
  eventOverlapsDay,
  parseUTC,
  snapMinutes,
} from '../../_lib/time';
import type { CalendarEvent } from '../../_lib/types';
import { EventChip } from '../event/EventChip';
import { ConflictChip } from '../event/ConflictChip';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_PX = MINUTES_PER_DAY * PX_PER_MINUTE; // 24h * 60min * 1.6 = 2304

interface Props {
  days: Date[];
  onEventClick?: (e: CalendarEvent) => void;
  onCreateDraft?: (draft: Omit<CalendarEvent, 'id'>) => void;
}

interface DragState {
  mode: 'create' | 'move' | 'resize';
  eventId?: string;
  focus?: boolean;
  dayIndex: number;
  startMin: number;
  endMin: number;
  originalStartMin?: number;
  originalEndMin?: number;
  pointerOffsetMin?: number;
}

export function TimeGrid({ days, onEventClick, onCreateDraft }: Props) {
  const events = useCalendar(s => s.events);
  const calendars = useCalendar(s => s.calendars);
  const selectedId = useCalendar(s => s.selectedEventId);

  const gridRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [pendingConflict, setPendingConflict] = useState<{
    eventId: string;
    targets: CalendarEvent[];
    newStart: string;
    newEnd: string;
  } | null>(null);

  const visibleCalIds = useMemo(
    () => new Set(calendars.filter(c => c.visible).map(c => c.id)),
    [calendars],
  );
  const visibleEvents = useMemo(
    () => events.filter(e => visibleCalIds.has(e.calendarId)),
    [events, visibleCalIds],
  );

  // Auto-scroll to 8am on mount
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTop = 8 * 60 * PX_PER_MINUTE - 40;
    }
  }, []);

  // Current-time indicator
  const [nowMin, setNowMin] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });
  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date();
      setNowMin(n.getHours() * 60 + n.getMinutes());
    }, 60_000);
    return () => clearInterval(t);
  }, []);

  function pointerMinute(e: PointerEvent | React.PointerEvent, dayColEl: HTMLElement): number {
    const rect = dayColEl.getBoundingClientRect();
    const y = e.clientY - rect.top;
    return Math.max(0, Math.min(MINUTES_PER_DAY - SNAP_MINUTES, snapMinutes(y / PX_PER_MINUTE)));
  }

  function startCreate(e: React.PointerEvent<HTMLDivElement>, dayIndex: number) {
    if (e.button !== 0) return;
    const col = e.currentTarget;
    (col as HTMLElement).setPointerCapture(e.pointerId);
    const startMin = pointerMinute(e, col);
    setDrag({
      mode: 'create',
      focus: e.shiftKey,
      dayIndex,
      startMin,
      endMin: startMin + SLOT_MINUTES,
    });
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag) return;
    const cols = gridRef.current?.querySelectorAll<HTMLElement>('[data-day-col]');
    if (!cols) return;
    const col = cols[drag.dayIndex];
    if (!col) return;
    const m = pointerMinute(e, col);
    if (drag.mode === 'create') {
      setDrag({ ...drag, endMin: Math.max(drag.startMin + SNAP_MINUTES, m) });
    } else if (drag.mode === 'move') {
      const dur = (drag.originalEndMin ?? 0) - (drag.originalStartMin ?? 0);
      const newStart = Math.max(0, Math.min(MINUTES_PER_DAY - dur, m - (drag.pointerOffsetMin ?? 0)));
      setDrag({ ...drag, startMin: newStart, endMin: newStart + dur });
    } else if (drag.mode === 'resize') {
      setDrag({ ...drag, endMin: Math.max(drag.startMin + SNAP_MINUTES, m) });
    }
  }

  function onPointerUp() {
    if (!drag) return;
    const day = days[drag.dayIndex];
    const base = startOfDay(day);
    const newStart = addMinutes(base, drag.startMin).toISOString();
    const newEnd = addMinutes(base, drag.endMin).toISOString();

    if (drag.mode === 'create') {
      const focusId = calendars.find(c => c.name.toLowerCase().includes('focus'))?.id
        ?? calendars[0]?.id;
      const defaultId = calendars.find(c => c.visible && !c.name.toLowerCase().includes('focus'))?.id
        ?? calendars[0]?.id;
      if ((drag.endMin - drag.startMin) >= SNAP_MINUTES && defaultId) {
        const draft: Omit<CalendarEvent, 'id'> = {
          calendarId: drag.focus ? focusId : defaultId,
          title: '',
          start: newStart,
          end: newEnd,
          isFocusBlock: drag.focus || undefined,
        };
        if (onCreateDraft) {
          onCreateDraft(draft);
        } else {
          calendarStore.createEvent({
            ...draft,
            title: drag.focus ? 'Focus block' : 'New event',
          });
        }
      }
    } else if ((drag.mode === 'move' || drag.mode === 'resize') && drag.eventId) {
      const ev = events.find(e => e.id === drag.eventId);
      if (ev) {
        // detect focus-block overrun
        const conflictTargets = events.filter(
          other =>
            other.id !== ev.id &&
            other.isFocusBlock &&
            visibleCalIds.has(other.calendarId) &&
            parseUTC(other.start).toISOString() < newEnd &&
            parseUTC(other.end).toISOString() > newStart,
        );
        if (conflictTargets.length > 0 && !ev.isFocusBlock) {
          setPendingConflict({
            eventId: ev.id,
            targets: conflictTargets,
            newStart,
            newEnd,
          });
        } else {
          calendarStore.moveEvent(ev.id, newStart, newEnd);
        }
      }
    }
    setDrag(null);
  }

  function beginMove(e: React.PointerEvent, event: CalendarEvent, dayIndex: number) {
    e.stopPropagation();
    if (e.button !== 0) return;
    const col = (e.currentTarget as HTMLElement).closest<HTMLElement>('[data-day-col]');
    if (!col) return;
    col.setPointerCapture(e.pointerId);
    const pointerM = pointerMinute(e, col);
    const { topMin, heightMin } = eventMinutesOnDay(event, days[dayIndex]);
    setDrag({
      mode: 'move',
      eventId: event.id,
      dayIndex,
      startMin: topMin,
      endMin: topMin + heightMin,
      originalStartMin: topMin,
      originalEndMin: topMin + heightMin,
      pointerOffsetMin: pointerM - topMin,
    });
    calendarStore.select(event.id);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Day headers */}
      <div
        className="grid border-b border-gray-200/70 bg-white"
        style={{ gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))` }}
      >
        <div />
        {days.map(d => {
          const today = isSameDay(d, new Date());
          return (
            <div
              key={d.toISOString()}
              className={cn(
                'flex flex-col items-center justify-center py-2 text-xs',
                today && 'text-blue-600',
              )}
            >
              <span className="uppercase tracking-wide text-gray-400">{format(d, 'EEE')}</span>
              <span
                className={cn(
                  'mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-base font-semibold text-gray-800',
                  today && 'bg-blue-600 text-white',
                )}
              >
                {format(d, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      {/* All-day strip */}
      <div
        className="grid border-b border-gray-200/70 bg-white"
        style={{ gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))` }}
      >
        <div className="py-1 pr-1 text-right text-[10px] uppercase tracking-wide text-gray-400">
          all-day
        </div>
        {days.map(d => {
          const allDay = visibleEvents.filter(
            e => e.allDay && eventOverlapsDay(e, d),
          );
          return (
            <div key={d.toISOString()} className="flex min-h-[28px] flex-wrap gap-1 border-l border-gray-100 px-1 py-1">
              {allDay.map(e => {
                const cal = calendars.find(c => c.id === e.calendarId);
                return (
                  <EventChip
                    key={e.id}
                    event={e}
                    calendar={cal}
                    variant="allday"
                    onClick={() => onEventClick?.(e)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Scrollable grid */}
      <div ref={gridRef} className="relative flex-1 overflow-y-auto">
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))`,
            height: DAY_PX,
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Gutter */}
          <div className="relative">
            {HOURS.map(h => (
              <div
                key={h}
                className="absolute right-2 -translate-y-1/2 text-[10px] text-gray-400"
                style={{ top: h * 60 * PX_PER_MINUTE }}
              >
                {h === 0 ? '' : format(new Date(2020, 0, 1, h), 'h a')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((d, dayIdx) => {
            const dayEvents = visibleEvents
              .filter(e => !e.allDay && eventOverlapsDay(e, d))
              .map(e => e);
            const laid = layoutDay(dayEvents);
            const today = isSameDay(d, new Date());
            return (
              <div
                key={d.toISOString()}
                data-day-col
                className="relative border-l border-gray-100"
                onPointerDown={ev => startCreate(ev, dayIdx)}
              >
                {/* Hour lines */}
                {HOURS.map(h => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-gray-100"
                    style={{ top: h * 60 * PX_PER_MINUTE }}
                  />
                ))}
                {/* Now indicator */}
                {today && (
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
                    style={{ top: nowMin * PX_PER_MINUTE }}
                  >
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span className="h-px flex-1 bg-rose-500" />
                  </div>
                )}

                {/* Event chips */}
                {laid.map(({ event, lane, laneCount }) => {
                  const cal = calendars.find(c => c.id === event.calendarId);
                  const { topMin, heightMin } = eventMinutesOnDay(event, d);
                  const isDragging = drag?.mode === 'move' && drag.eventId === event.id;
                  const topPx = isDragging
                    ? drag.startMin * PX_PER_MINUTE
                    : topMin * PX_PER_MINUTE;
                  const heightPx = isDragging
                    ? (drag.endMin - drag.startMin) * PX_PER_MINUTE
                    : heightMin * PX_PER_MINUTE;
                  return (
                    <EventChip
                      key={event.id}
                      event={event}
                      calendar={cal}
                      variant="grid"
                      lane={lane}
                      laneCount={laneCount}
                      topPx={topPx}
                      heightPx={heightPx}
                      selected={selectedId === event.id}
                      dragging={isDragging}
                      onPointerDown={ev => beginMove(ev, event, dayIdx)}
                      onClick={ev => {
                        ev.stopPropagation();
                        onEventClick?.(event);
                      }}
                    />
                  );
                })}

                {/* Draft ghost */}
                {drag && drag.dayIndex === dayIdx && drag.mode === 'create' && (
                  <div
                    className={cn(
                      'absolute left-1 right-1 rounded-md border-2 border-dashed',
                      drag.focus ? 'border-violet-400 bg-violet-50/60' : 'border-blue-400 bg-blue-50/60',
                    )}
                    style={{
                      top: drag.startMin * PX_PER_MINUTE,
                      height: (drag.endMin - drag.startMin) * PX_PER_MINUTE,
                    }}
                  >
                    <p className="px-1 py-0.5 text-[10px] font-medium">
                      {drag.focus ? 'Focus block' : 'New event'} · {format(addMinutes(startOfDay(d), drag.startMin), 'h:mm a')}–{format(addMinutes(startOfDay(d), drag.endMin), 'h:mm a')}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {pendingConflict && (
        <ConflictChip
          targets={pendingConflict.targets}
          onMoveIt={() => {
            calendarStore.moveEvent(
              pendingConflict.eventId,
              pendingConflict.newStart,
              pendingConflict.newEnd,
            );
            setPendingConflict(null);
          }}
          onStackBoth={() => {
            calendarStore.moveEvent(
              pendingConflict.eventId,
              pendingConflict.newStart,
              pendingConflict.newEnd,
            );
            setPendingConflict(null);
          }}
          onCancel={() => setPendingConflict(null)}
        />
      )}
    </div>
  );
}
