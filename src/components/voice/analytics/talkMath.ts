/**
 * The arithmetic behind the talk-ratio bar, kept out of the component so it
 * can be tested — and reasoned about — on its own.
 */

/**
 * Whole percentages that sum to exactly 100: floor everything, then hand the
 * leftover points to the largest remainders.
 *
 * Three independent `Math.round`s cannot do this. An even three-way split
 * rounds to 33/33/33 and leaves a gap in the bar; 33.33/33.33/33.34 rounds to
 * 33/33/33 as well, losing the point that belongs to the largest share.
 */
export function sharePercents(parts: number[]): number[] {
  const total = parts.reduce((n, p) => n + Math.max(0, p), 0);
  if (total <= 0) return parts.map(() => 0);

  const exact = parts.map((p) => (Math.max(0, p) / total) * 100);
  const floors = exact.map(Math.floor);
  let left = 100 - floors.reduce((n, f) => n + f, 0);

  const order = exact
    .map((value, i) => ({ i, rest: value - Math.floor(value) }))
    .sort((a, b) => b.rest - a.rest || a.i - b.i);

  const out = [...floors];
  for (const { i } of order) {
    if (left <= 0) break;
    out[i] += 1;
    left -= 1;
  }
  return out;
}

/** "3:05" — call lengths are read as minutes and seconds, not as 185 s. */
export function clock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
