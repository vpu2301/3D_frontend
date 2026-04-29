import { describe, it, expect } from 'vitest';
import { computeBacklinks, deriveTitle, deriveSnippet, extractInlineTags, deriveFullText } from '@/pages/notes/_lib/backlinks';
import type { Note } from '@/pages/notes/_lib/types';

const mk = (overrides: Partial<Note>): Note => ({
  id: 'n1',
  content: { type: 'doc', content: [{ type: 'paragraph' }] },
  notebookId: null,
  tags: [],
  pinned: false,
  trashed: false,
  reminders: [],
  links: [],
  createdAt: 0,
  updatedAt: 0,
  ...overrides,
});

describe('deriveTitle', () => {
  it('uses explicit title when set', () => {
    expect(deriveTitle(mk({ title: 'Explicit' }))).toBe('Explicit');
  });
  it('falls back to first H1', () => {
    const note = mk({
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'From H1' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'body' }] },
        ],
      },
    });
    expect(deriveTitle(note)).toBe('From H1');
  });
  it('falls back to first non-empty line if no H1', () => {
    const note = mk({
      content: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Just a thought' }] }],
      },
    });
    expect(deriveTitle(note)).toBe('Just a thought');
  });
  it('returns "Untitled" for empty notes', () => {
    expect(deriveTitle(mk({}))).toBe('Untitled');
  });
});

describe('computeBacklinks', () => {
  it('builds a target → backlinks map', () => {
    const a = mk({ id: 'a', title: 'A', links: [{ type: 'note', targetId: 'b' }] });
    const b = mk({ id: 'b', title: 'B', links: [] });
    const map = computeBacklinks([a, b]);
    expect(map.get('note:b')).toHaveLength(1);
    expect(map.get('note:b')![0].fromNoteId).toBe('a');
    expect(map.get('note:a')).toBeUndefined();
  });

  it('skips trashed notes', () => {
    const a = mk({ id: 'a', trashed: true, links: [{ type: 'note', targetId: 'b' }] });
    const b = mk({ id: 'b' });
    const map = computeBacklinks([a, b]);
    expect(map.get('note:b')).toBeUndefined();
  });

  it('keys backlinks by link type', () => {
    const a = mk({
      id: 'a',
      title: 'A',
      links: [
        { type: 'note', targetId: 'x' },
        { type: 'doc', targetId: 'x' },
      ],
    });
    const map = computeBacklinks([a]);
    expect(map.get('note:x')).toHaveLength(1);
    expect(map.get('doc:x')).toHaveLength(1);
  });
});

describe('extractInlineTags', () => {
  it('finds #tags in plain content', () => {
    const note = mk({
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'thinking about #product and #engineering today' }],
          },
        ],
      },
    });
    expect(extractInlineTags(note)).toEqual(['product', 'engineering']);
  });
  it('deduplicates while preserving order', () => {
    const note = mk({
      content: {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: '#a #b #a' }] },
        ],
      },
    });
    expect(extractInlineTags(note)).toEqual(['a', 'b']);
  });
});

describe('deriveSnippet', () => {
  it('joins text from successive blocks up to max length', () => {
    const note = mk({
      content: {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'First.' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Second.' }] },
        ],
      },
    });
    const s = deriveSnippet(note, 80);
    expect(s).toContain('First.');
    expect(s).toContain('Second.');
  });
});

describe('deriveFullText', () => {
  it('flattens all text content', () => {
    const note = mk({
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Title' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Body.' }] },
        ],
      },
    });
    const t = deriveFullText(note);
    expect(t).toContain('Title');
    expect(t).toContain('Body.');
  });
});
