import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  Inbox as InboxIcon,
  Star,
  Send,
  FileEdit,
  Clock,
  Moon,
  Archive,
  AlertOctagon,
  Mail as MailAll,
  Sparkles,
  Tag,
  Trash2,
  ChevronDown,
  ChevronRight,
  Reply,
} from 'lucide-react';
import {
  useMailStore,
  selectEmails,
  selectThreads,
  selectLabels,
  selectViews,
  selectDrafts,
  isInInbox,
} from '@/pages/mail/_hooks/use-mail-store';
import { useMailUiStore } from '@/pages/mail/_hooks/use-mail-ui-store';
import { cn } from '@/lib/utils';

interface NavRowProps {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconStyle?: React.CSSProperties;
  label: string;
  count?: number;
  badgeColor?: 'red' | 'gray';
  active?: boolean;
  onClick: () => void;
}

function NavRow({ icon: Icon, iconStyle, label, count, badgeColor, active, onClick }: NavRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-[10px] py-2 pl-3 pr-3 text-left text-[13.5px] transition-colors',
        active
          ? 'bg-[rgba(20,22,26,0.07)] font-semibold text-[var(--ink)]'
          : 'font-medium text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
      )}
    >
      <Icon
        className={cn('h-4 w-4 shrink-0', active ? 'text-[var(--ink)]' : 'text-[var(--text-4)]')}
        style={iconStyle}
      />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'shrink-0 rounded-full px-1.5 text-[10px] font-semibold leading-tight',
            badgeColor === 'red'
              ? 'bg-[var(--ink)] py-0.5 text-white'
              : 'text-[var(--text-4)]',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function MailMiniRail() {
  const emailsMap = useMailStore(selectEmails);
  const threadsMap = useMailStore(selectThreads);
  const labelsMap = useMailStore(selectLabels);
  const draftsMap = useMailStore(selectDrafts);
  const viewsMap = useMailStore(selectViews);
  const createDraft = useMailStore((s) => s.createDraft);
  const openCompose = useMailUiStore((s) => s.openCompose);
  const navigate = useNavigate();
  const location = useLocation();

  const [smartOpen, setSmartOpen] = useState(true);
  const [labelsOpen, setLabelsOpen] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);

  const emails = useMemo(() => Object.values(emailsMap), [emailsMap]);
  const drafts = useMemo(() => Object.values(draftsMap), [draftsMap]);

  const inboxUnread = emails.filter((e) => isInInbox(e) && !e.isRead).length;
  const importantUnread = emails.filter(
    (e) => isInInbox(e) && !e.isRead && e.category === 'important',
  ).length;
  const starredCount = emails.filter((e) => e.isStarred && !e.isTrashed).length;
  const sentCount = emails.filter(
    (e) => e.direction === 'outgoing' && !e.isTrashed && !e.isScheduled,
  ).length;
  const draftCount = drafts.length;
  const scheduledCount = emails.filter((e) => e.isScheduled).length;
  const snoozedCount = emails.filter((e) => e.isSnoozed).length;
  const archivedCount = emails.filter(
    (e) => e.folderOverride === 'archive' && !e.isTrashed,
  ).length;
  const spamCount = emails.filter((e) => e.isSpam && !e.isTrashed).length;
  const trashedCount = emails.filter((e) => e.isTrashed).length;
  const allCount = emails.filter((e) => !e.isTrashed && !e.isSpam).length;

  const followUpCount = Object.values(threadsMap).filter((t) => t.awaitingReplyFromOthers).length;

  const path = location.pathname;
  const isInbox = path === '/mail' || path.startsWith('/mail/thread/');

  const onCompose = async () => {
    const d = await createDraft({});
    openCompose(d.id);
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-[var(--line-soft)] bg-transparent">
      <div className="px-4 pt-4 pb-4">
        <button
          type="button"
          onClick={onCompose}
          className="plat-btn w-full justify-center"
        >
          <Plus className="h-4 w-4" /> Compose
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-0.5">
          <NavRow
            icon={InboxIcon}
            label="Inbox"
            count={inboxUnread}
            active={isInbox}
            onClick={() => navigate('/mail')}
          />
          <NavRow
            icon={Sparkles}
            label="Important"
            count={importantUnread}
            active={path === '/mail/folder/important'}
            onClick={() => navigate('/mail/folder/important')}
          />
          <NavRow
            icon={Star}
            label="Starred"
            count={starredCount}
            active={path === '/mail/folder/starred'}
            onClick={() => navigate('/mail/folder/starred')}
          />
          <NavRow
            icon={Reply}
            label="Follow-ups"
            count={followUpCount}
            active={path === '/mail/follow-ups'}
            onClick={() => navigate('/mail/follow-ups')}
          />
          <NavRow
            icon={Send}
            label="Sent"
            count={sentCount}
            active={path === '/mail/folder/sent'}
            onClick={() => navigate('/mail/folder/sent')}
          />
          <NavRow
            icon={FileEdit}
            label="Drafts"
            count={draftCount}
            active={path === '/mail/folder/drafts'}
            onClick={() => navigate('/mail/folder/drafts')}
          />
        </div>

        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          className="mt-1 flex w-full items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-[var(--text-4)] transition-colors hover:text-[var(--ink)]"
        >
          {moreOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          {moreOpen ? 'Less' : 'More'}
        </button>
        {moreOpen && (
          <div className="space-y-0.5">
            <NavRow
              icon={Clock}
              label="Scheduled"
              count={scheduledCount}
              active={path === '/mail/folder/scheduled'}
              onClick={() => navigate('/mail/folder/scheduled')}
            />
            <NavRow
              icon={Moon}
              label="Snoozed"
              count={snoozedCount}
              active={path === '/mail/folder/snoozed'}
              onClick={() => navigate('/mail/folder/snoozed')}
            />
            <NavRow
              icon={Archive}
              label="Archive"
              count={archivedCount}
              active={path === '/mail/folder/archive'}
              onClick={() => navigate('/mail/folder/archive')}
            />
            <NavRow
              icon={AlertOctagon}
              label="Spam"
              count={spamCount}
              active={path === '/mail/folder/spam'}
              onClick={() => navigate('/mail/folder/spam')}
            />
            <NavRow
              icon={MailAll}
              label="All mail"
              count={allCount}
              active={path === '/mail/folder/all'}
              onClick={() => navigate('/mail/folder/all')}
            />
          </div>
        )}

        <div className="plat-eyebrow mb-1.5 mt-6 flex items-center justify-between px-3">
          <button
            type="button"
            onClick={() => setSmartOpen((o) => !o)}
            className="flex items-center gap-1"
          >
            {smartOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Smart views
          </button>
        </div>
        {smartOpen && (
          <div className="space-y-0.5">
            {Object.values(viewsMap).map((v) => (
              <NavRow
                key={v.id}
                icon={Sparkles}
                label={v.name}
                active={path === `/mail/views/${v.id}`}
                onClick={() => navigate(`/mail/views/${v.id}`)}
              />
            ))}
          </div>
        )}

        <div className="plat-eyebrow mb-1.5 mt-6 flex items-center justify-between px-3">
          <button
            type="button"
            onClick={() => setLabelsOpen((o) => !o)}
            className="flex items-center gap-1"
          >
            {labelsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Labels
          </button>
        </div>
        {labelsOpen && (
          <div className="space-y-0.5">
            {Object.values(labelsMap)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((l) => {
                const count = emails.filter(
                  (e) => e.labels.includes(l.id) && !e.isTrashed,
                ).length;
                return (
                  <NavRow
                    key={l.id}
                    icon={Tag}
                    iconStyle={{ color: l.color }}
                    label={l.name}
                    count={count}
                    active={path === `/mail/label/${l.id}`}
                    onClick={() => navigate(`/mail/label/${l.id}`)}
                  />
                );
              })}
          </div>
        )}

        <div className="plat-eyebrow mb-1.5 mt-6 px-3">
          Fix &amp; manage
        </div>
        <div className="space-y-0.5">
          <NavRow
            icon={Trash2}
            label="Trash"
            count={trashedCount}
            active={path === '/mail/folder/trash'}
            onClick={() => navigate('/mail/folder/trash')}
          />
        </div>
      </div>
    </aside>
  );
}
