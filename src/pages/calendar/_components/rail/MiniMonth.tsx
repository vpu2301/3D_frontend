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
        caption_label: 'text-xs font-semibold text-gray-800',
        nav: 'flex gap-1',
        nav_button:
          'h-6 w-6 rounded-md text-gray-500 hover:bg-gray-100 inline-flex items-center justify-center',
        table: 'w-full border-collapse',
        head_row: 'flex',
        head_cell:
          'text-[10px] font-medium text-gray-400 uppercase w-7 h-6 flex items-center justify-center',
        row: 'flex',
        cell: 'h-7 w-7 text-center text-xs p-0 relative',
        day: 'h-7 w-7 rounded-full text-gray-700 hover:bg-gray-100 inline-flex items-center justify-center',
        day_selected: '!bg-[#bdd8ec] !text-gray-900 hover:!bg-[#a5c8e0]',
        day_today: 'font-semibold text-[#1a73e8]',
        day_outside: 'text-gray-300',
      }}
    />
  );
}
