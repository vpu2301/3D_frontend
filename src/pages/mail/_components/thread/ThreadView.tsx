import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Moon,
  Trash2,
  Tag,
  CalendarPlus,
  ListTodo,
  MoreHorizontal,
  Sparkles,
  MailPlus,
  Star,
  ArrowLeft,
} from 'lucide-react';
import {
  useMailStore,
  selectEmails,
  selectThreads,
} from '@/pages/mail/_hooks/use-mail-store';
import { useMailUiStore } from '@/pages/mail/_hooks/use-mail-ui-store';
import { useTodoStore } from '@/pages/todo/_hooks/use-todo-store';
import { calendarStore } from '@/pages/calendar/_hooks/use-calendar-store';
import type { Email } from '@/pages/mail/_lib/types';
import MessageItem from './MessageItem';
import ThreadSummary from './ThreadSummary';
import RsvpCard from './RsvpCard';
import Avatar from '../list/Avatar';
import { cn } from '@/lib/utils';

interface Props {
  threadId: string;
  /** When true, render with a "back" button instead of inline (for /mail/thread/:id full-screen). */
  fullScreen?: boolean;
}

export default function ThreadView({ threadId, fullScreen }: Props) {
  const emailsMap = useMailStore(selectEmails);
  const threadsMap = useMailStore(selectThreads);
  const archive = useMailStore((s) => s.archive);
  const trash = useMailStore((s) => s.trash);
  const snooze = useMailStore((s) => s.snooze);
  const markThreadRead = useMailStore((s) => s.markThreadRead);
  const createDraft = useMailStore((s) => s.createDraft);
  const openCompose = useMailUiStore((s) => s.openCompose);
  const setSelectedThreadId = useMailUiStore((s) => s.setSelectedThreadId);
  const navigate = useNavigate();
  const createTask = useTodoStore((s) => s.createTask);

  const thread = threadsMap[threadId];
  const emails = useMemo(() => {
    if (!thread) return [] as Email[];
    return thread.emailIds
      .map((id) => emailsMap[id])
      .filter(Boolean)
      .sort((a, b) => a.receivedAt - b.receivedAt) as Email[];
  }, [thread, emailsMap]);

  if (!thread) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
        <div className="text-center">
          <MailPlus className="mx-auto mb-2 h-8 w-8 text-gray-300" />
          <p>Select a conversation</p>
        </div>
      </div>
    );
  }

  const lastIncoming = [...emails].reverse().find((e) => e.direction === 'incoming') ?? emails[emails.length - 1];

  const onReply = async (replyAll = false) => {
    const reply = lastIncoming;
    const me = 'me@3days.ai';
    const to = [reply.from];
    const cc = replyAll ? reply.cc.filter((r) => r.email !== me) : [];
    const draft = await createDraft({
      threadId: thread.id,
      replyToEmailId: reply.id,
      subject: reply.subject.startsWith('Re:') ? reply.subject : `Re: ${reply.subject}`,
      to,
      cc,
      bcc: [],
      bodyHtml: '',
    });
    openCompose(draft.id);
  };

  const onForward = async () => {
    const reply = lastIncoming;
    const draft = await createDraft({
      subject: reply.subject.startsWith('Fwd:') ? reply.subject : `Fwd: ${reply.subject}`,
      to: [],
      cc: [],
      bcc: [],
      bodyHtml: `<p>---------- Forwarded message ----------</p><p>From: ${reply.from.name} &lt;${reply.from.email}&gt;<br>Date: ${new Date(reply.receivedAt).toLocaleString()}<br>Subject: ${reply.subject}</p>`,
    });
    openCompose(draft.id);
  };

  const onMakeTask = async () => {
    await createTask({
      title: thread.subject,
      sourceModule: 'mail',
      sourceId: thread.id,
      priority: 'med',
      tags: ['mail'],
    } as any);
    // Subtle confirmation via console; cross-module toast TBD.
    // eslint-disable-next-line no-console
    console.info(`[mail] Created task linked to thread ${thread.id}`);
  };

  const onScheduleMeeting = () => {
    const calendars = calendarStore.getState().calendars;
    const cal = calendars.find((c) => c.visible) ?? calendars[0];
    if (!cal) return;
    const start = new Date();
    start.setMinutes(0, 0, 0);
    start.setHours(start.getHours() + 1);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);
    const me = 'me@3days.ai';
    calendarStore.createEvent({
      calendarId: cal.id,
      title: thread.subject,
      start: start.toISOString(),
      end: end.toISOString(),
      attendees: thread.participants
        .filter((p) => p.email !== me)
        .map((p) => ({ email: p.email, name: p.name, response: 'pending' as const })),
      description: `Meeting from email thread: ${thread.subject}`,
    });
    navigate('/calendar');
  };

  const onArchive = async () => {
    await archive(emails.map((e) => e.id));
    setSelectedThreadId(null);
    if (fullScreen) navigate('/mail');
  };

  const onTrash = async () => {
    await trash(emails.map((e) => e.id));
    setSelectedThreadId(null);
    if (fullScreen) navigate('/mail');
  };

  const onSnooze = async () => {
    await snooze(emails.map((e) => e.id), Date.now() + 86_400_000);
    setSelectedThreadId(null);
  };

  const onMarkRead = () => markThreadRead(thread.id, true);

  const incomingRsvp = emails.find((e) => e.rsvp);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      {/* Sticky header */}
      <header className="border-b border-gray-100 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          {fullScreen && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-100"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <h2 className="flex-1 truncate text-lg font-medium text-gray-900">{thread.subject}</h2>
          <span className="shrink-0 text-[11px] text-gray-500">
            {emails.length} message{emails.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Participant chips */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {thread.participants.slice(0, 6).map((p) => (
            <button
              key={p.email}
              type="button"
              onClick={() => p.contactId && navigate(`/contacts/contact/${p.contactId}`)}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-200"
              title={p.email}
            >
              <Avatar name={p.name} email={p.email} size={16} />
              <span className="truncate max-w-[120px]">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Action bar */}
        <div className="mt-3 flex flex-wrap items-center gap-1">
          <ActionButton icon={Reply} label="Reply" onClick={() => onReply(false)} primary />
          <ActionButton icon={ReplyAll} label="Reply all" onClick={() => onReply(true)} />
          <ActionButton icon={Forward} label="Forward" onClick={onForward} />
          <span className="mx-1 h-5 w-px bg-gray-200" />
          <ActionButton icon={Archive} label="Archive" onClick={onArchive} />
          <ActionButton icon={Moon} label="Snooze" onClick={onSnooze} />
          <ActionButton icon={Trash2} label="Delete" onClick={onTrash} />
          <span className="mx-1 h-5 w-px bg-gray-200" />
          <ActionButton icon={ListTodo} label="Make task" onClick={onMakeTask} />
          <ActionButton icon={CalendarPlus} label="Schedule meeting" onClick={onScheduleMeeting} />
          <button
            type="button"
            onClick={onMarkRead}
            className="ml-auto rounded p-1.5 text-gray-500 hover:bg-gray-100"
            title="Mark all read"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <ThreadSummary thread={thread} emails={emails} />

        {incomingRsvp?.rsvp && (
          <RsvpCard email={incomingRsvp} />
        )}

        {emails.map((e, i) => (
          <MessageItem
            key={e.id}
            email={e}
            defaultExpanded={i === emails.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  primary,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors',
        primary
          ? 'bg-[#bdd8ec] font-medium text-gray-900 hover:bg-[#a5c8e0]'
          : 'text-gray-700 hover:bg-gray-100',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
