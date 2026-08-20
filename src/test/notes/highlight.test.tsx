/**
 * S7 — the release gate.
 *
 * `ts_headline` hands back the note's own text with `<b>` around the matches.
 * Everything else in that string is whatever the user typed, so the snippet is
 * an injection vector wearing a highlight. These tests are about one property:
 * no path from note content to executed markup.
 *
 * They test the parser rather than the rendering, plus a render assertion at the
 * end — because React escaping text nodes is the second half of the guarantee,
 * and a future refactor to `dangerouslySetInnerHTML` would keep the parser green
 * while breaking the property. `searchGates.test.ts` covers that half.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { parseHighlight, stripHighlight } from '@/pages/notes/_lib/highlight';
import Highlighted from '@/pages/notes/_components/search/Highlighted';

describe('parseHighlight', () => {
  it('splits a snippet into matched and unmatched text', () => {
    expect(parseHighlight('die <b>Frist</b> läuft ab')).toEqual([
      { text: 'die ', match: false },
      { text: 'Frist', match: true },
      { text: ' läuft ab', match: false },
    ]);
  });

  it('handles several matches', () => {
    const segments = parseHighlight('<b>Frist</b> und <b>Gutachten</b>');
    expect(segments.filter((s) => s.match).map((s) => s.text)).toEqual(['Frist', 'Gutachten']);
  });

  it('keeps the text when a marker is unbalanced', () => {
    // Losing the emphasis is acceptable; losing the words is not.
    expect(stripHighlight('eine <b>offene Frist')).toBe('eine offene Frist');
    expect(stripHighlight('eine offene</b> Frist')).toBe('eine offene Frist');
  });

  it('is empty for an empty snippet', () => {
    expect(parseHighlight('')).toEqual([]);
    expect(parseHighlight(null)).toEqual([]);
    expect(parseHighlight(undefined)).toEqual([]);
  });
});

describe('S7 — note content cannot become markup', () => {
  const hostile = 'siehe <img src=x onerror="alert(1)"> und <script>alert(2)</script>';

  it('treats every other angle bracket as content', () => {
    // Only `<b>` and `</b>` are markers. Everything else is text the user typed.
    expect(stripHighlight(hostile)).toBe(hostile);
  });

  it('renders a hostile snippet as text, with no elements created from it', () => {
    const { container } = render(<Highlighted snippet={`<b>siehe</b> ${hostile}`} />);

    // The dangerous strings are present *as text*…
    expect(container.textContent).toContain('<img src=x onerror="alert(1)">');
    expect(container.textContent).toContain('<script>alert(2)</script>');

    // …and nothing was parsed into an element.
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
    expect(container.innerHTML).not.toContain('<img');
    expect(container.innerHTML).not.toContain('<script');
  });

  it('marks the match and nothing else', () => {
    render(<Highlighted snippet={'die <b>Fristverlängerung</b> ist beantragt'} />);
    const marks = screen.getAllByText('Fristverlängerung');
    expect(marks).toHaveLength(1);
    expect(marks[0].tagName).toBe('MARK');
  });

  it('survives a snippet that is entirely a marker', () => {
    const { container } = render(<Highlighted snippet="<b></b>" />);
    expect(container.textContent).toBe('');
  });
});
