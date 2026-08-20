// src/lib/api/voice.ts
// API client + types for /api/voice/*. Follows the existing dashboard
// pattern: bearer token from the Pincer auth store, TanStack Query hooks.

import { useEffect, useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
// Auth stays single-source: the voice endpoints live on the same Pincer
// backend as /api/chat and /api/status, so the token, the per-browser
// `X-Pincer-User` id and the error shape all come from pincerClient.
import { getAuth, authHeaders, isConnected, PincerError } from "@/lib/pincerClient";

// Re-exported so voice surfaces have one import for "is there a backend?".
export { isConnected };
import { REFETCH_INTERVALS } from "@/lib/constants";
import { sseFrames } from "@/lib/sse";

/**
 * Authenticated JSON fetch against the connected Pincer backend.
 *
 * Mirrors pincerClient's private `request()` (same headers, same 401 and
 * error-detail handling) — kept here rather than widening pincerClient's
 * public surface, but reading credentials only through its exports.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const auth = getAuth();
  if (!auth) throw new PincerError("Not connected to Pincer backend", 0);
  const res = await fetch(`${auth.apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(auth),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
      else if (body?.error) detail = body.error;
    } catch {
      /* keep default detail */
    }
    throw new PincerError(detail, res.status);
  }
  return res.json() as Promise<T>;
}

// ── Types (mirror src/pincer/api/voice.py schemas) ──────────────────

export interface VoiceStatus {
  engine: string;
  language: string;
  consent_mode: string;
  outbound_enabled: boolean;
  voice_configured: boolean;
  webhook_base_configured: boolean;
  active_call_count: number;

  // ── Outbound guardrails (Sprint 8 T8.3) ──
  // Optional throughout: a backend that predates the limits work simply omits
  // them and the header strip renders nothing rather than inventing numbers.
  /** Outbound calls placed in the current day window. */
  daily_calls_used?: number;
  /** Configured ceiling; null means "no limit configured". */
  daily_calls_limit?: number | null;
  /** True while server-side quiet hours are suppressing outbound calls. */
  quiet_hours_active?: boolean;
  /** Local wall-clock time outbound resumes, e.g. "08:00". */
  quiet_hours_until?: string | null;
  /** Size of the do-not-call list. */
  do_not_call_count?: number;
}

export interface ActiveCall {
  call_sid: string;
  direction: string;
  caller_number: string;
  target_number: string;
  target_name: string;
  purpose: string;
  engine: string;
  duration_seconds: number;
}

/**
 * Turn-latency roll-up for one call — from the `TURN_LATENCY` events Sprint 5
 * T5.1 emits. Every number is milliseconds; nulls mean "that stage was never
 * timed on this call" (e.g. a call that never reached TTS).
 */
export interface LatencyStages {
  stt: number | null;
  llm_ttft: number | null;
  tts: number | null;
  total: number | null;
}

/** One conversational turn's stage timings — detail view only. */
export interface LatencyTurn {
  turn: number;
  stt_ms: number | null;
  llm_ttft_ms: number | null;
  tts_ms: number | null;
  total_ms: number | null;
}

export interface CallLatency {
  turns: number;
  p50_ms: number | null;
  p95_ms: number | null;
  stages_p50: LatencyStages;
  /** Detail-only. Absent on the list endpoint — the panel falls back to p50. */
  per_turn?: LatencyTurn[];
}

/** Sprint 5 targets the latency chip is coloured against (ms, p50 per turn). */
export const LATENCY_TARGET_GOOD_MS = 1_200;
export const LATENCY_TARGET_OK_MS = 2_000;

/**
 * Appointment state carried by a `schedule_appointment_call` (Sprint 6
 * T6.3/T6.4). `status` walks proposed → verified → calendar_created →
 * invitations_sent, and can end at `failed` / `no_slot` / `declined`.
 */
export type AppointmentStatus = string;

/** Known `AppointmentStatus` values, in the order the timeline walks them. */
export const APPOINTMENT_STEPS = [
  "proposed",
  "verified",
  "calendar_created",
  "invitations_sent",
] as const;

/** Terminal states that are not a step on the happy path. */
export const APPOINTMENT_TERMINAL = ["failed", "no_slot", "declined"] as const;

export interface AppointmentInfo {
  status: AppointmentStatus;
  agreed_datetime: string | null;
  duration_minutes: number | null;
  calendar_event_link: string | null;
  retry_count: number;
}

/** A slot the agent offered on the call. */
export interface AppointmentCandidate {
  start: string;
  end?: string | null;
  /** True for the slot the callee actually agreed to. */
  accepted?: boolean;
}

