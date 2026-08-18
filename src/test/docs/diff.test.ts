import { describe, it, expect } from 'vitest';
import { wordDiff, lineDiff, diffStats } from '@/pages/docs/_lib/diff';

describe('wordDiff', () => {
  it('marks identical text as equal', () => {
    const segs = wordDiff('hello world', 'hello world');
    expect(segs).toHaveLength(1);
    expect(segs[0].type).toBe('equal');
    expect(segs[0].value).toBe('hello world');
  });

  it('detects an inserted word', () => {
    const segs = wordDiff('hello world', 'hello big world');
    const added = segs.filter((s) => s.type === 'added');
    expect(added.length).toBeGreaterThan(0);
    expect(added.some((s) => s.value.includes('big'))).toBe(true);
  });

  it('detects a removed word', () => {
    const segs = wordDiff('hello cruel world', 'hello world');
    const removed = segs.filter((s) => s.type === 'removed');
    expect(removed.some((s) => s.value.includes('cruel'))).toBe(true);
  });

  it('handles full replacement', () => {
    const segs = wordDiff('foo', 'bar');
    expect(segs.some((s) => s.type === 'removed' && s.value.includes('foo'))).toBe(true);
    expect(segs.some((s) => s.type === 'added' && s.value.includes('bar'))).toBe(true);
  });
});

describe('lineDiff', () => {
  it('compares multi-line content', () => {
    const a = 'line one\nline two\nline three';
    const b = 'line one\nline 2\nline three';
    const segs = lineDiff(a, b);
    expect(segs.some((s) => s.type === 'added')).toBe(true);
    expect(segs.some((s) => s.type === 'removed')).toBe(true);
  });
});

describe('diffStats', () => {
  it('counts characters added and removed', () => {
    const segs = wordDiff('hello world', 'hello big world');
    const { added, removed } = diffStats(segs);
    expect(added).toBeGreaterThan(0);
    expect(removed).toBe(0);
  });

  it('returns zeros for identical text', () => {
    const segs = wordDiff('same text', 'same text');
    const { added, removed } = diffStats(segs);
    expect(added).toBe(0);
    expect(removed).toBe(0);
  });
});
