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
    <div className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-gray-50 py-2.5 last:border-0">
      <dt className="text-xs font-medium text-gray-400">{label}</dt>
      <dd className={cn('text-sm text-gray-700', mono && 'font-mono text-xs')}>{value}</dd>
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
        <SheetHeader className="space-y-1 border-b border-gray-100 px-6 pb-4 pt-5 text-left">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#f0e9df] px-2.5 py-0.5 text-[11px] font-medium text-gray-700">
              {t(`category.${c.category}`)}
            </span>
            <span className="font-mono text-[11px] text-gray-400">{c.transactionRef}</span>
          </div>
          <SheetTitle className="font-display text-xl font-light leading-snug text-gray-900">
            {c.problem}
          </SheetTitle>
          <SheetDescription className="text-xs text-gray-400">
            {mandate?.name} · {formatCurrency(i18n.language, c.amount, c.currency)}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 py-5">
          {/* Confidence block */}
          <div
            className={cn(
              'flex items-center gap-4 rounded-xl border p-4',
              high ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50',
            )}
          >
            <p className={cn('font-display text-4xl font-light', high ? 'text-green-700' : 'text-amber-700')}>
              {c.confidence}
              <span className="text-lg">%</span>
            </p>
            <div>
              <p className={cn('flex items-center gap-1.5 text-xs font-semibold', high ? 'text-green-700' : 'text-amber-700')}>
                {high ? <BadgeCheck aria-hidden className="h-3.5 w-3.5" /> : <CircleAlert aria-hidden className="h-3.5 w-3.5" />}
                {high ? t('queue.highConfidence') : t('queue.belowThreshold')}
              </p>
              <p className="mt-0.5 text-xs text-gray-600">
                {high ? t('drawer.confidenceNoteHigh') : t('drawer.confidenceNoteLow')}
              </p>
            </div>
          </div>

          {/* Evidence */}
          <h3 className="mb-1 mt-6 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {t('drawer.evidence')}
          </h3>
          <dl>
            <EvidenceRow label={t('drawer.problem')} value={c.problem} />
            <EvidenceRow label={t('drawer.suspectedCause')} value={c.suspectedCause} />
            <EvidenceRow label={t('drawer.source')} value={c.source} />
            <div className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-gray-50 py-2.5">
              <dt className="text-xs font-medium text-gray-400">{t('drawer.ruleCheck')}</dt>
              <dd className="flex items-start gap-1.5 text-sm text-gray-700">
                {c.ruleCheckPassed ? (
                  <ShieldCheck aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                ) : (
                  <ShieldX aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                )}
                {c.ruleCheck}
              </dd>
            </div>
            <EvidenceRow label={t('drawer.category')} value={t(`category.${c.category}`)} />
            <EvidenceRow label={t('drawer.transaction')} value={c.transactionRef} mono />
            <EvidenceRow label={t('drawer.amount')} value={formatCurrency(i18n.language, c.amount, c.currency)} />
          </dl>

          {/* Proposed action */}
          <h3 className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
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
                  className="rounded-full bg-gray-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                >
                  {t('drawer.saveProposal')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-full border border-gray-200 px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-900/10 bg-[#faf7f2] p-4">
              <p className="text-sm text-gray-800">{c.proposedAction}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={handleApprove}
            disabled={!can('approve') || editing}
            title={!can('approve') ? t('common.noPermission') : undefined}
            className={cn(
              'flex-1 rounded-full px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400',
              high ? 'bg-green-700 hover:bg-green-800' : 'bg-amber-600 hover:bg-amber-700',
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
              'inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400',
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
              'rounded-full border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300',
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
