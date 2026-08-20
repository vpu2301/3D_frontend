import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, CircleAlert, Pencil, ShieldCheck, ShieldX } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { CloseCase } from '@/pages/accounting/_lib/types';
import { CONFIDENCE_THRESHOLD } from '@/pages/accounting/_lib/types';
import { useAccountingStore } from '@/pages/accounting/_hooks/use-accounting-store';
import { formatCurrency } from '@/pages/accounting/_lib/format';

interface CaseDrawerProps {
  caseId: string | null;
  onClose: () => void;
}

function EvidenceRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-[var(--line-soft)] py-2.5 last:border-0">
      <dt className="text-xs font-medium text-[#7a8087]">{label}</dt>
      <dd className={cn('text-sm text-[#4a5057]', mono && 'text-xs')} style={mono ? { fontFamily: "'IBM Plex Mono', monospace" } : undefined}>{value}</dd>
    </div>
  );
}

export default function CaseDrawer({ caseId, onClose }: CaseDrawerProps) {
  const { t, i18n } = useTranslation('accounting');
  const { toast } = useToast();

  const c: CloseCase | undefined = useAccountingStore((s) =>
    s.cases.find((x) => x.id === caseId),
  );
  const mandate = useAccountingStore((s) =>
    s.mandates.find((m) => m.id === c?.mandateId),
  );
  const can = useAccountingStore((s) => s.can);
  const approveCase = useAccountingStore((s) => s.approveCase);
  const rejectCase = useAccountingStore((s) => s.rejectCase);
  const editCaseProposal = useAccountingStore((s) => s.editCaseProposal);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  if (!c) return null;

  const high = c.confidence >= CONFIDENCE_THRESHOLD;

  const handleApprove = () => {
    approveCase(c.id);
    toast({
      title: t('drawer.toastApproved'),
      description: t('drawer.toastApprovedDesc', { ref: c.transactionRef }),
    });
    onClose();
  };

  const handleReject = () => {
    rejectCase(c.id);
    toast({
      title: t('drawer.toastRejected'),
      description: t('drawer.toastRejectedDesc', { ref: c.transactionRef }),
    });
    onClose();
  };

  const startEdit = () => {
    setDraft(c.proposedAction);
    setEditing(true);
  };

  const saveEdit = () => {
    editCaseProposal(c.id, draft.trim() || c.proposedAction);
    setEditing(false);
    toast({ title: t('drawer.toastEdited'), description: t('drawer.toastEditedDesc') });
  };

  return (
    <Sheet open={!!caseId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <SheetHeader className="space-y-1.5 border-b border-[var(--line-soft)] px-6 pb-5 pt-5 text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#e9ebef] px-3 py-1 text-[11.5px] font-semibold text-[#6b7178]">
              {t(`category.${c.category}`)}
            </span>
            <span className="text-[11px] text-[#7a8087]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {c.transactionRef}
            </span>
          </div>
          <SheetTitle
            className="text-[21px] font-semibold leading-snug tracking-[-0.03em] text-[#14161a]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {c.problem}
          </SheetTitle>
          <SheetDescription className="text-xs text-[#7a8087]">
            {mandate?.name} · {formatCurrency(i18n.language, c.amount, c.currency)}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 py-5">
          {/* Confidence block */}
          <div
            className={cn(
              'flex items-center gap-4 rounded-[14px] border p-4',
              high ? 'border-[#c6e5d1] bg-[#e6f5ea]' : 'border-[#f0d9bf] bg-[#fdf0e4]',
            )}
          >
            <p
              className={cn('text-4xl font-semibold tracking-[-0.035em]', high ? 'text-[#1e7a3c]' : 'text-[#9a5312]')}
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {c.confidence}
              <span className="text-lg">%</span>
            </p>
            <div>
              <p className={cn('flex items-center gap-1.5 text-xs font-semibold', high ? 'text-[#1e7a3c]' : 'text-[#9a5312]')}>
                {high ? <BadgeCheck aria-hidden className="h-3.5 w-3.5" /> : <CircleAlert aria-hidden className="h-3.5 w-3.5" />}
                {high ? t('queue.highConfidence') : t('queue.belowThreshold')}
              </p>
              <p className="mt-0.5 text-xs text-[#5a6067]">
                {high ? t('drawer.confidenceNoteHigh') : t('drawer.confidenceNoteLow')}
              </p>
            </div>
          </div>

          {/* Evidence */}
          <h3
            className="mb-1 mt-6 text-[10px] font-medium uppercase tracking-[0.22em] text-[#9aa0a6]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {t('drawer.evidence')}
          </h3>
          <dl>
            <EvidenceRow label={t('drawer.problem')} value={c.problem} />
            <EvidenceRow label={t('drawer.suspectedCause')} value={c.suspectedCause} />
            <EvidenceRow label={t('drawer.source')} value={c.source} />
            <div className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-[var(--line-soft)] py-2.5">
              <dt className="text-xs font-medium text-[#7a8087]">{t('drawer.ruleCheck')}</dt>
              <dd className="flex items-start gap-1.5 text-sm text-[#4a5057]">
                {c.ruleCheckPassed ? (
                  <ShieldCheck aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1e7a3c]" />
                ) : (
                  <ShieldX aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9a5312]" />
                )}
                {c.ruleCheck}
              </dd>
            </div>
            <EvidenceRow label={t('drawer.category')} value={t(`category.${c.category}`)} />
            <EvidenceRow label={t('drawer.transaction')} value={c.transactionRef} mono />
            <EvidenceRow label={t('drawer.amount')} value={formatCurrency(i18n.language, c.amount, c.currency)} />
          </dl>

          {/* Proposed action */}
          <h3
            className="mb-2 mt-6 text-[10px] font-medium uppercase tracking-[0.22em] text-[#9aa0a6]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {t('drawer.proposedAction')}
          </h3>
          {editing ? (
            <div>
              <label htmlFor="proposal-edit" className="sr-only">{t('drawer.editLabel')}</label>
              <Textarea
                id="proposal-edit"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={4}
                className="text-sm"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={saveEdit}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-[#14161a] px-5 text-xs font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14161a]/25"
                >
                  {t('drawer.saveProposal')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-xs font-semibold text-[#5a6067] transition-colors hover:border-[var(--ink)] hover:text-[#14161a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14161a]/25"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-[12px] border border-[var(--line-soft)] bg-[#f4f5f7] p-4">
              <p className="text-sm text-[#14161a]">{c.proposedAction}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-[var(--line-soft)] px-6 py-4">
          <button
            type="button"
            onClick={handleApprove}
            disabled={!can('approve') || editing}
            title={!can('approve') ? t('common.noPermission') : undefined}
            className={cn(
              'inline-flex h-10 flex-1 items-center justify-center rounded-full bg-[#14161a] px-5 text-[13px] font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14161a]/25',
              (!can('approve') || editing) && 'cursor-not-allowed opacity-40',
            )}
          >
            {high ? t('drawer.approve') : t('drawer.reviewApprove')}
          </button>
          <button
            type="button"
            onClick={startEdit}
            disabled={!can('prepare') || editing}
            title={!can('prepare') ? t('common.noPermission') : undefined}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-[12.5px] font-semibold text-[#5a6067] transition-colors hover:border-[var(--ink)] hover:text-[#14161a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14161a]/25',
              (!can('prepare') || editing) && 'cursor-not-allowed opacity-40',
            )}
          >
            <Pencil aria-hidden className="h-3.5 w-3.5" />
            {t('common.edit')}
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={!can('approve') || editing}
            title={!can('approve') ? t('common.noPermission') : undefined}
            className={cn(
              'inline-flex h-10 items-center rounded-full border border-[rgba(179,56,46,0.25)] px-4 text-[12.5px] font-semibold text-[#b3382e] transition-colors hover:bg-[rgba(179,56,46,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b3382e]/25',
              (!can('approve') || editing) && 'cursor-not-allowed opacity-40',
            )}
          >
            {t('drawer.reject')}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
