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
        className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Share "{docTitle}"</h3>
          <button
            type="button"
            onClick={() => setShareOpen(false)}
            className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
            className="flex-1 rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
          />
          <select
            value={access}
            onChange={(e) => setAccess(e.target.value as any)}
            className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="view">Can view</option>
            <option value="comment">Can comment</option>
            <option value="edit">Can edit</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Invite
          </button>
        </form>

        {invited.length > 0 && (
          <div className="mb-4 space-y-1">
            {invited.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md bg-zinc-50 px-2 py-1 text-sm dark:bg-zinc-800"
              >
                <span>{p.email}</span>
                <span className="text-xs text-zinc-500">{p.access}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mb-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-700">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>Anyone with the link</span>
            <select
              value={access}
              onChange={(e) => setAccess(e.target.value as any)}
              className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
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
              className="flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800"
            />
            <button
              type="button"
              onClick={onCopy}
              className="flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border border-dashed border-zinc-300 bg-zinc-50/50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800/30">
          <div className="flex items-center gap-2 text-zinc-500">
            <Bot className="h-4 w-4" />
            <div>
              <div className="font-medium text-zinc-700 dark:text-zinc-300">Share with AI agents</div>
              <div className="text-xs">Coming soon</div>
            </div>
          </div>
          <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500 dark:border-zinc-600">
            Preview
          </span>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShareOpen(false)}
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
