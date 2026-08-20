/**
 * F16 — command coverage.
 *
 * The claim FE-1 makes is that the command palette is *the* entry point to
 * every action in /notes. A claim like that decays the moment someone adds a
 * button and forgets, and it decays invisibly: the button works, so nothing
 * looks broken, and the palette is quietly no longer complete.
 *
 * So it is a build gate. Every `<button>` under `src/pages/notes/` must carry
 * either:
 *
 *   - `data-command="<id>"`, where the id exists in the registry — the button
 *     is that action's on-screen form; or
 *   - `data-command-exempt="<reason>"` — a considered statement that this
 *     control is not an action (a disclosure triangle, a row selection, an
 *     argument for a command that is itself in the registry).
 *
 * The exemption is deliberately a sentence rather than a boolean. `exempt` with
 * no reason is how a gate becomes a formality.
 */

import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { COMMANDS_BY_ID, NOTE_COMMANDS } from '@/pages/notes/_lib/commands';

const ROOT = 'src/pages/notes';

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return tsxFiles(path);
    return path.endsWith('.tsx') ? [path] : [];
  });
}

/** Every `<button` … `>` opening tag in a file, with its line number. */
function buttonTags(source: string): Array<{ tag: string; line: number }> {
  const out: Array<{ tag: string; line: number }> = [];
  const pattern = /<button\b/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    // Walk to the end of the opening tag. Attribute values in this codebase do
    // not contain a bare `>` outside braces, and the brace depth handles JSX
    // expressions like `className={cn(a > b)}`.
    let depth = 0;
    let index = match.index;
    for (; index < source.length; index++) {
      const char = source[index];
      if (char === '{') depth++;
      else if (char === '}') depth--;
      else if (char === '>' && depth === 0) break;
    }
    out.push({
      tag: source.slice(match.index, index + 1),
      line: source.slice(0, match.index).split('\n').length,
    });
  }
  return out;
}

describe('the command registry', () => {
  it('has unique ids', () => {
    const ids = NOTE_COMMANDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has no two commands on the same shortcut', () => {
    const bound = NOTE_COMMANDS.filter((c) => c.shortcut).map((c) => c.shortcut);
    expect(new Set(bound).size).toBe(bound.length);
  });

  it('gives every command a label and a group', () => {
    for (const command of NOTE_COMMANDS) {
      expect(command.label.length, command.id).toBeGreaterThan(0);
      expect(command.group, command.id).toBeTruthy();
    }
  });
});

describe('F16 — every action-bearing button is in the registry', () => {
  const files = tsxFiles(ROOT);

  it('finds the notes module', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it('has no unannotated button', () => {
    const offenders: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      for (const { tag, line } of buttonTags(source)) {
        const command = /data-command="([^"]+)"/.exec(tag);
        const exempt = /data-command-exempt="([^"]+)"/.exec(tag);

        if (command) {
          if (!COMMANDS_BY_ID[command[1]]) {
            offenders.push(`${file}:${line} — data-command="${command[1]}" is not in the registry`);
          }
          continue;
        }
        if (exempt) {
          if (exempt[1].trim().length < 15) {
            offenders.push(`${file}:${line} — data-command-exempt needs a real reason`);
          }
          continue;
        }
        // A button built from a variable (`data-command={command}`) is annotated
        // by its caller; the prop itself is what this looks for.
        if (/data-command=\{/.test(tag) || /data-command-exempt=\{/.test(tag)) continue;

        offenders.push(`${file}:${line} — button with neither data-command nor data-command-exempt`);
      }
    }

    expect(offenders, `\n${offenders.join('\n')}\n`).toEqual([]);
  });
});
