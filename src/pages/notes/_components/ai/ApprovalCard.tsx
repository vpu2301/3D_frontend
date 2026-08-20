/**
 * The human gate on every agent write (FE-5 §5, ADR 0006).
 *
 * One component, three surfaces: inline in the agent transcript at the point
 * the tool was called, in the notification bell's Approvals section, and as a
 * banner on an affected note. All three read the same store slice, so a
 * decision made in one is reflected in the others without a refresh.
 *
 * The card shows the change **before** it happens. That is the whole feature:
 * the server ends its turn at `approval_required` and holds nothing open, so an
 * agent write occurs only after somebody here has seen a diff and clicked
 * Approve. Everything else on the card exists to make that click informed —
 * which tool, on which note, why, what it costs, and how long the offer stands.
 *
 * There is no "remember my choice". It would recreate auto-approval without any
 * of the governance that would have to come with it, and on privileged material
 * that is not a convenience worth having.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ShieldAlert, Loader2, FileWarning, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  useApprovalsStore,
  type ApprovalBlock,
  type PendingApproval,
} from '@/pages/notes/_hooks/use-approvals-store';
import { lineDiff, diffStats, withContext } from '@/pages/notes/_lib/lineDiff';
import { cn } from '@/lib/utils';

export type { PendingApproval };

interface Props {
  approval: PendingApproval;
  /**
   * Called only when a write actually happened, so the transcript can resume
   * the agent turn. A stale or expired decision never fires it.
   */
  onDecided?: (approved: boolean) => void;
  /** The banner variant drops the heading; the note it sits on is the context. */
  compact?: boolean;
}

