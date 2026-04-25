import { useCallback, useMemo, useState } from 'react';
import { addMinutes } from 'date-fns';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { CalendarShell } from './_components/CalendarShell';
import { TimeGrid } from './_components/grid/TimeGrid';
import { MonthView } from './_components/grid/MonthView';
import { AgendaView } from './_components/grid/AgendaView';
import { EventDialog, type EventDialogState } from './_components/event/EventDialog';
import { CommandPalette } from './_components/palette/CommandPalette';
import { AIChatSidebar } from './_components/chat/AIChatSidebar';
import { calendarStore, useCalendar } from './_hooks/use-calendar-store';
import { useCalendarKeyboard } from './_hooks/use-keyboard';
import { dayRange, parseUTC, threeDayRange, weekRange } from './_lib/time';
import type { CalendarEvent } from './_lib/types';

export default function CalendarPage() {
  const view = useCalendar(s => s.view);
  const anchorISO = useCalendar(s => s.anchorISO);
  const calendars = useCalendar(s => s.calendars);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dialog, setDialog] = useState<EventDialogState>(null);

  const anchor = useMemo(() => parseUTC(anchorISO), [anchorISO]);

  const onEventClick = useCallback((e: CalendarEvent) => {
    calendarStore.select(e.id);
    setDialog({ mode: 'edit', id: e.id });
  }, []);

  const onCreate = useCallback(() => {
    const now = new Date();
    const start = new Date(now);
    start.setMinutes(0, 0, 0);
    start.setHours(start.getHours() + 1);
    const end = addMinutes(start, 60);
    const defaultCal =
      calendars.find(
        c => c.visible && !c.name.toLowerCase().includes('focus'),
      )?.id ?? calendars[0]?.id;
    if (!defaultCal) return;
    setDialog({
      mode: 'create',
      draft: {
        calendarId: defaultCal,
        title: '',
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });
  }, [calendars]);

  const onCreateDraft = useCallback(
    (draft: Omit<CalendarEvent, 'id'>) => {
      setDialog({ mode: 'create', draft });
    },
    [],
  );

  useCalendarKeyboard({
    onCreate,
    onOpenDetail: (id) => {
      calendarStore.select(id);
      setDialog({ mode: 'edit', id });
    },
    onPaletteOpen: () => setPaletteOpen(true),
  });

  let body: React.ReactNode;
  if (view === 'day') body = <TimeGrid days={dayRange(anchor).days} onEventClick={onEventClick} onCreateDraft={onCreateDraft} />;
  else if (view === '3day') body = <TimeGrid days={threeDayRange(anchor).days} onEventClick={onEventClick} onCreateDraft={onCreateDraft} />;
  else if (view === 'week') body = <TimeGrid days={weekRange(anchor).days} onEventClick={onEventClick} onCreateDraft={onCreateDraft} />;
  else if (view === 'month') body = <MonthView anchor={anchor} onEventClick={onEventClick} onCreateDraft={onCreateDraft} />;
  else body = <AgendaView anchor={anchor} onEventClick={onEventClick} />;

  return (
    <div className="min-h-screen bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex h-screen flex-1 flex-col bg-white">
            <div className="flex flex-1 overflow-hidden">
              <CalendarShell onCreate={onCreate}>{body}</CalendarShell>
              <AIChatSidebar
                onOpenEvent={(id) => {
                  calendarStore.select(id);
                  setDialog({ mode: 'edit', id });
                }}
              />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onOpenEvent={(e) => {
          calendarStore.select(e.id);
          setDialog({ mode: 'edit', id: e.id });
        }}
      />
      <EventDialog
        open={!!dialog}
        onOpenChange={(v) => !v && setDialog(null)}
        state={dialog}
      />
    </div>
  );
}
