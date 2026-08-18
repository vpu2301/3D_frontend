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
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-blue-500 to-violet-500 px-2 py-1 text-[11px] font-medium text-white shadow-sm hover:brightness-110"
          >
            <Sparkles className="h-3 w-3" />
            Create ({Math.round(preview.confidence * 100)}%)
          </button>
        )}
      </div>
      {preview && preview.title && (
        <div className="mx-3 mt-2 rounded-lg border border-dashed border-blue-200 bg-blue-50/40 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wide text-blue-500">Preview</p>
          <p className="mt-0.5 text-sm font-medium text-gray-900">{preview.title}</p>
          <p className="text-xs text-gray-600">
            {format(parseUTC(preview.start), 'EEE, MMM d · h:mm a')} –{' '}
            {format(parseUTC(preview.end), 'h:mm a')}
            {preview.location ? ` · ${preview.location}` : ''}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Press <kbd className="rounded border border-gray-300 bg-white px-1 text-[10px]">Enter</kbd> to create.
          </p>
        </div>
      )}
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => { onOpenChange(false); calendarStore.setAnchor(new Date().toISOString()); }}>
            <Clock className="mr-2 h-3.5 w-3.5 text-gray-400" />
            Jump to today
            <span className="ml-auto text-[10px] text-gray-400">T</span>
          </CommandItem>
          <CommandItem onSelect={() => setView('day')}>
            <CalendarClock className="mr-2 h-3.5 w-3.5 text-gray-400" />
            Switch to day
            <span className="ml-auto text-[10px] text-gray-400">1</span>
          </CommandItem>
          <CommandItem onSelect={() => setView('3day')}>
            <CalendarClock className="mr-2 h-3.5 w-3.5 text-gray-400" />
            Switch to 3-day
            <span className="ml-auto text-[10px] text-gray-400">2</span>
          </CommandItem>
          <CommandItem onSelect={() => setView('week')}>
            <CalendarClock className="mr-2 h-3.5 w-3.5 text-gray-400" />
            Switch to week
            <span className="ml-auto text-[10px] text-gray-400">3</span>
          </CommandItem>
          <CommandItem onSelect={() => setView('month')}>
            <CalendarClock className="mr-2 h-3.5 w-3.5 text-gray-400" />
            Switch to month
            <span className="ml-auto text-[10px] text-gray-400">4</span>
          </CommandItem>
          <CommandItem onSelect={() => { onOpenChange(false); calendarStore.toggleChat(); }}>
            <Zap className="mr-2 h-3.5 w-3.5 text-gray-400" />
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
            <Plus className="mr-2 h-3.5 w-3.5 text-gray-400" />
            Create blank event
            <span className="ml-auto text-[10px] text-gray-400">C</span>
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
              <Search className="mr-2 h-3.5 w-3.5 text-gray-400" />
              <span className="truncate">{e.title}</span>
              <span className="ml-auto text-[10px] text-gray-400">
                {format(parseUTC(e.start), 'EEE h:mm a')}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