/** One dial attempt in a retried scheduling job. */
export interface AppointmentAttempt {
  attempt: number;
  call_sid?: string | null;
  at?: string | null;
  outcome?: string | null;
}

/** Everything the detail endpoint knows about the appointment. */
export interface AppointmentDetail extends AppointmentInfo {
  topic?: string | null;
  candidates?: AppointmentCandidate[];
  attendees?: string[];
  max_retries?: number | null;
  attempts?: AppointmentAttempt[];
  /**
   * Sprint 6's honesty rule: when the calendar write fails the appointment is
   * NOT reported as booked. This carries the reason, and `follow_up` what the
   * backend does about it.
   */
  calendar_error?: string | null;
  follow_up?: string | null;
}

/** A promise made on the call. The backend writes `{who, what, when}`. */
export interface Commitment {
  /** 'agent' | 'callee' — empty when the record predates the field. */
  who: string;
  what: string;
  when: string | null;
}

/** A proposed next action. The backend writes `{tool, reason, draft_args}`. */
export interface FollowUpSuggestion {
  tool: string;
  reason: string;
}

/** Structured end-of-call extraction (Sprint 3 T3.1). */
export interface CallOutcome {
  outcome: string;
  task_result?: string;
  key_facts?: string[];
  commitments?: Commitment[];
  follow_up_suggestions?: FollowUpSuggestion[];
  language?: string;
}

export interface CallSummary {
  call_sid: string;
  direction: string;
  status: string;
  from_number: string;
  to_number: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;

  // ── Added by the v2 API extension. All optional: an older backend omits
  // them and every surface that uses them renders nothing instead of a zero.
  /** BCP-47-ish language the call was conducted in, e.g. "en", "de". */
  language?: string | null;
  /** Sprint 9 T9.3 failure taxonomy, e.g. "no_answer", "stt_timeout". */
  failure_code?: string | null;
  /** Sprint 9 T9.1 `call_costs` roll-up, USD. */
  cost_total_usd?: number | null;
  /**
   * Why an inbound call came in (S12 §11). Null/absent for outbound calls and
   * for any backend that predates the receptionist.
   */
  inbound_intent?: InboundIntent | string | null;
  appointment?: AppointmentInfo | null;
  outcome?: CallOutcome | null;
  latency?: CallLatency | null;
}

export interface TranscriptLine {
  speaker: "agent" | "caller" | "provider" | "system" | string;
  text: string;
  confidence: number;
  state: string;
  timestamp: string;
}

export interface CallAction {
  action_type: string;
  tool_name: string;
  input_summary: string;
  output_summary: string;
  user_confirmed: boolean | null;
  timestamp: string;

  // ── v3 (S11 §9): how this action was allowed to happen ──
  /** Tool tier: R read · W write · X dangerous. */
  tier?: ToolTier | string | null;
  /** Which gate applied: auto · verbal · user · off. */
  approval_mode?: ApprovalMode | string | null;
  /**
   * S11 §5.2 *code* (not a sentence) when the action was refused. The UI owns
   * the code → sentence map, in both UI languages.
   */
  deny_reason?: string | null;
}

/** Tool risk tier (S11 §3). */
export type ToolTier = "R" | "W" | "X";

/** Which gate a tool call went through (S11 §6). */
export type ApprovalMode = "auto" | "verbal" | "user" | "off";

/** Why an inbound call came in (S12 §11). */
export type InboundIntent =
  | "question"
  | "message"
  | "appointment"
  | "human"
  | "unknown"
  | "after_hours";

export const INBOUND_INTENTS: InboundIntent[] = [
  "question",
  "message",
  "appointment",
  "human",
  "unknown",
  "after_hours",
];

export interface CallDetail extends CallSummary {
  transcript: TranscriptLine[];
  actions: CallAction[];
  /** Detail carries the candidates/attempts the list summary leaves out. */
  appointment?: AppointmentDetail | null;
}

export interface Contact {
  name: string;
  phone_number: string;
  notes: string;
  /** On the do-not-call list (Sprint 8 T8.3) — the UI refuses to dial them. */
  opted_out?: boolean;
}

export interface InitiateCallIn {
  target_number: string;
  purpose: string;
  target_name?: string;
  language?: string;
}

export interface InitiateCallOut {
  call_sid: string;
}

// ── Hooks ────────────────────────────────────────────────────────────
// All queries are gated on a connected backend: with no token stored there
// is nothing to poll, and the page renders a connect prompt instead.

