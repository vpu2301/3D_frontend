import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Check, X, Clock } from 'lucide-react';
import { calendarStore } from '@/pages/calendar/_hooks/use-calendar-store';
import type { Email } from '@/pages/mail/_lib/types';

interface Props {
  email: Email;
}

export default function RsvpCard({ email }: Props) {
  const rsvp = email.rsvp!;
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'accepted' | 'declined' | 'tentative'>(
    rsvp.status ?? 'pending',
  );

  const respond = (next: 'accepted' | 'declined' | 'tentative') => {
    setStatus(next);
    if (next === 'accepted' || next === 'tentative') {
      const calendars = calendarStore.getState().calendars;
      const cal = calendars.find((c) => c.visible) ?? calendars[0];
      if (cal) {
        const me = 'me@3days.ai';
        calendarStore.createEvent({
          calendarId: cal.id,
          title: rsvp.eventTitle,
          start: new Date(rsvp.proposedStart).toISOString(),
          end: new Date(rsvp.proposedEnd).toISOString(),
          attendees: [
            { email: rsvp.organizer.email, name: rsvp.organizer.name, response: 'yes' },
            { email: me, name: 'You', response: next === 'accepted' ? 'yes' : 'maybe' },
          ],
          description: `Accepted from email: ${email.subject}`,
        });
      }
    }
  };

  const start = new Date(rsvp.proposedStart);
  const end = new Date(rsvp.proposedEnd);
  const dateLabel = start.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const timeLabel = `${start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} – ${end.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;

  return (
    <div className="mx-6 my-3 rounded-[12px] border border-[var(--line-soft)] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--sand)] text-[var(--ink)]">
          <CalendarIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-[var(--ink)]">{rsvp.eventTitle}</h4>
          <p className="text-xs text-[var(--text-4)]">
            {dateLabel} · {timeLabel} · Organizer: {rsvp.organizer.name}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <RsvpButton
              active={status === 'accepted'}
              onClick={() => respond('accepted')}
              icon={Check}
              label="Yes"
            />
            <RsvpButton
              active={status === 'tentative'}
              onClick={() => respond('tentative')}
              icon={Clock}
              label="Maybe"
            />
            <RsvpButton
              active={status === 'declined'}
              onClick={() => respond('declined')}
              icon={X}
              label="No"
            />
            <button
              type="button"
              onClick={() => navigate('/calendar')}
              className="ml-auto text-[11px] font-medium text-[var(--text-2)] transition-colors hover:text-[var(--ink)] hover:underline"
            >
              Open Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RsvpButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'flex items-center gap-1 rounded-full bg-[var(--ink)] px-3 py-1 text-xs font-semibold text-white'
          : 'flex items-center gap-1 rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]'
      }
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
