/**
 * O7's arithmetic, and the formatting that carries it.
 *
 * The due bucket decides what lands under "Overdue" — the heading someone scans
 * before their first coffee, and the number the sidebar badge is about. It is
 * therefore the one calculation in FE-2 worth a table-driven test, including
 * across a DST boundary, because `now + 7 * 86_400_000` is wrong twice a year
 * and wrong in the direction that hides a deadline.
 */

import { describe, it, expect } from 'vitest';
import {
  dueBucket,
  formatDue,
  fromDateInputValue,
  groupByDue,
  isLowConfidence,
  ownerLabel,
  startOfDay,
  toDateInputValue,
} from '@/pages/notes/_lib/outcomes';
import type { Outcome } from '@/pages/notes/_lib/apiClient';

const at = (iso: string) => new Date(iso).getTime();

describe('dueBucket', () => {
  const now = at('2026-08-05T14:30:00');

  it('places a date by calendar day, not by elapsed hours', () => {
    expect(dueBucket(at('2026-08-04T23:59:00'), now)).toBe('overdue');
    // Due earlier *today* is still today. A task due "Wednesday" is not overdue
    // at 14:30 on Wednesday, and treating it that way turns the badge into an
    // alarm clock for a date nobody meant that precisely.
    expect(dueBucket(at('2026-08-05T09:00:00'), now)).toBe('today');
    expect(dueBucket(at('2026-08-05T23:00:00'), now)).toBe('today');
  });

  it('calls the next seven days "this week"', () => {
    expect(dueBucket(at('2026-08-06T08:00:00'), now)).toBe('week');
    expect(dueBucket(at('2026-08-11T23:00:00'), now)).toBe('week');
    expect(dueBucket(at('2026-08-12T08:00:00'), now)).toBe('later');
  });

  it('has a bucket for a date the server could not resolve', () => {
    expect(dueBucket(null, now)).toBe('none');
    expect(dueBucket(undefined, now)).toBe('none');
  });

  /**
   * The DST case (O7). In Europe/Berlin, 25 October 2026 is 25 hours long. A
   * bucket computed by adding milliseconds gets the boundary wrong by an hour,
   * which moves the last day of "this week" onto the wrong side of midnight.
   */
  it('is correct across a DST change', () => {
    const before = at('2026-10-23T12:00:00'); // Friday, before the change
    // The seventh day out is 30 October regardless of how many hours the week had.
    expect(dueBucket(at('2026-10-29T09:00:00'), before)).toBe('week');
    expect(dueBucket(at('2026-10-30T09:00:00'), before)).toBe('later');

    // And a date on the long day itself is that day, not the one before it.
    const onTheDay = at('2026-10-25T12:00:00');
    expect(dueBucket(at('2026-10-25T01:30:00'), onTheDay)).toBe('today');
    expect(dueBucket(at('2026-10-24T23:30:00'), onTheDay)).toBe('overdue');
  });

  it('startOfDay lands on local midnight, whatever the offset', () => {
    const midnight = startOfDay(at('2026-10-25T23:59:00'));
    expect(midnight.getHours()).toBe(0);
    expect(midnight.getDate()).toBe(25);
  });
});

describe('formatDue', () => {
  const now = at('2026-08-05T10:00:00');

  it('says the urgency in words, so colour is never the only signal', () => {
    expect(formatDue({ dueAt: at('2026-08-03T10:00:00'), dueText: null }, now)).toMatch(/^Overdue/);
    expect(formatDue({ dueAt: at('2026-08-05T18:00:00'), dueText: null }, now)).toBe('Today');
  });

  it('keeps a phrase the server could not resolve, rather than dropping it', () => {
    // "End of the month" is information. Silently discarding it loses what the
    // person actually wrote.
    expect(formatDue({ dueAt: null, dueText: 'Ende des Monats' }, now)).toContain(
      'Ende des Monats',
    );
  });

  it('says nothing when there is nothing to say', () => {
    expect(formatDue({ dueAt: null, dueText: null }, now)).toBeNull();
  });
});

describe('the date input round-trip', () => {
  it('does not shift a day for a user east of Greenwich in the evening', () => {
    // 22:00 on the 7th in Berlin is the 8th in UTC. `toISOString().slice(0,10)`
    // is the obvious implementation and it makes the date jump.
    const evening = new Date(2026, 7, 7, 22, 0, 0).getTime();
    expect(toDateInputValue(evening)).toBe('2026-08-07');
  });

  it('round-trips through the input value', () => {
    const back = fromDateInputValue('2026-08-07');
    expect(toDateInputValue(back)).toBe('2026-08-07');
  });

  it('treats an empty input as no date, not as the epoch', () => {
    expect(fromDateInputValue('')).toBeNull();
    expect(toDateInputValue(null)).toBe('');
  });
});

describe('presentation rules', () => {
  it('only pre-checks what the model was reasonably sure of', () => {
    expect(isLowConfidence({ confidence: 0.42 })).toBe(true);
    expect(isLowConfidence({ confidence: 0.91 })).toBe(false);
    // No score at all is not a low score — manual items have none.
    expect(isLowConfidence({ confidence: null })).toBe(false);
  });

  it('does not shout the user their own name back', () => {
    expect(ownerLabel('me')).toBe('Me');
    expect(ownerLabel('Ich')).toBe('Me');
    expect(ownerLabel('Müller')).toBe('Müller');
    expect(ownerLabel(null)).toBe('Unassigned');
  });
});

describe('groupByDue', () => {
  const now = at('2026-08-05T10:00:00');
  const outcome = (id: string, dueAt: number | null): Outcome =>
    ({ id, dueAt, createdAt: 1, anchor: { quote: 'q', state: 'anchored' } }) as Outcome;

  it('orders the groups by urgency and the rows by date', () => {
    const groups = groupByDue(
      [
        outcome('later', at('2026-09-01T10:00:00')),
        outcome('undated', null),
        outcome('overdue-2', at('2026-08-01T10:00:00')),
        outcome('overdue-1', at('2026-07-01T10:00:00')),
        outcome('today', at('2026-08-05T20:00:00')),
      ],
      now,
    );

    expect(groups.map((g) => g.bucket)).toEqual(['overdue', 'today', 'later', 'none']);
    expect(groups[0].items.map((i) => i.id)).toEqual(['overdue-1', 'overdue-2']);
  });

  it('omits a bucket with nothing in it rather than showing an empty heading', () => {
    const groups = groupByDue([outcome('a', null)], now);
    expect(groups).toHaveLength(1);
    expect(groups[0].bucket).toBe('none');
  });
});
