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
        <p className="plat-eyebrow mb-2.5 px-2">Calendars</p>
        <ul className="space-y-3">
          {accounts.map(acc => (
            <li key={acc.id}>
              <div className="mb-1 flex items-center justify-between px-2">
                <p className="text-xs font-semibold text-[var(--ink)]">{acc.displayName}</p>
                <span className="text-[10px] uppercase tracking-wide text-[var(--text-5)]">
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
                            'flex w-full items-center gap-2 rounded-[10px] px-2.5 py-1.5 text-left text-xs text-[var(--text-1)] transition hover:bg-[rgba(20,22,26,0.04)]',
                            !c.visible && 'opacity-50',
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-3.5 w-3.5 items-center justify-center rounded-[4px]',
                              c.visible ? palette.dot : 'bg-[var(--sand-deep)]',
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
        className="flex w-full items-center gap-2 rounded-full border border-dashed border-[var(--line)] px-3 py-1.5 text-xs text-[var(--text-4)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
        disabled
        aria-label="Connect account (platform connector)"
      >
        <Circle className="h-3 w-3" />
        Connect account
      </button>
    </div>
  );
}
