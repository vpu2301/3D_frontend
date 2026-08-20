/**
 * Notes API client — the HTTP layer `use-notes-store.ts` sits on.
 *
 * Generated-contract types come from `api-types.ts`, produced from the
 * backend's `openapi.json` (`make openapi` → `npx openapi-typescript`), so a
 * schema change that is not regenerated fails the build rather than at runtime.
 *
 * On the `Note` type: the generated `NoteOut` widens every optional field to
 * `T | null`, because Python's `str | None` has no way to say "absent". The
 * server never sends null for those — routes use `response_model_exclude_none`
 * — so `toNote()` casts once, here, instead of leaking `| null` into the store.
 */

import type {
  LinkCandidate,
  LinkType,
  Note,
  NoteLink,
  Notebook,
  Reminder,
  TagInfo,
} from '@/pages/notes/_lib/types';
import { apiFetch } from '@/auth/apiFetch';
import type { components } from './api-types';

type NoteOut = components['schemas']['NoteOut'];
type NoteListOut = components['schemas']['NoteListOut'];
type NotebookOut = components['schemas']['NotebookOut'];
type VersionSummary = components['schemas']['VersionSummaryOut'];
type VersionOut = components['schemas']['VersionOut'];
type BacklinkOut = components['schemas']['BacklinkOut'];
type GraphOut = components['schemas']['GraphOut'];
type LinkCandidateOut = components['schemas']['LinkCandidateOut'];
type NoteLinkOut = components['schemas']['NoteLinkOut'];
type ReminderOut = components['schemas']['ReminderOut'];
type NotificationOut = components['schemas']['NotificationOut'];
type SearchOut = components['schemas']['SearchOut'];
type SessionSummaryOut = components['schemas']['SessionSummaryOut'];
type SessionDetailOut = components['schemas']['SessionDetailOut'];
type ActionPageOut = components['schemas']['ActionPageOut'];
type SeedResultOut = components['schemas']['SeedResultOut'];
type OutcomeOut = components['schemas']['OutcomeOut'];
type OutcomeListOut = components['schemas']['OutcomeListOut'];
type OutcomeSummaryOut = components['schemas']['OutcomeSummaryOut'];
type ExtractOut = components['schemas']['ExtractOut'];
type ConfirmBatchOut = components['schemas']['ConfirmBatchOut'];
type OutcomeEditIn = components['schemas']['OutcomeEditIn'];
type OutcomeCreateIn = components['schemas']['OutcomeCreateIn'];
type SavedViewOut = components['schemas']['SavedViewOut'];
type MatterOut = components['schemas']['MatterOut'];
type MatterViewOut = components['schemas']['MatterViewOut'];
type MatterTimelineOut = components['schemas']['MatterTimelineOut'];
type RelatedNoteOut = components['schemas']['RelatedNoteOut'];
type ResurfacedOut = components['schemas']['ResurfacedOut'];

/** The server note, plus the additive fields the mock's `Note` did not declare. */
export type ServerNote = Note & { version: number; snippet?: string };

export type Backlink = BacklinkOut;
export type GraphData = GraphOut;
export type GraphNode = components['schemas']['GraphNodeOut'];
export type GraphEdge = components['schemas']['GraphEdgeOut'];
export type Notification = NotificationOut;
export type SearchResult = components['schemas']['SearchItem'];
export type AgentSessionSummary = SessionSummaryOut;
export type AgentSessionDetail = SessionDetailOut;
export type AgentActionRow = components['schemas']['ActionRowOut'];

/**
 * BE-2's query DSL — the one filter language.
 *
 * Search, saved views, matter pages and (from BE-4) the agent all speak it, and
 * it is a *closed* contract: an unknown key is a 422 naming the key, so a typo
 * fails loudly instead of silently widening the result set. There is deliberately
 * no query-builder library behind it — eleven clause types is smaller than any
 * library's API surface.
 */
