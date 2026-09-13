/**
 * The non-visual half of the thread vocabulary (S14): hrefs, the status
 * machine mirrored from the API, attach-kind meaning, and the date phrasing
 * the commitments table speaks. Kept beside voiceMeta.ts so the components
 * stay components.
 */
import { THREAD_TRANSITIONS, type Thread, type ThreadAttachKind, type ThreadCommitment, type ThreadStatus } from '@/lib/api/voice';

export const threadHref = (id: string) => `/telephony/threads/${encodeURIComponent(id)}`;

/** What the API will accept from here — the UI offers nothing else (§3.1). */
export const STATUS_ACTION_LABEL: Record<ThreadStatus, string> = {
  open: 'Reopen',
  resolved: 'Mark resolved',
  closed: 'Close thread',
};

export function allowedTransitions(status: string): ThreadStatus[] {
  return THREAD_TRANSITIONS[status as ThreadStatus] ?? [];
}

export interface AttachMeta {
  glyph: string;
  label: string;
  title: string;
}

export const ATTACH_META: Record<ThreadAttachKind, AttachMeta> = {
  origin: { glyph: '\u25cf', label: 'first call', title: 'The call this thread started from' },
  retry: { glyph: '\u21bb', label: 'retry', title: 'A retry of the previous attempt' },
  followup: { glyph: '\u2795', label: 'follow-up', title: 'A follow-up placed from this thread' },
  inbound_matched: {
    glyph: '\u21e0',
    label: 'inbound match',
    // The disclosure §6 requires: the owner must know this was a guess.
    title: 'Matched by caller number \u2014 heuristic. Reassign it if it belongs elsewhere.',
  },
  manual: { glyph: '\u270e', label: 'assigned', title: 'Assigned to this thread by hand' },
};

export function attachMeta(kind: string): AttachMeta {
  return ATTACH_META[kind as ThreadAttachKind] ?? { glyph: '\u2022', label: kind || 'call', title: kind || 'call' };
}

const COMMITMENT_ORDER: Record<string, number> = { expired: 0, open: 1, done: 2 };

/** Expired first — those are the ones costing the owner something. */
export function sortCommitments(list: ThreadCommitment[]): ThreadCommitment[] {
  return [...list].sort((a, b) => {
    const rank = (COMMITMENT_ORDER[a.status] ?? 1) - (COMMITMENT_ORDER[b.status] ?? 1);
    if (rank !== 0) return rank;
    const at = a.due_at ? new Date(a.due_at).getTime() : Infinity;
    const bt = b.due_at ? new Date(b.due_at).getTime() : Infinity;
    return at - bt;
  });
}

export const expiredCount = (t: Pick<Thread, 'expired_commitment_count'>) =>
  t.expired_commitment_count ?? 0;

/** "Thu 21 Aug, 14:00" — the way someone would say it out loud. */
export function spokenDate(iso: string | null): string {
  if (!iso) return 'no date agreed';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function relativeDate(iso: string | null, now = Date.now()): string {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  if (isNaN(t)) return '';
  const days = Math.round((t - now) / 86_400_000);
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days === -1) return 'yesterday';
  return days > 0 ? `in ${days} days` : `${Math.abs(days)} days ago`;
}

/**
 * A backend that predates the threads API answers 404/405 on the collection.
 * That is absence, not failure: the app should say "this server does not do
 * threads yet", never paint a red error over a working page.
 */
export function threadsUnavailable(err: { status?: number } | null | undefined): boolean {
  return !!err && (err.status === 404 || err.status === 405 || err.status === 501);
}

/**
 * On a *single* thread, a 404 is a dead link — the id is gone or was merged
 * away — so only a hard "this route does not exist" counts as absence here.
 */
export function threadRouteMissing(err: { status?: number } | null | undefined): boolean {
  return !!err && (err.status === 405 || err.status === 501);
}

