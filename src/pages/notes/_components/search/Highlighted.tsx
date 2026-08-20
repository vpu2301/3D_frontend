/**
 * A server snippet, rendered safely.
 *
 * The whole component is four lines because that is the point: the snippet is
 * split into plain-text segments by `_lib/highlight.ts` and rendered as React
 * text nodes, which React escapes. There is no `dangerouslySetInnerHTML` in the
 * notes module and `searchGates.test.ts` fails the build if one appears — a
 * `ts_headline` snippet is note content with markers in it, and note content is
 * whatever the user typed.
 */

import { parseHighlight } from '@/pages/notes/_lib/highlight';

export default function Highlighted({ snippet }: { snippet: string | null | undefined }) {
  const segments = parseHighlight(snippet);
  if (segments.length === 0) return null;

  return (
    <>
      {segments.map((segment, index) =>
        segment.match ? (
          <mark key={index} className="rounded-[4px] bg-[var(--sand-deep)] px-0.5 text-[var(--ink)]">
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
