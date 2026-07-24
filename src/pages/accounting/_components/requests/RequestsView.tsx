import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCheck, FileEdit, Mail, MessageCircle, MessageSquare, Phone, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RequestChannel } from '@/pages/accounting/_lib/types';
import { useAccountingStore } from '@/pages/accounting/_hooks/use-accounting-store';
import ViewHeader from '@/pages/accounting/_components/shared/ViewHeader';
import RequestApprovalModal from '@/pages/accounting/_components/requests/RequestApprovalModal';

const CHANNEL_ICON: Record<RequestChannel, typeof Mail> = {
  email: Mail,
  teams: MessageSquare,
  whatsapp: MessageCircle,
  viber: Phone,
  portal: Globe,
};

export default function RequestsView() {
  const { t } = useTranslation('accounting');
  const requests = useAccountingStore((s) => s.requests);
  const mandates = useAccountingStore((s) => s.mandates);
  const [openRequestId, setOpenRequestId] = useState<string | null>(null);

  const mandateName = (id: string) => mandates.find((m) => m.id === id)?.name ?? id;

  // Drafts first (they need action), then sent.
  const sorted = [...requests].sort((a, b) =>
    a.status === b.status ? a.id.localeCompare(b.id) : a.status === 'draft' ? -1 : 1,
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <ViewHeader title={t('requests.title')} subtitle={t('requests.subtitle')} />

      <div className="flex-1 overflow-y-auto p-6">
        {sorted.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-medium text-gray-700">{t('requests.emptyTitle')}</p>
            <p className="mt-1 max-w-xs text-xs text-gray-400">{t('requests.emptyBody')}</p>
          </div>
        ) : (
          <ul className="space-y-2.5" aria-label={t('requests.title')}>
            {sorted.map((r) => {
              const Icon = CHANNEL_ICON[r.channel];
              const draft = r.status === 'draft';
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => draft && setOpenRequestId(r.id)}
                    disabled={!draft}
                    title={!draft ? t('requests.readOnly') : undefined}
                    className={cn(
                      'flex w-full items-center gap-4 rounded-xl border bg-white p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400',
                      draft
                        ? 'border-amber-200 hover:-translate-y-0.5 hover:shadow-md'
                        : 'cursor-default border-gray-100 opacity-70',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                        draft ? 'bg-amber-50' : 'bg-gray-50',
                      )}
                    >
                      <Icon aria-hidden className={cn('h-4 w-4', draft ? 'text-amber-600' : 'text-gray-400')} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-gray-900">{r.title}</p>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            draft ? 'bg-amber-100 text-amber-800' : 'bg-green-50 text-green-700',
                          )}
                        >
                          {draft ? <FileEdit aria-hidden className="h-2.5 w-2.5" /> : <CheckCheck aria-hidden className="h-2.5 w-2.5" />}
                          {draft ? t('requests.draft') : t('requests.sent')}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-400">
                        {mandateName(r.mandateId)} · {t(`requests.channel.${r.channel}`)} · {t('requests.to')}{' '}
                        {r.recipient}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-gray-400">
                      {t('requests.itemCount', { count: r.bundledItems.length })}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <RequestApprovalModal requestId={openRequestId} onClose={() => setOpenRequestId(null)} />
    </div>
  );
}
