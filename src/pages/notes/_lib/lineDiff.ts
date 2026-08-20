/**
 * Line-level diff for the approval card (§5, and §9.1 as acknowledged debt).
 *
 * A word-level inline diff is a design decision, not a developer's; this is the
 * interim that keeps the card honest until a designer takes it. Line-level over
 * rendered Markdown is enough to answer the question the card exists to ask —
 * "is this the change you meant?" — without inventing a visual language.
 *
 * Plain LCS. The inputs are one note's worth of Markdown, so the O(n·m) table
 * is a few thousand cells at worst; a Myers implementation would be faster at a
 * size this code will never see.
 */

export type DiffOp = 'equal' | 'add' | 'remove';

export interface DiffLine {
  op: DiffOp;
  text: string;
}

/** Anything past this is truncated by the renderer, not here — see `diffStats`. */
const MAX_LINES = 4000;

export function lineDiff(before: string, after: string): DiffLine[] {
  const a = splitLines(before).slice(0, MAX_LINES);
  const b = splitLines(after).slice(0, MAX_LINES);

  // Longest common subsequence table over lines.
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      out.push({ op: 'equal', text: a[i] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      out.push({ op: 'remove', text: a[i] });
      i++;
    } else {
      out.push({ op: 'add', text: b[j] });
      j++;
    }
  }
  while (i < a.length) out.push({ op: 'remove', text: a[i++] });
  while (j < b.length) out.push({ op: 'add', text: b[j++] });

  return out;
}

function splitLines(text: string): string[] {
  // An empty document has no lines, not one blank one. `''.split('\n')` yields
  // `['']`, which would render a phantom "−1" on every note the agent creates
  // from nothing — a deletion the user is being asked to approve that does not
  // exist.
  if (text === '') return [];
  return text.replace(/\r\n?/g, '\n').split('\n');
}

export interface DiffStats {
  added: number;
  removed: number;
}

export function diffStats(lines: DiffLine[]): DiffStats {
  return {
    added: lines.filter((l) => l.op === 'add').length,
    removed: lines.filter((l) => l.op === 'remove').length,
  };
}

/**
 * Collapses long runs of unchanged lines to a few lines of context either side.
 *
 * A 400-line note with a one-line edit should show that one line, not bury it.
 * `null` marks an elision the renderer draws as a "… n unchanged lines" rule —
 * saying how many were hidden matters, because silently omitting content from a
 * diff someone is about to approve is exactly the trust failure this avoids.
 */
export function withContext(lines: DiffLine[], context = 3): Array<DiffLine | null> {
  const keep = new Set<number>();
  lines.forEach((line, index) => {
    if (line.op === 'equal') return;
    for (let k = index - context; k <= index + context; k++) {
      if (k >= 0 && k < lines.length) keep.add(k);
    }
  });

  const out: Array<DiffLine | null> = [];
  let elided = 0;
  lines.forEach((line, index) => {
    if (keep.has(index)) {
      if (elided > 0) {
        out.push(null);
        elided = 0;
      }
      out.push(line);
    } else {
      elided++;
    }
  });
  if (elided > 0) out.push(null);
  return out;
}