const VOICE_REFETCH = REFETCH_INTERVALS.VOICE ?? 5_000;

export function useVoiceConnected(): boolean {
  return isConnected();
}

export function useVoiceStatus() {
  return useQuery<VoiceStatus, PincerError>({
    queryKey: ["voice", "status"],
    queryFn: () => apiFetch("/api/voice/status"),
    refetchInterval: VOICE_REFETCH,
    enabled: isConnected(),
  });
}

// ── Voice config: runtime-switchable turn model (Sprint 5 T5.4) ─────

export interface TurnModelChoice {
  value: string; // "" (default) | "<model>" | "<provider>:<model>"
  label: string;
}

export interface VoiceConfig {
  voice_turn_model: string;
  default_model: string;
  choices: TurnModelChoice[];
}

export function useVoiceConfig() {
  return useQuery<VoiceConfig, PincerError>({
    queryKey: ["voice", "config"],
    queryFn: () => apiFetch("/api/voice/config"),
    enabled: isConnected(),
  });
}

/**
 * Switch the model used for live voice turns. Applied by the backend to the
 * very NEXT turn of any active call and persisted across restarts
 * (data_dir/voice_runtime.json).
 */
export function useUpdateVoiceConfig() {
  const qc = useQueryClient();
  return useMutation<VoiceConfig, PincerError, string>({
    mutationFn: (voice_turn_model) =>
      apiFetch("/api/voice/config", {
        method: "PUT",
        body: JSON.stringify({ voice_turn_model }),
      }),
    onSuccess: (data) => qc.setQueryData(["voice", "config"], data),
  });
}

export function useActiveCalls() {
  return useQuery<ActiveCall[], PincerError>({
    queryKey: ["voice", "active"],
    queryFn: () => apiFetch("/api/voice/active"),
    refetchInterval: 2_000, // live section polls faster
    enabled: isConnected(),
  });
}

/**
 * Backend hard cap on `/api/voice/calls?limit=` (see api/voice.py:
 * `Query(default=50, ge=1, le=200)`). Asking for more is a 422, so history is
 * fetched in chunks of exactly this size.
 */
export const CALL_HISTORY_CHUNK = 200;

/** Safety cap on how much history is pulled into the browser at once. */
export const CALL_HISTORY_MAX = 1_000;

/** History polls slower than the live sections — finished calls do not move. */
const VOICE_HISTORY_REFETCH = 15_000;

/**
 * Whole call history, fetched in backend-sized chunks and accumulated client
 * side.
 *
 * `/api/voice/calls` returns a bare array with no total count, so paging it
 * server-side would leave the table unable to say how many calls exist, and
 * search/duration filters would only ever see the current page. Pulling the
 * full set (bounded by `max`) instead lets the table filter, sort and paginate
 * over everything. Chunks after the first are fetched automatically.
 */
export function useCallHistoryAll(max = CALL_HISTORY_MAX) {
  const q = useInfiniteQuery<CallSummary[], PincerError, InfiniteData<CallSummary[]>, string[], number>({
    queryKey: ["voice", "calls", "all"],
    queryFn: ({ pageParam }) =>
      apiFetch(`/api/voice/calls?limit=${CALL_HISTORY_CHUNK}&offset=${pageParam}`),
    initialPageParam: 0,
    getNextPageParam: (lastChunk, chunks) =>
      lastChunk.length < CALL_HISTORY_CHUNK ? undefined : chunks.length * CALL_HISTORY_CHUNK,
    refetchInterval: VOICE_HISTORY_REFETCH,
    enabled: isConnected(),
  });

  const calls = useMemo(() => (q.data?.pages ?? []).flat(), [q.data]);
  const belowCap = calls.length < max;
  const canAutoFetch = q.hasNextPage && belowCap && !q.isFetchingNextPage;
  const { fetchNextPage } = q;

  useEffect(() => {
    if (canAutoFetch) void fetchNextPage();
  }, [canAutoFetch, fetchNextPage]);

  return {
    calls,
    isLoading: q.isLoading,
    /** True while the tail of the history is still streaming in. */
    isLoadingMore: q.isFetchingNextPage || canAutoFetch,
    isError: q.isError,
    error: q.error,
    isRefetching: q.isRefetching,
    refetch: q.refetch,
    /** More calls exist on the server than the `max` cap allows loading. */
    cappedAt: q.hasNextPage && !belowCap ? calls.length : null,
    loadMore: () => void fetchNextPage(),
  };
}

