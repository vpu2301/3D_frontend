import { useState } from 'react';
import { Copy, Mail, X, Bot, Check } from 'lucide-react';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';

interface Props {
  docTitle: string;
}

export default function ShareModal({ docTitle }: Props) {
  const { shareOpen, setShareOpen } = useDocsUiStore();
  const [access, setAccess] = useState<'view' | 'comment' | 'edit'>('edit');
  const [email, setEmail] = useState('');
  const [invited, setInvited] = useState<{ email: string; access: string }[]>([]);
  const [copied, setCopied] = useState(false);

  if (!shareOpen) return null;

  const link = `${window.location.origin}${window.location.pathname}#mock-share`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const onInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setInvited((list) => [...list, { email, access }]);
    setEmail('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => setShareOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-[14px] border border-[var(--line-soft)] bg-white p-5 shadow-[0_16px_48px_rgba(20,22,26,0.16)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-[var(--ink)]">Share "{docTitle}"</h3>
          <button
            type="button"
            onClick={() => setShareOpen(false)}
            className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="mb-4 flex gap-2" onSubmit={onInvite}>
          <Mail className="absolute hidden" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Add people by email…"
            className="flex-1 rounded-[10px] border border-[var(--line-soft)] bg-[var(--sand)] px-2.5 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:bg-white focus:outline-none"
          />
          <select
            value={access}
            onChange={(e) => setAccess(e.target.value as any)}
            className="rounded-[10px] border border-[var(--line-soft)] bg-white px-2 py-1.5 text-sm text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
          >
            <option value="view">Can view</option>
            <option value="comment">Can comment</option>
            <option value="edit">Can edit</option>
          </select>
          <button
            type="submit"
            className="plat-btn h-9 px-4"
          >
            Invite
          </button>
        </form>

        {invited.length > 0 && (
          <div className="mb-4 space-y-1">
            {invited.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-[10px] bg-[var(--sand)] px-2.5 py-1.5 text-sm text-[var(--ink)]"
              >
                <span>{p.email}</span>
                <span className="text-xs text-[var(--text-4)]">{p.access}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mb-3 rounded-[12px] border border-[var(--line-soft)] p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[var(--ink)]">Anyone with the link</span>
            <select
              value={access}
              onChange={(e) => setAccess(e.target.value as any)}
              className="rounded-[10px] border border-[var(--line-soft)] bg-white px-2 py-0.5 text-xs text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
            >
              <option value="view">Can view</option>
              <option value="comment">Can comment</option>
              <option value="edit">Can edit</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={link}
              className="flex-1 rounded-[10px] border border-[var(--line-soft)] bg-[var(--sand)] px-2 py-1.5 text-xs text-[var(--text-2)]"
            />
            <button
              type="button"
              onClick={onCopy}
              className="plat-btn-ghost h-8 px-3 text-[11.5px]"
            >
              {copied ? <Check className="h-3 w-3 text-[var(--ok-fg)]" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[12px] border border-dashed border-[var(--line)] bg-[var(--sand)]/60 p-3 text-sm">
          <div className="flex items-center gap-2 text-[var(--text-4)]">
            <Bot className="h-4 w-4" />
            <div>
              <div className="font-semibold text-[var(--text-2)]">Share with AI agents</div>
              <div className="text-xs">Coming soon</div>
            </div>
          </div>
          <span className="plat-pill plat-pill-mute uppercase tracking-wider">
            Preview
          </span>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShareOpen(false)}
            className="plat-btn-ghost"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
