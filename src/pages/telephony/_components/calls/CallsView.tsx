import { useMemo, useState } from 'react';
import {
  Phone,
  PhoneCall,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Clock,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles,
  ListOrdered,
  Trash2,
  GripVertical,
} from 'lucide-react';
import {
  ALL_MOCK_CALLS,
  MOCK_SCHEDULED_CALLS,
  MOCK_QUEUED_CALLS,
  COUNTRY_FLAGS,
  type CallStatus,
  type CallDirection,
  type MockCall,
  type CallOutcome,
} from '@/pages/telephony/_lib/mock-data';
import PlatSelect from '@/pages/telephony/_components/shared/PlatSelect';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function fmtScheduled(ts: number) {
  const d = new Date(ts);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.floor((d.setHours(0,0,0,0) - today.getTime()) / 86_400_000);
  const time = new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  if (diff === 0) return `Heute ${time}`;
  if (diff === 1) return `Morgen ${time}`;
  return new Date(ts).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' }) + ` ${time}`;
}

// ─── Status dot ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: CallStatus }) {
  const base = 'h-2 w-2 rounded-full shrink-0';
  const map: Record<CallStatus, string> = {
    live: `${base} bg-green-500 animate-pulse`,
    completed: `${base} bg-[var(--text-5)]`,
    failed: `${base} bg-red-400`,
    aborted: `${base} bg-red-300`,
    pending_approval: `${base} bg-blue-400`,
    awaiting_user: `${base} bg-amber-400 animate-pulse`,
    scheduled: `${base} bg-violet-400`,
    queued: `${base} bg-sky-400`,
  };
  return <span className={map[status]} />;
}

// ─── Outcome chip ─────────────────────────────────────────────────────────────

function OutcomeChip({ outcome, status }: { outcome: CallOutcome; status: CallStatus }) {
  if (outcome) {
    const styles: Record<NonNullable<CallOutcome>, string> = {
      booked: 'bg-green-100 text-green-700',
      info_collected: 'bg-blue-100 text-blue-700',
      voicemail: 'bg-amber-100 text-amber-700',
      no_answer: 'bg-[var(--sand-deep)] text-[var(--text-3)]',
      failed: 'bg-red-100 text-red-600',
      user_aborted: 'bg-[var(--sand-deep)] text-[var(--text-4)]',
      callback_requested: 'bg-sky-100 text-sky-700',
    };
    const labels: Record<NonNullable<CallOutcome>, string> = {
      booked: 'Booked',
      info_collected: 'Info collected',
      voicemail: 'Voicemail',
      no_answer: 'No answer',
      failed: 'Failed',
      user_aborted: 'Aborted',
      callback_requested: 'Callback',
    };
    return (
      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0', styles[outcome])}>
        {labels[outcome]}
      </span>
    );
  }
  const statusChip: Partial<Record<CallStatus, { label: string; cls: string }>> = {
    live: { label: 'Live', cls: 'bg-green-50 text-green-700 border border-green-200' },
    pending_approval: { label: 'Pending', cls: 'bg-blue-50 text-blue-600 border border-blue-200' },
    awaiting_user: { label: 'Awaiting', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
    scheduled: { label: 'Scheduled', cls: 'bg-violet-50 text-violet-700 border border-violet-200' },
    queued: { label: 'Queued', cls: 'bg-sky-50 text-sky-700 border border-sky-200' },
  };
  const s = statusChip[status];
  if (!s) return null;
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0', s.cls)}>
      {s.label}
    </span>
  );
}

// ─── Place Call Modal ─────────────────────────────────────────────────────────

const AGENTS = [
  'Rezeptionistin Maria',
  'Sekretärin Sophie',
  'SDR Anton',
  'Rezeptionist Paul',
  'Assistent Klaus',
];

function PlaceCallModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [dialCode, setDialCode] = useState('+49');
  const [phone, setPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [agent, setAgent] = useState(AGENTS[0]);
  const [objective, setObjective] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [when, setWhen] = useState<'now' | 'scheduled'>('now');
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [placed, setPlaced] = useState(false);

  const canNext = phone.trim().length >= 6 && objective.trim().length >= 5;

  const onPlace = () => {
    setPlaced(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-[14px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--sand)]">
              <PhoneCall className="h-4 w-4 text-[var(--ink)]" />
            </div>
            <div>
              <h2 className="text-sm">
                {step === 1 ? 'Place a call' : 'Confirm & schedule'}
              </h2>
              <p className="text-[11px] text-[var(--text-5)]">Step {step} of 2</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[var(--text-5)] hover:bg-[var(--sand-deep)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {placed ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <PhoneCall className="h-7 w-7 text-green-600" />
            </div>
            <p className="text-base font-medium text-[var(--ink)]">
              {when === 'now' ? 'Call placed!' : 'Call scheduled!'}
            </p>
            <p className="mt-1 text-sm text-[var(--text-5)]">Agent is {when === 'now' ? 'dialling…' : 'ready for ' + schedDate}</p>
          </div>
        ) : step === 1 ? (
          <div className="space-y-4 px-6 py-5">
            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">Phone number *</label>
              <div className="flex gap-2">
                <PlatSelect
                  value={dialCode}
                  onChange={setDialCode}
                  ariaLabel="Country code"
                  className="w-auto shrink-0"
                >
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+43">🇦🇹 +43</option>
                  <option value="+41">🇨🇭 +41</option>
                </PlatSelect>
                <input
                  type="tel"
                  placeholder="089 12345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 rounded-[10px] border border-[var(--line)] px-3 py-2 text-sm outline-none placeholder:text-[var(--text-5)] focus:border-[var(--ink)]"
                />
              </div>
            </div>

            {/* Contact name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">Contact name (optional)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-5)]" />
                <input
                  type="text"
                  placeholder="Dr. Müller, Frau Weber…"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-[10px] border border-[var(--line)] py-2 pl-8 pr-3 text-sm outline-none placeholder:text-[var(--text-5)] focus:border-[var(--ink)]"
                />
              </div>
            </div>

            {/* Agent */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">Agent</label>
              <PlatSelect value={agent} onChange={setAgent} ariaLabel="Agent" className="bg-white">
                {AGENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </PlatSelect>
            </div>

            {/* Objective */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">
                Objective *
                <span className="ml-1 font-normal text-[var(--text-5)]">(what should the agent do?)</span>
              </label>
              <textarea
                placeholder="Termin für nächste Woche vereinbaren, Frage zu Rechnung klären…"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-[10px] border border-[var(--line)] px-3 py-2 text-sm outline-none placeholder:text-[var(--text-5)] focus:border-[var(--ink)]"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">Priority</label>
              <div className="flex gap-2">
                {(['normal', 'urgent'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs capitalize transition-colors',
                      priority === p
                        ? 'border-[var(--ink)] bg-[rgba(20,22,26,0.06)] text-[var(--ink)]'
                        : 'border-[var(--line)] text-[var(--text-3)] hover:bg-[var(--sand)]',
                    )}
                  >
                    {p === 'urgent' ? '🔴 ' : '⚪ '}{p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 px-6 py-5">
            {/* Summary card */}
            <div className="rounded-[14px] bg-[var(--sand)] p-4 text-sm">
              <p className="font-medium text-[var(--ink)]">{contactName || phone}</p>
              <p className="mt-0.5 text-xs text-[var(--text-4)]">{phone}</p>
              <p className="mt-2 text-xs text-[var(--text-2)]">{objective}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-[rgba(20,22,26,0.06)] px-2 py-0.5 text-[10px] text-[var(--text-2)]">{agent}</span>
                {priority === 'urgent' && (
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] text-red-600">Urgent</span>
                )}
              </div>
            </div>

            {/* When */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[var(--text-3)]">When</label>
              <div className="flex gap-2">
                {(['now', 'scheduled'] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWhen(w)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors',
                      when === w
                        ? 'border-[var(--ink)] bg-[rgba(20,22,26,0.06)] text-[var(--ink)]'
                        : 'border-[var(--line)] text-[var(--text-3)] hover:bg-[var(--sand)]',
                    )}
                  >
                    {w === 'now' ? <PhoneCall className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                    {w === 'now' ? 'Now' : 'Schedule'}
                  </button>
                ))}
              </div>
            </div>

            {when === 'scheduled' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-[var(--text-4)]">Date</label>
                  <input
                    type="date"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full rounded-[10px] border border-[var(--line)] px-3 py-2 text-sm outline-none focus:border-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-[var(--text-4)]">Time</label>
                  <input
                    type="time"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full rounded-[10px] border border-[var(--line)] px-3 py-2 text-sm outline-none focus:border-[var(--ink)]"
                  />
                </div>
              </div>
            )}

            {/* Cost estimate */}
            <div className="flex items-center gap-2 rounded-[10px] bg-[var(--sand)] px-3 py-2 text-xs text-[var(--text-4)]">
              <Sparkles className="h-3.5 w-3.5 text-violet-400 shrink-0" />
              Estimated cost: <span className="font-medium text-[var(--text-2)]">€0.35 – €0.85</span>
              <span className="ml-auto text-[10px] text-[var(--text-5)]">based on avg {agent} duration</span>
            </div>
          </div>
        )}

        {!placed && (
          <div className="flex items-center justify-between border-t border-[var(--line-soft)] px-6 py-4">
            <button
              type="button"
              onClick={step === 1 ? onClose : () => setStep(1)}
              className="rounded-full px-4 py-2 text-sm text-[var(--text-4)] hover:bg-[var(--sand-deep)]"
            >
              {step === 1 ? 'Cancel' : '← Back'}
            </button>
            {step === 1 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep(2)}
                className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-85 disabled:opacity-40"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={onPlace}
                className="flex items-center gap-1.5 rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                {when === 'now' ? 'Place call now' : 'Schedule call'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Schedule view ────────────────────────────────────────────────────────────

function ScheduleView() {
  const byDay = useMemo(() => {
    const groups = new Map<string, typeof MOCK_SCHEDULED_CALLS>();
    for (const call of MOCK_SCHEDULED_CALLS) {
      const day = new Date(call.scheduledAt!).toLocaleDateString('de-DE', {
        weekday: 'long', day: '2-digit', month: 'long',
      });
      if (!groups.has(day)) groups.set(day, []);
      groups.get(day)!.push(call);
    }
    return Array.from(groups.entries()).sort(
      ([, a], [, b]) => a[0].scheduledAt! - b[0].scheduledAt!,
    );
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {byDay.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Calendar className="mb-3 h-10 w-10 text-[var(--text-5)]" />
          <p className="text-sm text-[var(--text-5)]">No scheduled calls</p>
        </div>
      ) : (
        <div className="space-y-6">
          {byDay.map(([day, calls]) => (
            <div key={day}>
              <p className="plat-eyebrow mb-2.5">{day}</p>
              <div className="overflow-hidden rounded-[14px] border border-[var(--line-soft)] bg-white">
                {calls.map((call) => (
                  <div
                    key={call.callSid}
                    className="flex items-start gap-3 border-b border-[var(--line-soft)] p-4 last:border-b-0"
                  >
                    {/* Time column */}
                    <div className="w-14 shrink-0 text-center">
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {new Date(call.scheduledAt!).toLocaleTimeString('de-DE', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                      <p className="text-[10px] text-[var(--text-5)]">Uhr</p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[var(--ink)] truncate">
                          {call.counterpartyName ?? call.counterpartyPhone}
                        </p>
                        <span className="text-sm">{COUNTRY_FLAGS[call.counterpartyCountry]}</span>
                        <span className="rounded-full bg-[rgba(20,22,26,0.06)] px-2 py-0.5 text-[10px] text-[var(--text-2)]">
                          {call.agentPersona}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--text-4)] truncate">{call.objective}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {call.tags.map((t) => (
                          <span key={t} className="rounded-full bg-[var(--sand-deep)] px-1.5 py-0.5 text-[10px] text-[var(--text-4)]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        className="rounded-full border border-[var(--line)] px-2.5 py-1 text-[10px] text-[var(--text-3)] hover:bg-[var(--sand)]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-full p-1.5 text-[var(--text-5)] hover:bg-red-50 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Queue view ───────────────────────────────────────────────────────────────

function QueueView() {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {MOCK_QUEUED_CALLS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ListOrdered className="mb-3 h-10 w-10 text-[var(--text-5)]" />
          <p className="text-sm text-[var(--text-5)]">Queue is empty</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="mb-3 text-xs text-[var(--text-5)]">
            {MOCK_QUEUED_CALLS.length} calls waiting · Drag to reorder
          </p>
          <div className="overflow-hidden rounded-[14px] border border-[var(--line-soft)] bg-white">
          {MOCK_QUEUED_CALLS.map((call, idx) => (
            <div
              key={call.callSid}
              className="flex items-center gap-3 border-b border-[var(--line-soft)] p-4 last:border-b-0"
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-[var(--text-5)]" />

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--sand-deep)] text-xs font-bold text-[var(--text-2)]">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--ink)] truncate">
                    {call.counterpartyName ?? call.counterpartyPhone}
                  </p>
                  <span className="text-sm">{COUNTRY_FLAGS[call.counterpartyCountry]}</span>
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-4)] truncate">{call.objective}</p>
                <span className="mt-1 inline-block rounded-full bg-[rgba(20,22,26,0.06)] px-2 py-0.5 text-[10px] text-[var(--text-2)]">
                  {call.agentPersona}
                </span>
              </div>

              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  className="rounded-full bg-[var(--ink)] px-3 py-1 text-[10px] font-semibold text-white transition-opacity hover:opacity-85"
                >
                  Place now
                </button>
                <button
                  type="button"
                  className="rounded-full p-1.5 text-[var(--text-5)] hover:bg-red-50 hover:text-red-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Call Row ─────────────────────────────────────────────────────────────────

function CallRow({
  call,
  isSelected,
  onClick,
}: {
  call: MockCall;
  isSelected: boolean;
  onClick: () => void;
}) {
  const name = call.counterpartyName ?? call.counterpartyPhone;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 border-b border-[var(--line-soft)] px-4 py-3 text-left transition-colors',
        isSelected ? 'bg-[rgba(20,22,26,0.06)]' : 'hover:bg-[rgba(20,22,26,0.02)]',
      )}
    >
      {/* Status + direction */}
      <div className="flex w-5 shrink-0 flex-col items-center gap-1">
        <StatusDot status={call.status} />
        {call.direction === 'outbound'
          ? <ArrowUpRight className="h-3 w-3 text-[var(--text-5)]" />
          : <ArrowDownLeft className="h-3 w-3 text-[var(--text-5)]" />}
      </div>

      {/* Counterparty */}
      <div className="w-40 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-[var(--ink)]">{name}</span>
          <span className="shrink-0 text-sm">{COUNTRY_FLAGS[call.counterpartyCountry]}</span>
        </div>
        {call.counterpartyName && (
          <p className="truncate text-[11px] text-[var(--text-5)]">{call.counterpartyPhone}</p>
        )}
      </div>

      {/* Scheduled time for future calls */}
      {call.scheduledAt ? (
        <div className="flex flex-1 items-center gap-1.5 min-w-0">
          <Clock className="h-3 w-3 shrink-0 text-violet-400" />
          <span className="truncate text-xs text-violet-600">{fmtScheduled(call.scheduledAt)}</span>
          <span className="mx-1 text-[var(--text-5)]">·</span>
          <span className="truncate text-xs text-[var(--text-4)]">{call.objective}</span>
        </div>
      ) : (
        <p className="flex-1 min-w-0 truncate text-xs text-[var(--text-4)]">
          {call.summary || call.objective}
        </p>
      )}

      {/* Agent */}
      <span className="shrink-0 rounded-full bg-[var(--sand-deep)] px-2 py-0.5 text-[10px] text-[var(--text-4)]">
        {call.agentPersona}
      </span>

      {/* Duration */}
      <div className="w-14 shrink-0 text-right">
        {call.status === 'live' ? (
          <span className="flex items-center justify-end gap-1 text-xs font-medium text-green-600">
            Live <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          </span>
        ) : call.status === 'scheduled' ? (
          <span className="text-[10px] text-violet-400">—</span>
        ) : call.status === 'queued' ? (
          <span className="text-[10px] text-sky-400">#{call.queuePosition}</span>
        ) : call.durationSec > 0 ? (
          <span className="text-xs tabular-nums text-[var(--text-4)]">{fmt(call.durationSec)}</span>
        ) : (
          <span className="text-xs text-[var(--text-5)]">—</span>
        )}
      </div>

      {/* Cost */}
      <div className="w-12 shrink-0 text-right">
        <span className="text-xs tabular-nums text-[var(--text-4)]">
          {call.costEur > 0 ? `€${call.costEur.toFixed(2)}` : '—'}
        </span>
      </div>

      {/* Outcome */}
      <div className="w-24 shrink-0 flex justify-end">
        <OutcomeChip outcome={call.outcome} status={call.status} />
      </div>
    </button>
  );
}

// ─── Filter config ────────────────────────────────────────────────────────────

type Tab = 'calls' | 'schedule' | 'queue';
type StatusFilter = 'all' | 'live' | 'pending' | 'completed' | 'failed';
type DirectionFilter = 'all' | 'inbound' | 'outbound';

// ─── Main component ───────────────────────────────────────────────────────────

interface CallsViewProps {
  onSelectCall: (callSid: string) => void;
  selectedCallSid: string | null;
}

export default function CallsView({ onSelectCall, selectedCallSid }: CallsViewProps) {
  const [tab, setTab] = useState<Tab>('calls');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const liveCount = ALL_MOCK_CALLS.filter((c) => c.status === 'live').length;
  const pendingCount = ALL_MOCK_CALLS.filter(
    (c) => c.status === 'pending_approval' || c.status === 'awaiting_user',
  ).length;

  const filteredCalls = useMemo(() => {
    setPage(1);
    const base = ALL_MOCK_CALLS.filter(
      (c) => c.status !== 'scheduled' && c.status !== 'queued',
    );
    return base.filter((call) => {
      if (statusFilter === 'live' && call.status !== 'live') return false;
      if (statusFilter === 'pending' && call.status !== 'pending_approval' && call.status !== 'awaiting_user') return false;
      if (statusFilter === 'completed' && call.status !== 'completed') return false;
      if (statusFilter === 'failed' && call.status !== 'failed' && call.status !== 'aborted') return false;
      if (directionFilter !== 'all' && call.direction !== directionFilter) return false;
      return true;
    });
  }, [statusFilter, directionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCalls.length / PAGE_SIZE));
  const pagedCalls = filteredCalls.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--line-soft)] px-6 py-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="plat-crumb" style={{ color: 'var(--text-4)' }}>3days.telephony</p>
            <h1 className="mt-1 text-[26px] text-[var(--ink)]">Calls</h1>
          </div>
          {liveCount > 0 && (
            <span className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              {liveCount} live
            </span>
          )}
          {pendingCount > 0 && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
              {pendingCount} pending
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-85"
        >
          <PhoneCall className="h-3.5 w-3.5" /> Place call
        </button>
      </div>

      {/* Tabs: Calls / Schedule / Queue */}
      <div className="flex shrink-0 items-center gap-0 border-b border-[var(--line-soft)] px-6">
        {([
          { id: 'calls', label: 'All calls', count: ALL_MOCK_CALLS.filter(c => c.status !== 'scheduled' && c.status !== 'queued').length },
          { id: 'schedule', label: 'Scheduled', count: MOCK_SCHEDULED_CALLS.length, dot: 'bg-violet-400' },
          { id: 'queue', label: 'Queue', count: MOCK_QUEUED_CALLS.length, dot: 'bg-sky-400' },
        ] as const).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm transition-colors',
              tab === t.id
                ? 'border-[var(--ink)] text-[var(--ink)] font-semibold'
                : 'border-transparent text-[var(--text-4)] hover:text-[var(--text-2)]',
            )}
          >
            {t.label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                tab === t.id ? 'bg-[rgba(20,22,26,0.06)] text-[var(--text-2)]' : 'bg-[var(--sand-deep)] text-[var(--text-4)]',
              )}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters — only for calls tab */}
      {tab === 'calls' && (
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-[var(--line-soft)] px-6 py-2.5">
          <div className="flex items-center gap-1.5">
            {(['all', 'live', 'pending', 'completed', 'failed'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setStatusFilter(v)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs capitalize transition-colors',
                  statusFilter === v
                    ? 'border-[var(--ink)] bg-[rgba(20,22,26,0.06)] text-[var(--ink)]'
                    : 'border-[var(--line)] text-[var(--text-4)] hover:border-[var(--line)] hover:text-[var(--text-2)]',
                )}
              >
                {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-[var(--sand-deep)]" />
          <div className="flex items-center gap-1.5">
            {(['all', 'inbound', 'outbound'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setDirectionFilter(v)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs capitalize transition-colors',
                  directionFilter === v
                    ? 'border-[var(--ink)] bg-[rgba(20,22,26,0.06)] text-[var(--ink)]'
                    : 'border-[var(--line)] text-[var(--text-4)] hover:border-[var(--line)] hover:text-[var(--text-2)]',
                )}
              >
                {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {tab === 'calls' && (
        filteredCalls.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-[var(--text-5)]">
            <Phone className="h-10 w-10 opacity-30" />
            <p className="text-sm font-light">No calls match the selected filters</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto min-h-0">
              {pagedCalls.map((call) => (
                <CallRow
                  key={call.callSid}
                  call={call}
                  isSelected={call.callSid === selectedCallSid}
                  onClick={() => onSelectCall(call.callSid)}
                />
              ))}
            </div>

            {/* Pagination bar */}
            <div className="flex shrink-0 items-center justify-between border-t border-[var(--line-soft)] px-5 py-2.5">
              <p className="text-xs text-[var(--text-5)]">
                {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filteredCalls.length)} of {filteredCalls.length} calls
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-4)] transition-colors hover:bg-[var(--sand)] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '…' ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-xs text-[var(--text-5)]">…</span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p as number)}
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors',
                          page === p
                            ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]'
                            : 'text-[var(--text-4)] hover:bg-[var(--sand-deep)]',
                        )}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-4)] transition-colors hover:bg-[var(--sand)] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </>
        )
      )}

      {tab === 'schedule' && <ScheduleView />}
      {tab === 'queue' && <QueueView />}

      {showModal && <PlaceCallModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
