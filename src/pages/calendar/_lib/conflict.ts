import { parseUTC } from './time';
import type { CalendarEvent } from './types';

export function overlaps(a: CalendarEvent, b: CalendarEvent): boolean {
  if (a.id === b.id) return false;
  if (a.allDay || b.allDay) return false;
  const as = parseUTC(a.start).getTime();
  const ae = parseUTC(a.end).getTime();
  const bs = parseUTC(b.start).getTime();
  const be = parseUTC(b.end).getTime();
  return as < be && bs < ae;
}

export function findConflicts(
  target: CalendarEvent,
  all: CalendarEvent[],
): CalendarEvent[] {
  return all.filter(e => overlaps(target, e));
}

export function findFocusConflicts(
  target: CalendarEvent,
  all: CalendarEvent[],
): CalendarEvent[] {
  return all.filter(e => e.isFocusBlock && overlaps(target, e));
}

// Lane layout for a day column so overlapping events stack side-by-side.
export interface LaidOutEvent {
  event: CalendarEvent;
  lane: number;
  laneCount: number;
}

export function layoutDay(events: CalendarEvent[]): LaidOutEvent[] {
  const sorted = [...events].sort(
    (a, b) => parseUTC(a.start).getTime() - parseUTC(b.start).getTime(),
  );
  const clusters: CalendarEvent[][] = [];
  for (const e of sorted) {
    const cluster = clusters[clusters.length - 1];
    if (!cluster || !cluster.some(c => overlaps(c, e))) {
      clusters.push([e]);
    } else {
      cluster.push(e);
    }
  }
  const out: LaidOutEvent[] = [];
  for (const cluster of clusters) {
    const lanes: CalendarEvent[][] = [];
    for (const e of cluster) {
      let placed = false;
      for (let i = 0; i < lanes.length; i++) {
        const lane = lanes[i];
        const last = lane[lane.length - 1];
        if (parseUTC(last.end) <= parseUTC(e.start)) {
          lane.push(e);
          out.push({ event: e, lane: i, laneCount: 0 });
          placed = true;
          break;
        }
      }
      if (!placed) {
        lanes.push([e]);
        out.push({ event: e, lane: lanes.length - 1, laneCount: 0 });
      }
    }
    const count = lanes.length;
    for (const laid of out.filter(l => cluster.includes(l.event))) {
      laid.laneCount = count;
    }
  }
  return out;
}
