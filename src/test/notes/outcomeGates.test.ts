/**
 * O11 — counts are the server's.
 *
 * The overdue badge is, by the sprint's own words, the product's single most
 * valuable pixel: it is the reason someone opens the app when they were not
 * planning to. A number like that must be one the server computed over the whole
 * corpus, not a tally over whatever rows this session happens to hold — the
 * client-side version is right on the fixture and quietly wrong at 20 000
 * outcomes, and nobody notices until someone misses a deadline.
 *
 * So it is a build gate rather than a convention: no component may derive a
 * status count from outcome rows. The one documented exception is the note-list
 * row hint ("3 open"), which lives in the store next to the comment explaining
 * why there is nothing else to ask.
 */

import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/pages/notes';
/** The store is where the one allowed tally lives, with its reasoning attached. */
const ALLOWED = [
  join(ROOT, '_hooks/use-outcomes-store.ts'),
  // Pure presentation helpers: bucketing a list it was handed, never counting a
  // corpus it cannot see.
  join(ROOT, '_lib/outcomes.ts'),
];

/** Comments stripped: prose explaining why something is absent is not its presence. */
function code(path: string): string {
  return readFileSync(path, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(path) ? [path] : [];
  });
}

describe('O11 — no client-side count of obligations', () => {
  const files = sourceFiles(ROOT).filter((file) => !ALLOWED.includes(file));

  it('never filters outcomes by status and takes a length', () => {
    // The shape this catches: `outcomes.filter(o => o.status === 'open').length`
    // anywhere a number is shown to the user.
    const pattern = /status\s*===\s*'(open|overdue|proposed)'[\s\S]{0,120}?\.length/;
    const offenders = files.filter((file) => pattern.test(code(file)));
    expect(offenders, offenders.join(', ')).toEqual([]);
  });

  it('does not count overdue by comparing due dates itself', () => {
    // `dueAt < Date.now()` in a component is a re-derivation of the server's
    // `summary.mine.overdue`, with a different definition of "now".
    const pattern = /dueAt[^\n]{0,40}<[^\n]{0,20}Date\.now\(\)/;
    const offenders = files.filter((file) => pattern.test(code(file)));
    expect(offenders, offenders.join(', ')).toEqual([]);
  });
});

describe('the badge and the tab counts read the summary', () => {
  it('the sidebar badge is summary.mine.overdue', () => {
    const rail = readFileSync(join(ROOT, '_components/sidebar/NotesMiniRail.tsx'), 'utf8');
    expect(rail).toContain('summary?.mine.overdue');
  });

  it('the open-items tabs read summary, not the rendered rows', () => {
    const page = readFileSync(join(ROOT, 'NotesOpenItems.tsx'), 'utf8');
    expect(page).toContain('summary?.mine.open');
    expect(page).toContain('summary?.theirs.open');
    expect(page).toContain('summary?.unconfirmed');
    // The tell-tale of the wrong version.
    expect(page).not.toMatch(/counts\s*=\s*\{[^}]*rows\.length/);
  });
});

/**
 * FE-2 §5 is a specification, not an aspiration: an outcome has text, a person
 * as free text, a due date and a status. The moment one of these words appears
 * in the module, this sprint has started building a task manager inside a notes
 * app, which is the thing it explicitly promised not to do.
 */
describe('§5 — the exclusion list did not ship', () => {
  const excluded = [
    'priority',
    'priorities',
    'subtask',
    'sub-task',
    'dependency',
    'dependencies',
    'recurring',
    'recurrence',
    'kanban',
    'gantt',
    'estimate',
    'storyPoints',
  ];

  it('introduces none of the task-manager concepts', () => {
    // `api-types.ts` is generated from the backend's schema; if a task-manager
    // field ever appears there it is BE's decision to answer for, not FE's.
    const files = sourceFiles(ROOT).filter((file) => !file.endsWith('api-types.ts'));
    const offenders: string[] = [];
    for (const file of files) {
      const source = code(file).toLowerCase();
      for (const word of excluded) {
        // Only where it would be a field or a UI concept, not in prose that
        // explains why it is absent.
        const asIdentifier = new RegExp(`(^|[^a-z])${word}\\s*[:=?]`, 'm');
        if (asIdentifier.test(source)) offenders.push(`${file} — ${word}`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
