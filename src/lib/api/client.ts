/**
 * The owner app's API client (FE-BINDING: "API client").
 *
 * One authenticated JSON `fetch` against the connected Pincer backend, typed
 * against the generated OpenAPI schema (`./generated/schema.d.ts`,
 * FE-ADR-002). Every hook in `src/lib/api/*` goes through `request()`; the
 * older `apiFetch` in `voice.ts` is an alias of it, so there is exactly one
 * place that knows about headers, error shapes and the 401 contract.
 *
 * Errors are normalised to `ApiError { status, detail, fields? }`:
 *   - a hand-raised HTTPException carries a sentence → `detail`
 *   - a FastAPI 422 carries `[{loc, msg}]` → `detail` is the messages joined,
 *     `fields` maps the field path ("phone_number", "hours.mon.0") to its msg
 *   - a 401 additionally notifies `onUnauthorized` listeners; the session
 *     store logs out and the auth guard redirects with `returnTo`.
 *
 * Rule 11 of the Block I spec: the server's `detail` is shown verbatim — it is
 * the single source of truth for validation text, so nothing here rewrites it.
 */
import { authHeaders, getAuth, PincerError } from "@/lib/pincerClient";
import type { components, paths } from "./generated/schema";
import { getTenantId } from "./tenant";

/** All component schemas of the pinned contract, by name. */
export type Schemas = components["schemas"];
/** One schema by name: `Schema<"CallSummary">`. */
export type Schema<K extends keyof Schemas> = Schemas[K];
/** All paths of the pinned contract, for hooks that want to bind a route. */
export type ApiPaths = paths;

export type ApiFieldErrors = Record<string, string>;

export class ApiError extends PincerError {
  readonly fields?: ApiFieldErrors;

  constructor(detail: string, status: number, fields?: ApiFieldErrors) {
    super(detail, status);
    this.name = "ApiError";
    if (fields && Object.keys(fields).length) this.fields = fields;
  }

  /** The server's own sentence — what the UI shows. */
  get detail(): string {
    return this.message;
  }

  /** True for "this backend does not have that endpoint" (404, or SPA fallthrough). */
  get isMissingEndpoint(): boolean {
    return this.status === 404;
  }
}

type UnauthorizedListener = (err: ApiError) => void;
const unauthorizedListeners = new Set<UnauthorizedListener>();

/** Subscribe to 401s. Returns the unsubscribe function. */
export function onUnauthorized(fn: UnauthorizedListener): () => void {
  unauthorizedListeners.add(fn);
  return () => {
    unauthorizedListeners.delete(fn);
  };
}

interface FastApiValidationItem {
  loc?: Array<string | number>;
  msg?: string;
}

/**
 * Terminal escape codes, removed before anything reaches a DOM node.
 *
 * Rule 11 says the server's `detail` is shown verbatim, and it still is — but
 * "verbatim" means the server's words, not its colour codes. `twilio-python`
 * formats `TwilioRestException.__str__` with ANSI SGR sequences whenever the
 * process has a tty on stderr (its own source warns that "someone might catch
 * this error and try to display the message from it to an end user"), so a
 * failed outbound call reached this app as `\x1b[31m\x1b[49mHTTP Error…` and
 * painted `[31m[49m` across the dialog. The backend no longer sends them; this
 * is the guard that keeps any other library from doing the same.
 *
 * Only the escape sequences go. The message, its line breaks and its URLs are
 * left exactly as the server wrote them.
 */
