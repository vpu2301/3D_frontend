import type { Note, NoteLink, LinkType } from './types';

export interface Backlink {
  fromNoteId: string;
  fromNoteTitle: string;
  snippet: string;
  /** The link record on the source note that points to the target. */
  link: NoteLink;
}

/**
 * Compute a map of `targetId` → backlinks pointing at it across all notes.
 * Cheap (O(n*links)); recomputed on note changes.
 */
export function computeBacklinks(notes: Note[]): Map<string, Backlink[]> {
  const map = new Map<string, Backlink[]>();
  for (const note of notes) {
    if (note.trashed) continue;
    for (const link of note.links ?? []) {
      const key = `${link.type}:${link.targetId}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({
        fromNoteId: note.id,
        fromNoteTitle: deriveTitle(note),
        snippet: deriveSnippet(note),
        link,
      });
    }
  }
  return map;
}

export function backlinksFor(
  map: Map<string, Backlink[]>,
  type: LinkType,
  targetId: string,
): Backlink[] {
  return map.get(`${type}:${targetId}`) ?? [];
}

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
