/**
 * Shapes and time helpers for planned outbound calls.
 *
 * This used to be a localStorage store standing in for endpoints that did not
 * exist. `GET/POST/DELETE /api/voice/calls/scheduled` do exist and the server
 * dials what they hold, so the persistence is gone and what remains is the row
 * shape the Planned screen renders plus the clock arithmetic the composer and
 * that screen share.
 */

export interface PlannedNumber {
  number: string;
  name: string;
}

export interface PlannedCall {
  id: string;
  kind: 'scheduled';
  numbers: PlannedNumber[];
  purpose: string;
  /** When the server will place the call. */
  at?: string;
  created: string;
}

/**
 * Minutes from now as a local "YYYY-MM-DD HH:mm" — the format the composer
 * sends. Local on purpose: a call is scheduled against the wall clock of the
 * person scheduling it.
 */
export function stampIn(minutes: number, now = new Date()): string {
  const at = new Date(now.getTime() + minutes * 60_000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())} ${pad(at.getHours())}:${pad(at.getMinutes())}`;
}

/** `<input type="datetime-local">` gives "YYYY-MM-DDTHH:mm"; the API wants a space. */
export const fromLocalInput = (value: string) => value.replace('T', ' ');

/** "in 25 min" / "in 1 h 40 min" — how far off a stored moment is. */
export function leadTimeLabel(at: string, now = new Date()): string {
  // Two shapes reach this: the local "YYYY-MM-DD HH:mm" the composer builds,
  // and the UTC ISO the server answers with. Date handles both once the space
  // is a T; only the space form is ambiguous, and it means local.
  const target = new Date(at.includes('T') ? at : at.replace(' ', 'T'));
  if (isNaN(target.getTime())) return '';
  const minutes = Math.round((target.getTime() - now.getTime()) / 60_000);
  if (minutes < 0) return 'overdue';
  if (minutes < 1) return 'now';
  if (minutes < 60) return `in ${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `in ${h} h ${m} min` : `in ${h} h`;
}

