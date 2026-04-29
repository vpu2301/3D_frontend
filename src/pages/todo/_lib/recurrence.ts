import type { RecurrenceRule } from './types';

const DAY_MS = 86_400_000;
const DAY_INDEX: Record<string, number> = { su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6 };

/**
 * Compute the next occurrence after `afterMs` for the given rule, anchored at
 * `anchorMs` (the original due date). Returns undefined if the series ended.
 */
export function nextOccurrence(rule: RecurrenceRule, anchorMs: number, afterMs: number): number | undefined {
  if (rule.until && afterMs >= rule.until) return undefined;
  switch (rule.freq) {
    case 'daily': {
      const next = afterMs + rule.interval * DAY_MS;
      return rule.until && next > rule.until ? undefined : next;
    }
    case 'weekly': {
      if (rule.byday && rule.byday.length > 0) {
        const after = new Date(afterMs);
        const days = rule.byday.map((d) => DAY_INDEX[d.toLowerCase()] ?? 1);
        for (let i = 1; i <= 7 * rule.interval; i++) {
          const cand = new Date(after);
          cand.setDate(after.getDate() + i);
          if (days.includes(cand.getDay())) {
            const next = cand.getTime();
            return rule.until && next > rule.until ? undefined : next;
          }
        }
        return undefined;
      }
      const next = afterMs + rule.interval * 7 * DAY_MS;
      return rule.until && next > rule.until ? undefined : next;
    }
    case 'monthly': {
      const d = new Date(anchorMs);
      const offset = afterMs - anchorMs;
      const monthsElapsed = Math.max(0, Math.floor(offset / (30.44 * DAY_MS)));
      const cand = new Date(d);
      cand.setMonth(cand.getMonth() + (monthsElapsed + rule.interval));
      const next = cand.getTime();
      return rule.until && next > rule.until ? undefined : next;
    }
    case 'yearly': {
      const d = new Date(anchorMs);
      const offset = afterMs - anchorMs;
      const yearsElapsed = Math.max(0, Math.floor(offset / (365.25 * DAY_MS)));
      const cand = new Date(d);
      cand.setFullYear(cand.getFullYear() + (yearsElapsed + rule.interval));
      const next = cand.getTime();
      return rule.until && next > rule.until ? undefined : next;
    }
    case 'custom':
      // Mock: treat custom as `every N days`, falling back to anchor + 7 days.
      const next = afterMs + (rule.interval ?? 7) * DAY_MS;
      return rule.until && next > rule.until ? undefined : next;
  }
}

/**
 * Expand a recurring task into virtual instances within [fromMs, toMs].
 * Returns array of due dates (ms epoch). Does not include the anchor itself.
 */
export function expandRecurrence(
  rule: RecurrenceRule,
  anchorMs: number,
  fromMs: number,
  toMs: number,
): number[] {
  const out: number[] = [];
  if (anchorMs >= fromMs && anchorMs <= toMs) out.push(anchorMs);
  let cur = anchorMs;
  // hard cap to prevent infinite loops in misconfigured rules
  for (let i = 0; i < 200; i++) {
    const n = nextOccurrence(rule, anchorMs, cur);
    if (!n) break;
    if (n > toMs) break;
    if (n >= fromMs) out.push(n);
    cur = n;
  }
  return out;
}

export function describeRecurrence(rule: RecurrenceRule): string {
  const every = rule.interval > 1 ? `every ${rule.interval} ` : 'every ';
  switch (rule.freq) {
    case 'daily':
      return rule.interval > 1 ? `${every}days` : 'daily';
    case 'weekly':
      if (rule.byday && rule.byday.length) return `weekly on ${rule.byday.join(', ')}`;
      return rule.interval > 1 ? `${every}weeks` : 'weekly';
    case 'monthly':
      return rule.interval > 1 ? `${every}months` : 'monthly';
    case 'yearly':
      return rule.interval > 1 ? `${every}years` : 'yearly';
    case 'custom':
      return rule.custom ?? 'custom recurrence';
  }
}
