/**
 * Turning a server snippet into something safe to render.
 *
 * `ts_headline` returns the note's own text with `<b>…</b>` wrapped around the
 * matched words. That string is **not** safe HTML: everything outside the
 * markers is whatever the user typed, and a note containing
 * `<img src=x onerror=alert(1)>` produces a snippet containing it verbatim.
 * Passing that to `dangerouslySetInnerHTML` would execute it — which is why
 * FE-3's S7 is a release gate rather than a nice-to-have.
 *
 * So the snippet is *parsed*, not injected. This module turns it into a list of
 * plain-text segments, each flagged as a match or not, and the component renders
 * them as React text nodes inside `<mark>` or nothing. React escapes text nodes,
 * so there is no path from note content to executed markup.
 *
 * The parser is deliberately literal about which markers it honours: exactly
 * `<b>` and `</b>`, the defaults `ts_headline` is called with. Any other angle
 * bracket in the string is content and is treated as content.
 */

export interface HighlightSegment {
  text: string;
  match: boolean;
}

const OPEN = '<b>';
const CLOSE = '</b>';

/**
 * Split a `ts_headline` snippet into segments.
 *
 * Unbalanced markers are handled the safe way round: an unclosed `<b>`
 * highlights to the end of the snippet rather than dropping the text, and a
 * stray `</b>` with nothing open is content. Losing the text would be worse
 * than losing the emphasis.
 */
export function parseHighlight(snippet: string | null | undefined): HighlightSegment[] {
  if (!snippet) return [];

  const segments: HighlightSegment[] = [];
  let index = 0;
  let inMatch = false;
  let buffer = '';

  const flush = () => {
    if (buffer) segments.push({ text: buffer, match: inMatch });
    buffer = '';
  };

  while (index < snippet.length) {
    if (snippet.startsWith(OPEN, index)) {
      flush();
      inMatch = true;
      index += OPEN.length;
      continue;
    }
    if (snippet.startsWith(CLOSE, index)) {
      flush();
      inMatch = false;
      index += CLOSE.length;
      continue;
    }
    buffer += snippet[index];
    index += 1;
  }
  flush();

  return segments;
}

/** The snippet as plain text, markers removed — for titles, `aria-label`s and tests. */
export function stripHighlight(snippet: string | null | undefined): string {
  return parseHighlight(snippet)
    .map((segment) => segment.text)
    .join('');
}
