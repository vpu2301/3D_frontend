import { useMemo } from 'react';
import { addMinutes, format, isSameMonth, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCalendar } from '../../_hooks/use-calendar-store';
import { eventOverlapsDay, monthGrid, parseUTC } from '../../_lib/time';
import type { CalendarEvent } from '../../_lib/types';
import { EventChip } from '../event/EventChip';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface MonthViewProps {
  anchor: Date;
  onEventClick: (e: CalendarEvent) => void;
  onCreateDraft?: (draft: Omit<CalendarEvent, 'id'>) => void;
}

export function MonthView({ anchor, onEventClick, onCreateDraft }: MonthViewProps) {
  const events = useCalendar(s => s.events);
  const calendars = useCalendar(s => s.calendars);
  const visibleCalIds = useMemo(
    () => new Set(calendars.filter(c => c.visible).map(c => c.id)),
    [calendars],
  );
  const days = useMemo(() => monthGrid(anchor), [anchor]);

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-7 border-b border-[var(--line-soft)]">
        {WEEKDAYS.map(d => (
          <div key={d} className="plat-eyebrow px-2 py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-7 overflow-y-auto" style={{ gridAutoRows: 'minmax(100px, 1fr)' }}>
        {days.map(day => {
          const inMonth = isSameMonth(day, anchor);
          const today = isSameDay(day, new Date());
          const dayEvents = events
            .filter(e => visibleCalIds.has(e.calendarId) && eventOverlapsDay(e, day))
            .sort((a, b) => parseUTC(a.start).getTime() - parseUTC(b.start).getTime())
            .slice(0, 4);
          return (
            <div
              key={day.toISOString()}
              role={onCreateDraft ? 'button' : undefined}
              tabIndex={onCreateDraft ? 0 : undefined}
              onClick={() => {
                if (!onCreateDraft) return;
                const defaultCal = calendars.find(c => c.visible && !c.name.toLowerCase().includes('focus'))
                  ?? calendars[0];
                if (!defaultCal) return;
                const start = new Date(day);
                start.setHours(9, 0, 0, 0);
                onCreateDraft({
                  calendarId: defaultCal.id,
                  title: '',
                  start: start.toISOString(),
                  end: addMinutes(start, 60).toISOString(),
                });
              }}
              className={cn(
                'flex flex-col gap-0.5 border-b border-r border-[var(--line-soft)] p-1 transition',
                !inMonth && 'bg-[rgba(20,22,26,0.02)]',
                onCreateDraft && 'cursor-pointer hover:bg-[rgba(20,22,26,0.03)]',
              )}
            >
              <span
                className={cn(
                  'ml-auto inline-flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px]',
                  today
                    ? 'bg-[var(--ink)] font-semibold text-white'
                    : inMonth
                      ? 'text-[var(--ink)]'
                      : 'text-[var(--text-5)]',
                )}
                style={{ fontFamily: 'var(--display)', letterSpacing: '-0.02em' }}
              >
                {format(day, 'd')}
              </span>
              <div className="space-y-0.5 overflow-hidden">
                {dayEvents.map(e => (
                  <EventChip
                    key={e.id}
                    event={e}
                    calendar={calendars.find(c => c.id === e.calendarId)}
                    variant="month"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onEventClick(e);
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
