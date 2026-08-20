/**
 * Pending agent approvals — one store slice behind all three surfaces (§5).
 *
 * The transcript, the notification bell and the note banner are three windows
 * onto the same list. If each fetched its own, approving in the transcript
 * would leave a stale count in the bell and a banner offering to approve
 * something that already ran, and the user would learn that the approval UI
 * cannot be trusted — which is the one thing this feature is for.
 *
 * Polling, not sockets: an approval is not latency-sensitive (it has a 24-hour
 * expiry), and a socket for it would be a reconnection state machine in
 * exchange for nothing. The poll pauses on a hidden tab, because a background
 * tab polling every 30 seconds forever is how a laptop fan becomes the
 * product's most memorable feature.
 */

import { create } from 'zustand';
import { notesApi, NotesApiError, type AgentActionRow } from '@/pages/notes/_lib/apiClient';
import type { ActionDiff } from '@/pages/notes/_lib/aiClient';

export const APPROVAL_POLL_MS = 30_000;

/**
 * A pending action as the card needs it.
 *
 * `diff`, `noteId`, `expiresAt` and `costUsd` are optional because BE-4 does
 * not send them yet (see the backend handoff doc). Each one degrades to an
 * honest absence rather than a made-up value: no diff renders "the change
 * cannot be previewed" instead of an empty green/red block that reads as "this
 * changes nothing".
 */
export interface PendingApproval {
  actionId: string;
  tool: string;
  input: Record<string, unknown>;
  explanation: string;
  noteId?: string;
  noteTitle?: string;
  diff?: ActionDiff;
  costUsd?: number;
  /** ms-epoch. The server expires an unanswered action after 24 hours. */
  expiresAt?: number;
  createdAt?: number;
}

/** Why a card is no longer actionable, when it is not. */
export type ApprovalBlock = 'stale' | 'expired' | null;

interface ApprovalsState {
  pending: PendingApproval[];
  /** Per-action in-flight decision, so a double-click cannot approve twice. */
  deciding: Record<string, boolean>;
  /**
   * Per-action blocking condition. Deliberately **not** cleared by a refetch:
   * the refetch is triggered *by* the stale error, so clearing it there would
   * erase the explanation a few milliseconds after showing it. The user clears
   * it by acknowledging — see `clearBlock`.
   */
  blocked: Record<string, ApprovalBlock>;
  /**
   * Actions this browser has already decided. The card is rendered from a prop
   * in three places, so it cannot rely on disappearing from `pending` to know
   * it is settled — without this, a second click on a card still on screen
   * sends a second approve.
   */
  resolved: Record<string, 'approved' | 'rejected'>;
  loading: boolean;
  /** Number of live pollers mounted; the interval runs while this is > 0. */
  subscribers: number;

  refresh: () => Promise<void>;
  subscribe: () => () => void;
  /** "I have read why this stopped" — re-arms the card against fresh data. */
  clearBlock: (actionId: string) => void;
  /**
   * Resolves to `true` when the write actually happened, so a caller can
   * decide whether to resume an agent turn. A stale or expired action
   * resolves `false` and leaves the card in place, explaining itself.
   */
  decide: (actionId: string, approved: boolean, reason?: string) => Promise<boolean>;
  forNote: (noteId: string) => PendingApproval[];
}

/**
 * The list endpoint returns audit rows, which are a superset of what a card
 * needs and use different names. Mapping here keeps that shape in one place.
 */
function fromActionRow(row: AgentActionRow): PendingApproval {
  const extra = row as AgentActionRow & {
    diff?: ActionDiff;
    noteId?: string;
    noteTitle?: string;
    expiresAt?: number;
    explanation?: string;
  };
  return {
    actionId: row.id,
    tool: row.toolName ?? row.kind,
    input: (row.toolInput ?? {}) as Record<string, unknown>,
    explanation: extra.explanation ?? '',
    noteId: extra.noteId,
    noteTitle: extra.noteTitle,
    diff: extra.diff,
    costUsd: row.costUsd,
    expiresAt: extra.expiresAt,
    createdAt: row.createdAt,
  };
}