export function useCallDetail(callSid: string | null) {
  return useQuery<CallDetail, PincerError>({
    queryKey: ["voice", "call", callSid],
    queryFn: () => apiFetch(`/api/voice/calls/${callSid}`),
    enabled: !!callSid && isConnected(),
  });
}

/**
 * Detail for an in-progress call: the backend stores finalized transcript
 * lines and actions as the call runs, so polling the same detail endpoint
 * every 2s gives a real live transcript feed.
 */
export function useLiveCallDetail(callSid: string | null) {
  return useQuery<CallDetail, PincerError>({
    queryKey: ["voice", "call-live", callSid],
    queryFn: () => apiFetch(`/api/voice/calls/${callSid}`),
    enabled: !!callSid && isConnected(),
    refetchInterval: 2_000,
  });
}

/**
 * Ask the agent for a call summary WITHOUT touching the user's chat thread.
 *
 * /api/chat/message is stateful per X-Pincer-User: sent as the browser's own
 * user, the agent answers inside the ongoing conversation (memory and all) —
 * which produced replies about *previous* chat context instead of the
 * transcript. So summaries run under a dedicated per-browser summarizer
 * identity: clean context in, and the exchange is stored under that side
 * identity instead of polluting the user's history.
 */
const SUMMARIZER_ID_KEY = "pincer.web.summarizerId";

