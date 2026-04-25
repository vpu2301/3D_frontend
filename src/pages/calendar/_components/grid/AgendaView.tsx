import { useMemo } from 'react';
import { format } from 'date-fns';
import { useCalendar } from '../../_hooks/use-calendar-store';
import { parseUTC, weekRange } from '../../_lib/time';
import type { CalendarEvent } from '../../_lib/types';
import { EventChip } from '../event/EventChip';

export function AgendaView({
  anchor,
  onEventClick,
}: {
  anchor: Date;
  onEventClick: (e: CalendarEvent) => void;
}) {
  const events = useCalendar(s => s.events);
  const calendars = useCalendar(s => s.calendars);
  const range = useMemo(() => weekRange(anchor), [anchor]);
  const visibleCalIds = useMemo(
    () => new Set(calendars.filter(c => c.visible).map(c => c.id)),
    [calendars],
  );
  const grouped = useMemo(() => {
    const inRange = events
      .filter(
        e =>
          visibleCalIds.has(e.calendarId) &&
          parseUTC(e.start) <= range.end &&
          parseUTC(e.end) >= range.start,
      )
      .sort((a, b) => parseUTC(a.start).getTime() - parseUTC(b.start).getTime());
    const map = new Map<string, CalendarEvent[]>();
    for (const e of inRange) {
      const key = format(parseUTC(e.start), 'yyyy-MM-dd');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [events, range.end, range.start, visibleCalIds]);

  return (
    <div className="h-full overflow-y-auto px-6 py-4">
      {grouped.size === 0 && (
        <div className="flex h-full items-center justify-center text-sm text-gray-400">
          Nothing scheduled this week.
        </div>
      )}
      {Array.from(grouped.entries()).map(([k, dayEvents]) => {
        const d = new Date(k);
        return (
          <section key={k} className="mb-6">
            <header className="sticky top-0 z-10 -mx-6 border-b border-gray-200/70 bg-white/90 px-6 py-2 backdrop-blur">
              <h2 className="text-sm font-semibold text-gray-800">
                {format(d, 'EEEE, MMMM d')}
              </h2>
            </header>
            <div className="mt-2 space-y-1.5">
              {dayEvents.map(e => (
                <EventChip
                  key={e.id}
                  event={e}
                  calendar={calendars.find(c => c.id === e.calendarId)}
                  variant="agenda"
                  onClick={() => onEventClick(e)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
