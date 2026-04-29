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
      className="absolute inset-x-3 bottom-12 z-20 rounded-lg border border-[#8fc4e4]/40 bg-white p-3 shadow-xl"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#1a73e8]">
          <Sparkles className="h-3.5 w-3.5" />
          Reply with AI
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 text-gray-400 hover:bg-gray-100"
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
            className="rounded-md border border-gray-100 bg-white px-2.5 py-2 text-left text-sm hover:border-[#8fc4e4] hover:bg-[#f8fbff]"
          >
            <div className="font-medium text-gray-900">{i.label}</div>
            <div className="text-[11px] text-gray-500">{i.hint}</div>
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-1">
        <input
          value={freeForm}
          onChange={(e) => setFreeForm(e.target.value)}
          placeholder="Or describe the reply…"
          className={cn(
            'flex-1 rounded-full border border-transparent bg-[#f1f3f4] px-3 py-1.5 text-sm',
            'focus:border-[#8fc4e4] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8fc4e4]',
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && freeForm.trim()) onPick('free-form', freeForm.trim());
          }}
        />
        <button
          type="button"
          onClick={() => freeForm.trim() && onPick('free-form', freeForm.trim())}
          disabled={!freeForm.trim()}
          className="rounded-full bg-[#bdd8ec] px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-[#a5c8e0] disabled:opacity-50"
        >
          Draft
        </button>
      </div>
    </div>
  );
}
