import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Pencil, SendHorizonal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAccountingStore } from '@/pages/accounting/_hooks/use-accounting-store';

interface RequestApprovalModalProps {
  requestId: string | null;
  onClose: () => void;
}

export default function RequestApprovalModal({ requestId, onClose }: RequestApprovalModalProps) {
  const { t } = useTranslation('accounting');
  const { toast } = useToast();

  const request = useAccountingStore((s) => s.requests.find((r) => r.id === requestId));
  const mandate = useAccountingStore((s) => s.mandates.find((m) => m.id === request?.mandateId));
  const can = useAccountingStore((s) => s.can);
  const editRequest = useAccountingStore((s) => s.editRequest);
  const approveAndSendRequest = useAccountingStore((s) => s.approveAndSendRequest);

  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [bodyDraft, setBodyDraft] = useState('');

  if (!request) return null;

  const channelLabel = t(`requests.channel.${request.channel}`);

  const handleSend = () => {
    approveAndSendRequest(request.id);
    toast({
      title: t('modal.toastSent'),
      description: t('modal.toastSentDesc', { channel: channelLabel, recipient: request.recipient }),
    });
    onClose();
  };

  const startEdit = () => {
    setTitleDraft(request.title);
    setBodyDraft(request.body);
    setEditing(true);
  };

  const saveEdit = () => {
    editRequest(request.id, {
      title: titleDraft.trim() || request.title,
      body: bodyDraft.trim() || request.body,
    });
    setEditing(false);
    toast({ title: t('modal.toastEdited'), description: t('modal.toastEditedDesc') });
  };

  return (
    <Dialog open={!!requestId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-xl font-light text-gray-900">
            {t('modal.title')}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            {mandate?.name}
          </DialogDescription>
        </DialogHeader>

        {/* Approval reminder (§7) */}
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
          <Info aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-800">{t('modal.reminder')}</p>
        </div>

        {/* Draft as the client will receive it */}
        <div className="rounded-xl border border-gray-200">
          <div className="grid grid-cols-[6.5rem_1fr] gap-2 border-b border-gray-100 px-4 py-2.5 text-sm">
            <span className="text-xs font-medium text-gray-400">{t('modal.channel')}</span>
            <span className="text-gray-800">{channelLabel}</span>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] gap-2 border-b border-gray-100 px-4 py-2.5 text-sm">
            <span className="text-xs font-medium text-gray-400">{t('modal.recipient')}</span>
            <span className="text-gray-800">{request.recipient}</span>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] gap-2 border-b border-gray-100 px-4 py-2.5 text-sm">
            <span className="text-xs font-medium text-gray-400">{t('modal.subject')}</span>
            {editing ? (
              <div>
                <label htmlFor="req-subject" className="sr-only">{t('modal.editLabelSubject')}</label>
                <input
                  id="req-subject"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                />
              </div>
            ) : (
              <span className="font-medium text-gray-900">{request.title}</span>
            )}
          </div>
          <div className="px-4 py-3">
            {editing ? (
              <div>
                <label htmlFor="req-body" className="sr-only">{t('modal.editLabelMessage')}</label>
                <Textarea
                  id="req-body"
                  value={bodyDraft}
                  onChange={(e) => setBodyDraft(e.target.value)}
                  rows={4}
                  className="text-sm"
                />
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-gray-700">{request.body}</p>
            )}
            <p className="mb-1.5 mt-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {t('modal.bundledItems')}
            </p>
            <ul className="space-y-1.5">
              {request.bundledItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {editing ? (
            <>
              <button
                type="button"
                onClick={saveEdit}
                className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                {t('common.save')}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                {t('common.cancel')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSend}
                disabled={!can('send')}
                title={!can('send') ? t('common.noPermission') : undefined}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400',
                  !can('send') && 'cursor-not-allowed opacity-40',
                )}
              >
                <SendHorizonal aria-hidden className="h-3.5 w-3.5" />
                {t('modal.approveSend')}
              </button>
              <button
                type="button"
                onClick={startEdit}
                disabled={!can('prepare')}
                title={!can('prepare') ? t('common.noPermission') : undefined}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400',
                  !can('prepare') && 'cursor-not-allowed opacity-40',
                )}
              >
                <Pencil aria-hidden className="h-3.5 w-3.5" />
                {t('common.edit')}
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
