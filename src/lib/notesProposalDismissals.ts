/**
 * "I have looked at these and I do not want to see the card again."
 *
 * Dismissal is not rejection. Rejecting a proposal is a server verb that moves
 * it to `dropped`; dismissing the card leaves the proposals `proposed`, waiting
 * in Open Items → Unconfirmed. So there is nothing on the server to record it
 * against, and it has to live in the browser.
 *
 * It is keyed by note **version**, because that is what makes it honest: the
 * card stays gone while the note is what the user reviewed, and comes back the
 * moment they write more and the server proposes something new. A dismissal
 * keyed by note id alone would silently swallow every future extraction.
 *
 * This lives in `src/lib/` rather than in the notes module because FE-1's gate
 * F13 forbids browser persistence under `src/pages/notes/` — the store swap is
 * only durable if the module has no local storage to drift back into.
 */

const KEY = 'notes:dismissed-proposals:v1';
/** Enough for a long session; the map is (noteId → version) and tiny. */
const MAX_ENTRIES = 500;

type Dismissals = Record<string, number>;

function read(): Dismissals {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Dismissals) : {};
  } catch {
    return {};
  }
}

function write(map: Dismissals): void {
  try {
    const entries = Object.entries(map);
    // Oldest-out by insertion order, which is good enough for a hint cache and
    // avoids storing a timestamp per note to do it properly.
    const trimmed = entries.length > MAX_ENTRIES ? entries.slice(-MAX_ENTRIES) : entries;
    localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(trimmed)));
  } catch {
    /* private window, quota, disabled storage — the card simply reappears */
  }
}

/** True when the user dismissed the card for this note at this exact version. */
export function isProposalCardDismissed(noteId: string, version: number): boolean {
  return read()[noteId] === version;
}

export function dismissProposalCard(noteId: string, version: number): void {
  const map = read();
  map[noteId] = version;
  write(map);
}

/** Used when the user asks for extraction explicitly — they want to see it again. */
export function undismissProposalCard(noteId: string): void {
  const map = read();
  delete map[noteId];
  write(map);
}
