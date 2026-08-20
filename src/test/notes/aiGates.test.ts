/**
 * FE-5's build gates — the rules that are file facts rather than behaviour.
 *
 * A1, A3 and A17 are here because each guards a decision that erodes silently.
 * Nobody will ever open a pull request titled "add a second SSE parser" or
 * "put AI on one more surface"; it happens one reasonable-looking commit at a
 * time, and only a gate notices.
 */

import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/pages/notes';
const TESTS = 'src/test/notes';

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

const files = sourceFiles(ROOT);

describe('A1 — the mock AI is gone from /notes', () => {
  /**
   * The spec writes this gate as `grep -r "mockAi" src/` returning nothing.
   * Scoped here to `/notes` deliberately: the Docs mock is still the AI backend
   * for five other apps (docs, todo, contacts, drive, mail) that have no Notes
   * endpoints behind them, and deleting it there would remove working features
   * to satisfy a Notes sprint. What FE-5 actually promised is that the Notes
   * path is real, and that is what this asserts.
   */
  // This file is excluded from its own search: a gate has to name the thing it
  // forbids. Nothing else gets that exemption.
  const scoped = [...files, ...sourceFiles(TESTS)].filter(
    (file) => !file.endsWith('aiGates.test.ts'),
  );

  it('is named nowhere under /notes — not in code, not in a comment', () => {
    // The raw file, not `code()`: a comment explaining how to reach the mock is
    // a signpost back to it, and the point is that there is no way back.
    const offenders = scoped.filter((file) => readFileSync(file, 'utf8').includes('mockAi'));
    expect(offenders, offenders.join(', ')).toEqual([]);
  });

  it('imports nothing at all from the docs mock module', () => {
    const offenders = scoped.filter((file) => /_lib\/mockAi/.test(readFileSync(file, 'utf8')));
    expect(offenders, offenders.join(', ')).toEqual([]);
  });

  it('routes every AI call through the one client', () => {
    const callers = files.filter((file) => /\baiClient\b/.test(code(file)));
    // If this list grows a file that is not an AI surface, an AI call has been
    // added somewhere that does not answer to A17.
    expect(callers.length).toBeGreaterThan(0);
    for (const caller of callers) {
      expect(code(caller)).toMatch(/from '@\/pages\/notes\/_lib\/aiClient'/);
    }
  });
});

describe('A3 — one SSE reader', () => {
  it('has exactly one file that opens a stream reader', () => {
    const readers = files.filter((file) => /\.getReader\s*\(/.test(code(file)));
    expect(readers).toEqual([join(ROOT, '_lib/sse.ts')]);
  });

  it('never reaches for EventSource', () => {
    // It cannot POST, cannot send an auth header, and reconnects on its own —
    // which for a generated answer means a second, different answer.
    const offenders = files.filter((file) => /\bEventSource\b/.test(code(file)));
    expect(offenders, offenders.join(', ')).toEqual([]);
  });

  it('has every event-stream consumer go through the shared reader', () => {
    const consumers = files.filter((file) => /text\/event-stream/.test(code(file)));
    expect(consumers.length).toBeGreaterThan(0);
    for (const consumer of consumers) {
      expect(code(consumer)).toMatch(/from '@\/pages\/notes\/_lib\/sse'/);
    }
  });
});

describe('A17 — AI exists in exactly two places', () => {
  /**
   * The two entry points, by design:
   *
   *   1. the bubble menu, on a text selection
   *   2. the ask panel
   *
   * Everything else may *render* AI output (the approval card, the citation
   * chips, the settings log) but may not *invoke* it. That is the distinction
   * this gate draws, and it is the one that matters: a surface that shows a
   * result the user asked for elsewhere is not a new entry point; a button that
   * starts a generation is.
   */
  const INVOKING_CALLS = [
    'extractTasks',
    'extractDecisions',
    'suggestTags',
    'suggestLinks',
    'answerOverNotes',
    'agentChat',
    'continueAgentTurn',
  ];

  const invokers = files.filter((file) => {
    if (file === join(ROOT, '_lib/aiClient.ts')) return false; // the client defines them
    const source = code(file);
    return INVOKING_CALLS.some((call) => new RegExp(`\\b${call}\\s*\\(`).test(source));
  });

  it('has AI invoked from the bubble menu, the ask panel, and nothing else', () => {
    expect(invokers.sort()).toEqual(
      [
        // Entry point 1.
        join(ROOT, '_components/editor/NoteBubbleMenu.tsx'),
        // Entry point 2, split across its two tabs.
        join(ROOT, '_components/ai/AgentTab.tsx'),
        join(ROOT, '_components/ai/AskTab.tsx'),
        // Not an entry point: tag suggestions are a background consequence of
        // typing, with approve/reject chips and a server-side threshold. There
        // is no button here for a user to press.
        join(ROOT, '_components/editor/NoteEditor.tsx'),
      ].sort(),
    );
  });

  it('marks the inline entry point so a stray sparkle button is visible in review', () => {
    expect(readFileSync(join(ROOT, '_components/editor/NoteBubbleMenu.tsx'), 'utf8')).toContain(
      'data-ai-entry-point',
    );
  });

  it('has no AI action in the slash menu, the toolbar or the palette', () => {
    // The three places an "improve this" button historically reappears.
    for (const file of [
      '_components/editor/NoteSlashMenu.tsx',
      '_components/editor/NoteEditorTopBar.tsx',
      '_lib/commands.ts',
    ]) {
      const source = code(join(ROOT, file));
      for (const call of INVOKING_CALLS) {
        expect(source, `${file} invokes ${call}`).not.toMatch(new RegExp(`\\b${call}\\s*\\(`));
      }
    }
  });
});

describe('A12 — no AI surface renders model output as HTML', () => {
  const AI_SURFACES = [
    '_components/ai/AskTab.tsx',
    '_components/ai/AgentTab.tsx',
    '_components/ai/ApprovalCard.tsx',
    '_components/ai/CitationChips.tsx',
    '_components/ai/AnswerFooter.tsx',
    '_components/settings/NotesAiSettingsPanel.tsx',
  ];

  it('uses no dangerouslySetInnerHTML anywhere in the AI path', () => {
    for (const file of AI_SURFACES) {
      expect(code(join(ROOT, file)), file).not.toContain('dangerouslySetInnerHTML');
    }
  });

  it('pipes no answer through a Markdown renderer', () => {
    // A Markdown renderer is the realistic way HTML gets back in: it looks like
    // a formatting improvement rather than a change in trust boundary.
    for (const file of AI_SURFACES) {
      expect(code(join(ROOT, file)), file).not.toMatch(/react-markdown|marked|\bDOMPurify\b/);
    }
  });
});

describe('F13 still holds for the surfaces FE-5 added', () => {
  it('keeps the recent-questions cache outside the module', () => {
    const offenders = files.filter((file) => /localStorage\.setItem/.test(readFileSync(file, 'utf8')));
    expect(offenders, offenders.join(', ')).toEqual([]);
  });
});
