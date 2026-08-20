import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import type { ReplyIntent } from '@/pages/mail/_lib/types';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (intent: ReplyIntent, freeFormPrompt?: string) => void;
}

const INTENTS: { id: Exclude<ReplyIntent, 'free-form'>; label: string; hint: string }[] = [
  { id: 'acknowledge', label: 'Acknowledge', hint: 'Got it, will follow up' },
  { id: 'decline', label: 'Decline politely', hint: 'No, but thanks' },
  { id: 'ask-more-info', label: 'Ask for more info', hint: 'Need clarity before responding' },
  { id: 'confirm-and-propose-time', label: 'Confirm + propose time', hint: 'Yes, here are a few slots' },
  { id: 'push-back', label: 'Push back politely', hint: 'Disagree, suggest alternative' },
];

export default function ReplyIntentPicker({ open, onClose, onPick }: Props) {
  const [freeForm, setFreeForm] = useState('');
  if (!open) return null;
  return (
    <div
      role="dialog"
      className="absolute inset-x-3 bottom-12 z-20 rounded-[14px] border border-[var(--line)] bg-white p-3 shadow-xl"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="plat-eyebrow flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Reply with AI
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-[6px] p-0.5 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {INTENTS.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => onPick(i.id)}
            className="rounded-[12px] border border-[var(--line-soft)] bg-white px-2.5 py-2 text-left text-sm transition-colors hover:border-[var(--ink)]"
          >
            <div className="font-semibold text-[var(--ink)]">{i.label}</div>
            <div className="text-[11px] text-[var(--text-4)]">{i.hint}</div>
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-1">
        <input
          value={freeForm}
          onChange={(e) => setFreeForm(e.target.value)}
          placeholder="Or describe the reply…"
          className={cn(
            'flex-1 rounded-[10px] border border-[var(--line-soft)] bg-[var(--sand)] px-3 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--text-5)]',
            'focus:border-[var(--ink)] focus:bg-white focus:outline-none',
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && freeForm.trim()) onPick('free-form', freeForm.trim());
          }}
        />
        <button
          type="button"
          onClick={() => freeForm.trim() && onPick('free-form', freeForm.trim())}
          disabled={!freeForm.trim()}
          className="rounded-full bg-[var(--ink)] px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-[0.86] disabled:opacity-35"
        >
          Draft
        </button>
      </div>
    </div>
  );
}
