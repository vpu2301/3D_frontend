/**
 * Outcomes — tasks and decisions as entities (BE-1).
 *
 * A separate store from `use-notes-store` because outcomes have a different
 * lifetime: the notes map is the corpus, loaded once; outcomes are queried per
 * note and per question ("what do I owe"), and the answers to those questions
 * are the server's, not a tally over what happens to be in memory.
 *
 * Three rules, all of them the reason this feature can be trusted on client
 * material:
 *
 *  1. **`proposed` is not an obligation.** Nothing the model produced counts
 *     until a human confirmed it. The store keeps proposals separate and never
 *     lets them into an "open" view.
 *  2. **Counts come from the server.** `summary` is one request and it is the
 *     only source for the overdue badge and the tab counts. A count derived by
 *     filtering the rows that happen to be loaded is a number that is quietly
 *     wrong as soon as the corpus is paginated.
 *  3. **Mutations are optimistic and reversible.** Completing an obligation must
 *     feel instant and must be undoable, because the cost of an accidental tick
 *     is "I thought I had done that".
 */

import { useMemo } from 'react';
import { create } from 'zustand';
import { toast } from 'sonner';
import {
  notesApi,
  type ConfirmBatchResult,
  type ExtractResult,
  type Outcome,
  type OutcomeEdit,
  type OutcomeFilters,
  type OutcomeSummary,
} from '@/pages/notes/_lib/apiClient';
import { reportError } from '@/pages/notes/_lib/errors';

/**
 * How many open outcomes to hold for the list badges. Obligations, not notes.
 *
 * Capped at the server's own maximum: `GET /v1/outcomes` rejects anything above
 * 200 with a 422, so asking for 500 spent a request on a guaranteed failure —
 * once on every boot, and again on every list mount.
 */
const OPEN_INDEX_LIMIT = 200;

interface OutcomesState {
  /** Every outcome this session has seen, by id. */
  byId: Record<string, Outcome>;
  /** Note ids whose outcomes have been fetched — an empty note is not "unloaded". */
  loadedNotes: Record<string, boolean>;
  loadingNotes: Record<string, boolean>;
  /** Note ids currently being extracted, so the card can say so. */
  extracting: Record<string, boolean>;

  /** The server's roll-up. The badge and the tab counts read this and nothing else. */
  summary: OutcomeSummary | null;
  summaryLoading: boolean;

  loadForNote: (noteId: string) => Promise<void>;
  /** Re-fetch even if already loaded — used after a checkpoint may have auto-extracted. */
  refreshNote: (noteId: string) => Promise<void>;
  extract: (noteId: string) => Promise<ExtractResult | null>;

  confirmBatch: (
    ids: string[],
    edits?: Array<OutcomeEdit & { id: string }>,
  ) => Promise<ConfirmBatchResult | null>;
  reject: (ids: string[]) => Promise<void>;

  complete: (id: string) => Promise<void>;
  reopen: (id: string) => Promise<void>;
  patch: (id: string, edits: OutcomeEdit) => Promise<void>;
  createManual: (
    noteId: string,
    payload: { kind: Outcome['kind']; text: string; owedBy?: string; dueAt?: number | null },
  ) => Promise<Outcome | null>;
  remove: (id: string) => Promise<void>;

  refreshSummary: () => Promise<void>;
  /** Fill the per-note open index the list badges read. */
  loadOpenIndex: () => Promise<void>;

  reset: () => void;
}