export async function generateCallSummary(transcript: string): Promise<string> {
  const auth = getAuth();
  if (!auth) throw new PincerError("Not connected to Pincer backend", 0);

  let sid = localStorage.getItem(SUMMARIZER_ID_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(SUMMARIZER_ID_KEY, sid);
  }

  const prompt =
    "You are acting as a summarization function, not a conversational assistant. " +
    "Ignore any previous conversation or memory — respond ONLY based on the transcript below. " +
    "Write a call summary for a business owner in the language of the transcript, under 120 words, " +
    "covering: outcome, key facts, commitments made, recommended next steps. " +
    "No greeting, no questions back, no emojis — output the summary text only. " +
    "If the call has no business content (e.g. a test call), say that in one sentence.\n\n" +
    "TRANSCRIPT:\n" + transcript;

  const res = await fetch(`${auth.apiUrl}/api/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
      "X-Pincer-User": `call-summarizer-${sid}`,
    },
    body: JSON.stringify({ text: prompt }),
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* keep default */
    }
    throw new PincerError(detail, res.status);
  }
  const data = (await res.json()) as { reply?: string };
  if (!data.reply) throw new PincerError("Empty reply from agent", 500);
  return data.reply;
}

export function useContacts() {
  return useQuery<Contact[], PincerError>({
    queryKey: ["voice", "contacts"],
    queryFn: () => apiFetch("/api/voice/contacts"),
    enabled: isConnected(),
  });
}

export function useInitiateCall() {
  const qc = useQueryClient();
  return useMutation<InitiateCallOut, PincerError, InitiateCallIn>({
    mutationFn: (body) =>
      apiFetch("/api/voice/calls", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["voice", "active"] });
      qc.invalidateQueries({ queryKey: ["voice", "calls"] });
      // Placing a call moves the daily-limit counter in the header strip.
      qc.invalidateQueries({ queryKey: ["voice", "status"] });
    },
  });
}

// ── Structured outcome normalisation ─────────────────────────────────
//
// `commitments` and `follow_up_suggestions` arrive as arrays of *objects*, and
// an object rendered as a React child throws — taking the whole page down with
// it, not just the panel. So anything claiming to be an outcome is normalised
// here, once, and every field the UI touches is a string by the time it is
// rendered. This runs over both the top-level `outcome` field (v2 API) and the
// JSON blob on the `outcome` action (how older calls carry it).

const asText = (v: unknown): string => (v == null ? "" : String(v).trim());

function toStrList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map(asText).filter(Boolean);
}

/** Bare strings are still accepted: older calls were written that way. */
function toCommitments(v: unknown): Commitment[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item): Commitment | null => {
      if (typeof item !== "object" || item === null) {
        const what = asText(item);
        return what ? { who: "", what, when: null } : null;
      }
      const o = item as Record<string, unknown>;
      const what = asText(o.what);
      return what ? { who: asText(o.who), what, when: asText(o.when) || null } : null;
    })
    .filter((c): c is Commitment => c !== null);
}

function toSuggestions(v: unknown): FollowUpSuggestion[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item): FollowUpSuggestion | null => {
      if (typeof item !== "object" || item === null) {
        const reason = asText(item);
        return reason ? { tool: "", reason } : null;
      }
      const o = item as Record<string, unknown>;
      const tool = asText(o.tool);
      const reason = asText(o.reason);
      return tool || reason ? { tool, reason } : null;
    })
    .filter((s): s is FollowUpSuggestion => s !== null);
}

/** Returns null for anything that is not recognisably an outcome record. */
export function normalizeOutcome(raw: unknown): CallOutcome | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (!("outcome" in data)) return null;
  return {
    outcome: asText(data.outcome),
    task_result: asText(data.task_result),
    key_facts: toStrList(data.key_facts),
    commitments: toCommitments(data.commitments),
    follow_up_suggestions: toSuggestions(data.follow_up_suggestions),
    language: asText(data.language) || undefined,
  };
}

// ── Appointment scheduling (Sprint 6 T6.1) ───────────────────────────

/**
 * Body of `POST /api/voice/schedule`, which wraps the backend's
 * `schedule_appointment_call` tool. Auth semantics are the same as
 * `POST /api/voice/calls`: the request IS the approval.
 */
export interface ScheduleAppointmentIn {
  target_number: string;
  target_name?: string;
  /** What the appointment is about — the agent's briefing. */
  topic: string;
  /** Inclusive ISO date (YYYY-MM-DD) bounds of the acceptable window. */
  timeframe_start: string;
  timeframe_end: string;
  duration_minutes: number;
  /** Omitted means "auto" — the agent follows the callee. */
  language?: string;
  /** Email addresses invited to the resulting calendar event. */
  attendees?: string[];
  create_meet_link?: boolean;
}

export interface ScheduleAppointmentOut {
  call_sid: string;
}

/**
 * Ask the agent to call someone and book a slot.
 *
 * Errors are surfaced verbatim by callers: "no free slots", daily limit, quiet
 * hours, opt-out and validation all come back as a PincerError with the
 * backend's own `detail`, and inventing friendlier copy here would hide which
 * guardrail actually fired.
 */
export function useScheduleAppointment() {
  const qc = useQueryClient();
  return useMutation<ScheduleAppointmentOut, PincerError, ScheduleAppointmentIn>({
    mutationFn: (body) =>
      apiFetch("/api/voice/schedule", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["voice", "active"] });
      qc.invalidateQueries({ queryKey: ["voice", "calls"] });
      qc.invalidateQueries({ queryKey: ["voice", "status"] });
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════
// v3 — in-call tools (S11) & receptionist (S12)
// ═══════════════════════════════════════════════════════════════════════

// ── Approvals: `user` mode, decided while the callee is on hold ──────

export type ApprovalState = "pending" | "approved" | "denied" | "expired" | "call_ended";

/** Terminal states — the card flips to these and dismisses. */
export const APPROVAL_TERMINAL_STATES: ApprovalState[] = [
  "approved",
  "denied",
  "expired",
  "call_ended",
];

export interface VoiceApproval {
  id: string;
  call_sid: string;
  tool_name: string;
  /** S11's human-readable sentence, shown verbatim. */
  summary: string;
  args_preview: Record<string, string | number | boolean | null>;
  /** Absolute ISO-8601; the countdown is driven from this, not a local timer. */
  expires_at: string;
  /** Present on stream events; absent on the pending list (all pending). */
  state?: ApprovalState;
}

export interface ApprovalDecisionOut {
  id: string;
  state: ApprovalState;
}

/** How fast the pending list is polled while the stream is down. */
export const APPROVAL_POLL_MS = 3_000;
/** …and while it is up, where it is only a safety net. */
const APPROVAL_POLL_STREAMING_MS = 30_000;

/** The one place that knows where the approvals stream lives. */
const APPROVALS_STREAM_PATH = "/api/approvals/stream";
/** The one event name on that stream this client cares about. */
const VOICE_APPROVAL_EVENT = "voice_approval";

const APPROVALS_KEY = ["voice", "approvals", "pending"];

/** A bare array or an envelope; both are accepted. */
function asApprovalList(raw: unknown): VoiceApproval[] {
  if (Array.isArray(raw)) return raw as VoiceApproval[];
  const envelope = raw as { approvals?: VoiceApproval[] } | null;
  return envelope?.approvals ?? [];
}

type TerminalListener = (id: string, state: ApprovalState) => void;
const terminalListeners = new Set<TerminalListener>();

/**
 * Approvals pushed over the stream, held until they go terminal or expire.
 *
 * They cannot live only in the query cache: a poll that started before the push
 * resolves after it and would erase the card. A card outliving the list by a
 * few seconds is harmless; one that blinks out while a caller waits is not.
 */
const streamedPending = new Map<string, VoiceApproval>();

/**
 * Terminal approval events: decided elsewhere, expired, call ended. The card
 * needs them to show which state it reached, not just to stop counting.
 */
export function onApprovalTerminal(fn: TerminalListener): () => void {
  terminalListeners.add(fn);
  return () => terminalListeners.delete(fn);
}

/**
 * One shared stream connection, ref-counted: two subscribers opening two
 * streams would deliver every approval twice.
 */
let streamRefs = 0;
let streamAbort: AbortController | null = null;
const streamStateListeners = new Set<(up: boolean) => void>();

function setStreamUp(up: boolean) {
  streamStateListeners.forEach((fn) => fn(up));
}

async function runApprovalStream(onFrame: (a: VoiceApproval) => void) {
  let backoff = 1_000;

  while (streamAbort && !streamAbort.signal.aborted) {
    try {
      const auth = getAuth();
      if (!auth) throw new PincerError("Not connected", 0);

      const res = await fetch(`${auth.apiUrl}${APPROVALS_STREAM_PATH}`, {
        headers: { Accept: "text/event-stream", ...authHeaders(auth) },
        signal: streamAbort.signal,
      });
      if (!res.ok || !res.body) throw new PincerError(`HTTP ${res.status}`, res.status);

      setStreamUp(true);
      backoff = 1_000;

      for await (const frame of sseFrames(res.body)) {
        if (frame.event !== VOICE_APPROVAL_EVENT) continue; // chat/notes share the stream
        try {
          onFrame(JSON.parse(frame.data) as VoiceApproval);
        } catch {
          /* a malformed frame is dropped, not acted on */
        }
      }
    } catch {
      /* fall through to the backoff below — polling covers the gap */
    }

    setStreamUp(false);
    if (!streamAbort || streamAbort.signal.aborted) return;
    // Exponential-ish backoff, capped: a backend that is down should not be
    // hammered, but an approval waiting 25s cannot wait a minute for a retry.
    await new Promise((r) => setTimeout(r, backoff));
    backoff = Math.min(backoff * 2, 10_000);
  }
}

/**
 * Pending `user`-mode approvals: stream first, poll as a fallback. The event is
 * what makes the card appear in about a second; the 3s poll is what makes it
 * appear at all when the stream is dead.
 */
export function usePendingApprovals() {
  const qc = useQueryClient();
  const [streaming, setStreaming] = useState(false);

  const query = useQuery<VoiceApproval[], PincerError>({
    queryKey: APPROVALS_KEY,
    queryFn: async () => asApprovalList(await apiFetch("/api/voice/approvals/pending")),
    refetchInterval: streaming ? APPROVAL_POLL_STREAMING_MS : APPROVAL_POLL_MS,
    enabled: isConnected(),
    // A backend without the endpoint answers 404; retrying that every 3s is
    // not useful.
    retry: false,
  });

  useEffect(() => {
    if (!isConnected()) return;

    const onUp = (up: boolean) => setStreaming(up);
    streamStateListeners.add(onUp);

    streamRefs += 1;
    if (streamRefs === 1) {
      streamAbort = new AbortController();
      void runApprovalStream((incoming) => {
        const state = incoming.state ?? "pending";
        if (state === "pending") {
          streamedPending.set(incoming.id, incoming);
          qc.setQueryData<VoiceApproval[]>(APPROVALS_KEY, (prev = []) => [
            ...prev.filter((a) => a.id !== incoming.id),
            incoming,
          ]);
        } else {
          streamedPending.delete(incoming.id);
          qc.setQueryData<VoiceApproval[]>(APPROVALS_KEY, (prev = []) =>
            prev.filter((a) => a.id !== incoming.id),
          );
          terminalListeners.forEach((fn) => fn(incoming.id, state));
        }
      });
    }

    return () => {
      streamStateListeners.delete(onUp);
      streamRefs -= 1;
      if (streamRefs === 0) {
        streamAbort?.abort();
        streamAbort = null;
      }
    };
  }, [qc]);

  // What the server last listed, plus anything the stream announced since,
  // minus anything already expired.
  const approvals = useMemo(() => {
    const byId = new Map<string, VoiceApproval>();
    for (const a of query.data ?? []) byId.set(a.id, a);
    for (const [id, a] of streamedPending) if (!byId.has(id)) byId.set(id, a);
    const now = Date.now();
    return [...byId.values()].filter((a) => new Date(a.expires_at).getTime() > now);
    // No dep on the streamed map: every push writes through setQueryData.
  }, [query.data]);

  return {
    approvals,
    isLoading: query.isLoading,
    /** True while the SSE stream is connected — the card is then near-instant. */
    streaming,
  };
}

/**
 * Approve or deny. A 409 is not an error to hide: the approval reached a
 * terminal state elsewhere and the card has to show that state.
 */
export function useDecideApproval() {
  const qc = useQueryClient();
  return useMutation<
    ApprovalDecisionOut,
    PincerError & { state?: ApprovalState },
    { id: string; decision: "approve" | "deny" }
  >({
    mutationFn: async ({ id, decision }) => {
      const auth = getAuth();
      if (!auth) throw new PincerError("Not connected to Pincer backend", 0);
      const res = await fetch(`${auth.apiUrl}/api/voice/approvals/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(auth) },
        body: JSON.stringify({ decision }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        detail?: string;
        state?: ApprovalState;
        id?: string;
      };
      if (!res.ok) {
        const err = new PincerError(body.detail ?? `HTTP ${res.status}`, res.status) as PincerError & {
          state?: ApprovalState;
        };
        // 409 carries the terminal state the server settled on.
        err.state = body.state;
        throw err;
      }
      return { id: body.id ?? id, state: body.state ?? (decision === "approve" ? "approved" : "denied") };
    },
    onSettled: (_data, _err, vars) => {
      streamedPending.delete(vars.id);
      qc.setQueryData<VoiceApproval[]>(APPROVALS_KEY, (prev = []) =>
        prev.filter((a) => a.id !== vars.id),
      );
    },
  });
}

