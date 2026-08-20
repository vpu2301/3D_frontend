import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarClock, Clock, Plus, Search, Sparkles, Zap } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { calendarStore, useCalendar } from '../../_hooks/use-calendar-store';
import { mockParse } from '../../_lib/nl-schema';
import { parseUTC } from '../../_lib/time';
import type { CalendarEvent, CalendarView } from '../../_lib/types';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onOpenEvent: (e: CalendarEvent) => void;
}

export function CommandPalette({ open, onOpenChange, onOpenEvent }: Props) {
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const events = useCalendar(s => s.events);
  const calendars = useCalendar(s => s.calendars);

  // Reset input when re-opened
  useEffect(() => {
    if (open) setInput('');
  }, [open]);

  const preview = useMemo(() => {
    if (!input.trim()) return null;
    if (input.startsWith('/') || input.length < 5) return null;
    return mockParse(input);
  }, [input]);

  const upcoming = useMemo(
    () =>
      [...events]
        .filter(e => parseUTC(e.end) >= new Date())
        .sort((a, b) => parseUTC(a.start).getTime() - parseUTC(b.start).getTime())
        .slice(0, 6),
    [events],
  );

  function commitNL() {
    if (!preview || !preview.title) return;
    const defaultCal =
      calendars.find(c => c.visible && !c.name.toLowerCase().includes('focus'))?.id
      ?? calendars[0]?.id;
    if (!defaultCal) return;
    const ev = calendarStore.createEvent({
      calendarId: defaultCal,
      title: preview.title,
      start: preview.start,
      end: preview.end,
      location: preview.location,
    });
    onOpenChange(false);
    onOpenEvent(ev);
  }

  function setView(v: CalendarView) {
    navigate(`/calendar/${v}`);
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="relative">
        <CommandInput
          placeholder={'Try "lunch with Sana Thursday at 1" or search…'}
          value={input}
          onValueChange={setInput}
        />
        {preview && preview.title && (
          <button
            type="button"
            onClick={commitNL}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full bg-[var(--ink)] px-2.5 py-1 text-[11px] font-semibold text-white transition hover:opacity-85"
          >
            <Sparkles className="h-3 w-3" />
            Create ({Math.round(preview.confidence * 100)}%)
          </button>
        )}
      </div>
      {preview && preview.title && (
        <div className="mx-3 mt-2 rounded-[10px] border border-dashed border-[var(--line)] bg-[var(--sand)] px-3 py-2">
          <p className="plat-eyebrow">Preview</p>
          <p className="mt-1 text-sm font-semibold text-[var(--ink)]">{preview.title}</p>
          <p className="text-xs text-[var(--text-3)]">
            {format(parseUTC(preview.start), 'EEE, MMM d · h:mm a')} –{' '}
            {format(parseUTC(preview.end), 'h:mm a')}
            {preview.location ? ` · ${preview.location}` : ''}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-4)]">
            Press <kbd className="rounded-[4px] border border-[var(--line)] bg-white px-1 font-mono text-[10px]">Enter</kbd> to create.
          </p>
        </div>
      )}
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => { onOpenChange(false); calendarStore.setAnchor(new Date().toISOString()); }}>
            <Clock className="mr-2 h-3.5 w-3.5 text-[var(--text-5)]" />
            Jump to today
            <span className="ml-auto font-mono text-[10px] text-[var(--text-5)]">T</span>
          </CommandItem>
          <CommandItem onSelect={() => setView('day')}>
            <CalendarClock className="mr-2 h-3.5 w-3.5 text-[var(--text-5)]" />
            Switch to day
            <span className="ml-auto font-mono text-[10px] text-[var(--text-5)]">1</span>
          </CommandItem>
          <CommandItem onSelect={() => setView('3day')}>
            <CalendarClock className="mr-2 h-3.5 w-3.5 text-[var(--text-5)]" />
            Switch to 3-day
            <span className="ml-auto font-mono text-[10px] text-[var(--text-5)]">2</span>
          </CommandItem>
          <CommandItem onSelect={() => setView('week')}>
            <CalendarClock className="mr-2 h-3.5 w-3.5 text-[var(--text-5)]" />
            Switch to week
            <span className="ml-auto font-mono text-[10px] text-[var(--text-5)]">3</span>
          </CommandItem>
          <CommandItem onSelect={() => setView('month')}>
            <CalendarClock className="mr-2 h-3.5 w-3.5 text-[var(--text-5)]" />
            Switch to month
            <span className="ml-auto font-mono text-[10px] text-[var(--text-5)]">4</span>
          </CommandItem>
          <CommandItem onSelect={() => { onOpenChange(false); calendarStore.toggleChat(); }}>
            <Zap className="mr-2 h-3.5 w-3.5 text-[var(--text-5)]" />
            Toggle AI sidebar
          </CommandItem>
          <CommandItem
            onSelect={() => {
              const defaultCal =
                calendars.find(c => c.visible && !c.name.toLowerCase().includes('focus'))?.id
                ?? calendars[0]?.id;
              if (!defaultCal) return;
              const start = new Date();
              start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
              const end = new Date(start.getTime() + 30 * 60_000);
              const ev = calendarStore.createEvent({
                calendarId: defaultCal,
                title: 'New event',
                start: start.toISOString(),
                end: end.toISOString(),
              });
              onOpenChange(false);
              onOpenEvent(ev);
            }}
          >
            <Plus className="mr-2 h-3.5 w-3.5 text-[var(--text-5)]" />
            Create blank event
            <span className="ml-auto font-mono text-[10px] text-[var(--text-5)]">C</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Upcoming">
          {upcoming.map(e => (
            <CommandItem
              key={e.id}
              value={`${e.title}-${e.id}`}
              onSelect={() => {
                onOpenChange(false);
                onOpenEvent(e);
              }}
            >
              <Search className="mr-2 h-3.5 w-3.5 text-[var(--text-5)]" />
              <span className="truncate">{e.title}</span>
              <span className="ml-auto font-mono text-[10px] text-[var(--text-5)]">
                {format(parseUTC(e.start), 'EEE h:mm a')}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
