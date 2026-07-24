import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, CircleAlert, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CloseCase } from '@/pages/accounting/_lib/types';
import { CONFIDENCE_THRESHOLD } from '@/pages/accounting/_lib/types';
import {
  useAccountingStore,
  selectPendingCases,
} from '@/pages/accounting/_hooks/use-accounting-store';
import { formatCurrency } from '@/pages/accounting/_lib/format';
import ViewHeader from '@/pages/accounting/_components/shared/ViewHeader';
import CaseDrawer from '@/pages/accounting/_components/queue/CaseDrawer';

function CaseCard({ c, mandateName, onOpen }: { c: CloseCase; mandateName: string; onOpen: () => void }) {
  const { t, i18n } = useTranslation('accounting');
  const high = c.confidence >= CONFIDENCE_THRESHOLD;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'group flex w-full flex-col rounded-xl border bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400',
        high ? 'border-gray-200' : 'border-amber-200',
      )}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="rounded-full bg-[#f0e9df] px-2.5 py-0.5 text-[11px] font-medium text-gray-700">
          {t(`category.${c.category}`)}
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
            high ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700',
          )}
        >
          {high ? <BadgeCheck aria-hidden className="h-3 w-3" /> : <CircleAlert aria-hidden className="h-3 w-3" />}
          {c.confidence}% · {high ? t('queue.highConfidence') : t('queue.belowThreshold')}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium leading-snug text-gray-900">{c.problem}</p>

      <p className="mt-2 text-xs text-gray-400">
        {mandateName} · <span className="font-mono">{c.transactionRef}</span> ·{' '}
        {formatCurrency(i18n.language, c.amount, c.currency)}
      </p>

      <div className="mt-3 w-full rounded-lg bg-[#faf7f2] px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {t('queue.proposedAction')}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-gray-700">{c.proposedAction}</p>
      </div>
    </button>
  );
}

export default function ReviewQueueView() {
  const { t } = useTranslation('accounting');
  const [searchParams, setSearchParams] = useSearchParams();

  const pending = useAccountingStore(selectPendingCases);
  const mandates = useAccountingStore((s) => s.mandates);

  const [openCaseId, setOpenCaseId] = useState<string | null>(null);

  // Deep link from Close Radar: ?mandate=<id> focuses that mandate's first case.
  const mandateParam = searchParams.get('mandate');
  useEffect(() => {
    if (!mandateParam) return;
    const first = pending.find((c) => c.mandateId === mandateParam);
    if (first) setOpenCaseId(first.id);
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mandateParam]);

  const mandateName = (id: string) => mandates.find((m) => m.id === id)?.name ?? id;

  // Below-threshold cases listed after high-confidence ones, then by confidence.
  const sorted = [...pending].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <ViewHeader
        title={t('queue.title')}
        subtitle={t('queue.subtitle')}
        right={
          pending.length > 0 ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
              {t('queue.casesPending', { count: pending.length })}
            </span>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {sorted.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-20 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <Inbox aria-hidden className="h-5 w-5 text-green-600" />
            </span>
            <p className="mt-3 text-sm font-medium text-gray-700">{t('queue.emptyTitle')}</p>
            <p className="mt-1 max-w-xs text-xs text-gray-400">{t('queue.emptyBody')}</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2" aria-label={t('queue.title')}>
            {sorted.map((c) => (
              <li key={c.id}>
                <CaseCard c={c} mandateName={mandateName(c.mandateId)} onOpen={() => setOpenCaseId(c.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <CaseDrawer caseId={openCaseId} onClose={() => setOpenCaseId(null)} />
    </div>
  );
}
