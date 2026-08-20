import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, ChevronRight, CircleAlert, Inbox } from 'lucide-react';
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
      className="group flex w-full flex-col px-5 py-4 text-left transition-colors hover:bg-[rgba(20,22,26,0.02)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ink)]/25"
    >
      <div className="flex w-full items-center gap-2">
        <span className="plat-pill plat-pill-mute">{t(`category.${c.category}`)}</span>
        <span className={cn('plat-pill', high ? 'plat-pill-ok' : 'plat-pill-warn')}>
          {high ? <BadgeCheck aria-hidden className="h-3 w-3" /> : <CircleAlert aria-hidden className="h-3 w-3" />}
          {c.confidence}% · {high ? t('queue.highConfidence') : t('queue.belowThreshold')}
        </span>
        <ChevronRight
          aria-hidden
          className="ml-auto h-4 w-4 shrink-0 text-[var(--text-5)] transition-colors group-hover:text-[var(--ink)]"
        />
      </div>

      <p className="mt-3 text-[14.5px] font-medium leading-snug text-[var(--ink)]">{c.problem}</p>

      <p className="mt-1.5 text-xs text-[var(--text-4)]">
        {mandateName} · <span style={{ fontFamily: 'var(--mono)' }}>{c.transactionRef}</span> ·{' '}
        <span style={{ fontFamily: 'var(--mono)' }}>{formatCurrency(i18n.language, c.amount, c.currency)}</span>
      </p>

      <div className="mt-3 w-full rounded-[12px] bg-[var(--sand)] px-3 py-2.5">
        <p className="plat-eyebrow">{t('queue.proposedAction')}</p>
        <p className="mt-1 line-clamp-2 text-xs text-[var(--text-1)]">{c.proposedAction}</p>
      </div>
    </button>
  );
}

export default function ReviewQueueView() {
  const { t } = useTranslation('accounting');
  const [searchParams, setSearchParams] = useSearchParams();

  const cases = useAccountingStore((s) => s.cases);
  const mandates = useAccountingStore((s) => s.mandates);
  const pending = useMemo(() => selectPendingCases({ cases }), [cases]);

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
    <div className="flex flex-1 flex-col overflow-hidden">
      <ViewHeader
        title={t('queue.title')}
        subtitle={t('queue.subtitle')}
        right={
          pending.length > 0 ? (
            <span className="plat-pill plat-pill-warn">
              {t('queue.casesPending', { count: pending.length })}
            </span>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {sorted.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-20 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ok-bg)]">
              <Inbox aria-hidden className="h-5 w-5 text-[var(--ok-fg)]" />
            </span>
            <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{t('queue.emptyTitle')}</p>
            <p className="mt-1 max-w-xs text-xs text-[var(--text-4)]">{t('queue.emptyBody')}</p>
          </div>
        ) : (
          <ul className="plat-list" aria-label={t('queue.title')}>
            {sorted.map((c) => (
              <li key={c.id} className="border-b border-[var(--line-soft)] last:border-0">
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
