import { describe, it, expect } from 'vitest';
import { parseQuickAdd, looksLikeNlDate, parseDate } from '@/pages/todo/_lib/nlParse';

describe('parseQuickAdd', () => {
  it('extracts a plain title', () => {
    const r = parseQuickAdd('buy milk');
    expect(r.title).toBe('buy milk');
    expect(r.priority).toBeUndefined();
    expect(r.tags).toEqual([]);
  });

  it('extracts !1 priority', () => {
    const r = parseQuickAdd('finish report !1');
    expect(r.title).toBe('finish report');
    expect(r.priority).toBe(1);
  });

  it('extracts p2 priority', () => {
    const r = parseQuickAdd('p2 review pr');
    expect(r.priority).toBe(2);
  });

  it('extracts tags', () => {
    const r = parseQuickAdd('email Sam #work #followup');
    expect(r.tags).toEqual(['work', 'followup']);
    expect(r.title).toContain('email Sam');
  });

  it('extracts +project against context', () => {
    const r = parseQuickAdd('draft launch comms +q2-launch', {
      projects: [{ id: 'p1', name: 'Q2 launch' } as any],
    });
    expect(r.projectId).toBe('p1');
    expect(r.title).toBe('draft launch comms');
  });

  it('extracts >list against context', () => {
    const r = parseQuickAdd('milk >shopping', {
      lists: [{ id: 'l1', name: 'Shopping' } as any],
    });
    expect(r.listId).toBe('l1');
  });

  it('extracts ~30m estimate', () => {
    const r = parseQuickAdd('quick review ~30m');
    expect(r.estimate).toBe(30);
  });

  it('extracts ~2h estimate', () => {
    const r = parseQuickAdd('deep work ~2h');
    expect(r.estimate).toBe(120);
  });

  it('extracts a chrono date', () => {
    const r = parseQuickAdd('submit tomorrow at 3pm');
    expect(r.dueAt).toBeDefined();
  });

  it('infers urgency to P2 when no explicit priority', () => {
    const r = parseQuickAdd('respond urgent');
    expect(r.priority).toBe(2);
  });

  it('handles all of the above together', () => {
    const r = parseQuickAdd('draft launch comms tomorrow 2pm !1 #comms +q2-launch ~30m', {
      projects: [{ id: 'p1', name: 'Q2 launch' } as any],
    });
    expect(r.title).toBe('draft launch comms');
    expect(r.priority).toBe(1);
    expect(r.tags).toEqual(['comms']);
    expect(r.projectId).toBe('p1');
    expect(r.estimate).toBe(30);
    expect(r.dueAt).toBeDefined();
  });
});

describe('looksLikeNlDate', () => {
  it('returns true for natural-language date strings', () => {
    expect(looksLikeNlDate('tomorrow at 3pm')).toBe(true);
    expect(looksLikeNlDate('next monday')).toBe(true);
  });
  it('returns false for plain text', () => {
    expect(looksLikeNlDate('buy milk')).toBe(false);
  });
});

describe('parseDate', () => {
  it('parses common phrases', () => {
    const d = parseDate('tomorrow at 9am');
    expect(d).toBeInstanceOf(Date);
  });
  it('returns null for non-date', () => {
    expect(parseDate('xkcd')).toBeNull();
  });
});
