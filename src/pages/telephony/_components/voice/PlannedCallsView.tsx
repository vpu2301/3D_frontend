/**
 * The rail's "Planned" screen: everything queued or scheduled from the call
 * composer, in one place.
 *
 * DEMO, badged: the backend has no scheduling/queue endpoints yet, so these
 * entries live locally (src/pages/telephony/_lib/planned.ts) and nothing
 * dials on its own. What IS real from here: "Call now instead" hands any
 * entry to the live composer, which dials for real.
 */
import { useState } from 'react';
import {
  CalendarClock,
  ListOrdered,
  PhoneOutgoing,
  Trash2,
  Users,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MockedRouteBanner } from '@/components/voice/MockedBadge';
import StartCallModal from '@/pages/telephony/_components/voice/StartCallModal';
import {
  loadPlanned,
  removePlanned,
  type PlannedCall,
} from '@/pages/telephony/_lib/planned';
import { cn } from '@/lib/utils';

function label(entry: PlannedCall): string {
  if (entry.kind === 'scheduled') {
    const who = entry.numbers[0];
    return who?.name || who?.number || 'Unknown';
  }
  return `${entry.numbers.length} calls`;
}

export default function PlannedCallsView() {
  const [planned, setPlanned] = useState<PlannedCall[]>(loadPlanned);
  const [composer, setComposer] = useState<{ number: string; name: string; purpose: string } | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const scheduled = planned
    .filter((p) => p.kind === 'scheduled')
    .sort((a, b) => (a.at ?? '').localeCompare(b.at ?? ''));
  const queues = planned.filter((p) => p.kind === 'queue');

  const remove = (id: string) => setPlanned(removePlanned(id));

  const Section = ({
    title,
    icon: Icon,
    items,
    empty,
  }: {
    title: string;
    icon: typeof CalendarClock;
    items: PlannedCall[];
    empty: string;
  }) => (
    <div>
      <p className="plat-eyebrow mb-2.5 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        {title} ({items.length})
      </p>
      {items.length === 0 ? (
        <p className="rounded-[10px] border border-dashed border-[var(--line)] px-4 py-5 text-center text-xs text-[var(--text-5)]">
          {empty}
        </p>
      ) : (
        <Card className="overflow-hidden border-[var(--line-soft)] bg-white">
          <table className="w-full text-sm">
            <tbody>
              {items.map((entry) => (
                <tr key={entry.id} className="border-b border-[var(--line-soft)] last:border-b-0">
                  <td className="w-full max-w-0 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-shrink-0 rounded-[10px] bg-[var(--sand)] p-2"
                      >
                        {entry.kind === 'scheduled' ? (
                          <CalendarClock className="h-4 w-4 text-[var(--ink)]" />
                        ) : (
                          <Users className="h-4 w-4 text-[var(--ink)]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[var(--ink)]">
                          {label(entry)}
                          {entry.kind === 'scheduled' && entry.at && (
                            <span className="ml-2 text-xs font-normal text-[var(--blue)]">{entry.at}</span>
                          )}
                        </p>
                        <p className="truncate text-xs text-[var(--text-4)]">{entry.purpose}</p>
                        {entry.kind === 'queue' && (
                          <p className="truncate text-xs text-[var(--text-5)]">
                            {entry.numbers.map((n) => n.name || n.number).join(' → ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const first = entry.numbers[0];
                          setComposer({
                            number: first?.number ?? '',
                            name: first?.name ?? '',
                            purpose: entry.purpose,
                          });
                          setComposerOpen(true);
                        }}
                        className="flex h-7 items-center gap-1.5 rounded-full bg-[var(--ink)] px-2.5 text-xs font-medium text-white hover:opacity-85"
                        title="Open in the composer and dial for real"
                      >
                        <PhoneOutgoing className="h-3 w-3" />
                        Call now instead
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(entry.id)}
                        className="rounded-full p-1.5 text-[var(--text-5)] hover:bg-[var(--sand-deep)] hover:text-[var(--text-3)]"
                        aria-label="Delete planned entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <MockedRouteBanner reason="These entries are saved locally by the call composer and nothing dials on its own — the backend has no call-queue endpoint. Real appointment scheduling moved to the composer's 'Schedule appointment' tab, which calls and books for real; 'Call now instead' uses the real composer." />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line-soft)] px-6 pt-5 pb-4">
          <div>
            <p className="plat-crumb" style={{ color: 'var(--text-4)' }}>3days.telephony</p>
            <h1 className="mt-1 text-[26px] text-[var(--ink)]">Planned</h1>
            <p className="mt-1 text-xs text-[var(--text-4)]">
              Scheduled calls and queues waiting to run
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setComposer(null);
              setComposerOpen(true);
            }}
            className="flex h-9 items-center gap-1.5 rounded-full bg-[var(--ink)] px-3.5 text-xs font-medium text-white transition-colors hover:opacity-85"
          >
            <PhoneOutgoing className="h-3.5 w-3.5" />
            New call
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <Section
            title="Scheduled calls"
            icon={CalendarClock}
            items={scheduled}
            empty="Nothing here — real appointments are booked from the composer's Schedule appointment tab and appear in the call history."
          />
          <Section
            title="Call queues"
            icon={ListOrdered}
            items={queues}
            empty="No queues — build one in the composer's Queue tab."
          />
        </div>
      </div>

      {composerOpen && (
        <StartCallModal
          onClose={() => {
            setComposerOpen(false);
            setPlanned(loadPlanned()); // pick up anything the composer added
          }}
          initialMode="now"
          initialNumber={composer?.number ?? ''}
          initialName={composer?.name ?? ''}
          initialPurpose={composer?.purpose ?? ''}
        />
      )}
    </div>
  );
}
