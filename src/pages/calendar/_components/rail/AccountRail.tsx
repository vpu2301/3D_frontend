import { Check, Circle } from 'lucide-react';
import { calendarStore, useCalendar } from '../../_hooks/use-calendar-store';
import { PALETTE } from '../../_lib/palette';
import { cn } from '@/lib/utils';

export function AccountRail() {
  const accounts = useCalendar(s => s.accounts);
  const calendars = useCalendar(s => s.calendars);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Calendars
        </h3>
        <ul className="space-y-3">
          {accounts.map(acc => (
            <li key={acc.id}>
              <div className="mb-1 flex items-center justify-between px-2">
                <p className="text-xs font-medium text-gray-700">{acc.displayName}</p>
                <span className="text-[10px] uppercase tracking-wide text-gray-400">
                  {acc.provider}
                </span>
              </div>
              <ul className="space-y-0.5">
                {calendars
                  .filter(c => c.accountId === acc.id)
                  .map(c => {
                    const palette = PALETTE[c.colorToken];
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => calendarStore.toggleCalendar(c.id)}
                          aria-pressed={c.visible}
                          className={cn(
                            'flex w-full items-center gap-2 rounded-r-full py-1.5 pl-3 pr-3 text-left text-xs text-gray-700 transition hover:bg-gray-100',
                            !c.visible && 'opacity-50',
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-3.5 w-3.5 items-center justify-center rounded-[3px]',
                              c.visible ? palette.dot : 'bg-gray-200',
                            )}
                          >
                            {c.visible ? (
                              <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                            ) : null}
                          </span>
                          <span className="truncate">{c.name}</span>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-500 transition hover:border-[#8fc4e4] hover:text-[#1a73e8]"
        disabled
        aria-label="Connect account (platform connector)"
      >
        <Circle className="h-3 w-3" />
        Connect account
      </button>
    </div>
  );
}
