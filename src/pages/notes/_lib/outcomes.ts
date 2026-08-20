/**
 * Everything about outcomes that is a pure function of one, kept out of the
 * components so the rules can be read and tested in one place.
 *
 * The rule that matters most here is the **due bucket**. It decides what lands
 * under "Overdue" — the heading a lawyer scans first and the number the sidebar
 * badge is about — so its arithmetic is done in calendar days rather than in
 * milliseconds. `now + 7 * 86_400_000` is wrong twice a year, and the week it is
 * wrong is the week the app tells someone a Friday deadline is next Saturday.
 */

import type { Outcome } from '@/pages/notes/_lib/apiClient';

export type DueBucket = 'overdue' | 'today' | 'week' | 'later' | 'none';

export const DUE_BUCKET_LABELS: Record<DueBucket, string> = {
  overdue: 'Overdue',
  today: 'Today',
  week: 'This week',
  later: 'Later',
  none: 'No date',
};

/** The order the Open Items page renders them in — urgency first. */
export const DUE_BUCKET_ORDER: DueBucket[] = ['overdue', 'today', 'week', 'later', 'none'];

/** Midnight local, via calendar fields — `setHours` is DST-correct, subtraction is not. */
export function startOfDay(at: number | Date): Date {
  const date = new Date(at);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** `days` calendar days on, which is 23, 24 or 25 hours depending on the date. */
export function addDays(at: number | Date, days: number): Date {
  const date = new Date(at);
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Day granularity throughout, deliberately.
 *
 * Due dates come from phrases — "nächsten Freitag", "Ende des Monats" — that the
 * server resolves to a day. Treating a task due today at 09:00 as overdue at
 * 09:01 would turn the badge into an alarm clock for a date nobody meant that
 * precisely. Anything due before today is overdue; anything due today is today.
 *
 * The sidebar badge does **not** use this: it shows the server's `summary.mine
 * .overdue`, so the number the user acts on is the server's, not a re-derivation.
 */
export function dueBucket(dueAt: number | null | undefined, now: number = Date.now()): DueBucket {
  if (dueAt === null || dueAt === undefined) return 'none';
  const due = startOfDay(dueAt).getTime();
  const today = startOfDay(now).getTime();
  if (due < today) return 'overdue';
  if (due === today) return 'today';
  // "This week" is the next seven days, not the calendar week: a Monday morning
  // showing only two days of work is the same complaint every time.
  if (due < addDays(today, 7).setHours(0, 0, 0, 0)) return 'week';
  return 'later';
}

/**
 * The date as text, carrying the urgency itself.
 *
 * Colour is never the only signal (it fails for the ~8 % of men with a colour
 * deficiency, and in every printout), so "Overdue · 3 Aug" says it in words.
 */
export function formatDue(
  outcome: Pick<Outcome, 'dueAt' | 'dueText'>,
  now: number = Date.now(),
): string | null {
  if (outcome.dueAt === null || outcome.dueAt === undefined) {
    // The server keeps the phrase it could not resolve. Showing it is honest and
    // useful — "end of the month" is information, just not a date.
    return outcome.dueText ? `${outcome.dueText} (no date)` : null;
  }

  const bucket = dueBucket(outcome.dueAt, now);
  const date = new Date(outcome.dueAt);
  const short = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

  switch (bucket) {
    case 'overdue': {
      const days = Math.round(
        (startOfDay(now).getTime() - startOfDay(outcome.dueAt).getTime()) / 86_400_000,
      );
      return `Overdue by ${days}d · ${short}`;
    }
    case 'today':
      return 'Today';
    case 'week':
      return date.toLocaleDateString(undefined, { weekday: 'long' });
    default:
      return short;
  }
}

/** Tailwind classes for the due text. Redundant with `formatDue`'s words, on purpose. */
export function dueToneClass(bucket: DueBucket): string {
  switch (bucket) {
    case 'overdue':
      return 'text-[var(--bad-fg)]';
    case 'today':
      return 'text-[var(--warn-fg)]';
    default:
      return 'text-[var(--text-4)]';
  }
}

/**
 * The date input's `value`, in the browser's own calendar day.
 *
 * `toISOString().slice(0, 10)` is the obvious version and it is wrong east of
 * Greenwich in the evening: 22:00 on the 7th in Berlin is the 8th in UTC, and
 * the user watches their date jump a day when they open the editor.
 */
export function toDateInputValue(dueAt: number | null | undefined): string {
  if (dueAt === null || dueAt === undefined) return '';
  const date = new Date(dueAt);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** The inverse: a `yyyy-mm-dd` from the date input, at local noon. */
export function fromDateInputValue(value: string): number | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  // Noon, so a timezone shift in either direction cannot move the calendar day.
  return new Date(year, month - 1, day, 12, 0, 0, 0).getTime();
}

/**
 * Low-confidence proposals are the ones a human should look at rather than wave
 * through, so they are the only ones not pre-checked. The threshold is a
 * judgement call, set where the model's own score stops correlating with
 * correctness; the server's own precision gate is the real defence.
 */
export const LOW_CONFIDENCE = 0.6;

export function isLowConfidence(outcome: Pick<Outcome, 'confidence'>): boolean {
  return typeof outcome.confidence === 'number' && outcome.confidence < LOW_CONFIDENCE;
}

export function isOrphaned(outcome: Pick<Outcome, 'anchor'>): boolean {
  return outcome.anchor?.state === 'orphaned';
}

/** "me" as the server resolved it, for a chip that should not shout the user's own name. */
export function ownerLabel(owed: string | null | undefined): string {
  if (!owed) return 'Unassigned';
  return /^(me|ich)$/i.test(owed.trim()) ? 'Me' : owed;
}

export function groupByDue(
  outcomes: Outcome[],
  now: number = Date.now(),
): Array<{ bucket: DueBucket; items: Outcome[] }> {
  const groups = new Map<DueBucket, Outcome[]>();
  for (const outcome of outcomes) {
    const bucket = dueBucket(outcome.dueAt, now);
    const list = groups.get(bucket) ?? [];
    list.push(outcome);
    groups.set(bucket, list);
  }
  for (const list of groups.values()) {
    // Within a bucket: soonest first, then the undated, then newest.
    list.sort((a, b) => (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity) || b.createdAt - a.createdAt);
  }
  return DUE_BUCKET_ORDER.filter((bucket) => groups.has(bucket)).map((bucket) => ({
    bucket,
    items: groups.get(bucket)!,
  }));
}

export const KIND_LABELS: Record<Outcome['kind'], string> = {
  task: 'Task',
  decision: 'Decision',
};
