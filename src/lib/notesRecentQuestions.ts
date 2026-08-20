/**
 * The last five questions asked against a note (FE-5 §4).
 *
 * Re-asking is the common second action: the answer streamed, the user changed
 * the scope or reworded slightly, and retyping the question is pure friction.
 * Five is deliberate — a longer list stops being a shortcut and becomes a
 * history panel nobody asked for.
 *
 * It is per note and per browser, not per user on the server. A question is a
 * draft thought; syncing it would mean uploading half-formed queries about
 * client matters to be stored indefinitely, which is a bad trade for a
 * convenience this small.
 *
 * Lives in `src/lib/` rather than in the notes module because FE-1's gate F13
 * forbids browser persistence under `src/pages/notes/` — same reasoning, and
 * same precedent, as `notesProposalDismissals`.
 */

const KEY = 'notes:recent-questions:v1';
const PER_NOTE = 5;
/** Cap the whole map so a long-lived browser cannot grow it without bound. */
const MAX_NOTES = 50;

type Store = Record<string, string[]>;

/** Questions with no note attached still deserve a history. */
const GLOBAL = '__global__';

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : {};
    return parsed && typeof parsed === 'object' ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function write(store: Store): void {
  try {
    const entries = Object.entries(store);
    const trimmed = entries.length > MAX_NOTES ? entries.slice(-MAX_NOTES) : entries;
    localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(trimmed)));
  } catch {
    // A full or disabled localStorage costs the user a convenience, not the
    // feature. Never let it break asking a question.
  }
}

export function recentQuestions(noteId: string | undefined): string[] {
  return read()[noteId ?? GLOBAL] ?? [];
}

export function rememberQuestion(noteId: string | undefined, question: string): void {
  const text = question.trim();
  if (!text) return;
  const key = noteId ?? GLOBAL;
  const store = read();
  // Case-insensitive dedupe, newest first: re-asking the same thing should move
  // it to the top rather than fill the list with five copies of itself.
  const existing = (store[key] ?? []).filter((q) => q.toLowerCase() !== text.toLowerCase());
  store[key] = [text, ...existing].slice(0, PER_NOTE);
  write(store);
}
