/**
 * The call composer — one large modal for everything outbound.
 *
 *   Appointment → REAL: POST /api/voice/schedule. The agent calls, offers
 *                 slots inside the timeframe, agrees one, and writes the
 *                 calendar event (Sprint 6 T6.1). This is the default.
 *   Free-form   → REAL: POST /api/voice/calls, the agent dials immediately
 *                 with nothing but the purpose as its briefing.
 *   Queue       → MOCKED (badged): no call-queue endpoint on the backend yet.
 *                 Fully clickable and persisted locally so the flow can be
 *                 demoed, and it says exactly why it is not hitting the server.
 *
 * Contacts are a searchable picker column (real, /api/voice/contacts) —
 * scales past the handful that chips could hold. In queue mode the same
 * picker adds entries instead of filling the form. Opted-out contacts are
 * disabled: the backend would 403 them, and the UI should not pretend
 * otherwise (Sprint 8 T8.3).
 */
import { useMemo, useState } from 'react';
import {
  Ban,
  BookUser,
  CalendarCheck2,
  CalendarClock,
  ListOrdered,
  PhoneOutgoing,
  Plus,
  Search,
  Trash2,
  User,
  Video,
  X,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContacts, useInitiateCall, useScheduleAppointment } from '@/lib/api/voice';
import { MockedBadge } from '@/components/voice/MockedBadge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Mode = 'appointment' | 'now' | 'queue';

interface QueueEntry {
  number: string;
  name: string;
}

type Timeframe = 'tomorrow' | 'next_week' | 'custom';

const DURATIONS = [15, 30, 45, 60] as const;

