/**
 * Highlighting the sentence a proposal came from.
 *
 * This is the trust mechanism of FE-2, not a decoration. A lawyer will not
 * accept an obligation they cannot trace, so hovering a proposed task has to
 * light up the exact words in the document that produced it. BE-1 stores the
 * verbatim `quote` for precisely this — and stores it *as well as* the offsets,
 * because offsets rot the moment the paragraph above is edited and a quote can
 * be re-found.
 *
 * So the search here is by text, not by offset. It normalises whitespace and
 * case the same way the backend's hallucination gate does, which means a quote
 * the server accepted as evidence is a quote this can find. When it cannot be
 * found, nothing is highlighted and nothing is scrolled: showing the wrong
 * sentence is worse than showing none.
 */

import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';

export const sourceHighlightKey = new PluginKey<string | null>('notes-source-highlight');

/** A position in the document, in the flattened text the search runs over. */
interface FlatText {
  /** The whole document's text, whitespace-collapsed and lower-cased. */
  text: string;
  /** `positions[i]` is the ProseMirror position of `text[i]`. */
  positions: number[];
}

/**
 * Flatten the document to searchable text.
 *
 * Runs of whitespace collapse to a single space, so a quote spanning a soft
 * wrap or two spaces after a full stop still matches — the same normalisation
 * the server applies before it accepts a quote as evidence.
 */
function flatten(doc: ProseMirrorNode): FlatText {
  let text = '';
  const positions: number[] = [];
  let pendingSpace = false;

  doc.descendants((node, pos) => {
    if (node.isText && node.text) {
      for (let i = 0; i < node.text.length; i++) {
        const char = node.text[i];
        if (/\s/.test(char)) {
          pendingSpace = true;
          continue;
        }
        if (pendingSpace && text.length > 0) {
          text += ' ';
          positions.push(pos + i);
          pendingSpace = false;
        }
        text += char.toLowerCase();
        positions.push(pos + i);
      }
      return false;
    }
    // A block boundary is at least a space, or the last word of one paragraph
    // runs into the first word of the next.
    if (node.isBlock && text.length > 0) pendingSpace = true;
    return true;
  });

  return { text, positions };
}

export function normaliseQuote(quote: string): string {
  return quote.replace(/\s+/g, ' ').trim().toLowerCase();
}

/** Document range for `quote`, or null when it is no longer there. */
export function findQuoteRange(
  doc: ProseMirrorNode,
  quote: string,
): { from: number; to: number } | null {
  const needle = normaliseQuote(quote);
  if (needle.length < 3) return null;

  const flat = flatten(doc);
  const at = flat.text.indexOf(needle);
  if (at === -1) return null;

  const from = flat.positions[at];
  const lastCharPos = flat.positions[at + needle.length - 1];
  if (from === undefined || lastCharPos === undefined) return null;
  return { from, to: lastCharPos + 1 };
}

/**
 * The extension. State is a single quote — one highlight at a time, because the
 * interaction is "hover this row" and two lit sentences answer no question.
 */
export const SourceHighlight = Extension.create({
  name: 'sourceHighlight',

  addProseMirrorPlugins() {
    return [
      new Plugin<string | null>({
        key: sourceHighlightKey,
        state: {
          init: () => null,
          apply(transaction, current) {
            const next = transaction.getMeta(sourceHighlightKey);
            return next === undefined ? current : (next as string | null);
          },
        },
        props: {
          decorations(state) {
            const quote = sourceHighlightKey.getState(state);
            if (!quote) return DecorationSet.empty;
            const range = findQuoteRange(state.doc, quote);
            if (!range) return DecorationSet.empty;
            return DecorationSet.create(state.doc, [
              Decoration.inline(range.from, range.to, {
                class: 'notes-source-highlight',
              }),
            ]);
          },
        },
      }),
    ];
  },
});

/** Light up `quote`, or pass null to clear. Safe to call for a quote that is gone. */
export function setSourceHighlight(view: EditorView, quote: string | null): void {
  view.dispatch(view.state.tr.setMeta(sourceHighlightKey, quote));
}

/**
 * Scroll the document to `quote` and light it up. Returns false when the quote
 * is no longer in the note, so the caller can say "the source text changed"
 * rather than leaving the user staring at an unmoved page.
 */
export function scrollToQuote(view: EditorView, quote: string): boolean {
  const range = findQuoteRange(view.state.doc, quote);
  if (!range) return false;

  setSourceHighlight(view, quote);
  const coords = view.domAtPos(range.from);
  const element =
    coords.node.nodeType === Node.TEXT_NODE ? coords.node.parentElement : (coords.node as HTMLElement);
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return true;
}
