import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Download,
  Flag,
  CheckCircle2,
  XCircle,
  PhoneOff,
  Send,
  Clock,
  Euro,
  MessageSquare,
  Zap,
  ChevronDown,
  ChevronUp,
  FileText,
  CalendarDays,
  StickyNote,
  BookUser,
  ExternalLink,
  Sparkles,
  Phone,
} from 'lucide-react';
import {
  ALL_MOCK_CALLS,
  COUNTRY_FLAGS,
  type MockCall,
  type CallStatus,
  type GeneratedDoc,
} from '@/pages/telephony/_lib/mock-data';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDuration(sec: number | null | undefined): string {
  if (!sec) return '—';
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
}

function fmtOffset(sec: number): string {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function fmtTime(ms: number): string {
  return new Date(ms).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function fmtDate(ms: number): string {
  return new Date(ms).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_META: Record<CallStatus, { label: string; cls: string; dot: string }> = {
  live:             { label: 'Live',             cls: 'bg-green-50 text-green-700 border-green-200',  dot: 'bg-green-500 animate-pulse' },
  completed:        { label: 'Completed',        cls: 'bg-gray-100 text-gray-600 border-gray-200',   dot: 'bg-gray-400' },
  failed:           { label: 'Failed',           cls: 'bg-red-50 text-red-600 border-red-200',       dot: 'bg-red-400' },
  aborted:          { label: 'Aborted',          cls: 'bg-red-50 text-red-500 border-red-200',       dot: 'bg-red-300' },
  pending_approval: { label: 'Pending approval', cls: 'bg-blue-50 text-blue-600 border-blue-200',   dot: 'bg-blue-400' },
  awaiting_user:    { label: 'Awaiting you',     cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400 animate-pulse' },
  scheduled:        { label: 'Scheduled',        cls: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-400' },
  queued:           { label: 'Queued',           cls: 'bg-sky-50 text-sky-700 border-sky-200',      dot: 'bg-sky-400' },
};

function StatusBadge({ status }: { status: CallStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={cn('flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', m.cls)}>
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', m.dot)} />
      {m.label}
    </span>
  );
}

// ─── State machine timeline ────────────────────────────────────────────────────

const STAGES_BASE   = ['Init', 'Greeting', 'Conversation', 'Wrap-up', 'Done'];
const STAGES_CONFIRM = ['Init', 'Greeting', 'Conversation', 'Confirming', 'Done'];

function stageIndex(status: CallStatus, hasIntervention: boolean): number {
  switch (status) {
    case 'live':             return 2;
    case 'awaiting_user':    return hasIntervention ? 3 : 2;
    case 'completed':        return 4;
    case 'failed':
    case 'aborted':          return 4;
    case 'pending_approval': return 0;
    default:                 return 0;
  }
}

function StateMachineTimeline({ call }: { call: MockCall }) {
  const stages = call.hasUserIntervention ? STAGES_CONFIRM : STAGES_BASE;
  const active = stageIndex(call.status, call.hasUserIntervention);
  const isFailed = call.status === 'failed' || call.status === 'aborted';

  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {stages.map((s, i) => {
        const done   = i < active;
        const isNow  = i === active;
        const failed = isNow && isFailed;
        const label  = failed && i === stages.length - 1 ? 'Failed' : s;

        return (
          <div key={s} className="flex items-center gap-0.5">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-medium transition-all',
                done   ? 'bg-[#dde9f4] text-gray-600'
                : failed ? 'bg-red-100 text-red-600'
                : isNow && call.status === 'live' ? 'bg-green-100 text-green-700 ring-1 ring-green-300'
                : isNow ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-400',
              )}
            >
              {done ? '✓ ' : ''}{label}
            </span>
            {i < stages.length - 1 && (
              <span className="text-gray-200 text-[10px]">›</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Transcript bubble ────────────────────────────────────────────────────────

function TranscriptBubble({ turn, agentLabel }: { turn: MockCall['transcript'][0]; agentLabel: string }) {
  const isAgent = turn.role === 'agent';
  return (
    <div className={cn('mb-4 flex flex-col', isAgent ? 'items-start' : 'items-end')}>
      <div className="mb-1 flex items-center gap-2 px-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          {isAgent ? agentLabel : 'Gesprächspartner'}
        </span>
        <span className="text-[10px] text-gray-300">{fmtOffset(turn.timestampSec)}</span>
      </div>
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed text-gray-900',
          isAgent ? 'rounded-tl-none bg-[#dde9f4]' : 'rounded-tr-none bg-gray-100',
        )}
      >
        {turn.text}
      </div>
    </div>
  );
}

function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="mb-4 flex flex-col items-start">
      <span className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-none bg-[#dde9f4] px-4 py-3">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function AwaitingBanner() {
  return (
    <div className="my-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <p className="mb-2 text-xs font-medium text-amber-800">
        ⏸ Awaiting your confirmation:
        <span className="ml-1 font-semibold">"Soll ich den Termin für Donnerstag 14:00 Uhr bestätigen?"</span>
      </p>
      <div className="flex gap-2">
        <button type="button" className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600">
          Approve
        </button>
        <button type="button" className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200">
          Deny
        </button>
      </div>
    </div>
  );
}

// ─── Generated / linked documents ─────────────────────────────────────────────

const DOC_TYPE_META: Record<GeneratedDoc['type'], { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  calendar_event: { icon: CalendarDays, color: 'text-blue-500 bg-blue-50' },
  crm_note:       { icon: BookUser,     color: 'text-rose-500 bg-rose-50' },
  document:       { icon: FileText,     color: 'text-sky-500 bg-sky-50' },
  note:           { icon: StickyNote,   color: 'text-amber-500 bg-amber-50' },
};

const ACTION_LABEL: Record<GeneratedDoc['action'], string> = {
  created:   'Created',
  updated:   'Updated',
  scheduled: 'Scheduled',
};

function DocLink({ doc }: { doc: GeneratedDoc }) {
  const navigate = useNavigate();
  const meta = DOC_TYPE_META[doc.type];
  const Icon = meta.icon;

  return (
    <button
      type="button"
      onClick={() => navigate(doc.href)}
      className="flex w-full items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-left transition-colors hover:border-[#8fc4e4] hover:bg-[#f0f7fc]"
    >
      <div className={cn('mt-0.5 shrink-0 rounded-lg p-1.5', meta.color)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-gray-800">{doc.label}</p>
        <p className="mt-0.5 text-[10px] text-gray-400">{ACTION_LABEL[doc.action]} by agent</p>
      </div>
      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" />
    </button>
  );
}

// ─── Outcome chip ─────────────────────────────────────────────────────────────

function OutcomeChip({ outcome }: { outcome: MockCall['outcome'] }) {
  if (!outcome) return null;
  const map: Record<NonNullable<MockCall['outcome']>, { label: string; cls: string }> = {
    booked:             { label: '✓ Booked',           cls: 'bg-green-100 text-green-700' },
    info_collected:     { label: '✓ Info collected',   cls: 'bg-blue-100 text-blue-700' },
    voicemail:          { label: '📬 Voicemail',        cls: 'bg-amber-100 text-amber-700' },
    no_answer:          { label: '— No answer',        cls: 'bg-gray-100 text-gray-600' },
    failed:             { label: '✗ Failed',           cls: 'bg-red-100 text-red-600' },
    user_aborted:       { label: '✗ Aborted',          cls: 'bg-gray-100 text-gray-500' },
    callback_requested: { label: '↩ Callback',         cls: 'bg-sky-100 text-sky-700' },
  };
  const m = map[outcome];
  return (
    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', m.cls)}>{m.label}</span>
  );
}

// ─── Left panel ───────────────────────────────────────────────────────────────

function LeftPanel({ call, onBack }: { call: MockCall; onBack: () => void }) {
  const [objectiveOpen, setObjectiveOpen] = useState(true);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-100 bg-white">
      <div className="space-y-5 p-4">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to calls
        </button>

        {/* Counterparty */}
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg">
              {COUNTRY_FLAGS[call.counterpartyCountry] ?? '🌐'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {call.counterpartyName ?? call.counterpartyPhone}
              </p>
              {call.counterpartyName && (
                <p className="truncate text-xs text-gray-400">{call.counterpartyPhone}</p>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            {call.direction === 'outbound'
              ? <ArrowUpRight className="h-3.5 w-3.5 text-gray-400" />
              : <ArrowDownLeft className="h-3.5 w-3.5 text-gray-400" />}
            <span className="capitalize">{call.direction} call</span>
            {call.startedAt > 0 && (
              <>
                <span className="text-gray-300">·</span>
                <span>{fmtDate(call.startedAt)}</span>
                <span className="text-gray-300">·</span>
                <span>{fmtTime(call.startedAt)}</span>
              </>
            )}
          </div>
        </div>

        {/* Agent */}
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Agent</p>
          <span className="rounded-full bg-[#dde9f4] px-2.5 py-1 text-xs font-medium text-gray-800">
            {call.agentPersona}
          </span>
        </div>

        <hr className="border-gray-100" />

        {/* State machine */}
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Progress</p>
          <StateMachineTimeline call={call} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Clock,         label: 'Duration',       value: fmtDuration(call.durationSec) },
            { icon: Euro,          label: 'Cost',           value: call.costEur > 0 ? `€${call.costEur.toFixed(2)}` : '—' },
            { icon: MessageSquare, label: 'Turns',          value: String(call.transcript.length) },
            { icon: Zap,           label: 'Interventions',  value: call.hasUserIntervention ? '1' : '0' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] text-gray-400">
                <Icon className="h-3 w-3" /> {label}
              </div>
              <p className="text-sm font-semibold tabular-nums text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Outcome */}
        {call.outcome && (
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Outcome</p>
            <OutcomeChip outcome={call.outcome} />
          </div>
        )}

        {/* Objective */}
        <div>
          <button
            type="button"
            onClick={() => setObjectiveOpen((v) => !v)}
            className="flex w-full items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-600"
          >
            Objective
            {objectiveOpen
              ? <ChevronUp className="h-3.5 w-3.5" />
              : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {objectiveOpen && (
            <p className="mt-2 text-xs leading-relaxed text-gray-700">{call.objective}</p>
          )}
        </div>

        {/* Tags */}
        {call.tags.length > 0 && (
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Tags</p>
            <div className="flex flex-wrap gap-1">
              {call.tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Center panel (transcript) ────────────────────────────────────────────────

function CenterPanel({ call }: { call: MockCall }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [call.callSid]);

  const onCopy = () => {
    const text = call.transcript
      .map((t) => `[${fmtOffset(t.timestampSec)}] ${t.role === 'agent' ? call.agentPersona : 'Counterparty'}: ${t.text}`)
      .join('\n');
    navigator.clipboard.writeText(text).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Transcript header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Transcript</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-700"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-700"
          >
            <Download className="h-3.5 w-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Scrollable transcript body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* EU AI Act label */}
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          <p className="text-[11px] text-amber-800">
            KI-generierte Kommunikation — EU AI Act Art. 12 · Pincer Cloud
          </p>
        </div>

        {/* Empty */}
        {call.transcript.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="mb-3 h-10 w-10 text-gray-200" />
            <p className="text-sm text-gray-400">No transcript available</p>
            <p className="mt-1 text-xs text-gray-300">
              {call.status === 'pending_approval' || call.status === 'scheduled' || call.status === 'queued'
                ? 'Call has not started yet'
                : 'Transcript will appear here once the call begins'}
            </p>
          </div>
        )}

        {/* Turns */}
        {call.transcript.map((turn, idx) => {
          const isLastTurn = idx === call.transcript.length - 1;
          return (
            <div key={turn.id}>
              <TranscriptBubble turn={turn} agentLabel={call.agentPersona} />
              {isLastTurn && call.status === 'awaiting_user' && turn.role === 'agent' && (
                <AwaitingBanner />
              )}
            </div>
          );
        })}

        {call.status === 'live' && <TypingIndicator label={call.agentPersona} />}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Right panel ──────────────────────────────────────────────────────────────

function LivePanel({ call }: { call: MockCall }) {
  const [whisper, setWhisper] = useState('');
  const budget = 2.0;
  const pct = Math.min((call.costEur / budget) * 100, 100);
  const barColor = pct >= 95 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-400' : 'bg-[#bdd8ec]';

  return (
    <div className="space-y-4">
      {/* End call */}
      <button
        type="button"
        className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-red-500 text-sm font-medium text-white transition-colors hover:bg-red-600"
      >
        <PhoneOff className="h-4 w-4" /> End Call
      </button>

      {/* Cost ticker */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Live cost</p>
        <p className="text-2xl font-light tabular-nums text-gray-900">€{call.costEur.toFixed(2)}</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div className={cn('h-1.5 rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-[10px] text-gray-400">Budget: €{budget.toFixed(2)} max</p>
      </div>

      {/* Whisper */}
      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Whisper to agent</p>
        <textarea
          value={whisper}
          onChange={(e) => setWhisper(e.target.value)}
          placeholder="Give the agent a hint…"
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 p-2.5 text-sm outline-none placeholder:text-gray-300 focus:border-[#8fc4e4]"
        />
        <button
          type="button"
          className="mt-1.5 flex items-center gap-1.5 rounded-full bg-[#bdd8ec] px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-[#a5c8e0] ml-auto"
        >
          <Send className="h-3 w-3" /> Send
        </button>
      </div>
    </div>
  );
}

function CompletedPanel({ call }: { call: MockCall }) {
  const [training, setTraining] = useState(false);

  return (
    <div className="space-y-3">
      {/* Actions */}
      <button
        type="button"
        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-gray-200 text-sm text-gray-600 transition-colors hover:bg-gray-50"
      >
        <Flag className="h-3.5 w-3.5" /> Flag for review
      </button>
      <button
        type="button"
        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[#bdd8ec] text-sm font-medium text-gray-800 transition-colors hover:bg-[#a5c8e0]"
      >
        <Download className="h-3.5 w-3.5" /> Export transcript
      </button>

      {/* Training toggle */}
      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
        <span className="text-xs text-gray-600">Add to training set</span>
        <button
          type="button"
          onClick={() => setTraining((v) => !v)}
          className={cn(
            'relative h-5 w-9 rounded-full transition-colors',
            training ? 'bg-[#5aacee]' : 'bg-gray-200',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
              training ? 'translate-x-4' : 'translate-x-0.5',
            )}
          />
        </button>
      </div>
    </div>
  );
}

function PendingPanel({ call }: { call: MockCall }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Objective</p>
        <p className="text-sm text-gray-700">{call.objective}</p>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
        <span className="text-xs text-gray-500">Est. cost</span>
        <span className="text-sm font-medium text-gray-800">€0.40 – €0.80</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-amber-600">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        9:47 remaining to approve
      </div>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-green-500 text-sm font-medium text-white hover:bg-green-600"
      >
        <Phone className="h-4 w-4" /> Approve & place call
      </button>
      <button
        type="button"
        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-red-50 text-sm font-medium text-red-700 hover:bg-red-100"
      >
        <XCircle className="h-3.5 w-3.5" /> Reject
      </button>
    </div>
  );
}

function RightPanel({ call }: { call: MockCall }) {
  const isLive     = call.status === 'live' || call.status === 'awaiting_user';
  const isPending  = call.status === 'pending_approval';
  const isDone     = call.status === 'completed' || call.status === 'failed' || call.status === 'aborted';
  const hasDocs    = (call.generatedDocs?.length ?? 0) > 0;

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-l border-gray-100 bg-white">
      <div className="space-y-5 p-4">
        {isLive    && <LivePanel call={call} />}
        {isPending && <PendingPanel call={call} />}
        {isDone    && <CompletedPanel call={call} />}

        {/* Generated / linked documents */}
        {hasDocs && (
          <div>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Generated by agent
            </p>
            <div className="space-y-2">
              {call.generatedDocs!.map((doc) => (
                <DocLink key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
        )}

        {/* No docs placeholder for completed calls */}
        {isDone && !hasDocs && (
          <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center">
            <FileText className="mx-auto mb-2 h-6 w-6 text-gray-200" />
            <p className="text-xs text-gray-400">No documents generated</p>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Call detail header ────────────────────────────────────────────────────────

function DetailHeader({ call, onBack }: { call: MockCall; onBack: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {call.counterpartyName ?? call.counterpartyPhone}
          </p>
          <p className="text-[11px] text-gray-400">
            {call.direction === 'outbound' ? '↗ Outbound' : '↘ Inbound'} · {call.agentPersona}
            {call.startedAt > 0 && ` · ${fmtDate(call.startedAt)}`}
          </p>
        </div>
        <StatusBadge status={call.status} />
        {call.outcome && <OutcomeChip outcome={call.outcome} />}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        {call.durationSec > 0 && (
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {fmtDuration(call.durationSec)}
          </span>
        )}
        {call.costEur > 0 && (
          <span className="flex items-center gap-1">
            <Euro className="h-3.5 w-3.5" /> {call.costEur.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface CallDetailViewProps {
  callSid: string;
  onBack: () => void;
}

export default function CallDetailView({ callSid, onBack }: CallDetailViewProps) {
  const call = ALL_MOCK_CALLS.find((c) => c.callSid === callSid);

  if (!call) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-gray-400">
        <XCircle className="h-10 w-10 opacity-30" />
        <p className="text-sm">Call not found</p>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-white">
      <DetailHeader call={call} onBack={onBack} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LeftPanel call={call} onBack={onBack} />
        <CenterPanel call={call} />
        <RightPanel call={call} />
      </div>
    </div>
  );
}