export type NoteQuery = {
  all?: QueryNode[];
  any?: QueryNode[];
  not?: QueryNode;
  sort?: 'relevance' | 'updatedDesc' | 'createdDesc' | 'dueAsc';
  limit?: number;
  cursor?: string;
};

export type QueryNode =
  | QueryClause
  | { all: QueryNode[] }
  | { any: QueryNode[] }
  | { not: QueryNode };

/** Exactly one key per clause. */
export type QueryClause =
  | { text: { text: string; mode?: TextMode } }
  | { tag: string }
  | { notebook: string }
  | { linkedTo: string }
  | { linkedToType: 'note' | 'doc' | 'event' }
  | { hasOutcome: boolean | { kind?: OutcomeKind; status?: string; owedBy?: string } }
  | { hasAttachment: boolean }
  | { hasReminder: boolean }
  | { state: 'active' | 'archived' | 'trashed' | 'any' }
  | { updated: { after?: string; before?: string } }
  | { created: { after?: string; before?: string } }
  | { derived: string }
  | { noteId: string }
  | { pinned: boolean }
  | { daily: boolean };

/**
 * The retrieval mode. Hybrid is the default and the only one the UI chooses on
 * the user's behalf — "keyword or semantic?" is not a decision anyone can make
 * meaningfully about a half-remembered sentence.
 */
export type TextMode = 'fts' | 'semantic' | 'hybrid';

/** `/v1/views/preview` and `/v1/views/{id}/results` — untyped in the schema. */
export type QueryResults = {
  items: Array<{ id: string; title: string; snippet: string; updatedAt: number }>;
  total: number;
  nextCursor: string | null;
  /** The literal query matched nothing; these are semantic fallbacks. Say so. */
  closest: boolean;
};

export type SearchResponse = SearchOut;
export type SavedView = SavedViewOut;
export type Matter = MatterOut;
export type MatterView = MatterViewOut;
export type MatterTimeline = MatterTimelineOut;
export type MatterOutcome = components['schemas']['MatterOutcomeOut'];
export type MatterNote = components['schemas']['MatterNoteOut'];
export type MatterDocument = components['schemas']['MatterDocumentOut'];
export type MatterUpcoming = components['schemas']['MatterUpcomingOut'];
export type MatterSummary = components['schemas']['MatterSummaryOut'];
export type RelatedNote = RelatedNoteOut;
export type Resurfaced = ResurfacedOut;

/** BE-1: a task or decision as an entity, with a pointer back to its source. */
export type Outcome = OutcomeOut;
export type OutcomeAnchor = components['schemas']['AnchorOut'];
export type OutcomeKind = Outcome['kind'];
export type OutcomeStatus = Outcome['status'];
export type OutcomeEdit = OutcomeEditIn;
export type OutcomeSummary = OutcomeSummaryOut;
export type OutcomeFacets = components['schemas']['OutcomeFacets'];
export type ExtractResult = ExtractOut;
export type ConfirmBatchResult = ConfirmBatchOut;
export type BatchFailure = components['schemas']['BatchFailure'];

export type OutcomeFilters = {
  kind?: OutcomeKind;
  status?: OutcomeStatus;
  /** `me` resolves server-side against the tenant's alias list; `others` is its complement. */
  owedBy?: 'me' | 'others' | string;
  owedTo?: 'me' | 'others' | string;
  dueBefore?: number;
  dueAfter?: number;
  overdue?: boolean;
  noteId?: string;
  notebookId?: string;
  tag?: string;
  q?: string;
  limit?: number;
  offset?: number;
};

/**
 * Injected rather than imported so tests can drive the client without a token.
 * The default is the authenticated fetcher, so no bootstrap ordering matters:
 * a call made before any wiring runs still carries credentials.
 */
export type Fetcher = (path: string, init?: RequestInit) => Promise<Response>;

let fetcher: Fetcher = apiFetch;

