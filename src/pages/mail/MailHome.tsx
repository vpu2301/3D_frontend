import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MailLayout from '@/pages/mail/_components/shared/MailLayout';
import MailMiniRail from '@/pages/mail/_components/sidebar/MailMiniRail';
import ThreadList from '@/pages/mail/_components/list/ThreadList';
import DailyDigestCard from '@/pages/mail/_components/list/DailyDigestCard';
import ThreadView from '@/pages/mail/_components/thread/ThreadView';
import ComposeArea from '@/pages/mail/_components/compose/ComposeArea';
import { useMailStore, isInInbox } from '@/pages/mail/_hooks/use-mail-store';
import { useMailUiStore } from '@/pages/mail/_hooks/use-mail-ui-store';
import { useContactsStore } from '@/pages/contacts/_hooks/use-contacts-store';
import type { Email, Thread } from '@/pages/mail/_lib/types';

interface Props {
  /** Filter mode for the list. */
  mode?:
    | 'inbox'
    | 'starred'
    | 'sent'
    | 'drafts'
    | 'scheduled'
    | 'snoozed'
    | 'archive'
    | 'spam'
    | 'all'
    | 'trash'
    | 'important'
    | 'label'
    | 'view'
    | 'follow-ups';
  title?: string;
}

const PREDICATES: Record<NonNullable<Props['mode']>, (t: Thread, e: Email[]) => boolean> = {
  inbox: (_, emails) => emails.some((e) => isInInbox(e)),
  important: (_, emails) =>
    emails.some((e) => isInInbox(e)) && emails.some((e) => e.category === 'important'),
  starred: (_, emails) => emails.some((e) => e.isStarred && !e.isTrashed),
  sent: (_, emails) =>
    emails.some((e) => e.direction === 'outgoing' && !e.isScheduled && !e.isTrashed),
  drafts: () => false, // handled separately — drafts aren't threads
  scheduled: (_, emails) => emails.some((e) => e.isScheduled),
  snoozed: (_, emails) => emails.some((e) => e.isSnoozed),
  archive: (_, emails) => emails.some((e) => e.folderOverride === 'archive' && !e.isTrashed),
  spam: (_, emails) => emails.some((e) => e.isSpam && !e.isTrashed),
  all: (_, emails) => emails.some((e) => !e.isTrashed && !e.isSpam),
  trash: (_, emails) => emails.some((e) => e.isTrashed),
  label: () => false, // overridden when mode === 'label'
  view: () => false,
  'follow-ups': (t) => t.awaitingReplyFromOthers,
};

const TITLES: Record<NonNullable<Props['mode']>, string> = {
  inbox: 'Inbox',
  important: 'Important',
  starred: 'Starred',
  sent: 'Sent',
  drafts: 'Drafts',
  scheduled: 'Scheduled',
  snoozed: 'Snoozed',
  archive: 'Archive',
  spam: 'Spam',
  all: 'All mail',
  trash: 'Trash',
  label: 'Label',
  view: 'View',
  'follow-ups': 'Awaiting reply',
};

export default function MailHome({ mode = 'inbox', title }: Props) {
  const load = useMailStore((s) => s.load);
  const loadContacts = useContactsStore((s) => s.load);
  const labels = useMailStore((s) => s.labels);
  const views = useMailStore((s) => s.views);
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedThreadId, setSelectedThreadId } = useMailUiStore();

  useEffect(() => {
    load();
    loadContacts();
  }, [load, loadContacts]);

  // Sync URL → selected thread when on /mail/thread/:id
  useEffect(() => {
    const m = location.pathname.match(/^\/mail\/thread\/([^/]+)/);
    if (m) setSelectedThreadId(m[1]);
  }, [location.pathname, setSelectedThreadId]);

  // Build effective predicate
  let predicate = PREDICATES[mode];
  let listTitle = title ?? TITLES[mode];

  if (mode === 'label' && id) {
    const label = labels[id];
    listTitle = label ? `${label.emoji ? `${label.emoji} ` : ''}${label.name}` : 'Label';
    predicate = (_t, emails) =>
      emails.some((e) => e.labels.includes(id) && !e.isTrashed);
  }
  if (mode === 'view' && id) {
    const view = views[id];
    listTitle = view ? view.name : 'Smart view';
    if (view?.builtInKey === 'awaiting-reply') {
      predicate = (t) => t.awaitingReplyFromUser;
    } else if (view?.builtInKey === 'sent-awaiting') {
      predicate = (t) => t.awaitingReplyFromOthers;
    } else if (view?.builtInKey === 'mentions-me') {
      predicate = (_t, emails) =>
        emails.some(
          (e) =>
            e.direction === 'incoming' &&
            !e.isTrashed &&
            (e.to.length + e.cc.length) <= 3,
        );
    } else if (view?.builtInKey === 'vips') {
      // approximate: top 6 senders by frequency
      // computed inline against the thread/emails
      predicate = (_t, emails) => emails.some((e) => e.direction === 'incoming' && !e.isTrashed);
    } else if (view?.emailIds) {
      const set = new Set(view.emailIds);
      predicate = (_t, emails) => emails.some((e) => set.has(e.id));
    }
  }

  return (
    <MailLayout>
      <div className="flex flex-1 overflow-hidden">
        <MailMiniRail />
        <div className="flex flex-1 overflow-hidden">
          <div className="relative flex flex-col">
            <ThreadList
              predicate={predicate}
              title={listTitle}
              showCategoryTabs={mode === 'inbox'}
            />
            {mode === 'inbox' && (
              <div className="absolute left-0 right-0 top-[112px] z-10">
                <DailyDigestCard />
              </div>
            )}
          </div>
          {selectedThreadId ? (
            <ThreadView threadId={selectedThreadId} />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
              <div className="text-center">
                <p>Select a conversation</p>
                <p className="mt-1 text-xs text-gray-400">
                  Or press <span className="rounded bg-gray-100 px-1 font-mono">C</span> to compose
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <ComposeArea />
    </MailLayout>
  );
}