export const useOutcomesStore = create<OutcomesState>((set, get) => {
  const absorb = (outcomes: Outcome[]) =>
    set((s) => {
      const byId = { ...s.byId };
      for (const outcome of outcomes) byId[outcome.id] = outcome;
      return { byId };
    });

  const drop = (ids: string[]) =>
    set((s) => {
      const byId = { ...s.byId };
      for (const id of ids) delete byId[id];
      return { byId };
    });

  /**
   * Every mutation refreshes the roll-up rather than adjusting a local number.
   * It is one small request, and it is what keeps the badge honest when an
   * outcome changes bucket, is superseded, or was already changed elsewhere.
   */
  const afterMutation = () => {
    void get().refreshSummary();
  };

  return {
    byId: {},
    loadedNotes: {},
    loadingNotes: {},
    extracting: {},
    summary: null,
    summaryLoading: false,

    loadForNote: async (noteId) => {
      if (get().loadedNotes[noteId] || get().loadingNotes[noteId]) return;
      await get().refreshNote(noteId);
    },

    refreshNote: async (noteId) => {
      set((s) => ({ loadingNotes: { ...s.loadingNotes, [noteId]: true } }));
      try {
        // No status filter: the note shows its proposals *and* its confirmed
        // items, and one request is cheaper than two for a set this small.
        const page = await notesApi.outcomes({ noteId, limit: 200 });
        set((s) => {
          const byId = { ...s.byId };
          // Drop anything we held for this note that the server no longer
          // returns — a rejected proposal must not linger in the card.
          for (const [id, outcome] of Object.entries(byId)) {
            if (outcome.noteId === noteId) delete byId[id];
          }
          for (const outcome of page.items) byId[outcome.id] = outcome;
          return {
            byId,
            loadedNotes: { ...s.loadedNotes, [noteId]: true },
            loadingNotes: { ...s.loadingNotes, [noteId]: false },
          };
        });
      } catch (error) {
        set((s) => ({ loadingNotes: { ...s.loadingNotes, [noteId]: false } }));
        // Not toasted: a note that fails to load its outcomes should still be
        // writable, and the card simply does not appear.
        if (import.meta.env.DEV) console.warn('[notes] could not load outcomes', error);
      }
    },

    extract: async (noteId) => {
      if (get().extracting[noteId]) return null;
      set((s) => ({ extracting: { ...s.extracting, [noteId]: true } }));
      try {
        const result = await notesApi.extract(noteId);
        absorb(result.outcomes);
        set((s) => ({ loadedNotes: { ...s.loadedNotes, [noteId]: true } }));
        afterMutation();

        if (result.outcomes.length === 0) {
          toast('Nothing to confirm', {
            description:
              result.stats.discardedUnanchorable > 0
                ? 'The model proposed items that could not be traced to a sentence, so they were dropped.'
                : 'No tasks or decisions were found in this note.',
          });
        }
        return result;
      } catch (error) {
        reportError(error, { title: 'Could not read this note for tasks' });
        return null;
      } finally {
        set((s) => ({ extracting: { ...s.extracting, [noteId]: false } }));
      }
    },

    confirmBatch: async (ids, edits = []) => {
      if (ids.length === 0) return null;
      const before = ids.map((id) => get().byId[id]).filter(Boolean);

      // Optimistic: the rows become obligations immediately, carrying the edits
      // the user made in the card, so "confirm" is visibly instant.
      const editById = new Map(edits.map((edit) => [edit.id, edit]));
      absorb(
        before.map((outcome) => ({
          ...outcome,
          ...stripId(editById.get(outcome.id)),
          status: 'open' as const,
          confirmedAt: Date.now(),
        })),
      );

      try {
        const result = await notesApi.confirmOutcomes(ids, edits);
        absorb(result.confirmed);
        // A partial failure is not a silent one: the rows that did not make it
        // go back to `proposed` and the user is told how many.
        if (result.failed.length > 0) {
          absorb(before.filter((outcome) => result.failed.some((f) => f.id === outcome.id)));
          toast.error(`${result.failed.length} of ${ids.length} could not be confirmed`, {
            description: 'They are still waiting in Unconfirmed.',
          });
        }
        afterMutation();
        return result;
      } catch (error) {
        absorb(before);
        reportError(error, { title: 'Could not confirm' });
        return null;
      }
    },

    reject: async (ids) => {
      const before = ids.map((id) => get().byId[id]).filter(Boolean);
      drop(ids);
      try {
        await Promise.all(ids.map((id) => notesApi.rejectOutcome(id)));
        afterMutation();
      } catch (error) {
        absorb(before);
        reportError(error, { title: 'Could not discard' });
      }
    },

    complete: async (id) => {
      const before = get().byId[id];
      if (!before) return;
      absorb([{ ...before, status: 'done', completedAt: Date.now() }]);
      try {
        absorb([await notesApi.completeOutcome(id)]);
        afterMutation();
      } catch (error) {
        absorb([before]);
        reportError(error, { title: 'Could not complete that' });
      }
    },

    reopen: async (id) => {
      const before = get().byId[id];
      if (!before) return;
      absorb([{ ...before, status: 'open', completedAt: null }]);
      try {
        absorb([await notesApi.reopenOutcome(id)]);
        afterMutation();
      } catch (error) {
        absorb([before]);
        reportError(error, { title: 'Could not reopen that' });
      }
    },

    patch: async (id, edits) => {
      const before = get().byId[id];
      if (!before) return;
      absorb([{ ...before, ...stripId(edits) }]);
      try {
        absorb([await notesApi.patchOutcome(id, edits)]);
        afterMutation();
      } catch (error) {
        absorb([before]);
        reportError(error, { title: 'Could not save that change' });
      }
    },

    createManual: async (noteId, payload) => {
      try {
        // Starts `open`: the confirmation gate exists for what the model
        // produced, not for what the user typed themselves.
        const outcome = await notesApi.createOutcome(noteId, {
          kind: payload.kind,
          text: payload.text,
          owedBy: payload.owedBy ?? null,
          dueAt: payload.dueAt ?? null,
        });
        absorb([outcome]);
        afterMutation();
        return outcome;
      } catch (error) {
        reportError(error, { title: 'Could not add that' });
        return null;
      }
    },

    remove: async (id) => {
      const before = get().byId[id];
      if (!before) return;
      drop([id]);
      try {
        await notesApi.deleteOutcome(id);
        afterMutation();
      } catch (error) {
        absorb([before]);
        reportError(error, { title: 'Could not delete that' });
      }
    },

    refreshSummary: async () => {
      set({ summaryLoading: true });
      try {
        set({ summary: await notesApi.outcomeSummary(), summaryLoading: false });
      } catch {
        // A failed roll-up hides the badge rather than showing a stale or
        // invented number. Zero would be a lie; absent is the truth.
        set({ summaryLoading: false });
      }
    },

    loadOpenIndex: async () => {
      try {
        const page = await notesApi.outcomes({ status: 'open', limit: OPEN_INDEX_LIMIT });
        absorb(page.items);
      } catch {
        /* the list badges simply do not appear */
      }
    },

    reset: () =>
      set({
        byId: {},
        loadedNotes: {},
        loadingNotes: {},
        extracting: {},
        summary: null,
        summaryLoading: false,
      }),
  };
});

