/**
 * The diff behind the approval card, and the frame batcher behind streaming.
 *
 * Both are small enough to look obviously correct and are tested anyway,
 * because the diff decides what a person believes they are approving.
 */

import { describe, expect, it, vi } from 'vitest';
import { lineDiff, diffStats, withContext } from '@/pages/notes/_lib/lineDiff';
import { createFrameBatcher } from '@/pages/notes/_lib/rafBatch';
import { toCsv } from '@/pages/notes/_lib/csv';

describe('lineDiff', () => {
  it('reports an unchanged document as entirely equal', () => {
    const lines = lineDiff('a\nb', 'a\nb');
    expect(lines.every((l) => l.op === 'equal')).toBe(true);
    expect(diffStats(lines)).toEqual({ added: 0, removed: 0 });
  });

  it('marks an inserted line without disturbing its neighbours', () => {
    const lines = lineDiff('a\nc', 'a\nb\nc');
    expect(lines.map((l) => `${l.op}:${l.text}`)).toEqual(['equal:a', 'add:b', 'equal:c']);
  });

  it('marks a deleted line', () => {
    expect(diffStats(lineDiff('a\nb\nc', 'a\nc'))).toEqual({ added: 0, removed: 1 });
  });

  it('reads a modified line as one removal and one addition', () => {
    expect(diffStats(lineDiff('a\nb', 'a\nB'))).toEqual({ added: 1, removed: 1 });
  });

  it('treats creation from nothing as all additions', () => {
    expect(diffStats(lineDiff('', 'a\nb'))).toEqual({ added: 2, removed: 0 });
  });

  it('normalises CRLF so a line-ending change is not a whole-file rewrite', () => {
    // Without this, a note saved by a Windows client would show every line as
    // changed, and the approval card would be unreadable at exactly the moment
    // it matters.
    expect(diffStats(lineDiff('a\r\nb', 'a\nb'))).toEqual({ added: 0, removed: 0 });
  });
});

describe('withContext', () => {
  it('elides long unchanged runs and marks where they were', () => {
    const before = Array.from({ length: 40 }, (_, i) => `line ${i}`).join('\n');
    const after = before.replace('line 20', 'line 20 changed');

    const shown = withContext(lineDiff(before, after), 2);
    // The change and its context survive; the rest is collapsed and *marked*,
    // because silently omitting content from a diff someone is about to approve
    // is the trust failure the card exists to avoid.
    expect(shown.filter((l) => l === null).length).toBeGreaterThan(0);
    expect(shown.some((l) => l?.text === 'line 20 changed')).toBe(true);
    expect(shown.length).toBeLessThan(20);
  });

  it('leaves a short diff alone', () => {
    const shown = withContext(lineDiff('a\nb', 'a\nB'), 3);
    expect(shown.includes(null)).toBe(false);
  });
});

describe('createFrameBatcher', () => {
  it('coalesces many pushes into one publish per frame', async () => {
    vi.useFakeTimers();
    const published: string[] = [];
    const batcher = createFrameBatcher<string>((v) => published.push(v));

    // A burst of tokens between two paints must cost one render, not 1000.
    for (let i = 0; i < 1000; i++) batcher.push(`chunk ${i}`);
    expect(published).toEqual([]);

    await vi.advanceTimersByTimeAsync(32);
    expect(published).toEqual(['chunk 999']);
    vi.useRealTimers();
  });

  it('flush publishes the pending value at once', () => {
    const published: string[] = [];
    const batcher = createFrameBatcher<string>((v) => published.push(v));
    batcher.push('final');
    batcher.flush();
    // The end of a stream cannot wait for a frame that may never come — a
    // background tab does not fire rAF at all.
    expect(published).toEqual(['final']);
  });

  it('cancel drops the pending value', async () => {
    vi.useFakeTimers();
    const published: string[] = [];
    const batcher = createFrameBatcher<string>((v) => published.push(v));
    batcher.push('dropped');
    batcher.cancel();
    await vi.advanceTimersByTimeAsync(32);
    expect(published).toEqual([]);
    vi.useRealTimers();
  });

  it('flush after cancel publishes nothing', () => {
    const published: string[] = [];
    const batcher = createFrameBatcher<string>((v) => published.push(v));
    batcher.push('x');
    batcher.cancel();
    batcher.flush();
    expect(published).toEqual([]);
  });
});

describe('toCsv', () => {
  it('quotes a field containing a newline so columns do not shift', () => {
    // A rejection reason with a newline in it, which is the realistic case.
    const csv = toCsv(['a', 'b'], [['plain', 'two\nlines']]);
    expect(csv).toBe('a,b\r\nplain,"two\nlines"');
  });

  it('escapes embedded quotes by doubling them', () => {
    expect(toCsv(['a'], [['say "hi"']])).toBe('a\r\n"say ""hi"""');
  });

  it('renders null and undefined as empty rather than the words', () => {
    expect(toCsv(['a', 'b'], [[null, undefined]])).toBe('a,b\r\n,');
  });
});
