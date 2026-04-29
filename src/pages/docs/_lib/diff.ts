import { diffWords, diffLines, Change } from 'diff';

export interface DiffSegment {
  value: string;
  type: 'equal' | 'added' | 'removed';
}

export function wordDiff(a: string, b: string): DiffSegment[] {
  const changes: Change[] = diffWords(a, b);
  return changes.map((c) => ({
    value: c.value,
    type: c.added ? 'added' : c.removed ? 'removed' : 'equal',
  }));
}

export function lineDiff(a: string, b: string): DiffSegment[] {
  const changes: Change[] = diffLines(a, b);
  return changes.map((c) => ({
    value: c.value,
    type: c.added ? 'added' : c.removed ? 'removed' : 'equal',
  }));
}

export function diffStats(segments: DiffSegment[]): { added: number; removed: number } {
  let added = 0;
  let removed = 0;
  for (const s of segments) {
    if (s.type === 'added') added += s.value.length;
    if (s.type === 'removed') removed += s.value.length;
  }
  return { added, removed };
}
