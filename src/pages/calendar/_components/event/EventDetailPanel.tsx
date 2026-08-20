import { format } from 'date-fns';
import { Calendar, MapPin, Sparkles, Trash2, Users, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { calendarStore, useCalendar } from '../../_hooks/use-calendar-store';
import { parseUTC } from '../../_lib/time';
import { PALETTE } from '../../_lib/palette';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EventDetailPanel({ open, onOpenChange }: Props) {
  const id = useCalendar(s => s.selectedEventId);
  const events = useCalendar(s => s.events);
  const calendars = useCalendar(s => s.calendars);
  const event = events.find(e => e.id === id);
  if (!event) return null;
  const cal = calendars.find(c => c.id === event.calendarId);
  const palette = PALETTE[cal?.colorToken ?? 'blue'];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] p-0 sm:max-w-[420px]">
        <SheetHeader className="border-b border-[var(--line-soft)] px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn('h-2.5 w-2.5 rounded-full', palette.dot)} />
              <SheetTitle className="text-sm">
                Event
              </SheetTitle>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[var(--text-4)] transition hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <Input
            value={event.title}
            onChange={e =>
              calendarStore.updateEvent(event.id, { title: e.target.value })
            }
            className="h-auto border-0 px-0 text-lg font-semibold focus-visible:ring-0"
          />

          <div className="space-y-2 text-sm text-[var(--text-1)]">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-[var(--text-5)]" />
              <span>
                {format(parseUTC(event.start), 'EEE, MMM d · h:mm a')} –{' '}
                {format(parseUTC(event.end), 'h:mm a')}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[var(--text-5)]" />
                <span>{event.location}</span>
              </div>
            )}
            {event.conferencing && (
              <div className="flex items-center gap-2">
                <Video className="h-3.5 w-3.5 text-[var(--text-5)]" />
                <a
                  href={event.conferencing.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--blue)] hover:underline"
                >
                  Join {event.conferencing.provider}
                </a>
              </div>
            )}
            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-3.5 w-3.5 text-[var(--text-5)]" />
                <div className="flex flex-wrap gap-1">
                  {event.attendees.map(a => (
                    <span
                      key={a.email}
                      className="rounded-full border border-[var(--line-soft)] bg-[var(--sand)] px-2.5 py-0.5 text-xs text-[var(--text-1)]"
                    >
                      {a.name ?? a.email}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="plat-eyebrow mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Prep notes
            </div>
            <Textarea
              value={event.prepNotes ?? ''}
              onChange={e =>
                calendarStore.updateEvent(event.id, { prepNotes: e.target.value })
              }
              placeholder="Ask the assistant to prep you…"
              rows={5}
              className="rounded-[10px] border-[var(--line)] text-sm"
            />
          </div>
        </div>

        <footer className="border-t border-[var(--line-soft)] px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-[var(--bad-fg)] hover:bg-[rgba(179,56,46,0.06)] hover:text-[var(--bad-fg)]"
            onClick={() => {
              calendarStore.deleteEvent(event.id);
              onOpenChange(false);
            }}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
