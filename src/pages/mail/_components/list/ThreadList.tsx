import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Paperclip,
  Archive,
  Moon,
  Trash2,
  Tag,
  Sparkles,
  CalendarPlus,
  ListTodo,
  Search,
  X,
  CheckSquare,
  Square,
} from 'lucide-react';
import {
  useMailStore,
  selectEmails,
  selectThreads,
} from '@/pages/mail/_hooks/use-mail-store';
import { useMailUiStore } from '@/pages/mail/_hooks/use-mail-ui-store';
import type { Email, Thread, MailCategory } from '@/pages/mail/_lib/types';
import Avatar from './Avatar';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: { id: MailCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'important', label: 'Important' },
  { id: 'updates', label: 'Updates' },
  { id: 'promos', label: 'Promos' },
  { id: 'calendar', label: 'Calendar' },
];

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const m = 60_000;
  const h = 3_600_000;
  const d = 86_400_000;
  if (diff < h) return `${Math.max(1, Math.floor(diff / m))}m`;
  if (diff < d) return `${Math.floor(diff / h)}h`;
  if (diff < 7 * d) return `${Math.floor(diff / d)}d`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

interface Props {
  /** Predicate filtering threads to show in this list. */
  predicate: (thread: Thread, emails: Email[]) => boolean;
  /** Heading shown above the list. */
  title: string;
  /** Whether to show the category tabs at top (Inbox does, folders don't). */
  showCategoryTabs?: boolean;
}