// ── Messages inbox (S12 §11) ─────────────────────────────────────────

export interface InboundMessageCall {
  started_at?: string | null;
  duration_seconds?: number | null;
  inbound_intent?: InboundIntent | string | null;
  language?: string | null;
}

export interface InboundMessage {
  id: string;
  call_sid: string;
  caller_name: string | null;
  caller_number: string | null;
  matter: string;
  urgency: "normal" | "urgent" | string;
  /** The caller never confirmed the spelling / the number on the call. */
  name_unverified?: boolean;
  number_unverified?: boolean;
  delivery_state?: string;
  created_at: string;
  read_at?: string | null;
  call?: InboundMessageCall | null;
}

export interface MessagesPage {
  messages: InboundMessage[];
  total: number;
  /** Server-side unread count; falls back to counting the loaded page. */
  unread: number;
}

const MESSAGES_REFETCH = 15_000;

function asMessagesPage(raw: unknown): MessagesPage {
  if (Array.isArray(raw)) {
    const messages = raw as InboundMessage[];
    return {
      messages,
      total: messages.length,
      unread: messages.filter((m) => !m.read_at).length,
    };
  }
  const env = (raw ?? {}) as Partial<MessagesPage>;
  const messages = env.messages ?? [];
  return {
    messages,
    total: env.total ?? messages.length,
    unread: env.unread ?? messages.filter((m) => !m.read_at).length,
  };
}

