import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Paperclip, FileText, StickyNote, Calendar as CalendarIcon, ListTodo } from 'lucide-react';
import { useMailStore } from '@/pages/mail/_hooks/use-mail-store';
import { useMailUiStore } from '@/pages/mail/_hooks/use-mail-ui-store';
import type { Email } from '@/pages/mail/_lib/types';
import HtmlMessage from './HtmlMessage';
import Avatar from '../list/Avatar';
import { cn } from '@/lib/utils';

interface Props {
  email: Email;
  defaultExpanded: boolean;
  onParticipantClick?: (contactId?: string, email?: string) => void;
}

const CONTEXT_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  doc: FileText,
  note: StickyNote,
  event: CalendarIcon,
  task: ListTodo,
};

export default function MessageItem({ email, defaultExpanded, onParticipantClick }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [body, setBody] = useState<string | undefined>(undefined);
  const getBody = useMailStore((s) => s.getBody);
  const showImages = useMailUiStore((s) => !!s.showBlockedImages[email.id]);
  const showImagesFor = useMailUiStore((s) => s.showImagesFor);

  useEffect(() => {
    if (!expanded) return;
    let cancelled = false;
    getBody(email.id).then((b) => {
      if (!cancelled) setBody(b);
    });
    return () => {
      cancelled = true;
    };
  }, [expanded, email.id, getBody]);

  const sentAt = email.sentAt ?? email.receivedAt;
  const dateLabel = new Date(sentAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="border-b border-[var(--line-soft)] last:border-0">
      <button
        type="button"
        onClick={() => setExpanded((x) => !x)}
        className={cn(
          'flex w-full items-start gap-3 px-6 py-3 text-left transition-colors hover:bg-[rgba(20,22,26,0.02)]',
          expanded && 'bg-white',
        )}
      >
        <Avatar name={email.from.name} email={email.from.email} size={32} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-[var(--ink)]">{email.from.name}</span>
            <span className="text-[11px] text-[var(--text-4)]">&lt;{email.from.email}&gt;</span>
            <span className="ml-auto text-[11px] text-[var(--text-4)]">{dateLabel}</span>
          </div>
          {!expanded && (
            <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-4)]">{email.snippet}</p>
          )}
          {expanded && (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-4)]">
              <span>To: {email.to.map((r) => r.name).join(', ') || 'me'}</span>
              {email.cc.length > 0 && <span>· Cc: {email.cc.map((r) => r.name).join(', ')}</span>}
              {email.aiTone && email.aiTone.tone !== 'neutral' && (
                <span className="rounded-full bg-[var(--sand-deep)] px-1.5 py-0.5 text-[10px] font-medium capitalize text-[var(--text-3)]">
                  {email.aiTone.tone}
                </span>
              )}
            </div>
          )}
        </div>
        {expanded ? <ChevronDown className="mt-1 h-3.5 w-3.5 text-[var(--text-5)]" /> : <ChevronRight className="mt-1 h-3.5 w-3.5 text-[var(--text-5)]" />}
      </button>

      {expanded && (
        <div className="px-6 pb-5">
          <HtmlMessage
            html={body}
            plainText={email.bodyText}
            showImages={showImages}
            onShowImages={() => showImagesFor(email.id)}
          />

          {email.attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {email.attachments.map((a) => (
                <button
                  key={a.driveFileId}
                  type="button"
                  className="flex items-center gap-2 rounded-[10px] border border-[var(--line-soft)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  title={a.filename}
                >
                  <Paperclip className="h-3.5 w-3.5 text-[var(--text-4)]" />
                  <span className="max-w-[160px] truncate">{a.filename}</span>
                  {a.size && <span className="text-[10px] text-[var(--text-5)]">{formatBytes(a.size)}</span>}
                </button>
              ))}
            </div>
          )}

          {email.contextRefs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {email.contextRefs.map((ref) => {
                const Icon = CONTEXT_ICON[ref.type] ?? FileText;
                return (
                  <span
                    key={`${ref.type}_${ref.targetId}`}
                    className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--line-soft)] bg-[var(--sand)] px-2 py-1 text-[11px] font-medium text-[var(--text-2)]"
                  >
                    <Icon className="h-3 w-3" />
                    {ref.label ?? `${ref.type}:${ref.targetId.slice(0, 8)}`}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}