/** `BatchEditIn` carries the id; the outcome itself must not be given one twice. */
function stripId(edit: (OutcomeEdit & { id?: string }) | undefined): Partial<Outcome> {
  if (!edit) return {};
  const { id: _ignored, ...rest } = edit;
  return rest as Partial<Outcome>;
}

// ── selectors ─────────────────────────────────────────────────────────────

const EMPTY: Outcome[] = [];

/**
 * The outcomes of one note.
 *
 * A hook rather than a selector on purpose: a selector that filters returns a
 * fresh array on every call, and `useSyncExternalStore` compares by identity —
 * so `useOutcomesStore(selectForNote(id))` re-renders forever. Subscribing to
 * the map and deriving under `useMemo` is the version that terminates.
 */
export function useNoteOutcomes(noteId: string | null | undefined): Outcome[] {
  const byId = useOutcomesStore((s) => s.byId);
  return useMemo(() => {
    if (!noteId) return EMPTY;
    return Object.values(byId).filter((outcome) => outcome.noteId === noteId);
  }, [byId, noteId]);
}

export function proposalsOf(outcomes: Outcome[]): Outcome[] {
  return outcomes
    .filter((outcome) => outcome.status === 'proposed')
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function confirmedOf(outcomes: Outcome[]): Outcome[] {
  return outcomes
    .filter((outcome) => outcome.status === 'open' || outcome.status === 'done')
    .sort((a, b) => (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity) || a.createdAt - b.createdAt);
}

/**
 * Open obligations per note, for the list row's "3 open".
 *
 * This tallies rows the *server* returned as `status=open`; there is no
 * per-note count endpoint to ask instead. It is a display hint on a row, never
 * a number the user acts on — the numbers that matter come from `summary`.
 */
export function selectOpenCountsByNote(s: OutcomesState): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const outcome of Object.values(s.byId)) {
    if (outcome.status !== 'open') continue;
    counts[outcome.noteId] = (counts[outcome.noteId] ?? 0) + 1;
  }
  return counts;
}
