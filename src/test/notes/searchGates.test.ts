/**
 * S1 and S7's structural half — the two things FE-3 cannot enforce by review.
 *
 * **One search.** Two search boxes appear organically: one in the palette, one on
 * a page, one in a list panel that filters "just the loaded notes". They behave
 * differently, they disagree, and the user has to work out which is which. The
 * only way that stays fixed is a build gate.
 *
 * **No raw HTML.** Search snippets are `ts_headline` output — note content with
 * markers — and the parser in `_lib/highlight.ts` is only half the guarantee.
 * The other half is that nothing in the module ever hands a string to the DOM.
 */

import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/pages/notes';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(path) ? [path] : [];
  });
}

/** Comments stripped: prose naming a hazard is not the hazard. */
function code(path: string): string {
  return readFileSync(path, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const files = sourceFiles(ROOT).filter((file) => !file.endsWith('api-types.ts'));

describe('S1 — one search entry point', () => {
  it('has exactly one page that queries the search endpoint', () => {
    const callers = files.filter((file) => {
      const source = readFileSync(file, 'utf8');
      return /notesApi\.(search|searchQuery)\s*\(/.test(source);
    });
    // `NotesSearch.tsx` and nothing else. The palette hands its query over.
    //
    // The AI panel used to be the second caller: its empty state searched as
    // you typed. FE-5 §4 replaced that with the recent-questions list, so the
    // list is now genuinely one entry long. The panel asks questions; it does
    // not run searches, and retrieval for an answer happens server-side.
    expect(callers.map((f) => f.replace(`${ROOT}/`, '')).sort()).toEqual(['NotesSearch.tsx']);
  });

  it('has no second search input', () => {
    // A text input whose placeholder or label says "search" and which is not the
    // one on the search page or the palette's own command input.
    const allowed = new Set([
      join(ROOT, 'NotesSearch.tsx'),
      join(ROOT, '_components/command/NotesCommandPalette.tsx'),
    ]);
    const offenders = files
      .filter((file) => !allowed.has(file))
      .filter((file) => {
        const source = readFileSync(file, 'utf8');
        return /<input[^>]*(placeholder|aria-label)=["'{][^>]*[Ss]earch/.test(source);
      });
    expect(offenders, offenders.join(', ')).toEqual([]);
  });

  it('keeps the list panel free of a corpus query', () => {
    // The list filters what is loaded. The moment it asks the server for `q=`,
    // it is a second search with different results from the first.
    const list = readFileSync(join(ROOT, '_components/list/NotesList.tsx'), 'utf8');
    expect(list).not.toMatch(/notesApi\.list\([^)]*\bq\b/);
    const toolbar = readFileSync(join(ROOT, '_components/list/NotesListToolbar.tsx'), 'utf8');
    expect(toolbar).not.toContain('setQuery');
  });

  it('has one filter builder — BE-2’s DSL, constructed in one module', () => {
    // Every clause is built by `_lib/queryDsl.ts` or by the view builder's own
    // `toQuery`. A third place composing `{ all: [...] }` literals is the start
    // of a second query language.
    const composers = files.filter((file) =>
      /(\ball|\bany):\s*(clauses|\[)/.test(code(file)),
    );
    expect(composers.map((f) => f.replace(`${ROOT}/`, '')).sort()).toEqual([
      '_components/views/ViewBuilder.tsx',
      '_lib/queryDsl.ts',
    ]);
  });
});

describe('S7 — nothing in the module writes raw HTML', () => {
  it('never uses dangerouslySetInnerHTML', () => {
    const offenders = files.filter((file) => code(file).includes('dangerouslySetInnerHTML'));
    expect(offenders, offenders.join(', ')).toEqual([]);
  });

  it('never assigns innerHTML or outerHTML', () => {
    const offenders = files.filter((file) => /\.(inner|outer)HTML\s*=/.test(code(file)));
    expect(offenders, offenders.join(', ')).toEqual([]);
  });

  it('renders every server snippet through the parser', () => {
    // A component that reads `.snippet` and is not using `Highlighted` renders
    // it as a plain text node, which is also safe — what must not exist is a
    // third path. This asserts the search page uses the parser.
    const page = readFileSync(join(ROOT, 'NotesSearch.tsx'), 'utf8');
    expect(page).toContain('<Highlighted snippet={item.snippet} />');
  });
});
