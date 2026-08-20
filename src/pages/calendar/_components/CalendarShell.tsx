import { addDays, addMonths, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, MessageSquare, Plus, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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
    <div className="flex h-full w-full flex-col">
      {/* Top chrome */}
      <header className="flex items-center justify-between border-b border-[var(--line-soft)] px-5 py-2.5">
        <div className="flex items-center gap-4">
          <div className="leading-tight">
            <p className="plat-crumb" style={{ color: 'var(--text-4)' }}>3days.calendar</p>
            <h1 className="text-[18px]" style={{ color: 'var(--ink)' }}>Calendar</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="plat-btn-ghost"
              style={{ height: 30, padding: '0 13px' }}
              onClick={() => calendarStore.setAnchor(new Date().toISOString())}
              aria-label="Jump to today (T)"
            >
              Today
            </button>
            <div className="flex items-center">
              <button
                type="button"
                aria-label="Previous"
                className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[var(--text-4)] transition hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
                onClick={() => shift(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next"
                className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[var(--text-4)] transition hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
                onClick={() => shift(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <p className="ml-1 text-sm font-medium text-[var(--ink)]">
              {formatRange(range.start, range.end, view)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div
            className="inline-flex items-center rounded-full border border-[var(--line)] p-0.5"
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
                      'rounded-full px-2.5 py-1 text-xs font-medium text-[var(--text-3)] transition',
                      view === v && 'bg-[rgba(20,22,26,0.07)] text-[var(--ink)]',
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
                className="flex h-8 items-center gap-1.5 rounded-[10px] border border-[var(--line)] px-2.5 text-xs text-[var(--text-3)]"
              >
                <RefreshCw className="h-3.5 w-3.5 text-[var(--ok-fg)]" />
                <span>{tz}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[11px]">
              Timezone resolved from device. Dates stored as UTC.
            </TooltipContent>
          </Tooltip>

          <button
            type="button"
            onClick={onCreate}
            aria-label="New event (C)"
            className="plat-btn"
            style={{ height: 32, padding: '0 16px' }}
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </button>

          <button
            type="button"
            onClick={calendarStore.toggleChat}
            aria-label="Toggle AI chat"
            aria-pressed={chatOpen}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-3)] transition hover:bg-[rgba(20,22,26,0.05)]',
              chatOpen && 'border-[var(--ink)] bg-[rgba(20,22,26,0.06)] text-[var(--ink)]',
            )}
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Body: left rail + main + chat sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--line-soft)] lg:flex">
          <div className="p-3">
            <MiniMonth />
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3 pt-2">
            <AccountRail />
          </div>
        </aside>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
