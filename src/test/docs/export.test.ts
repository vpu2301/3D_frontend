import { describe, it, expect } from 'vitest';
import { toMarkdown, toHtml, toPlainText } from '@/pages/docs/_lib/export';

const sampleDoc = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Title' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Some ', marks: [] }, { type: 'text', text: 'bold', marks: [{ type: 'bold' }] }, { type: 'text', text: ' text.' }] },
    {
      type: 'bulletList',
      content: [
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'one' }] }] },
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'two' }] }] },
      ],
    },
  ],
};

describe('toMarkdown', () => {
  it('emits a heading with the right level', () => {
    const md = toMarkdown(sampleDoc as any);
    expect(md).toMatch(/^# Title/);
  });

  it('preserves bold marks', () => {
    const md = toMarkdown(sampleDoc as any);
    expect(md).toContain('**bold**');
  });

  it('emits bulleted list lines starting with -', () => {
    const md = toMarkdown(sampleDoc as any);
    expect(md).toMatch(/- one/);
    expect(md).toMatch(/- two/);
  });
});

describe('toHtml', () => {
  it('wraps in a doctype + body', () => {
    const html = toHtml(sampleDoc as any, 'Test');
    expect(html).toMatch(/<!doctype html>/i);
    expect(html).toContain('<body>');
    expect(html).toContain('<h1>Title</h1>');
  });

  it('escapes html in text', () => {
    const doc = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '<script>' }] }] };
    const html = toHtml(doc as any);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});

describe('toPlainText', () => {
  it('returns a flat plain-text rendering', () => {
    const text = toPlainText(sampleDoc as any);
    expect(text).toContain('Title');
    expect(text).toContain('one');
    expect(text).toContain('two');
  });
});