export function setFetcher(f: Fetcher) {
  fetcher = f;
}

/** Restore the real authenticated fetcher (tests that swapped it out). */
export function resetFetcher() {
  fetcher = apiFetch;
}

export class NotesApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly requestId?: string,
    readonly body?: unknown,
    /** Seconds from a 429's `Retry-After`, so the UI can say how long. */
    readonly retryAfter?: number,
  ) {
    super(message);
  }
}

/**
 * Session expiry is a modal, not a toast, and it is raised from here so that
 * every route — not just the ones that remembered to check — reacts to a dead
 * token the same way. A silent retry against a 401 is the P8 failure mode this
 * exists to prevent.
 */
type SessionListener = (status: 401 | 403) => void;
const sessionListeners = new Set<SessionListener>();

export function onSessionExpired(listener: SessionListener): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

/** Thrown on 409 so the store can swap in the server's copy without re-fetching. */
export class VersionConflictError extends NotesApiError {
  constructor(
    readonly serverNote: ServerNote,
    requestId?: string,
  ) {
    super(409, 'version_conflict', 'This note changed since you loaded it.', requestId);
  }
}

/** 413 from `GET /v1/graph` — more notes than the server's node cap. */
export class GraphTooLargeError extends NotesApiError {
  constructor(message: string) {
    super(413, 'graph_too_large', message);
  }
}

/**
 * Reads in flight, keyed by path.
 *
 * The sidebar, the bell, the list and the editor mount together and several of
 * them want the same thing at the same instant — `/v1/tags`, `/v1/matters`,
 * `/v1/agent/actions`. Each duplicate is a request against a per-user budget of
 * sixty a minute (the service's `USER_PER_MINUTE`), spent on an answer already
 * on its way. Sharing the promise costs nothing and removes the whole class.
 *
 * Only GETs, and only for the duration of the flight: this is de-duplication,
 * not a cache, so a later mount still sees fresh data. Requests carrying an
 * `AbortSignal` opt out — one caller cancelling must not cancel another's.
 */
const inFlightReads = new Map<string, Promise<unknown>>();

function isSharableRead(init: RequestInit): boolean {
  const method = (init.method ?? 'GET').toUpperCase();
  return method === 'GET' && !init.signal;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (isSharableRead(init)) {
    const existing = inFlightReads.get(path);
    if (existing) return existing as Promise<T>;
    const flight = send<T>(path, init).finally(() => {
      inFlightReads.delete(path);
    });
    inFlightReads.set(path, flight);
    return flight;
  }
  return send<T>(path, init);
}

async function send<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetcher(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });

  if (response.status === 204) return undefined as T;

  const body = await response.json().catch(() => null);

  if (response.status === 409 && body?.error === 'version_conflict') {
    throw new VersionConflictError(toNote(body.serverNote), body.requestId);
  }
  if (response.status === 413 && body?.error === 'graph_too_large') {
    throw new GraphTooLargeError(body?.message ?? 'The graph is too large to render.');
  }
  if (response.status === 401 || response.status === 403) {
    for (const listener of sessionListeners) listener(response.status);
  }
  if (!response.ok) {
    const retryAfter = Number(response.headers?.get?.('Retry-After') ?? '');
    throw new NotesApiError(
      response.status,
      body?.error ?? 'error',
      body?.message ?? `HTTP ${response.status}`,
      body?.requestId,
      body,
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : undefined,
    );
  }
  return body as T;
}

/** See the note on `NoteOut` above — the null-widening is not real. */
function toNote(raw: NoteOut): ServerNote {
  const note = raw as unknown as ServerNote;
  // A note fetched without `include=content` has no `content`; the store and
  // every consumer index into `note.content`, so normalise to an empty doc
  // rather than let `undefined` reach TipTap.
  if (!note.content) note.content = { type: 'doc', content: [{ type: 'paragraph' }] };
  note.tags ??= [];
  note.links ??= [];
  note.reminders ??= [];
  return note;
}

