/**
 * Local text derivation for notes.
 *
 * The backlink *computation* that used to live here is gone — the server owns
 * link extraction and answers `GET /v1/notes/{id}/backlinks`, which is correct
 * across the whole corpus instead of only across whatever is loaded (ADR 0003).
 *
 * What stays is title/snippet/tag derivation, deliberately: the list and the
 * editor header show a title on the keystroke, before any round trip. The
 * server derives the same fields (`derivedTitle`, `snippet`) and those win once
 * they arrive.
 */

import type { Note } from './types';

/**
 * Title rules: explicit > first H1 > first non-empty line > "Untitled".
 * Notes are capture-oriented so we never force the user to set a title.
 */
export function deriveTitle(note: Note): string {
  if (note.title?.trim()) return note.title.trim();
  const content = note.content?.content ?? [];
  for (const block of content) {
    if (block.type === 'heading' && block.attrs?.level === 1) {
      const text = (block.content ?? []).map((c) => c.text ?? '').join('');
      if (text.trim()) return text.trim();
    }
  }
  for (const block of content) {
    const text = collectText(block).trim();
    if (text) return text.slice(0, 80);
  }
  return 'Untitled';
}

export function deriveSnippet(note: Note, max = 160): string {
  const content = note.content?.content ?? [];
  const collected: string[] = [];
  for (const block of content) {
    const text = collectText(block).trim();
    if (text) collected.push(text);
    if (collected.join(' ').length > max) break;
  }
  return collected.join(' ').slice(0, max);
}

function collectText(node: any): string {
  if (!node) return '';
  if (node.type === 'text') return node.text ?? '';
  if (!node.content) return '';
  return node.content.map(collectText).join('');
}

/**
 * Parse a note's content for #tags and return the unique set,
 * preserving the order of first appearance.
 */
export function extractInlineTags(note: Note): string[] {
  const text = deriveFullText(note);
  const out: string[] = [];
  const seen = new Set<string>();
  const re = /(?:^|\s)#([a-zA-Z][\w-]{0,63})/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const tag = m[1].toLowerCase();
    if (!seen.has(tag)) {
      out.push(tag);
      seen.add(tag);
    }
  }
  return out;
}

export function deriveFullText(note: Note): string {
  return collectText(note.content);
}
