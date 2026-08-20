/**
 * Reading the structured outcome the agent writes at end of call.
 *
 * Pure functions, no JSX: the panel, the transcript modal and the live-call
 * rail all need them, and components importing each other would be a cycle.
 *
 * Normalisation lives in `@/lib/api/voice` (normalizeOutcome), because the same
 * records arrive two ways: as the v2 `outcome` field, and as a JSON blob on an
 * `outcome` action for calls that predate it.
 */
import { normalizeOutcome } from '@/lib/api/voice';
import type {
  CallAction,
  CallDetail,
  CallOutcome,
  Commitment,
  FollowUpSuggestion,
} from '@/lib/api/voice';

export type { CallOutcome, Commitment, FollowUpSuggestion };

/** The blob form: `outcome` action → CallOutcome, or null if it isn't one. */
export function parseOutcome(action: CallAction): CallOutcome | null {
  if (action.action_type !== 'outcome') return null;
  for (const raw of [action.output_summary, action.input_summary]) {
    if (!raw || !raw.trim().startsWith('{')) continue;
    try {
      const parsed = normalizeOutcome(JSON.parse(raw));
      if (parsed) return parsed;
    } catch {
      /* not JSON — fall through */
    }
  }
  return null;
}

/**
 * The call's outcome, whichever way this backend sends it. Top-level field
 * wins: it is the one the backend maintains going forward.
 */
export function outcomeOf(detail: CallDetail): CallOutcome | null {
  const top = normalizeOutcome(detail.outcome);
  if (top) return top;
  for (const action of detail.actions) {
    const parsed = parseOutcome(action);
    if (parsed) return parsed;
  }
  return null;
}

export const WHO_LABEL: Record<string, string> = { agent: 'Agent', callee: 'Caller' };

/** `when` is an ISO datetime when the model behaves, free text when it does not. */
export function fmtWhen(when: string): string {
  const d = new Date(when);
  return Number.isNaN(d.getTime()) ? when : d.toLocaleString();
}

export function commitmentText(c: Commitment): string {
  const who = c.who ? `${WHO_LABEL[c.who] ?? c.who}: ` : '';
  const when = c.when ? ` (${fmtWhen(c.when)})` : '';
  return `${who}${c.what}${when}`;
}

// ── Local demo persistence ──────────────────────────────────────────

/**
 * Whether a suggested follow-up was actually carried out.
 *
 * Derived, not reported: the backend records the suggestion and, separately,
 * the tool call that answered it. Matching them on `tool_name` is what turns
 * "we suggested sending an email" into "the email was sent / refused / is
 * still waiting for someone to decide".
 */
export type ApprovalState = 'executed' | 'denied' | 'pending';

export function approvalStates(
  actions: CallAction[],
  suggestions: FollowUpSuggestion[],
): Record<string, ApprovalState> {
  const out: Record<string, ApprovalState> = {};
  for (const s of suggestions) {
    if (!s.tool) continue;
    const match = actions.find((a) => a.tool_name === s.tool && a.action_type !== 'outcome');
    if (!match) {
      out[s.tool] = 'pending';
    } else {
      out[s.tool] = match.user_confirmed === false ? 'denied' : match.user_confirmed === true ? 'executed' : 'pending';
    }
  }
  return out;
}