/** `create_note` → `Create note`. The server's tool names are the contract. */
function humanise(tool: string): string {
  const words = tool.replace(/[_-]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function money(usd: number): string {
  return usd > 0 && usd < 0.01 ? '<$0.01' : `$${usd.toFixed(2)}`;
}

/**
 * The 24-hour expiry, counted down live.
 *
 * It re-renders once a minute, not once a second: a ticking seconds display on
 * a card asking for a considered decision manufactures urgency the deadline
 * does not actually have.
 */
function useCountdown(expiresAt: number | undefined): { label: string; expired: boolean } {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!expiresAt) return { label: '', expired: false };

  const remaining = expiresAt - now;
  if (remaining <= 0) return { label: 'expired', expired: true };

  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  if (hours > 0) return { label: `expires in ${hours}h ${minutes}m`, expired: false };
  return { label: `expires in ${minutes}m`, expired: false };
}

const BLOCK_MESSAGE: Record<Exclude<ApprovalBlock, null>, string> = {
  stale: 'The note changed — please review this again. Nothing was written.',
  expired: 'This request expired before it was answered. Nothing was written.',
};

export default function ApprovalCard({ approval, onDecided, compact }: Props) {
  const decide = useApprovalsStore((s) => s.decide);
  const clearBlock = useApprovalsStore((s) => s.clearBlock);
  const deciding = useApprovalsStore((s) => Boolean(s.deciding[approval.actionId]));
  const blocked = useApprovalsStore((s) => s.blocked[approval.actionId] ?? null);
  const settled = useApprovalsStore((s) => s.resolved[approval.actionId]);

  const [intent, setIntent] = useState<'approve' | 'reject' | null>(null);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [reason, setReason] = useState('');

  const { label: countdown, expired } = useCountdown(approval.expiresAt);
  const block: ApprovalBlock = blocked ?? (expired ? 'expired' : null);
  // A settled card keeps its diff on screen — the user should be able to see
  // what they just approved — but offers no way to do it again.
  const locked = block !== null || Boolean(settled);

  const diff = useMemo(() => {
    if (!approval.diff) return null;
    const lines = lineDiff(approval.diff.before, approval.diff.after);
    return { lines: withContext(lines), stats: diffStats(lines) };
  }, [approval.diff]);

  const run = async (approved: boolean, withReason?: string) => {
    if (locked || deciding) return;
    setIntent(approved ? 'approve' : 'reject');
    try {
      const applied = await decide(approval.actionId, approved, withReason);
      if (applied) onDecided?.(approved);
    } finally {
      setIntent(null);
      setReasonOpen(false);
    }
  };

  return (
    <div
      className={cn(
        'rounded-[12px] border text-sm',
        locked
          ? 'border-[var(--line)] bg-[var(--sand)]'
          : 'border-[rgba(154,83,18,0.28)] bg-[var(--warn-bg)]',
      )}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-3 pt-2.5">
        {!compact && (
          <span
            className={cn(
              'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider',
              locked ? 'text-[var(--text-4)]' : 'text-[var(--warn-fg)]',
            )}
          >
            <ShieldAlert aria-hidden className="h-3.5 w-3.5" />
            Approval needed
          </span>
        )}

        <Badge
          variant="outline"
          className="rounded-full border-[var(--line)] bg-[var(--paper)] font-mono text-[10px] text-[var(--text-2)]"
        >
          {approval.tool}
        </Badge>

        {approval.costUsd !== undefined && approval.costUsd > 0 && (
          <span className="text-[11px] text-[var(--warn-fg)]">≈{money(approval.costUsd)}</span>
        )}

        {countdown && (
          <span
            className={cn(
              'ml-auto flex items-center gap-1 text-[11px]',
              expired ? 'text-[var(--text-4)]' : 'text-[var(--warn-fg)]',
            )}
          >
            <Clock aria-hidden className="h-3 w-3" />
            {countdown}
          </span>
        )}
      </div>

      <p className={cn('px-3 pt-1.5 text-xs', locked ? 'text-[var(--text-3)]' : 'text-[var(--warn-fg)]')}>
        The agent wants to <span className="font-medium">{humanise(approval.tool)}</span>
        {approval.noteId && (
          <>
            {' on '}
            <Link
              to={`/notes/${approval.noteId}`}
              className="inline-flex items-center gap-0.5 font-medium underline underline-offset-2 hover:no-underline"
            >
              {approval.noteTitle || 'this note'}
              <ExternalLink aria-hidden className="h-2.5 w-2.5" />
            </Link>
          </>
        )}
        .
      </p>

      {approval.explanation && (
        <p className="px-3 pt-1.5 text-xs text-[var(--warn-fg)]">{approval.explanation}</p>
      )}

      {/* The change itself. */}
      <div className="px-3 pt-2">
        {diff ? (
          <>
            <div className="plat-eyebrow mb-1 flex items-center gap-2">
              <span>Change</span>
              <span style={{ color: 'var(--ok-fg)' }}>+{diff.stats.added}</span>
              <span style={{ color: 'var(--bad-fg)' }}>−{diff.stats.removed}</span>
            </div>
            <div className="max-h-56 overflow-auto rounded-[10px] border border-[var(--line)] bg-[var(--paper)] font-mono text-[11px] leading-relaxed">
              {diff.lines.map((line, index) =>
                line === null ? (
                  <div
                    key={`gap-${index}`}
                    className="border-y border-dashed border-[var(--line)] bg-[var(--sand)] px-2 py-0.5 text-center text-[10px] text-[var(--text-5)]"
                  >
                    unchanged lines hidden
                  </div>
                ) : (
                  <div
                    key={`${line.op}-${index}`}
                    className={cn(
                      'flex gap-1.5 whitespace-pre-wrap break-words px-2',
                      line.op === 'add' && 'bg-[var(--ok-bg)] text-[var(--ok-fg)]',
                      line.op === 'remove' && 'bg-[rgba(179,56,46,0.08)] text-[var(--bad-fg)]',
                      line.op === 'equal' && 'text-[var(--text-4)]',
                    )}
                  >
                    <span aria-hidden className="select-none opacity-60">
                      {line.op === 'add' ? '+' : line.op === 'remove' ? '−' : ' '}
                    </span>
                    {/*
                      Rendered as text, always. This string is model output and
                      an approval card is the last surface that should be
                      interpreting it as markup (gate A12).
                    */}
                    <span className="min-w-0 flex-1">{line.text || ' '}</span>
                  </div>
                ),
              )}
            </div>
          </>
        ) : (
          <>
            <div className="plat-eyebrow mb-1 flex items-center gap-1.5">
              <FileWarning aria-hidden className="h-3 w-3" />
              No preview available — showing the raw request
            </div>
            {/*
              The tool input in full, pretty-printed. Summarising it would mean
              approving something you cannot see, which defeats the gate.
            */}
            <pre className="max-h-40 overflow-auto rounded-[10px] border border-[var(--line)] bg-[var(--paper)] p-2 text-[11px] leading-relaxed text-[var(--text-2)]">
              {JSON.stringify(approval.input, null, 2)}
            </pre>
          </>
        )}
      </div>

      {block && (
        <p
          role="status"
          className="mx-3 mt-2 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] px-2.5 py-1.5 text-xs text-[var(--text-2)]"
        >
          {BLOCK_MESSAGE[block]}
        </p>
      )}

      {reasonOpen && !locked && (
        <div className="px-3 pt-2">
          <label htmlFor={`reject-reason-${approval.actionId}`} className="sr-only">
            Why are you rejecting this?
          </label>
          <input
            id={`reject-reason-${approval.actionId}`}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void run(false, reason.trim() || undefined);
              if (event.key === 'Escape') setReasonOpen(false);
            }}
            placeholder="Why? (optional — recorded in the audit log)"
            className="w-full rounded-[10px] border border-[var(--line)] bg-[var(--paper)] px-2 py-1 text-xs text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">
        {settled ? (
          <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-3)]">
            <Check aria-hidden className="h-3 w-3" />
            {settled === 'approved' ? 'Approved' : 'Rejected'}
          </span>
        ) : block === 'stale' ? (
          // Clearing the block re-arms the card against the refetched action —
          // so the user re-confirms deliberately rather than the message simply
          // vanishing a moment after it appeared.
          <button
            data-command-exempt="acknowledges a stale approval and re-arms the card; scoped to that action"
            type="button"
            onClick={() => clearBlock(approval.actionId)}
            className="plat-btn-ghost !h-7 !px-3 !text-[11px] bg-[var(--paper)]"
          >
            Review again
          </button>
        ) : locked ? (
          <span className="text-[11px] text-[var(--text-4)]">No longer actionable.</span>
        ) : (
          <>
            <button
              data-command-exempt="approves one pending agent action; belongs to that action, not to the module"
              type="button"
              onClick={() => void run(true)}
              disabled={deciding}
              className="plat-btn !h-7 !px-3.5 !text-[11px] disabled:opacity-40"
            >
              {deciding && intent === 'approve' ? (
                <Loader2 aria-hidden className="h-3 w-3 animate-spin" />
              ) : (
                <Check aria-hidden className="h-3 w-3" />
              )}
              Approve
            </button>
            <button
              data-command-exempt="rejects one pending agent action; belongs to that action, not to the module"
              type="button"
              onClick={() => (reasonOpen ? void run(false, reason.trim() || undefined) : setReasonOpen(true))}
              disabled={deciding}
              className="plat-btn-ghost !h-7 !px-3 !text-[11px] bg-[var(--paper)] disabled:opacity-40"
            >
              {deciding && intent === 'reject' ? (
                <Loader2 aria-hidden className="h-3 w-3 animate-spin" />
              ) : (
                <X aria-hidden className="h-3 w-3" />
              )}
              Reject
            </button>
            <span className="text-[10px] text-[var(--warn-fg)]">Nothing is written until you decide.</span>
          </>
        )}
      </div>
    </div>
  );
}