export default function ThreadList({ predicate, title, showCategoryTabs }: Props) {
  const emailsMap = useMailStore(selectEmails);
  const threadsMap = useMailStore(selectThreads);
  const labels = useMailStore((s) => s.labels);
  const archive = useMailStore((s) => s.archive);
  const trash = useMailStore((s) => s.trash);
  const snooze = useMailStore((s) => s.snooze);
  const toggleStar = useMailStore((s) => s.toggleStar);
  const {
    selectedThreadId,
    setSelectedThreadId,
    selectedEmailIds,
    toggleSelected,
    clearSelection,
    query,
    setQuery,
    category,
    setCategory,
  } = useMailUiStore();
  const navigate = useNavigate();
  const [hoverId, setHoverId] = useState<string | null>(null);

  const threadList = useMemo(() => {
    const allThreads = Object.values(threadsMap);
    return allThreads
      .map((t) => {
        const emails = t.emailIds.map((id) => emailsMap[id]).filter(Boolean) as Email[];
        return { thread: t, emails };
      })
      .filter(({ thread, emails }) => emails.length > 0 && predicate(thread, emails))
      .filter(({ emails }) => {
        if (category === 'all' || !showCategoryTabs) return true;
        return emails.some((e) => e.category === category);
      })
      .filter(({ thread, emails }) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        if (thread.subject.toLowerCase().includes(q)) return true;
        if (thread.participants.some((p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))) return true;
        return emails.some((e) => e.snippet.toLowerCase().includes(q));
      })
      .sort((a, b) => b.thread.lastMessageAt - a.thread.lastMessageAt);
  }, [threadsMap, emailsMap, predicate, category, query, showCategoryTabs]);

  const onOpen = (thread: Thread) => {
    setSelectedThreadId(thread.id);
    navigate(`/mail/thread/${thread.id}`);
  };

  return (
    <div className="flex h-full w-[440px] shrink-0 flex-col border-r border-[var(--line-soft)] bg-transparent">
      <div className="px-5 pt-5 pb-3">
        <div className="plat-crumb">3days.mail</div>
        <h1 className="mt-1.5 text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
          {title} <span className="text-[var(--text-5)]">({threadList.length})</span>
        </h1>
      </div>

      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-5)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mail…"
            className="h-9 w-full rounded-[10px] border border-[var(--line-soft)] bg-[var(--sand)] pl-8 pr-7 text-xs text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:bg-white focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-[6px] p-0.5 text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.06)]"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {showCategoryTabs && (
        <div className="flex items-center gap-1 border-b border-[var(--line-soft)] px-3 pb-2">
          {CATEGORY_LABELS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                category === c.id
                  ? 'bg-[var(--ink)] text-white'
                  : 'text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.05)]',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {selectedEmailIds.length > 0 && (
        <div className="flex items-center justify-between gap-2 border-b border-[var(--line-soft)] bg-[rgba(20,22,26,0.04)] px-3 py-1.5 text-xs text-[var(--text-2)]">
          <span>{selectedEmailIds.length} selected</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                archive(selectedEmailIds);
                clearSelection();
              }}
              className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-white hover:text-[var(--ink)]"
              title="Archive"
            >
              <Archive className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                trash(selectedEmailIds);
                clearSelection();
              }}
              className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-white hover:text-[var(--ink)]"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-white hover:text-[var(--ink)]"
              title="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {threadList.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-[12px] bg-[var(--sand)] text-[var(--ink)]">
              <Sparkles className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-[var(--ink)]">Inbox zero.</p>
            <p className="mt-1 text-xs text-[var(--text-4)]">Nothing here — either the AI screened it out, or you handled it.</p>
          </div>
        ) : (
          threadList.map(({ thread, emails }) => {
            const last = emails[emails.length - 1];
            const lastIncoming = [...emails].reverse().find((e) => e.direction === 'incoming') ?? last;
            const active = selectedThreadId === thread.id;
            const isSelected = emails.some((e) => selectedEmailIds.includes(e.id));
            const tone = lastIncoming.aiTone;
            const isUnread = thread.hasUnread;
            const labelChips = Array.from(new Set(emails.flatMap((e) => e.labels))).slice(0, 2);
            return (
              <div
                key={thread.id}
                onMouseEnter={() => setHoverId(thread.id)}
                onMouseLeave={() => setHoverId(null)}
                className={cn(
                  'group relative flex cursor-pointer items-start gap-3 border-b border-[var(--line-soft)] px-4 py-3 transition-colors last:border-b-0',
                  active ? 'bg-[rgba(20,22,26,0.06)]' : 'hover:bg-[rgba(20,22,26,0.02)]',
                )}
                onClick={() => onOpen(thread)}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelected(last.id);
                  }}
                  className={cn(
                    'mt-1 shrink-0 text-[var(--text-5)] hover:text-[var(--ink)]',
                    (isSelected || hoverId === thread.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                  )}
                  aria-label={isSelected ? 'Deselect' : 'Select'}
                >
                  {isSelected ? <CheckSquare className="h-4 w-4 text-[var(--ink)]" /> : <Square className="h-4 w-4" />}
                </button>

                <Avatar name={lastIncoming.from.name} email={lastIncoming.from.email} size={32} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    {isUnread && (
                      <span
                        aria-hidden
                        className="mb-[1px] h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[var(--ink)]"
                      />
                    )}
                    <span className={cn('truncate text-sm', isUnread ? 'font-bold text-[var(--ink)]' : 'font-medium text-[var(--text-1)]')}>
                      {lastIncoming.from.name}
                    </span>
                    {emails.length > 1 && (
                      <span className="shrink-0 text-[11px] text-[var(--text-5)]">{emails.length}</span>
                    )}
                    <span className="ml-auto shrink-0 text-[11px] text-[var(--text-4)]">
                      {formatRelative(thread.lastMessageAt)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className={cn('truncate text-sm', isUnread ? 'font-semibold text-[var(--ink)]' : 'text-[var(--text-2)]')}>
                      {thread.subject}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-4)]">{lastIncoming.snippet}</p>
                  {(labelChips.length > 0 || thread.hasAttachments || tone) && (
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {thread.hasAttachments && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[var(--text-4)]">
                          <Paperclip className="h-2.5 w-2.5" />
                        </span>
                      )}
                      {labelChips.map((id) => {
                        const l = labels[id];
                        if (!l) return null;
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                            style={{
                              backgroundColor: `${l.color}1a`,
                              color: l.color,
                            }}
                          >
                            <Tag className="h-2.5 w-2.5" /> {l.name}
                          </span>
                        );
                      })}
                      {tone && tone.tone !== 'neutral' && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-[var(--sand-deep)] px-1.5 py-0.5 text-[10px] font-medium capitalize text-[var(--text-3)]">
                          {tone.tone}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Hover quick actions */}
                <div
                  className={cn(
                    'absolute right-3 top-3 flex items-center gap-0.5 rounded-[10px] border border-[var(--line-soft)] bg-white p-0.5 shadow-sm transition-opacity',
                    hoverId === thread.id ? 'opacity-100' : 'opacity-0 pointer-events-none',
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => archive(emails.map((e) => e.id))}
                    className="rounded-[8px] p-1 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
                    title="Archive"
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => snooze(emails.map((e) => e.id), Date.now() + 86_400_000)}
                    className="rounded-[8px] p-1 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
                    title="Snooze 1 day"
                  >
                    <Moon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => trash(emails.map((e) => e.id))}
                    className="rounded-[8px] p-1 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--bad-fg)]"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleStar(last.id)}
                    className="rounded-[8px] p-1 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
                    title="Star"
                  >
                    <Star className={cn('h-3.5 w-3.5', last.isStarred && 'fill-amber-400 text-amber-400')} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