// `no-control-regex` guards against control characters written into a pattern
// by accident. Here they are the entire subject: this is the code that removes
// them, so it is the one place that has to name them.
// eslint-disable-next-line no-control-regex
const ANSI_RE = /\u001B\[[0-?]*[ -/]*[@-~]/g;
// C0 controls have no business in a message either — except tab and newline.
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function stripAnsi(text: string): string {
  return text
    .replace(ANSI_RE, "")
    .replace(CONTROL_RE, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Turn a FastAPI error body into `{ detail, fields }`. Exported for tests and
 * for the SSE reader, which sees the same shapes on a failed handshake.
 */
export function normalizeErrorBody(
  body: unknown,
  status: number,
): { detail: string; fields?: ApiFieldErrors } {
  const out = normalizeErrorBodyRaw(body, status);
  const detail = stripAnsi(out.detail) || `HTTP ${status}`;
  if (!out.fields) return { detail };
  const fields: ApiFieldErrors = {};
  for (const [k, v] of Object.entries(out.fields)) fields[k] = stripAnsi(v);
  return { detail, fields };
}

function normalizeErrorBodyRaw(
  body: unknown,
  status: number,
): { detail: string; fields?: ApiFieldErrors } {
  const fallback = `HTTP ${status}`;
  if (!body || typeof body !== "object") return { detail: fallback };
  const raw = (body as { detail?: unknown; error?: unknown }).detail ?? (body as { error?: unknown }).error;
  if (typeof raw === "string" && raw) return { detail: raw };
  // Pincer's profile/setup routers answer 422 with {detail: {errors: [{field, message, type}]}}
  // and 409 with {detail: {step, ok, reason, detail}} (a setup gate).
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const obj = raw as { errors?: Array<{ field?: string; message?: string }>; reason?: string; detail?: string };
    if (Array.isArray(obj.errors)) {
      const fields: ApiFieldErrors = {};
      const msgs: string[] = [];
      for (const e of obj.errors) {
        const msg = String(e?.message ?? "");
        if (!msg) continue;
        msgs.push(msg);
        if (e.field && !(e.field in fields)) fields[e.field] = msg;
      }
      if (msgs.length) return { detail: msgs.join(" · "), fields: Object.keys(fields).length ? fields : undefined };
    }
    if (obj.reason) return { detail: obj.detail ? `${obj.reason}: ${obj.detail}` : obj.reason };
  }
  if (Array.isArray(raw)) {
    const fields: ApiFieldErrors = {};
    const msgs: string[] = [];
    for (const item of raw as Array<string | FastApiValidationItem>) {
      if (typeof item === "string") {
        if (item) msgs.push(item);
        continue;
      }
      const msg = String(item?.msg ?? "");
      if (!msg) continue;
      msgs.push(msg);
      const loc = (item.loc ?? []).filter((p) => p !== "body" && p !== "query" && p !== "path");
      if (loc.length) {
        const key = loc.join(".");
        if (!(key in fields)) fields[key] = msg;
      }
    }
    if (msgs.length) return { detail: msgs.join(" · "), fields: Object.keys(fields).length ? fields : undefined };
  }
  return { detail: fallback };
}

/**
 * Authenticated JSON request. `path` is absolute on the API ("/api/voice/calls").
 */
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const auth = getAuth();
  if (!auth) throw new ApiError("Not connected to Pincer backend", 0);

  const url = `${auth.apiUrl}${path}`;
  const tenant = getTenantId();
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(auth),
        // C3 reads `X-Pincer-Tenant` (instance-admin impersonation, audited); `X-Tenant-Id` is the FE spec's belt-and-braces.
        ...(tenant ? { "X-Pincer-Tenant": tenant, "X-Tenant-Id": tenant } : {}),
        ...(init.headers ?? {}),
      },
    });
  } catch (err) {
    // The request never left the browser: a stored URL with no scheme, a dead
    // host, a blocked origin. Engines word this differently and none of them
    // name the address, so say which one failed.
    const because = err instanceof Error ? err.message : String(err);
    throw new ApiError(`Could not reach the Pincer backend at ${url} — ${because}`, 0);
  }

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* non-JSON error page; keep the status-only detail */
    }
    const { detail, fields } = normalizeErrorBody(body, res.status);
    const error = new ApiError(detail, res.status, fields);
    if (res.status === 401) {
      for (const fn of unauthorizedListeners) {
        try {
          fn(error);
        } catch {
          /* a listener must never mask the original error */
        }
      }
    }
    throw error;
  }

  // 204 (DELETE …) and empty bodies are success with nothing to parse.
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) {
    // The server falls through to the single-page app for paths it does not
    // route, so a missing endpoint answers 200 text/html. Calling it what it
    // is lets every surface tell "this backend does not have it" from "broke".
    throw new ApiError(`No ${path} on this backend`, 404);
  }
  return res.json() as Promise<T>;
}

function withBody(method: string, body: unknown, init: RequestInit = {}): RequestInit {
  return { ...init, method, body: body === undefined ? undefined : JSON.stringify(body) };
}

/** Verb helpers. Bodies are JSON-encoded; `T` is the response type. */
export const api = {
  get: <T>(path: string, init: RequestInit = {}) => request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) => request<T>(path, withBody("POST", body, init)),
  put: <T>(path: string, body?: unknown, init?: RequestInit) => request<T>(path, withBody("PUT", body, init)),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) => request<T>(path, withBody("PATCH", body, init)),
  del: <T = void>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: "DELETE" }),
};

/** Query-string helper that drops undefined/null/empty values. */
export function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}
