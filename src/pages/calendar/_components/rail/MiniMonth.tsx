import { DayPicker } from 'react-day-picker';
import { calendarStore, useCalendar } from '../../_hooks/use-calendar-store';
import { parseUTC } from '../../_lib/time';
import 'react-day-picker/dist/style.css';

export function MiniMonth() {
  const anchorISO = useCalendar(s => s.anchorISO);
  const anchor = parseUTC(anchorISO);
  return (
    <DayPicker
      mode="single"
      selected={anchor}
      onSelect={d => {
        if (d) calendarStore.setAnchor(d.toISOString());
      }}
      weekStartsOn={1}
      showOutsideDays
      className="!m-0 text-xs"
      classNames={{
        months: 'space-y-2',
        month: 'space-y-1',
        caption: 'flex justify-between items-center px-1 py-1',
        caption_label: 'text-xs font-semibold text-[var(--ink)] [font-family:var(--display)]',
        nav: 'flex gap-1',
        nav_button:
          'h-6 w-6 rounded-[8px] text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.05)] inline-flex items-center justify-center',
        table: 'w-full border-collapse',
        head_row: 'flex',
        head_cell:
          'text-[10px] font-medium text-[var(--text-5)] uppercase w-7 h-6 flex items-center justify-center',
        row: 'flex',
        cell: 'h-7 w-7 text-center text-xs p-0 relative',
        day: 'h-7 w-7 rounded-full text-[var(--text-1)] hover:bg-[rgba(20,22,26,0.05)] inline-flex items-center justify-center',
        day_selected: '!bg-[#14161a] !text-white hover:!bg-[#14161a]',
        day_today: 'font-semibold text-[var(--ink)]',
        day_outside: 'text-[var(--text-5)] opacity-60',
      }}
    />
  );
}