let pollHandle: ReturnType<typeof setInterval> | null = null;
let visibilityBound = false;

export const useApprovalsStore = create<ApprovalsState>((set, get) => ({
  pending: [],
  deciding: {},
  blocked: {},
  resolved: {},
  loading: false,
  subscribers: 0,

  clearBlock: (actionId) =>
    set((s) => {
      const blocked = { ...s.blocked };
      delete blocked[actionId];
      return { blocked };
    }),

  refresh: async () => {
    set({ loading: true });
    try {
      const page = await notesApi.agentActions({ status: 'pending' });
      set({ pending: page.items.map(fromActionRow) });
    } catch {
      // A failed poll keeps the previous list. Emptying it would make the bell
      // count flicker to zero on every transient network blip, and a count that
      // lies in the reassuring direction is worse than a count that is late.
    } finally {
      set({ loading: false });
    }
  },

  subscribe: () => {
    const startPolling = () => {
      if (pollHandle !== null || document.hidden || get().subscribers === 0) return;
      pollHandle = setInterval(() => void get().refresh(), APPROVAL_POLL_MS);
    };
    const stopPolling = () => {
      if (pollHandle !== null) {
        clearInterval(pollHandle);
        pollHandle = null;
      }
    };

    if (!visibilityBound && typeof document !== 'undefined') {
      visibilityBound = true;
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          stopPolling();
        } else {
          // Coming back to the tab: refresh at once rather than waiting out the
          // interval. The user switched back *because* they want to look.
          if (get().subscribers > 0) void get().refresh();
          startPolling();
        }
      });
    }

    set((s) => ({ subscribers: s.subscribers + 1 }));
    void get().refresh();
    startPolling();

    return () => {
      const remaining = get().subscribers - 1;
      set({ subscribers: Math.max(0, remaining) });
      if (remaining <= 0) stopPolling();
    };
  },

  decide: async (actionId, approved, reason) => {
    // Idempotence at the UI layer. The server is the real guard, but a
    // double-click firing two approvals and applying a write twice is a
    // plausible bug with an expensive outcome on a client matter. Both a
    // decision in flight and one already settled are refused.
    if (get().deciding[actionId] || get().resolved[actionId]) return false;
    set((s) => ({ deciding: { ...s.deciding, [actionId]: true } }));

    try {
      if (approved) await notesApi.approveAction(actionId);
      else await notesApi.rejectAction(actionId, reason);

      set((s) => ({
        pending: s.pending.filter((p) => p.actionId !== actionId),
        blocked: { ...s.blocked, [actionId]: null },
        resolved: { ...s.resolved, [actionId]: approved ? 'approved' : 'rejected' },
      }));
      return true;
    } catch (error) {
      const block = classify(error);
      if (block) {
        // Nothing was written. Mark the card and refetch so the user is looking
        // at the current state of the note before deciding again — silently
        // applying a diff against a base that moved is the worst outcome this
        // UI can produce.
        set((s) => ({ blocked: { ...s.blocked, [actionId]: block } }));
        void get().refresh();
        return false;
      }
      throw error;
    } finally {
      set((s) => {
        const deciding = { ...s.deciding };
        delete deciding[actionId];
        return { deciding };
      });
    }
  },

  forNote: (noteId) => get().pending.filter((p) => p.noteId === noteId),
}));

/** 409 `stale_base` and 410/`expired` are refusals to act, not failures. */
function classify(error: unknown): ApprovalBlock {
  if (!(error instanceof NotesApiError)) return null;
  if (error.status === 409 && error.code === 'stale_base') return 'stale';
  if (error.status === 409) return 'stale';
  if (error.status === 410 || error.code === 'action_expired') return 'expired';
  return null;
}

/** Test seam: the polling handle is module state, so it must be resettable. */
export function __resetApprovalPolling() {
  if (pollHandle !== null) {
    clearInterval(pollHandle);
    pollHandle = null;
  }
  useApprovalsStore.setState({ pending: [], deciding: {}, blocked: {}, resolved: {}, subscribers: 0 });
}