export function useMessages(opts: { unread?: boolean; limit?: number; offset?: number } = {}) {
  const { unread, limit = 100, offset = 0 } = opts;
  const qs = new URLSearchParams();
  if (unread) qs.set("unread", "true");
  qs.set("limit", String(limit));
  qs.set("offset", String(offset));

  return useQuery<MessagesPage, PincerError>({
    queryKey: ["voice", "messages", { unread: !!unread, limit, offset }],
    queryFn: async () => asMessagesPage(await apiFetch(`/api/voice/messages?${qs}`)),
    refetchInterval: MESSAGES_REFETCH,
    enabled: isConnected(),
    retry: false,
  });
}

/** Unread count for the nav badge, without loading the list itself. */
export function useUnreadMessageCount() {
  const q = useQuery<MessagesPage, PincerError>({
    queryKey: ["voice", "messages", "unread-count"],
    queryFn: async () => asMessagesPage(await apiFetch("/api/voice/messages?unread=true&limit=1")),
    refetchInterval: MESSAGES_REFETCH,
    enabled: isConnected(),
    retry: false,
  });
  return q.data?.unread ?? 0;
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation<unknown, PincerError, string>({
    mutationFn: (id) => apiFetch(`/api/voice/messages/${id}/read`, { method: "POST" }),
    // Optimistic: the row must not flicker back to bold mid-POST.
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["voice", "messages"] });
      const now = new Date().toISOString();
      qc.setQueriesData<MessagesPage>({ queryKey: ["voice", "messages"] }, (page) =>
        page
          ? {
              ...page,
              unread: Math.max(0, page.unread - (page.messages.some((m) => m.id === id && !m.read_at) ? 1 : 0)),
              messages: page.messages.map((m) => (m.id === id ? { ...m, read_at: m.read_at ?? now } : m)),
            }
          : page,
      );
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["voice", "messages"] }),
  });
}

