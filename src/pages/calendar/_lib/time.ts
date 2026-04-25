import {
  addDays,
  addMinutes,
  differenceInMinutes,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export const MINUTES_PER_DAY = 24 * 60;
export const SLOT_MINUTES = 30;           // grid line every 30 min
export const SNAP_MINUTES = 5;            // drag snap
export const PX_PER_MINUTE = 48 / SLOT_MINUTES; // 48px per 30min row = 1.6px/min

export function resolveTimezone(): string {
  if (typeof Intl === 'undefined') return 'UTC';
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function parseUTC(iso: string): Date {
  return parseISO(iso);
}

export function weekRange(anchor: Date): { start: Date; end: Date; days: Date[] } {
  const start = startOfWeek(anchor, { weekStartsOn: 1 });
  const end = endOfWeek(anchor, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return { start, end, days };
}

export function threeDayRange(anchor: Date): { start: Date; end: Date; days: Date[] } {
  const start = startOfDay(anchor);
  const days = [start, addDays(start, 1), addDays(start, 2)];
  return { start, end: endOfDay(days[2]), days };
}

export function dayRange(anchor: Date): { start: Date; end: Date; days: Date[] } {
  const start = startOfDay(anchor);
  return { start, end: endOfDay(start), days: [start] };
}

export function monthGrid(anchor: Date): Date[] {
  const first = startOfWeek(startOfMonth(anchor), { weekStartsOn: 1 });
  const last = endOfWeek(endOfMonth(anchor), { weekStartsOn: 1 });
  const out: Date[] = [];
  let cursor = first;
  while (cursor <= last) {
    out.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return out;
}

export function minutesSinceMidnight(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

export function snapMinutes(total: number, snap = SNAP_MINUTES): number {
  return Math.round(total / snap) * snap;
}

export function eventOverlapsDay(e: { start: string; end: string }, day: Date): boolean {
  const s = parseUTC(e.start);
  const en = parseUTC(e.end);
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);
  return s <= dayEnd && en >= dayStart;
}

export function eventMinutesOnDay(
  e: { start: string; end: string },
  day: Date,
): { topMin: number; heightMin: number } {
  const s = parseUTC(e.start);
  const en = parseUTC(e.end);
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);
  const startClamped = s < dayStart ? dayStart : s;
  const endClamped = en > dayEnd ? dayEnd : en;
  const topMin = Math.max(0, minutesSinceMidnight(startClamped));
  const heightMin = Math.max(15, differenceInMinutes(endClamped, startClamped));
  return { topMin, heightMin };
}

export function formatRange(start: Date, end: Date, view: string): string {
  if (view === 'month') return format(start, 'MMMM yyyy');
  if (view === 'agenda') return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
  if (isSameDay(start, end)) return format(start, 'EEEE, MMMM d, yyyy');
  if (isSameMonth(start, end)) return `${format(start, 'MMM d')} – ${format(end, 'd, yyyy')}`;
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
}

export {
  addDays,
  addMinutes,
  differenceInMinutes,
  endOfDay,
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
};