function toNotebook(raw: NotebookOut): Notebook {
  return raw as Notebook;
}

function qs(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const encoded = search.toString();
  return encoded ? `?${encoded}` : '';
}

export interface ListParams {
  notebookId?: string;
  tag?: string;
  trashed?: boolean;
  q?: string;
  sortBy?: 'updated' | 'created' | 'title' | 'manual';
  dir?: 'asc' | 'desc';
  cursor?: string;
  limit?: number;
  /** Omit to get `snippet` only — the list panel does not need full documents. */
  include?: 'content';
  hasReminder?: boolean;
  linkedToDoc?: boolean;
  linkedToEvent?: boolean;
}

export interface NotePage {
  items: ServerNote[];
  nextCursor: string | null;
  total: number;
}

export const notesApi = {
  // ── identity ────────────────────────────────────────────────────────────
  /** Sprint 0's round-trip check. Also the "is the backend reachable" probe. */
  me: () =>
    request<{
      userId: string;
      tenantId: string;
      tenantName?: string | null;
      email?: string | null;
      displayName?: string | null;
      roles: string[];
      authMethod: string;
    }>('/v1/me'),

  // ── notes ───────────────────────────────────────────────────────────────
  async list(params: ListParams = {}): Promise<NotePage> {
    const page = await request<NoteListOut>(`/v1/notes${qs({ ...params })}`);
    return {
      items: page.items.map(toNote),
      nextCursor: page.nextCursor ?? null,
      total: page.total,
    };
  },

  /**
   * Every page of a query, followed to exhaustion.
   *
   * The store computes smart views, tag counts and list sorting over the whole
   * corpus, so it needs the whole corpus. That is correct at pilot size and is
   * the thing to revisit first when a workspace outgrows it — see the note in
   * `use-notes-store.ts`.
   */
  async listAll(params: ListParams = {}, pageLimit = 200): Promise<ServerNote[]> {
    const out: ServerNote[] = [];
    let cursor: string | null | undefined;
    // Bounded so a server that keeps handing back a cursor cannot spin forever.
    for (let page = 0; page < 100; page++) {
      const result = await this.list({ ...params, cursor: cursor ?? undefined, limit: pageLimit });
      out.push(...result.items);
      cursor = result.nextCursor;
      if (!cursor) break;
    }
    return out;
  },

  get: (id: string) => request<NoteOut>(`/v1/notes/${id}`).then(toNote),

  /**
   * The service honours `Idempotency-Key`, but its CORS policy allows only
   * `Authorization, Content-Type, X-Pincer-User, X-Request-Id` — sending the
   * header from the browser fails the preflight, so the retry-safety it buys is
   * unavailable from here until the backend's `allow_headers` includes it.
   */
  create: (init: Partial<Note> = {}) =>
    request<NoteOut>('/v1/notes', {
      method: 'POST',
      body: JSON.stringify(createPayload(init)),
    }).then(toNote),

  /**
   * `baseVersion` is the optimistic-concurrency token. A 409 throws
   * `VersionConflictError` carrying the server's note.
   *
   * `checkpoint` forces a version row; the store sends it on blur and route
   * change so a session always ends on a restorable version, while the 300 ms
   * autosave in between coalesces into roughly one version per minute.
   */
  patch: (
    id: string,
    patch: Partial<Note>,
    baseVersion: number,
    checkpoint = false,
    /**
     * Survive the page unloading. `navigator.sendBeacon` is the usual advice
     * and is unusable here: it only issues POST and cannot set `Authorization`
     * or `X-Pincer-User`, both of which the service requires (ADR 0001). A
     * `keepalive` fetch is the same guarantee for a request that needs a verb
     * and headers, so `beforeunload` uses this instead.
     */
    keepalive = false,
  ) =>
    request<NoteOut>(`/v1/notes/${id}${checkpoint ? '?checkpoint=true' : ''}`, {
      method: 'PATCH',
      body: JSON.stringify({ patch: patchPayload(patch), baseVersion }),
      keepalive,
    }).then(toNote),

  trash: (id: string) => request<NoteOut>(`/v1/notes/${id}`, { method: 'DELETE' }).then(toNote),
  restore: (id: string) =>
    request<NoteOut>(`/v1/notes/${id}/restore`, { method: 'POST' }).then(toNote),
  emptyTrash: () => request<void>('/v1/trash', { method: 'DELETE' }),
  togglePin: (id: string) =>
    request<NoteOut>(`/v1/notes/${id}/pin`, { method: 'POST' }).then(toNote),

  setTags: (id: string, tags: string[]) =>
    request<NoteOut>(`/v1/notes/${id}/tags`, {
      method: 'PUT',
      body: JSON.stringify({ tags }),
    }).then(toNote),

  setSuggestedTags: (id: string, tags: string[]) =>
    request<NoteOut>(`/v1/notes/${id}/suggested-tags`, {
      method: 'PUT',
      body: JSON.stringify({ tags }),
    }).then(toNote),

  moveToNotebook: (id: string, notebookId: string | null) =>
    request<NoteOut>(`/v1/notes/${id}/notebook`, {
      method: 'PUT',
      body: JSON.stringify({ notebookId }),
    }).then(toNote),

  setSortIndex: (id: string, index: number) =>
    request<void>(`/v1/notes/${id}/sort-index`, {
      method: 'PUT',
      body: JSON.stringify({ index }),
    }),

  /** Idempotent per (owner, date) — safe to call on every visit to /notes/daily. */
  ensureDaily: (date?: string) =>
    request<NoteOut>('/v1/notes/daily', {
      method: 'POST',
      body: JSON.stringify(date ? { date } : {}),
    }).then(toNote),

  /**
   * Quick capture. The server parses `#tags` and `[[label]]` out of the plain
   * text and builds the TipTap JSON, so the client sends only the text.
   */
  quickCapture: (text: string) =>
    request<NoteOut>('/v1/notes/quick', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }).then(toNote),

  // ── versions ────────────────────────────────────────────────────────────
  versions: (id: string) => request<VersionSummary[]>(`/v1/notes/${id}/versions`),
  version: (id: string, version: number) =>
    request<VersionOut>(`/v1/notes/${id}/versions/${version}`),
  restoreVersion: (id: string, version: number) =>
    request<NoteOut>(`/v1/notes/${id}/restore-version`, {
      method: 'POST',
      body: JSON.stringify({ version }),
    }).then(toNote),

  /**
   * The server renders the Markdown, proven byte-identical to the old
   * client-side renderer (backend test N8). One renderer, not two.
   */
  async exportMarkdown(id: string): Promise<string> {
    const response = await fetcher(`/v1/notes/${id}/export.md`);
    if (!response.ok) throw new NotesApiError(response.status, 'export_failed', 'Export failed.');
    return response.text();
  },

  // ── notebooks & tags ────────────────────────────────────────────────────
  notebooks: () => request<NotebookOut[]>('/v1/notebooks').then((rows) => rows.map(toNotebook)),

  createNotebook: (name: string, color?: string) =>
    request<NotebookOut>('/v1/notebooks', {
      method: 'POST',
      body: JSON.stringify(color ? { name, color } : { name }),
    }).then(toNotebook),

  renameNotebook: (id: string, name: string) =>
    request<NotebookOut>(`/v1/notebooks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }).then(toNotebook),

  deleteNotebook: (id: string) => request<void>(`/v1/notebooks/${id}`, { method: 'DELETE' }),

  /** Name, count and a mock-compatible colour — the client no longer derives any of it. */
  tags: () => request<TagInfo[]>('/v1/tags'),

  // ── outcomes: tasks & decisions as entities (BE-1) ───────────────────────

  /**
   * Extract into `proposed` outcomes. Nothing here counts as an obligation
   * until `confirm`/`confirmOutcomes` — `stats.discardedUnanchorable` reports
   * how many items the hallucination gate dropped, and is worth surfacing in
   * dev.
   *
   * Synchronous, per ADR 0009: one call, one result, no SSE to reconnect.
   */
  extract: (noteId: string, kinds: OutcomeKind[] = ['task', 'decision']) =>
    request<ExtractOut>(`/v1/notes/${noteId}/extract`, {
      method: 'POST',
      body: JSON.stringify({ kinds }),
    }),

  outcomes: (filters: OutcomeFilters = {}) =>
    request<OutcomeListOut>(`/v1/outcomes${qs({ ...filters })}`),

  /** The one request behind "what do I owe" — P2. Counts come from here, never from a tally. */
  outcomeSummary: () => request<OutcomeSummaryOut>('/v1/outcomes/summary'),

  confirmOutcome: (id: string, edits?: OutcomeEditIn, withReminder = false) =>
    request<OutcomeOut>(`/v1/outcomes/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ edits, withReminder }),
    }),

  /**
   * The primary confirmation path: one action for the whole set, edits carried
   * in the same call. Confirming six proposals as six requests — or as six
   * patches and then six confirms — is how the 30-second goal gets missed.
   * One bad id does not lose the rest: failures come back in `failed[]`.
   */
  confirmOutcomes: (
    ids: string[],
    edits: Array<OutcomeEditIn & { id: string }> = [],
    withReminder = false,
  ) =>
    request<ConfirmBatchOut>('/v1/outcomes/confirm-batch', {
      method: 'POST',
      body: JSON.stringify({ ids, edits, withReminder }),
    }),

  rejectOutcome: (id: string, reason?: string) =>
    request<OutcomeOut>(`/v1/outcomes/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  completeOutcome: (id: string) =>
    request<OutcomeOut>(`/v1/outcomes/${id}/complete`, { method: 'POST' }),

  reopenOutcome: (id: string) =>
    request<OutcomeOut>(`/v1/outcomes/${id}/reopen`, { method: 'POST' }),

  /** `status` is deliberately absent from `OutcomeEditIn`; transitions are verbs. */
  patchOutcome: (id: string, edits: OutcomeEditIn) =>
    request<OutcomeOut>(`/v1/outcomes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(edits),
    }),

  /** A hand-written obligation. Starts `open`: the gate is for what the model produced. */
  createOutcome: (noteId: string, payload: OutcomeCreateIn) =>
    request<OutcomeOut>(`/v1/notes/${noteId}/outcomes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  deleteOutcome: (id: string) => request<void>(`/v1/outcomes/${id}`, { method: 'DELETE' }),

  // ── retrieval: search, views, matters (BE-2) ─────────────────────────────

  /**
   * Literal + semantic, fused with RRF.
   *
   * `closest: true` means the literal query matched nothing and these are the
   * semantic near-misses — the UI must say so rather than presenting them as
   * hits, and must never render an empty state instead of them.
   *
   * `snippet` is `ts_headline` output: note content with `<b>…</b>` around the
   * matched words. It is **not** safe HTML — the rest of it is whatever the user
   * typed — so it is parsed and escaped by `_lib/highlight.ts`, never injected.
   */
  /** Driven by the DSL rather than a bare string; `search` below takes the string. */
  searchQuery: (query: NoteQuery, limit = 20, signal?: AbortSignal) =>
    request<SearchOut>('/v1/search', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
      signal,
    }),

  views: () => request<SavedViewOut[]>('/v1/views'),

  createView: (name: string, query: NoteQuery, icon?: string) =>
    request<SavedViewOut>('/v1/views', {
      method: 'POST',
      body: JSON.stringify({ name, query, icon }),
    }),

  patchView: (
    id: string,
    patch: { name?: string; icon?: string; query?: NoteQuery; pinnedOrder?: number },
  ) =>
    request<SavedViewOut>(`/v1/views/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  deleteView: (id: string) => request<void>(`/v1/views/${id}`, { method: 'DELETE' }),

  viewResults: (id: string, cursor?: string, limit = 50) =>
    request<QueryResults>(`/v1/views/${id}/results${qs({ cursor, limit })}`),

  /** Run an unsaved query — what the view builder calls as the user types. */
  previewQuery: (query: NoteQuery, signal?: AbortSignal) =>
    request<QueryResults>('/v1/views/preview', {
      method: 'POST',
      body: JSON.stringify({ query }),
      signal,
    }),

  /**
   * Matters are detected from tags and notebooks the user already had — any with
   * at least three notes and one outcome. There is nothing to configure, and
   * that is the point: a new taxonomy to maintain is the thing this avoids.
   */
  matters: () => request<MatterOut[]>('/v1/matters'),

  /** Six sections in one request. `summary=false` skips the AI paragraph. */
  matter: (key: string, summary = true) =>
    request<MatterViewOut>(`/v1/matters/${encodeURIComponent(key)}${qs({ summary })}`),

  matterTimeline: (key: string, cursor?: string, limit = 50) =>
    request<MatterTimelineOut>(
      `/v1/matters/${encodeURIComponent(key)}/timeline${qs({ cursor, limit })}`,
    ),

  relatedNotes: (noteId: string) => request<RelatedNoteOut[]>(`/v1/notes/${noteId}/related`),

  /** For the daily note. Deterministic, and free — no model call. */
  resurfaced: (tags: string[] = []) =>
    request<ResurfacedOut[]>(`/v1/resurfaced${qs({ tag: tags.join(',') })}`),

  // ── links, backlinks, candidates, graph ─────────────────────────────────
  addLink: (noteId: string, link: NoteLink) =>
    request<NoteLinkOut>(`/v1/notes/${noteId}/links`, {
      method: 'POST',
      body: JSON.stringify({ type: link.type, targetId: link.targetId, label: link.label }),
    }),

  removeLink: (noteId: string, type: LinkType, targetId: string) =>
    request<void>(`/v1/notes/${noteId}/links/${type}/${encodeURIComponent(targetId)}`, {
      method: 'DELETE',
    }),

  backlinks: (noteId: string) => request<BacklinkOut[]>(`/v1/notes/${noteId}/backlinks`),

  linkCandidates: (
    q: string,
    opts: { types?: LinkType[]; limit?: number; signal?: AbortSignal } = {},
  ) =>
    request<LinkCandidateOut[]>(
      `/v1/link-candidates${qs({
        q,
        types: opts.types?.join(','),
        limit: opts.limit,
      })}`,
      { signal: opts.signal },
    ) as Promise<LinkCandidate[]>,

  /** Throws `GraphTooLargeError` above the server's node cap — filter by tag. */
  graph: (tag?: string) => request<GraphOut>(`/v1/graph${qs({ tag })}`),

  // ── reminders & notifications ───────────────────────────────────────────
  /**
   * `calendarEventId` comes back null: the Calendar Mirror fills it in
   * asynchronously, and the badge shows "Mirroring…" until it does.
   */
  createReminder: (noteId: string, dueAt: number, location?: string) =>
    request<ReminderOut>(`/v1/notes/${noteId}/reminders`, {
      method: 'POST',
      body: JSON.stringify(location ? { dueAt, location } : { dueAt }),
    }) as Promise<Reminder>,

  patchReminder: (
    reminderId: string,
    patch: { dueAt?: number; location?: string; dismissed?: boolean },
  ) =>
    request<ReminderOut>(`/v1/reminders/${reminderId}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }) as Promise<Reminder>,

  deleteReminder: (reminderId: string) =>
    request<void>(`/v1/reminders/${reminderId}`, { method: 'DELETE' }),

  reminders: (params: { from?: number; to?: number; dismissed?: boolean } = {}) =>
    request<ReminderOut[]>(`/v1/reminders${qs({ ...params })}`) as Promise<Reminder[]>,

  notifications: () => request<NotificationOut[]>('/v1/notifications'),

  // ── hybrid search (Sprint 4, tuned in BE-2) ─────────────────────────────
  /**
   * FTS + vector with reciprocal-rank fusion. One endpoint, two request shapes:
   * this one takes the string the user typed, `searchQuery` takes the DSL.
   * Sending both is a 422 rather than a silent precedence rule.
   */
  search: (
    q: string,
    opts: { limit?: number; tag?: string; notebookId?: string; signal?: AbortSignal } = {},
  ) =>
    request<SearchOut>('/v1/search', {
      method: 'POST',
      body: JSON.stringify({
        q,
        limit: opts.limit,
        filters:
          opts.tag || opts.notebookId
            ? { tag: opts.tag, notebookId: opts.notebookId }
            : undefined,
      }),
      signal: opts.signal,
    }),

  // ── agent sessions & audit (Sprint 4) ───────────────────────────────────
  agentSessions: () => request<SessionSummaryOut[]>('/v1/agent/sessions'),
  agentSession: (id: string) => request<SessionDetailOut>(`/v1/agent/sessions/${id}`),

  approveAction: (actionId: string) =>
    request<{ result: unknown; resumed: boolean }>(`/v1/agent/actions/${actionId}/approve`, {
      method: 'POST',
    }),

  /**
   * The reason is recorded on the audit row. It is optional on the wire, but
   * asking for it is what makes a rejection a signal rather than a shrug — for
   * the tenant owner reading the log later, "wrong client" and "no reason
   * given" are very different answers to the same question.
   */
  rejectAction: (actionId: string, reason?: string) =>
    request<{ result: unknown; resumed: boolean }>(`/v1/agent/actions/${actionId}/reject`, {
      method: 'POST',
      body: JSON.stringify(reason ? { reason } : {}),
    }),

  agentActions: (params: { kind?: string; status?: string; cursor?: string } = {}) =>
    request<ActionPageOut>(`/v1/agent/actions${qs({ ...params })}`),

  // ── dev ─────────────────────────────────────────────────────────────────
  /** Owner-only; 404 in production. Replaces the old client-side `buildNotesSeed()`. */
  seed: () => request<SeedResultOut>('/v1/dev/seed', { method: 'POST' }),
};

/**
 * `POST /v1/notes` accepts a strict subset of `Note`. Sending an unknown field
 * (`links`, `reminders`, `updatedAt`, a temp `id`) is a 422, so the whitelist
 * lives here rather than at each call site.
 */
function createPayload(init: Partial<Note>) {
  const payload: Record<string, unknown> = {};
  if (init.title !== undefined) payload.title = init.title;
  if (init.content !== undefined) payload.content = init.content;
  if (init.notebookId !== undefined) payload.notebookId = init.notebookId;
  if (init.tags !== undefined) payload.tags = init.tags;
  if (init.pinned !== undefined) payload.pinned = init.pinned;
  if (init.suggestedTags !== undefined) payload.suggestedTags = init.suggestedTags;
  if (init.daily !== undefined) payload.daily = init.daily;
  if (init.sortIndex !== undefined) payload.sortIndex = init.sortIndex;
  return payload;
}

/** Same idea for `PATCH`: `NotePatchIn`'s fields only. */
function patchPayload(patch: Partial<Note>) {
  const payload: Record<string, unknown> = {};
  const allowed = [
    'title',
    'content',
    'notebookId',
    'tags',
    'pinned',
    'suggestedTags',
    'daily',
    'sortIndex',
    'links',
    'reminders',
  ] as const;
  for (const key of allowed) {
    if (patch[key] !== undefined) payload[key] = patch[key];
  }
  return payload;
}
