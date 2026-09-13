/**
 * Pincer backend client.
 *
 * Talks to a Pincer FastAPI server over HTTP + Server-Sent Events.
 *
 * Auth model:
 *   - Shared bearer token (PINCER_DASHBOARD_TOKEN or PINCER_WEB_CHAT_TOKEN on
 *     the backend). Stored under `pincer.web.auth` — in sessionStorage (plus
 *     an in-memory copy) by default since FE1, in localStorage only when the
 *     person opted into "remember this device". Readers check the session
 *     record first, so a remembered token and a one-off one never conflict.
 *   - Each browser gets a stable UUID (`pincer.web.userId`), sent as
 *     `X-Pincer-User`. That UUID is how the backend keys conversation state —
 *     there are no user accounts on the Pincer side.
 */

const AUTH_KEY = "pincer.web.auth";
const USER_ID_KEY = "pincer.web.userId";

export type PincerAuth = { apiUrl: string; token: string };

// ───────────────────── config / identity ─────────────────────

// In-memory copy of the session-scoped record: survives a storage that throws
// (private mode, blocked site data) for the life of the page.
let memoryAuth: PincerAuth | null = null;

function readStorage(storage: Storage | undefined): PincerAuth | null {
  try {
    const raw = storage?.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PincerAuth;
    if (!parsed?.apiUrl || !parsed?.token) return null;
    return { apiUrl: normalizeApiUrl(parsed.apiUrl), token: parsed.token };
  } catch {
    return null;
  }
}

export function getAuth(): PincerAuth | null {
  if (memoryAuth) return memoryAuth;
  const session = readStorage(typeof sessionStorage !== "undefined" ? sessionStorage : undefined);
  if (session) {
    memoryAuth = session;
    return session;
  }
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) {
      const envUrl = (import.meta.env.VITE_PINCER_API_URL as string | undefined)?.trim();
      const envToken = (import.meta.env.VITE_PINCER_TOKEN as string | undefined)?.trim();
      if (envUrl && envToken) return { apiUrl: normalizeApiUrl(envUrl), token: envToken };
      return null;
    }
    const parsed = JSON.parse(raw) as PincerAuth;
    if (!parsed?.apiUrl || !parsed?.token) return null;
    return { apiUrl: normalizeApiUrl(parsed.apiUrl), token: parsed.token };
  } catch {
    return null;
  }
}

/**
 * Store a connection. `persist: true` remembers the device (localStorage);
 * the default keeps it for this tab's session only (sessionStorage + memory).
 * Either way the previous record in the other storage is removed, so exactly
 * one token is live.
 */
export function setAuth(auth: PincerAuth, opts: { persist?: boolean } = {}) {
  const record = JSON.stringify({ apiUrl: normalizeApiUrl(auth.apiUrl), token: auth.token });
  const persist = opts.persist ?? true;
  memoryAuth = { apiUrl: normalizeApiUrl(auth.apiUrl), token: auth.token };
  try {
    if (persist) {
      localStorage.setItem(AUTH_KEY, record);
      sessionStorage.removeItem(AUTH_KEY);
    } else {
      sessionStorage.setItem(AUTH_KEY, record);
      localStorage.removeItem(AUTH_KEY);
    }
  } catch {
    /* storage unavailable — the in-memory copy still serves this page */
  }
}

export function clearAuth() {
  memoryAuth = null;
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}

/** True when the token is in localStorage (the device is remembered). */
export function isAuthPersisted(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) !== null;
  } catch {
    return false;
  }
}

export function isConnected(): boolean {
  return getAuth() !== null;
}

export function getUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export function resetUserId(): string {
  const id = crypto.randomUUID();
  localStorage.setItem(USER_ID_KEY, id);
  return id;
}

function stripTrailingSlash(s: string): string {
  return s.replace(/\/+$/, "");
}

/**
 * What a person types is not always a URL `fetch()` can parse.
 *
 * "127.0.0.1:8080" reads as a scheme called `127.0.0.1:` — engines reject it
 * before the request leaves the browser, and WebKit's wording for that ("The
 * string did not match the expected pattern.") tells the owner nothing. So a
 * missing scheme is filled in here, once, for everything that reads the
 * stored credentials: http for loopback and bare IPs, https for a hostname,
 * which is what a tunnel or a deployment will be.
 */
