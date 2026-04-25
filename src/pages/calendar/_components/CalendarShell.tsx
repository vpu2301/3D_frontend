import { addDays, addMonths, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, MessageSquare, Plus, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { calendarStore, useCalendar } from '../_hooks/use-calendar-store';
import type { CalendarView } from '../_lib/types';
import {
  dayRange,
  formatRange,
  monthGrid,
  parseUTC,
  resolveTimezone,
  threeDayRange,
  weekRange,
} from '../_lib/time';
import { AccountRail } from './rail/AccountRail';
import { MiniMonth } from './rail/MiniMonth';
import { useEffect, useState } from 'react';

const VIEW_LABELS: Record<CalendarView, string> = {
  day: 'Day',
  '3day': '3-day',
  week: 'Week',
  month: 'Month',
  agenda: 'Agenda',
};

const VIEW_KEYS: CalendarView[] = ['day', '3day', 'week', 'month', 'agenda'];

interface CalendarShellProps {
  children: React.ReactNode;
  onCreate: () => void;
}

export function CalendarShell({ children, onCreate }: CalendarShellProps) {
  const { view: viewParam } = useParams<{ view?: CalendarView }>();
  const navigate = useNavigate();
  const view = useCalendar(s => s.view);
  const anchorISO = useCalendar(s => s.anchorISO);
  const chatOpen = useCalendar(s => s.chatOpen);

  // URL is the source of truth for `view`. Sync URL → store on viewParam changes.
  // If viewParam is missing or invalid, redirect to the current store view.
  useEffect(() => {
    if (viewParam && VIEW_KEYS.includes(viewParam)) {
      if (viewParam !== calendarStore.getState().view) {
        calendarStore.setView(viewParam);
      }
    } else {
      navigate(`/calendar/${calendarStore.getState().view}`, { replace: true });
    }
  }, [viewParam, navigate]);

  const [tz, setTz] = useState<string>('UTC');
  useEffect(() => {
    setTz(resolveTimezone());
  }, []);

  const anchor = parseUTC(anchorISO);
  const range =
    view === 'day'
      ? dayRange(anchor)
      : view === '3day'
        ? threeDayRange(anchor)
        : view === 'week'
          ? weekRange(anchor)
          : view === 'month'
            ? { start: monthGrid(anchor)[0], end: monthGrid(anchor).slice(-1)[0], days: monthGrid(anchor) }
            : weekRange(anchor);

  function shift(dir: 1 | -1) {
    if (view === 'month') {
      calendarStore.setAnchor(addMonths(anchor, dir).toISOString());
    } else if (view === 'week') {
      const s = startOfWeek(anchor, { weekStartsOn: 1 });
      calendarStore.setAnchor(addDays(s, dir * 7).toISOString());
    } else if (view === '3day') {
      calendarStore.setAnchor(addDays(anchor, dir * 3).toISOString());
    } else {
      calendarStore.setAnchor(addDays(anchor, dir).toISOString());
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Top chrome */}
      <header className="flex items-center justify-between border-b border-gray-200/70 bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">Calendar</h1>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs"
              onClick={() => calendarStore.setAnchor(new Date().toISOString())}
              aria-label="Jump to today (T)"
            >
              Today
            </Button>
            <div className="flex items-center">
              <button
                type="button"
                aria-label="Previous"
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100"
                onClick={() => shift(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next"
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100"
                onClick={() => shift(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <p className="ml-1 text-sm font-medium text-gray-800">
              {formatRange(range.start, range.end, view)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div
            className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5"
            role="tablist"
            aria-label="Calendar view"
          >
            {VIEW_KEYS.map((v, i) => (
              <Tooltip key={v}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={view === v}
                    onClick={() => navigate(`/calendar/${v}`)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs font-medium text-gray-600 transition',
                      view === v && 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200',
                    )}
                  >
                    {VIEW_LABELS[v]}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[11px]">
                  Shortcut: {i + 1}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Sync status"
                className="flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-600"
              >
                <RefreshCw className="h-3.5 w-3.5 text-emerald-500" />
                <span>{tz}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[11px]">
              Timezone resolved from device. Dates stored as UTC.
            </TooltipContent>
          </Tooltip>

          <Button
            size="sm"
            className="h-8 gap-1.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600"
            onClick={onCreate}
            aria-label="New event (C)"
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>

          <button
            type="button"
            onClick={calendarStore.toggleChat}
            aria-label="Toggle AI chat"
            aria-pressed={chatOpen}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50',
              chatOpen && 'bg-gray-100 text-gray-900',
            )}
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Body: left rail + main + chat sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-gray-200/70 bg-gray-50/40 lg:flex">
          <div className="p-3">
            <MiniMonth />
          </div>
          <div className="flex-1 overflow-y-auto border-t border-gray-200/70 p-3">
            <AccountRail />
          </div>
        </aside>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
