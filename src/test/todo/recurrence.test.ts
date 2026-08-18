import { describe, it, expect } from 'vitest';
import { nextOccurrence, expandRecurrence, describeRecurrence } from '@/pages/todo/_lib/recurrence';

const day = 86_400_000;

describe('nextOccurrence', () => {
  it('daily increments by interval days', () => {
    const anchor = Date.UTC(2026, 3, 1, 9, 0, 0);
    const n = nextOccurrence({ freq: 'daily', interval: 1 }, anchor, anchor);
    expect(n).toBe(anchor + day);
  });

  it('weekly with byday picks the next matching weekday', () => {
    const anchor = new Date(Date.UTC(2026, 3, 6, 9, 0, 0)).getTime(); // Mon
    const n = nextOccurrence({ freq: 'weekly', interval: 1, byday: ['mo', 'we', 'fr'] }, anchor, anchor);
    expect(n).toBeDefined();
    expect(new Date(n!).getUTCDay()).toBe(3); // Wed UTC
  });

  it('respects until', () => {
    const anchor = Date.UTC(2026, 3, 1);
    const n = nextOccurrence({ freq: 'daily', interval: 1, until: anchor }, anchor, anchor);
    expect(n).toBeUndefined();
  });
});

describe('expandRecurrence', () => {
  it('returns occurrences within a range, including the anchor if inside', () => {
    const anchor = Date.UTC(2026, 3, 1);
    const out = expandRecurrence({ freq: 'daily', interval: 1 }, anchor, anchor, anchor + 3 * day);
    expect(out.length).toBe(4); // anchor + 3 daily after
  });
});

describe('describeRecurrence', () => {
  it('describes daily', () => {
    expect(describeRecurrence({ freq: 'daily', interval: 1 })).toBe('daily');
    expect(describeRecurrence({ freq: 'daily', interval: 3 })).toBe('every 3 days');
  });
  it('describes weekly with byday', () => {
    expect(describeRecurrence({ freq: 'weekly', interval: 1, byday: ['mo', 'fr'] })).toContain('mo');
  });
});
