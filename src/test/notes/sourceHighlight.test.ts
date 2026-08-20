/**
 * O4 — the trust mechanism.
 *
 * Finding the source sentence has to work the way BE-1's hallucination gate
 * works, or a quote the server accepted as evidence is a quote the UI cannot
 * show. And when the paragraph has been rewritten it has to fail *cleanly*:
 * highlighting a plausible-but-different sentence is worse than highlighting
 * nothing, because it puts words in the user's document that they did not write.
 */

import { describe, it, expect } from 'vitest';
import { Node as ProseMirrorNode, Schema } from '@tiptap/pm/model';
import { findQuoteRange, normaliseQuote } from '@/pages/notes/_lib/extensions/sourceHighlight';

/** The smallest schema that reproduces a real note: paragraphs of text. */
const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { content: 'inline*', group: 'block' },
    text: { group: 'inline' },
  },
});

function doc(...paragraphs: string[]): ProseMirrorNode {
  return schema.node(
    'doc',
    null,
    paragraphs.map((text) =>
      schema.node('paragraph', null, text ? [schema.text(text)] : []),
    ),
  );
}

function textAt(node: ProseMirrorNode, range: { from: number; to: number }): string {
  return node.textBetween(range.from, range.to);
}

describe('normaliseQuote', () => {
  it('collapses whitespace and case, exactly as the server gate does', () => {
    expect(normaliseQuote('  Fristverlängerung   BEANTRAGEN\n')).toBe(
      'fristverlängerung beantragen',
    );
  });
});

describe('findQuoteRange', () => {
  it('finds the sentence and returns exactly its span', () => {
    const node = doc('Vorher.', 'Wir beantragen eine Fristverlängerung.', 'Nachher.');
    const range = findQuoteRange(node, 'Wir beantragen eine Fristverlängerung.');
    expect(range).not.toBeNull();
    expect(textAt(node, range!)).toBe('Wir beantragen eine Fristverlängerung.');
  });

  it('matches across a line break and doubled spaces', () => {
    // The model quotes what it read; the document has whatever whitespace the
    // typist left. Both normalise to the same thing.
    const node = doc('Wir beantragen  eine\nFristverlängerung.');
    const range = findQuoteRange(node, 'Wir beantragen eine Fristverlängerung.');
    expect(range).not.toBeNull();
  });

  it('is case-insensitive', () => {
    const node = doc('Gutachten liefern bis Freitag.');
    expect(findQuoteRange(node, 'GUTACHTEN LIEFERN')).not.toBeNull();
  });

  it('finds a quote that has moved to another paragraph', () => {
    // Offsets rot; the quote does not. This is the whole reason BE-1 stores it.
    const node = doc('New opening paragraph.', 'Filler.', 'Unterlagen an Weber senden.');
    const range = findQuoteRange(node, 'Unterlagen an Weber senden.');
    expect(textAt(node, range!)).toBe('Unterlagen an Weber senden.');
  });

  it('returns null when the sentence is gone, rather than the nearest thing', () => {
    const node = doc('The paragraph was rewritten entirely.');
    expect(findQuoteRange(node, 'Unterlagen an Weber senden.')).toBeNull();
  });

  it('refuses a quote too short to be evidence', () => {
    // BE-1 refuses anything under 12 characters as an anchor for the same
    // reason: "ok" appears everywhere and points at nothing.
    const node = doc('ok');
    expect(findQuoteRange(node, 'ok')).toBeNull();
  });

  it('does not run words together across a paragraph boundary', () => {
    // "…senden." + "Weber…" must not match the invented quote "senden Weber",
    // which exists in neither paragraph.
    const node = doc('Unterlagen senden.', 'Weber bestätigt.');
    expect(findQuoteRange(node, 'senden.Weber')).toBeNull();
    // The same words with the boundary treated as a space do match, which is
    // what a quote spanning two blocks legitimately looks like.
    expect(findQuoteRange(node, 'senden. Weber bestätigt.')).not.toBeNull();
  });
});