/** `auto` lets the agent follow the callee — the language-consistency default. */
const LANGUAGES = [
  { value: '', label: 'Auto — follow the callee' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
] as const;

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * The preset timeframes resolved to the concrete [start, end] dates that go
 * over the wire. Shown back to the user under the picker, because "next week"
 * meaning Mon–Fri is a decision, not an obvious fact.
 */
function resolveTimeframe(
  tf: Timeframe,
  customStart: string,
  customEnd: string,
): { start: string; end: string } {
  if (tf === 'tomorrow') {
    const t = isoDate(addDays(1));
    return { start: t, end: t };
  }
  if (tf === 'next_week') {
    const today = new Date();
    // Monday of next week, through the Friday after it.
    const toMonday = ((8 - today.getDay()) % 7) || 7;
    const monday = addDays(toMonday);
    const friday = addDays(toMonday + 4);
    return { start: isoDate(monday), end: isoDate(friday) };
  }
  return { start: customStart, end: customEnd };
}

function fmtRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short' };
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return '';
  const left = s.toLocaleDateString(undefined, opts);
  return start === end ? left : `${left} – ${e.toLocaleDateString(undefined, opts)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

import PlatSelect from '@/pages/telephony/_components/shared/PlatSelect';
import {
  addPlanned as storeAddPlanned,
  loadPlanned,
  removePlanned as storeRemovePlanned,
  type PlannedCall,
} from '@/pages/telephony/_lib/planned';

const labelCls = 'text-xs font-medium text-[var(--text-3)]';
const inputCls =
  'rounded-[10px] border-[var(--line)] bg-[var(--sand)] text-[var(--ink)] placeholder:text-[var(--text-5)] focus-visible:ring-[rgba(20,22,26,0.25)]';

export default function StartCallModal({
  onClose,
  initialMode = 'appointment',
  initialNumber = '',
  initialName = '',
  initialPurpose = '',
}: {
  onClose: () => void;
  initialMode?: Mode;
  initialNumber?: string;
  initialName?: string;
  initialPurpose?: string;
}) {
  const { toast } = useToast();
  const { data: contacts } = useContacts();
  const initiate = useInitiateCall();
  const schedule = useScheduleAppointment();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [contactQuery, setContactQuery] = useState('');

  // Shared form state
  const [number, setNumber] = useState(initialNumber);
  const [name, setName] = useState(initialName);
  const [purpose, setPurpose] = useState(initialPurpose);

  // Appointment state (POST /api/voice/schedule)
  const [topic, setTopic] = useState(initialPurpose);
  const [timeframe, setTimeframe] = useState<Timeframe>('tomorrow');
  const [customStart, setCustomStart] = useState(isoDate(addDays(1)));
  const [customEnd, setCustomEnd] = useState(isoDate(addDays(7)));
  const [duration, setDuration] = useState<number>(30);
  const [language, setLanguage] = useState('');
  const [attendees, setAttendees] = useState<string[]>([]);
  const [attendeeDraft, setAttendeeDraft] = useState('');
  const [meetLink, setMeetLink] = useState(true);

  const range = resolveTimeframe(timeframe, customStart, customEnd);

  const addAttendee = (raw: string) => {
    const email = raw.trim().replace(/[,;]$/, '');
    if (!EMAIL_RE.test(email) || attendees.includes(email)) return;
    setAttendees((prev) => [...prev, email]);
    setAttendeeDraft('');
  };

  // Queue state
  const [queue, setQueue] = useState<QueueEntry[]>([]);

  // Demo-persisted planned work
  const [planned, setPlanned] = useState<PlannedCall[]>(loadPlanned);

  const filteredContacts = useMemo(() => {
    const q = contactQuery.trim().toLowerCase();
    const list = contacts ?? [];
    if (!q) return list;
    return list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone_number.includes(q),
    );
  }, [contacts, contactQuery]);

  const inQueue = (num: string) => queue.some((e) => e.number === num);

  /**
   * A number typed by hand can still be one the picker would have refused.
   * The UI warns rather than blocks: the do-not-call list lives on the server
   * and the server's 403 is the authority, not this lookup.
   */
  const typedOptOut = (contacts ?? []).find(
    (c) => c.opted_out && c.phone_number === number.trim(),
  );

  const pickContact = (contactName: string, phone: string, optedOut: boolean) => {
    // Belt and braces: the button is disabled, but a keyboard path or a stale
    // render must not be able to load an opted-out number into the form.
    if (optedOut) return;
    if (mode === 'queue') {
      setQueue((prev) =>
        inQueue(phone)
          ? prev.filter((e) => e.number !== phone)
          : [...prev, { number: phone, name: contactName }],
      );
    } else {
      setNumber(phone);
      setName(contactName);
    }
  };

  const addManualToQueue = () => {
    if (!number.trim() || inQueue(number.trim())) return;
    setQueue((prev) => [...prev, { number: number.trim(), name: name.trim() }]);
    setNumber('');
    setName('');
  };

  const addPlanned = (entry: Omit<PlannedCall, 'id' | 'created'>) => setPlanned(storeAddPlanned(entry));
  const removePlanned = (id: string) => setPlanned(storeRemovePlanned(id));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'appointment') {
      schedule.mutate(
        {
          target_number: number.trim(),
          ...(name.trim() ? { target_name: name.trim() } : {}),
          topic: topic.trim(),
          timeframe_start: range.start,
          timeframe_end: range.end,
          duration_minutes: duration,
          ...(language ? { language } : {}),
          ...(attendees.length ? { attendees } : {}),
          create_meet_link: meetLink,
        },
        {
          onSuccess: (r) => {
            toast({
              title: 'Appointment call started',
              description: `${r.call_sid} — it will appear under Active calls shortly.`,
            });
            onClose();
          },
          // The backend's own words: "no free slots", daily limit, quiet hours,
          // opt-out and validation are all different problems, and paraphrasing
          // them here would hide which guardrail actually fired.
          onError: (err) =>
            toast({ title: 'Could not schedule', description: err.message, variant: 'destructive' }),
        },
      );
      return;
    }

    if (mode === 'now') {
      initiate.mutate(
        { target_number: number, purpose, ...(name.trim() ? { target_name: name.trim() } : {}) },
        {
          onSuccess: (r) => {
            toast({ title: 'Dialing…', description: r.call_sid });
            onClose();
          },
          onError: (err) =>
            toast({ title: 'Call failed', description: err.message, variant: 'destructive' }),
        },
      );
      return;
    }

    // queue
    addPlanned({ kind: 'queue', numbers: queue, purpose });
    toast({
      title: `Queue of ${queue.length} saved (demo)`,
      description: 'Saved locally — the backend has no call-queue endpoint yet.',
    });
    setQueue([]);
    setPurpose('');
  };

  const canSubmit =
    mode === 'appointment'
      ? number.trim() !== '' && topic.trim() !== '' && range.start !== '' && range.end !== ''
      : mode === 'now'
        ? number.trim() !== '' && purpose.trim() !== ''
        : queue.length > 0 && purpose.trim() !== '';

  const pending = initiate.isPending || schedule.isPending;

  const tabs: { id: Mode; label: string; icon: typeof PhoneOutgoing; mocked?: boolean }[] = [
    { id: 'appointment', label: 'Schedule appointment', icon: CalendarCheck2 },
    { id: 'now', label: 'Free-form call', icon: PhoneOutgoing },
    { id: 'queue', label: 'Queue', icon: ListOrdered, mocked: true },
  ];

  const submitLabel =
    mode === 'appointment'
      ? schedule.isPending ? 'Starting…' : 'Call & book'
      : mode === 'now'
        ? initiate.isPending ? 'Dialing…' : 'Call'
        : `Start queue (${queue.length})`;

  const myPlanned = planned.filter((p) => p.kind === 'queue');

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex h-[85vh] w-[92vw] max-w-4xl flex-col gap-0 overflow-hidden p-0">
        {/* Header + mode switch */}
        <div className="border-b border-[var(--line-soft)] px-6 py-4">
          <DialogTitle className="flex items-center gap-2.5 text-base font-semibold text-[var(--ink)]">
            <div className="rounded-[10px] bg-[var(--sand)] p-2">
              <PhoneOutgoing className="h-4 w-4 text-[var(--ink)]" />
            </div>
            Start calls
          </DialogTitle>
          <div className="mt-3 flex items-center gap-1">
            {tabs.map(({ id, label, icon: Icon, mocked }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={cn(
                  'flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-colors',
                  mode === id
                    ? 'bg-[var(--ink)] text-white'
                    : 'text-[var(--text-4)] hover:bg-[var(--sand)] hover:text-[var(--ink)]',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {mocked && <MockedBadge />}
              </button>
            ))}
          </div>
        </div>

        {/* Mocked-mode notice */}
        {mode === 'queue' && (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-[11px] text-amber-800">
            The backend has no call-queue endpoint yet — queues are saved locally so the flow is
            testable, and nothing will actually dial.
          </div>
        )}

        <div className="flex min-h-0 flex-1">
          {/* ── Contact picker column ── */}
          <aside className="flex w-72 shrink-0 flex-col border-r border-[var(--line-soft)] bg-[rgba(20,22,26,0.015)]">
            <div className="border-b border-[var(--line-soft)] p-3">
              <p className="plat-eyebrow mb-2 flex items-center gap-1.5 px-1">
                <BookUser className="h-3.5 w-3.5" />
                Contacts
                {mode === 'queue' && <span className="normal-case text-[var(--text-5)]">— click to add</span>}
              </p>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-5)]" />
                <Input
                  value={contactQuery}
                  onChange={(e) => setContactQuery(e.target.value)}
                  placeholder="Search name or number…"
                  className={cn(inputCls, 'h-9 bg-white pl-9 text-xs')}
                />
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {!filteredContacts.length ? (
                <p className="px-3 py-6 text-center text-xs text-[var(--text-5)]">
                  {contacts?.length ? 'No contact matches.' : 'No contacts on the backend yet.'}
                </p>
              ) : (
                filteredContacts.map((c) => {
                  const active = mode === 'queue' ? inQueue(c.phone_number) : number === c.phone_number;
                  const optedOut = c.opted_out === true;
                  return (
                    <button
                      key={c.phone_number}
                      type="button"
                      onClick={() => pickContact(c.name, c.phone_number, optedOut)}
                      disabled={optedOut}
                      title={
                        optedOut
                          ? `${c.name} is on the do-not-call list — the agent will not dial this number.`
                          : undefined
                      }
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left transition-colors',
                        optedOut
                          ? 'cursor-not-allowed opacity-45'
                          : active
                            ? 'bg-[var(--blue)]/50'
                            : 'hover:bg-white',
                      )}
                    >
                      <span className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        active && !optedOut ? 'bg-[var(--blue)]' : 'bg-[var(--sand-deep)]',
                      )}>
                        {optedOut ? (
                          <Ban className="h-3.5 w-3.5 text-red-500" />
                        ) : (
                          <User className="h-3.5 w-3.5 text-[var(--text-4)]" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-[var(--ink)]">{c.name}</span>
                        <span className="block truncate font-mono text-[11px] text-[var(--text-5)]">{c.phone_number}</span>
                      </span>
                      {optedOut && (
                        <span className="ml-auto shrink-0 text-[9px] font-semibold uppercase tracking-wide text-red-600">
                          opted out
                        </span>
                      )}
                      {mode === 'queue' && active && !optedOut && (
                        <span className="ml-auto text-[10px] font-semibold text-[var(--text-4)]">#{queue.findIndex(q => q.number === c.phone_number) + 1}</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* ── Form column ── */}
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {mode === 'queue' ? (
                <>
                  {/* Queue list */}
                  <div>
                    <p className="plat-eyebrow mb-2">
                      Call queue — dialed one after another
                    </p>
                    {queue.length === 0 ? (
                      <p className="rounded-[10px] border border-dashed border-[var(--line)] px-4 py-6 text-center text-xs text-[var(--text-5)]">
                        Pick contacts on the left, or add a number below.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {queue.map((entry, i) => (
                          <div key={entry.number} className="flex items-center gap-3 rounded-[10px] border border-[var(--line-soft)] bg-[rgba(20,22,26,0.02)] px-3 py-2">
                            <span className="w-5 text-center font-mono text-xs text-[var(--text-5)]">{i + 1}</span>
                            <span className="min-w-0 flex-1 truncate text-sm text-[var(--ink)]">
                              {entry.name || 'Unknown'}
                              <span className="ml-2 font-mono text-xs text-[var(--text-5)]">{entry.number}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setQueue((prev) => prev.filter((q) => q.number !== entry.number))}
                              className="rounded p-1 text-[var(--text-5)] hover:bg-[var(--sand-deep)] hover:text-[var(--text-3)]"
                              aria-label={`Remove ${entry.number} from queue`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Manual add */}
                  <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                    <div className="space-y-1.5">
                      <Label className={labelCls}>Number</Label>
                      <Input placeholder="+49…" value={number} onChange={(e) => setNumber(e.target.value)} className={inputCls} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={labelCls}>Name (optional)</Label>
                      <Input placeholder="Who is being called" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                    </div>
                    <button
                      type="button"
                      onClick={addManualToQueue}
                      disabled={!number.trim() || inQueue(number.trim())}
                      className={cn(
                        'flex h-10 items-center gap-1 rounded-[10px] px-3 text-xs font-medium',
                        number.trim() && !inQueue(number.trim())
                          ? 'bg-[var(--sand)] text-[var(--text-2)] hover:bg-[var(--sand-deep)]'
                          : 'cursor-not-allowed bg-[var(--sand)] text-[var(--text-5)]',
                      )}
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="call-number" className={labelCls}>Number *</Label>
                    <Input
                      id="call-number"
                      placeholder="+49…"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="call-name" className={labelCls}>Name (optional)</Label>
                    <Input
                      id="call-name"
                      placeholder="Who is being called"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              {typedOptOut && mode !== 'queue' && (
                <div className="flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2.5">
                  <Ban className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                  <p className="text-[11px] leading-relaxed text-red-700">
                    {typedOptOut.name} is on the do-not-call list. The backend will refuse this
                    number — its answer is what counts, so the button stays live.
                  </p>
                </div>
              )}

              {mode === 'appointment' ? (
                <div className="space-y-1.5">
                  <Label htmlFor="appt-topic" className={labelCls}>Topic *</Label>
                  <Textarea
                    id="appt-topic"
                    placeholder="What is the meeting about? e.g. 'Kick-off for the warehouse rollout — 30 minutes with Anna and Tom.'"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    rows={3}
                    className={inputCls}
                  />
                  <p className="text-[11px] text-[var(--text-5)]">
                    The agent explains this on the call before offering slots.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="call-purpose" className={labelCls}>
                    {mode === 'queue' ? 'Purpose — applies to every call in the queue *' : 'Purpose *'}
                  </Label>
                  <Textarea
                    id="call-purpose"
                    placeholder="What should the agent do? e.g. 'Confirm Thursday's appointment, move it if 14:00 no longer works.'"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    rows={3}
                    className={inputCls}
                  />
                  <p className="text-[11px] text-[var(--text-5)]">
                    Be specific — this is the agent's entire briefing for the call.
                  </p>
                </div>
              )}

              {mode === 'appointment' && (
                <>
                  {/* Timeframe — the window the agent may offer slots inside */}
                  <div className="space-y-1.5">
                    <Label className={labelCls}>Timeframe *</Label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {([
                        { id: 'tomorrow', label: 'Tomorrow' },
                        { id: 'next_week', label: 'Next week' },
                        { id: 'custom', label: 'Custom range' },
                      ] as const).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setTimeframe(opt.id)}
                          className={cn(
                            'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                            timeframe === opt.id
                              ? 'bg-[var(--ink)] text-white'
                              : 'border border-[var(--line)] text-[var(--text-3)] hover:bg-[var(--sand)]',
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                      {timeframe !== 'custom' && (
                        <span className="text-[11px] text-[var(--text-5)]">
                          {fmtRange(range.start, range.end)}
                        </span>
                      )}
                    </div>
                    {timeframe === 'custom' && (
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5">
                          <Label htmlFor="appt-from" className={labelCls}>From</Label>
                          <Input
                            id="appt-from"
                            type="date"
                            value={customStart}
                            min={isoDate(new Date())}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="appt-to" className={labelCls}>To</Label>
                          <Input
                            id="appt-to"
                            type="date"
                            value={customEnd}
                            min={customStart || isoDate(new Date())}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Duration + language */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className={labelCls}>Duration</Label>
                      <div className="flex items-center rounded-full border border-[var(--line)] bg-white p-0.5">
                        {DURATIONS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDuration(d)}
                            className={cn(
                              'flex-1 rounded-full px-2 py-1.5 text-xs font-medium tabular-nums transition-colors',
                              duration === d
                                ? 'bg-[var(--ink)] text-white'
                                : 'text-[var(--text-4)] hover:text-[var(--ink)]',
                            )}
                          >
                            {d} min
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="appt-language" className={labelCls}>Language</Label>
                      <PlatSelect
                        id="appt-language"
                        value={language}
                        onChange={setLanguage}
                        ariaLabel="Call language"
                      >
                        {LANGUAGES.map((l) => (
                          <option key={l.value} value={l.value}>
                            {l.label}
                          </option>
                        ))}
                      </PlatSelect>
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="space-y-1.5">
                    <Label htmlFor="appt-attendees" className={labelCls}>
                      Attendees (optional)
                    </Label>
                    {attendees.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {attendees.map((a) => (
                          <span
                            key={a}
                            className="flex items-center gap-1 rounded-full bg-[var(--sand-deep)] py-1 pl-2.5 pr-1 text-[11px] text-[var(--text-2)]"
                          >
                            {a}
                            <button
                              type="button"
                              onClick={() => setAttendees((prev) => prev.filter((x) => x !== a))}
                              className="rounded-full p-0.5 text-[var(--text-5)] hover:text-[var(--ink)]"
                              aria-label={`Remove ${a}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <Input
                      id="appt-attendees"
                      type="email"
                      placeholder="name@company.com — Enter to add"
                      value={attendeeDraft}
                      onChange={(e) => setAttendeeDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          addAttendee(attendeeDraft);
                        }
                      }}
                      onBlur={() => addAttendee(attendeeDraft)}
                      className={inputCls}
                    />
                    <p className="text-[11px] text-[var(--text-5)]">
                      They receive the calendar invitation once the slot is agreed.
                    </p>
                  </div>

                  {/* Meet link */}
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-[10px] border border-[var(--line)] px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={meetLink}
                      onChange={(e) => setMeetLink(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-[var(--line)]"
                    />
                    <Video className="h-3.5 w-3.5 text-[var(--text-5)]" />
                    <span className="text-xs text-[var(--text-2)]">Add a video-meeting link</span>
                  </label>

                  {/* The backend's own error, in full — toasts truncate. */}
                  {schedule.isError && (
                    <div className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2.5">
                      <p className="text-xs font-medium text-red-700">
                        {schedule.error.message}
                      </p>
                      {schedule.error.status === 404 && (
                        <p className="mt-1 text-[11px] leading-relaxed text-red-700/80">
                          This Pincer backend does not expose POST /api/voice/schedule yet — it
                          arrives with Sprint 6 T6.1.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {mode === 'now' && initiate.isError && (
                <div className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2.5">
                  <p className="text-xs font-medium text-red-700">{initiate.error.message}</p>
                </div>
              )}

              {/* Demo-persisted planned items for the active mocked mode */}
              {mode === 'queue' && myPlanned.length > 0 && (
                <div className="border-t border-[var(--line-soft)] pt-4">
                  <p className="plat-eyebrow mb-2 flex items-center gap-2">
                    Saved queues <MockedBadge />
                  </p>
                  <div className="space-y-1.5">
                    {myPlanned.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-[10px] border border-dashed border-amber-300/70 bg-amber-50/40 px-3 py-2 text-xs">
                        <CalendarClock className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span className="min-w-0 flex-1 truncate text-[var(--text-2)]">
                          {item.kind === 'scheduled'
                            ? `${item.numbers[0]?.name || item.numbers[0]?.number} · ${item.at}`
                            : `${item.numbers.length} calls · ${item.numbers.map((entry) => entry.name || entry.number).join(', ')}`}
                          <span className="ml-2 text-[var(--text-5)]">— {item.purpose}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removePlanned(item.id)}
                          className="rounded p-1 text-[var(--text-5)] hover:bg-amber-100 hover:text-[var(--text-3)]"
                          aria-label="Delete planned item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-[var(--line-soft)] px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-xs font-medium text-[var(--text-4)] hover:bg-[var(--sand-deep)] hover:text-[var(--text-2)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit || pending}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors',
                  canSubmit && !pending
                    ? 'bg-[var(--ink)] text-white hover:opacity-85'
                    : 'cursor-not-allowed bg-[var(--sand-deep)] text-[var(--text-5)]',
                )}
              >
                {mode === 'appointment' ? (
                  <CalendarCheck2 className="h-3.5 w-3.5" />
                ) : (
                  <PhoneOutgoing className="h-3.5 w-3.5" />
                )}
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