export function normalizeApiUrl(raw: string): string {
  const url = stripTrailingSlash(raw.trim());
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  // A scheme we do not speak is left alone: better a clear failure than a
  // silent rewrite of what someone deliberately configured.
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(url)) return url;
  const local = /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0|\d{1,3}(\.\d{1,3}){3})(:\d+)?([/?#]|$)/i.test(url);
  return `${local ? "http" : "https"}://${url}`;
}

// ───────────────────── low-level fetch ─────────────────────

/**
 * Exported because the Notes service (`notes_app`) authenticates the same way —
 * shared bearer token plus the client-asserted `X-Pincer-User` (ADR 0001). It
 * rejects a request missing *either* header, so `src/auth/apiFetch.ts` reuses
 * this rather than re-reading the localStorage keys.
 */
export function authHeaders(auth: PincerAuth): Record<string, string> {
  return {
    Authorization: `Bearer ${auth.token}`,
    "X-Pincer-User": getUserId(),
  };
}

export class PincerError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
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
  if (res.status === 401) {
    clearAuth();
    throw new PincerError("Invalid token", 401);
  }
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

// ───────────────────── probe / login validation ─────────────────────

/** Validate an (apiUrl, token) pair by calling `/api/status`. */
export async function pingStatus(apiUrl: string, token: string): Promise<{ version: string }> {
  const url = `${normalizeApiUrl(apiUrl)}/api/status`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new PincerError("Token rejected by server", 401);
  if (!res.ok) throw new PincerError(`Server returned ${res.status}`, res.status);
  const data = (await res.json()) as { version?: string };
  return { version: data.version ?? "unknown" };
}

// ───────────────────── chat: non-streaming ─────────────────────

export interface ChatReply {
  reply: string;
  cost_usd?: number;
  model?: string;
}

export async function sendChat(text: string): Promise<ChatReply> {
  return request<ChatReply>("/api/chat/message", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

// ───────────────────── chat: streaming ─────────────────────

export type StreamEvent =
  | { event: "chunk"; data: { delta: string } }
  | { event: "tool"; data: { phase: "start" | "done"; name: string } }
  | {
      event: "approval";
      data: {
        approval_id: string;
        tool: string;
        args?: Record<string, unknown>;
      };
    }
  | { event: "done"; data: { text?: string } }
  | { event: "error"; data: { message: string } };

/**
 * Async generator over the SSE stream from /api/chat/stream.
 *
 * `EventSource` can't set Authorization, so we stream via fetch + a
 * hand-rolled parser for the `event:` / `data:` line protocol.
 */
export async function* streamChat(
  text: string,
  signal?: AbortSignal,
): AsyncGenerator<StreamEvent> {
  const auth = getAuth();
  if (!auth) throw new PincerError("Not connected to Pincer backend", 0);

  const res = await fetch(`${auth.apiUrl}/api/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...authHeaders(auth),
    },
    body: JSON.stringify({ text }),
    signal,
  });

  if (res.status === 401) {
    clearAuth();
    throw new PincerError("Invalid token", 401);
  }
  if (!res.ok || !res.body) {
    throw new PincerError(`HTTP ${res.status}`, res.status);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const parsed = parseFrame(frame);
        if (parsed) yield parsed;
        boundary = buffer.indexOf("\n\n");
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function parseFrame(frame: string): StreamEvent | null {
  let event = "message";
  const dataLines: string[] = [];
  for (const line of frame.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
  }
  if (dataLines.length === 0) return null;
  try {
    const data = JSON.parse(dataLines.join("\n"));
    return { event, data } as StreamEvent;
  } catch {
    return null;
  }
}

// ───────────────────── tool approvals ─────────────────────

// Resolve a pending approval the backend asked about via an SSE `approval`
// event. The agent's `await request_approval(...)` future on the server
// is keyed by `approval_id`; this POST resolves it and lets the streaming
// turn continue.
export async function respondApproval(
  approvalId: string,
  approved: boolean,
): Promise<void> {
  await request<{ ok: true }>("/api/chat/approval", {
    method: "POST",
    body: JSON.stringify({ approval_id: approvalId, approved }),
  });
}

// ───────────────────── conversation history ─────────────────────

export interface PincerMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: string;
  tool_name?: string | null;
  tool_input?: unknown;
}

interface ConversationsListItem {
  id: string;
  user_id: string;
  channel: string;
  updated_at: string;
}

interface ConversationDetail {
  id: string;
  messages: PincerMessage[];
}

/**
 * Fetch the most recent "web" conversation for the current browser's user_id.
 * Returns null if none exists yet.
 */
export async function fetchLatestConversation(): Promise<PincerMessage[] | null> {
  const userId = getUserId();
  const list = await request<{ conversations: ConversationsListItem[] }>(
    `/api/conversations?channel=web&search=${encodeURIComponent(userId)}&limit=1`,
  );
  const first = list.conversations?.[0];
  if (!first) return null;
  const detail = await request<ConversationDetail>(`/api/conversations/${first.id}`);
  return detail.messages ?? [];
}
