import { describe, it, expect } from 'vitest';
import { runPreset, generateSummary, generateOutline, ghostComplete, configureMockAi } from '@/pages/docs/_lib/mockAi';

configureMockAi({ failureRate: 0, minLatencyMs: 0, maxLatencyMs: 1 });

async function collect(stream: AsyncIterable<string>): Promise<string> {
  let acc = '';
  for await (const chunk of stream) acc += chunk;
  return acc;
}

describe('runPreset', () => {
  it('shorter actually shrinks the text', async () => {
    const text = 'This is a long sentence that contains many words and clauses and should be shortened.';
    const out = await collect(runPreset('shorter', text));
    expect(out.length).toBeLessThan(text.length);
  });

  it('longer extends the text', async () => {
    const text = 'Short.';
    const out = await collect(runPreset('longer', text));
    expect(out.length).toBeGreaterThan(text.length);
  });

  it('translate-spanish prefixes [ES]', async () => {
    const out = await collect(runPreset('translate-spanish', 'the dog and the cat'));
    expect(out.startsWith('[ES]')).toBe(true);
  });
});

describe('generateSummary', () => {
  it('returns a non-empty summary for non-empty content', async () => {
    const sum = await generateSummary('A document with some content. It has two sentences.');
    expect(sum.length).toBeGreaterThan(0);
  });
});

describe('generateOutline', () => {
  it('extracts headings in document order', async () => {
    const doc = {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'A' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'body' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'B' }] },
      ],
    };
    const outline = await generateOutline(doc as any);
    expect(outline.map((n) => n.text)).toEqual(['A', 'B']);
  });
});

describe('ghostComplete', () => {
  it('returns null for empty/short input', async () => {
    const r = await ghostComplete('');
    expect(r).toBeNull();
  });

  it('returns a string for a longer trailing context', async () => {
    const r = await ghostComplete('This is a sentence that ends with a comma,');
    expect(typeof r === 'string' && r.length > 0).toBe(true);
  });
});
