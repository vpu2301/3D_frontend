import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Send, CalendarPlus, Bell, Sparkles, Loader2 } from 'lucide-react';
import ContactsLayout from '@/pages/contacts/_components/shared/ContactsLayout';
import ContactsMiniRail from '@/pages/contacts/_components/sidebar/ContactsMiniRail';
import ContactAvatar from '@/components/contacts/ContactAvatar';
import {
  useContactsStore,
  selectContactsMap,
  displayName,
} from '@/pages/contacts/_hooks/use-contacts-store';
import { detectContactStaleness } from '@/pages/docs/_lib/mockAi';
import { cn } from '@/lib/utils';

interface StaleEntry {
  contactId: string;
  daysSinceLast: number;
  expectedCadenceDays: number;
  reason: string;
}

const DEFAULT_CADENCE_DAYS = 60;

export default function ContactsStaleness() {
  const load = useContactsStore((s) => s.load);
  const contactsMap = useContactsStore(selectContactsMap);
  const setStaleness = useContactsStore((s) => s.setStaleness);
  const getInteractions = useContactsStore((s) => s.getInteractionsForContact);
  const navigate = useNavigate();

  const [entries, setEntries] = useState<StaleEntry[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const compute = async () => {
    setRunning(true);
    const out: StaleEntry[] = [];
    for (const c of Object.values(contactsMap)) {
      if (c.trashed) continue;
      const cadence = c.staleness?.intent.days ?? DEFAULT_CADENCE_DAYS;
      const interactions = getInteractions(c.id);
      // Use updatedAt as a synthetic last-interaction proxy when there are no
      // cross-module interactions; the deterministic side of staleness is just
      // "have I touched this contact recently?"
      const lastAt =
        interactions.reduce((m, i) => Math.max(m, i.occurredAt), 0) || c.updatedAt;
      const days = (Date.now() - lastAt) / 86_400_000;
      if (days <= cadence) continue;
      try {
        const r = await detectContactStaleness(
          {
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            displayName: c.displayName,
            organization: c.organization,
            title: c.title,
            tags: c.tags,
            isExternal: c.isExternal,
          },
          interactions.map((i) => ({
            id: i.id,
            type: i.type,
            occurredAt: i.occurredAt,
            summary: i.summary,
          })),
          cadence,
        );
        if (r) {
          out.push({
            contactId: c.id,
            daysSinceLast: r.daysSinceLast,
            expectedCadenceDays: r.expectedCadenceDays,
            reason: r.reason,
          });
        } else {
          out.push({
            contactId: c.id,
            daysSinceLast: Math.round(days),
            expectedCadenceDays: cadence,
            reason: `${displayName(c)} — last touched ${Math.round(days)} days ago.`,
          });
        }
      } catch {
        /* mock failure — skip this entry */
      }
    }
    setEntries(out.sort((a, b) => b.daysSinceLast - a.daysSinceLast));
    setRunning(false);
  };

  // Auto-compute on mount
  useEffect(() => {
    compute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(contactsMap).length]);

  const onSnooze = async (contactId: string) => {
    await setStaleness(contactId, {
      intent: { type: 'every-x-days', days: DEFAULT_CADENCE_DAYS },
      suppressedUntil: Date.now() + 30 * 86_400_000,
    });
    setEntries((arr) => arr.filter((e) => e.contactId !== contactId));
  };

  const onMarkExpected = async (contactId: string, contactName: string) => {
    const days = Number(window.prompt(`Stay in touch with ${contactName} every how many days? (or blank for "never")`) ?? '');
    if (Number.isNaN(days)) return;
    await setStaleness(contactId, {
      intent: days > 0 ? { type: 'every-x-days', days } : { type: 'never' },
    });
    setEntries((arr) => arr.filter((e) => e.contactId !== contactId));
  };

  return (
    <ContactsLayout>
      <div className="flex flex-1 overflow-hidden">
        <ContactsMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-6 py-4">
            <div>
              <p className="plat-crumb">3days.contacts / staleness</p>
              <Link to="/contacts" className="mt-1.5 inline-flex items-center gap-1 text-xs text-[var(--text-4)] transition-colors hover:text-[var(--ink)]">
                <ArrowLeft className="h-3 w-3" /> Back to Contacts
              </Link>
              <h1 className="mt-1 flex items-center gap-2 text-[26px] leading-tight">
                <Clock className="h-5 w-5 text-[var(--text-4)]" /> Going stale
              </h1>
              <p className="mt-1 text-xs text-[var(--text-4)]">
                {entries.length} relationship{entries.length === 1 ? '' : 's'} that have gone quiet
              </p>
            </div>
            <button
              type="button"
              onClick={compute}
              disabled={running}
              className="plat-btn-ghost disabled:opacity-50"
            >
              {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Recompute
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {entries.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-[var(--line)] px-6 py-16 text-center text-sm text-[var(--text-4)]">
                {running ? 'Computing…' : 'Nothing stale right now.'}
              </div>
            ) : (
              <ul className="plat-list">
                {entries.map((e) => {
                  const c = contactsMap[e.contactId];
                  if (!c) return null;
                  return (
                    <li key={e.contactId} className="flex items-center gap-3 border-b border-[var(--line-soft)] px-4 py-3 last:border-b-0">
                      <ContactAvatar contact={c} size={40} />
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/contacts/contact/${c.id}`)}
                          className="text-sm font-semibold text-[var(--ink)] hover:underline"
                        >
                          {displayName(c)}
                        </button>
                        <div className="text-xs italic text-[var(--text-4)]">{e.reason}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {c.emails[0] && (
                          <a
                            href={`mailto:${c.emails[0].value}`}
                            className="plat-btn-ghost h-8"
                          >
                            <Send className="h-3.5 w-3.5" /> Draft check-in
                          </a>
                        )}
                        <button
                          type="button"
                          className="plat-btn-ghost h-8"
                          title="Schedule (Calendar — UI deferred)"
                        >
                          <CalendarPlus className="h-3.5 w-3.5" /> Schedule
                        </button>
                        <button
                          type="button"
                          onClick={() => onSnooze(c.id)}
                          className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
                        >
                          <Bell className="h-3.5 w-3.5" /> Snooze
                        </button>
                        <button
                          type="button"
                          onClick={() => onMarkExpected(c.id, displayName(c))}
                          className="flex h-8 items-center rounded-full px-3 text-xs font-semibold text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
                        >
                          Mark expected
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </main>
      </div>
    </ContactsLayout>
  );
}