// ── Receptionist profile & stats (S12 §4, §13) ───────────────────────

export interface BusinessHoursRange {
  open: string;
  close: string;
}

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const WEEKDAYS: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export interface BusinessProfile {
  enabled: true;
  name: string;
  languages: string[];
  /** IANA zone; the open/closed indicator is computed in it. */
  timezone: string;
  hours: Partial<Record<Weekday, BusinessHoursRange[]>>;
  services_count: number;
  faq_count: number;
  booking: { enabled: boolean; duration_minutes: number | null };
  transfer: { enabled: boolean };
  after_hours: string | null;
}

/** `{enabled: false}` is a legitimate answer, not an error — the panel hides. */
export type ProfileResult = BusinessProfile | { enabled: false };

export function useReceptionistProfile() {
  return useQuery<ProfileResult, PincerError>({
    queryKey: ["voice", "receptionist", "profile"],
    queryFn: async () => {
      try {
        return await apiFetch<ProfileResult>("/api/voice/receptionist/profile");
      } catch (e) {
        // 404 means "not configured", which is a state rather than a failure.
        if (e instanceof PincerError && e.status === 404) return { enabled: false as const };
        throw e;
      }
    },
    staleTime: 60_000,
    enabled: isConnected(),
    retry: false,
  });
}

export interface ReceptionistStats {
  answered: number;
  intents: Partial<Record<InboundIntent, number>>;
  /** 0..1. A value > 1 is read as an already-multiplied percentage. */
  booking_conversion: number;
  transfer_rate: number;
  messages_taken: number;
  busy_capacity: number;
  silent_hangups: number;
}

export function useReceptionistStats(days = 7) {
  return useQuery<ReceptionistStats, PincerError>({
    queryKey: ["voice", "receptionist", "stats", days],
    queryFn: () => apiFetch(`/api/voice/receptionist/stats?days=${days}`),
    refetchInterval: 60_000,
    enabled: isConnected(),
    retry: false,
  });
}

// ── Blocklist (S12 §10.2) ────────────────────────────────────────────

export interface BlocklistEntry {
  number: string;
  reason: string;
  added_at?: string | null;
  /** "owner" for a direct add, "suggested" for an approved suggestion. */
  source?: string | null;
}

/** E.164, mirroring the server: same pattern, same message on rejection. */
export const E164_RE = /^\+[1-9]\d{7,14}$/;
export const E164_HINT = "Enter the number in international format, e.g. +4930123456";

export function useBlocklist() {
  return useQuery<BlocklistEntry[], PincerError>({
    queryKey: ["voice", "blocklist"],
    queryFn: () => apiFetch("/api/voice/blocklist"),
    enabled: isConnected(),
    retry: false,
  });
}

export function useAddToBlocklist() {
  const qc = useQueryClient();
  return useMutation<BlocklistEntry, PincerError, { number: string; reason: string }>({
    mutationFn: (body) =>
      apiFetch("/api/voice/blocklist", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["voice", "blocklist"] }),
  });
}

export function useRemoveFromBlocklist() {
  const qc = useQueryClient();
  return useMutation<unknown, PincerError, string>({
    mutationFn: (number) =>
      apiFetch(`/api/voice/blocklist/${encodeURIComponent(number)}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["voice", "blocklist"] }),
  });
}

// ── Tool policy (S11 §3) — read-only mirror ──────────────────────────

export interface PolicyOverride {
  tool: string;
  mode: ApprovalMode | string;
  reason?: string | null;
}

export interface WriteBudget {
  limit: number | null;
  used?: number | null;
  window?: string | null;
}

export interface VoicePolicy {
  global_mode: ApprovalMode | string;
  overrides: PolicyOverride[];
  write_budget: WriteBudget | null;
  tiers: { tool: string; tier: ToolTier | string }[];
}

export function useVoicePolicy() {
  return useQuery<VoicePolicy, PincerError>({
    queryKey: ["voice", "policy"],
    queryFn: () => apiFetch("/api/voice/policy"),
    staleTime: 60_000,
    enabled: isConnected(),
    retry: false,
  });
}
