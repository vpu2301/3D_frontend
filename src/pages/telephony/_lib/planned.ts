/**
 * Local store for planned outbound work (scheduled calls + call queues).
 *
 * DEMO by design: the backend has no scheduling/queue endpoints yet, so the
 * composer persists here and the Planned page reads from here — the whole
 * flow is clickable end to end without pretending anything dialed. When the
 * endpoints land, this module is the single seam to replace.
 */

export interface PlannedNumber {
  number: string;
  name: string;
}

export interface PlannedCall {
  id: string;
  kind: 'scheduled' | 'queue';
  numbers: PlannedNumber[];
  purpose: string;
  /** "YYYY-MM-DD HH:mm" for scheduled entries. */
  at?: string;
  created: string;
}

const PLANNED_KEY = 'voice.demo.planned';

export function loadPlanned(): PlannedCall[] {
  try {
    return JSON.parse(localStorage.getItem(PLANNED_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function savePlanned(list: PlannedCall[]): void {
  localStorage.setItem(PLANNED_KEY, JSON.stringify(list));
}

export function addPlanned(entry: Omit<PlannedCall, 'id' | 'created'>): PlannedCall[] {
  const next = [
    { ...entry, id: crypto.randomUUID(), created: new Date().toISOString() },
    ...loadPlanned(),
  ];
  savePlanned(next);
  return next;
}

export function removePlanned(id: string): PlannedCall[] {
  const next = loadPlanned().filter((p) => p.id !== id);
  savePlanned(next);
  return next;
}
