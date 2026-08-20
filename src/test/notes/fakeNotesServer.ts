/**
 * An in-memory stand-in for the `notes_app` service, wired in through
 * `apiClient.setFetcher`.
 *
 * It implements the parts of the contract the store depends on for its
 * behaviour rather than for its shape: version increments, 409 on a stale
 * `baseVersion`, the silent pin cap, keyset pagination, and 204s where the real
 * service returns no body. Those are exactly the things a hand-rolled `vi.fn()`
 * returning fixtures would not catch.
 */

import type { Fetcher } from '@/pages/notes/_lib/apiClient';

export interface FakeNote {
  id: string;
  title?: string;
  content: unknown;
  notebookId: string | null;
  tags: string[];
  suggestedTags?: string[];
  pinned: boolean;
  trashed: boolean;
  daily?: boolean;
  sortIndex?: number;
  links: Array<{ type: string; targetId: string; label?: string }>;
  reminders: Array<{
    id: string;
    noteId: string;
    dueAt: number;
    location?: string;
    calendarEventId: string | null;
    dismissed: boolean;
  }>;
  version: number;
  createdAt: number;
  updatedAt: number;
}

const PIN_CAP = 5;

/** BE-1's outcome row, in the shape `OutcomeOut` serialises. */
export interface FakeOutcome {
  id: string;
  noteId: string;
  kind: 'task' | 'decision';
  status: 'proposed' | 'open' | 'done' | 'dropped' | 'superseded';
  origin: 'ai' | 'manual' | 'import';
  text: string;
  detail?: string | null;
  owedBy?: string | null;
  owedTo?: string | null;
  dueAt?: number | null;
  dueText?: string | null;
  anchor: { quote: string; charStart?: number | null; charEnd?: number | null; state: 'anchored' | 'orphaned' };
  sourceVersion: number;
  confidence?: number | null;
  confirmedAt?: number | null;
  completedAt?: number | null;
  createdAt: number;
  updatedAt: number;
}

export class FakeNotesServer {
  notes = new Map<string, FakeNote>();
  notebooks = new Map<string, { id: string; name: string; color: string; createdAt: number }>();
  /** Every path the client asked for, in order — used to assert call patterns. */
  calls: string[] = [];
  /** Set to force the next matching request to fail. */
  failNext: { method?: string; path?: string; status: number; error: string } | null = null;

  private seq = 0;
  private clock = 1_700_000_000_000;
  /**
   * Ids are unique per server instance, not just per row.
   *
   * Without this, two tests in the same file mint the same ids, and a request
   * left in flight when one test ends writes its stale row over the identically
   * numbered row of the next one. That failure looks like a bug in the
   * component under test and is not.
   */
  private static instances = 0;
  private readonly instance = ++FakeNotesServer.instances;

  id(prefix = 'note'): string {
    this.seq += 1;
    // UUID-shaped enough for a client that only ever treats ids as opaque.
    return `${prefix}-${String(this.instance).padStart(4, '0')}-0000-0000-${String(this.seq).padStart(12, '0')}`;
  }

  now(): number {
    this.clock += 1000;
    return this.clock;
  }

  addNote(init: Partial<FakeNote> = {}): FakeNote {
    const now = this.now();
    const note: FakeNote = {
      id: this.id(),
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      notebookId: null,
      tags: [],
      pinned: false,
      trashed: false,
      links: [],
      reminders: [],
      version: 1,
      createdAt: now,
      updatedAt: now,
      ...init,
    };
    this.notes.set(note.id, note);
    return note;
  }

  outcomes = new Map<string, FakeOutcome>();
  /** What `POST /v1/search` will answer. Set per test. */
  searchResults: Array<{ noteId: string; title: string; snippet: string; score?: number }> = [];
  /** When true the search answers `closest: true` — the semantic fallback path. */
  searchClosest = false;
  /** Bodies the client sent to `/v1/search`, for asserting the DSL. */
  searchRequests: unknown[] = [];
  matterRows: Array<{
    key: string;
    label: string;
    kind: 'tag' | 'notebook';
    noteCount: number;
    openTasks: number;
    lastActivityAt?: number | null;
  }> = [];
  matterViews = new Map<string, Record<string, unknown>>();
  savedViews = new Map<string, Record<string, unknown>>();
  /** Queries sent to `/v1/views/preview`, in order — for the abort test. */
  previewRequests: unknown[] = [];
  /** Resolves the next preview only when released, so a race can be staged. */
  holdPreview: Promise<void> | null = null;
  relatedRows: Array<{ noteId: string; title: string; snippet: string; score: number }> = [];

  addSavedView(init: Partial<Record<string, unknown>> = {}) {
    const now = this.now();
    const view = {
      id: this.id('view'),
      name: 'A view',
      query: { all: [] },
      seeded: false,
      createdAt: now,
      updatedAt: now,
      pinnedOrder: null,
      icon: null,
      warning: null,
      ...init,
    };
    this.savedViews.set(view.id as string, view);
    return view;
  }
  /** What the next `POST /v1/notes/{id}/extract` will propose. */
  nextExtraction: Array<Partial<FakeOutcome>> = [];

  addOutcome(init: Partial<FakeOutcome> & { noteId: string }): FakeOutcome {
    const now = this.now();
    const outcome: FakeOutcome = {
      id: this.id('outcome'),
      kind: 'task',
      status: 'proposed',
      origin: 'ai',
      text: 'Do the thing',
      anchor: { quote: 'do the thing', state: 'anchored' },
      sourceVersion: 1,
      createdAt: now,
      updatedAt: now,
      ...init,
    };
    this.outcomes.set(outcome.id, outcome);
    return outcome;
  }

  addNotebook(name: string, color = '#3b82f6') {
    const nb = { id: this.id('nb'), name, color, createdAt: this.now() };
    this.notebooks.set(nb.id, nb);
    return nb;
  }

  /** Install as the client's fetcher. */
  fetcher: Fetcher = async (path, init = {}) => {
    const method = (init.method ?? 'GET').toUpperCase();
    this.calls.push(`${method} ${path}`);

    if (
      this.failNext &&
      (!this.failNext.method || this.failNext.method === method) &&
      (!this.failNext.path || path.startsWith(this.failNext.path))
    ) {
      const { status, error } = this.failNext;
      this.failNext = null;
      return json({ error, message: `forced ${error}` }, status);
    }

    const body = init.body ? JSON.parse(String(init.body)) : undefined;
    const [rawPath, rawQuery = ''] = path.split('?');
    const query = new URLSearchParams(rawQuery);
    const segments = rawPath.split('/').filter(Boolean); // ['v1', 'notes', …]

    // ── /v1/me ──
    if (rawPath === '/v1/me') {
      return json({
        userId: 'user-1',
        tenantId: 'tenant-1',
        tenantName: 'Test tenant',
        roles: ['owner'],
        authMethod: 'fake',
      });
    }

    // ── /v1/notebooks ──
    if (rawPath === '/v1/notebooks') {
      if (method === 'GET') return json([...this.notebooks.values()]);
      if (method === 'POST') return json(this.addNotebook(body.name, body.color), 201);
    }
    if (segments[1] === 'notebooks' && segments.length === 3) {
      const nb = this.notebooks.get(segments[2]);
      if (!nb) return json({ error: 'not_found', message: 'No such notebook' }, 404);
      if (method === 'PATCH') {
        nb.name = body.name ?? nb.name;
        return json(nb);
      }
      if (method === 'DELETE') {
        this.notebooks.delete(nb.id);
        for (const n of this.notes.values()) if (n.notebookId === nb.id) n.notebookId = null;
        return empty();
      }
    }

    // ── retrieval (BE-2) ──
    if (rawPath === '/v1/search' && method === 'POST') {
      this.searchRequests.push(body);
      // The real service 422s when both shapes arrive; the fake enforces it so a
      // client that starts sending both is caught here rather than in staging.
      if (body?.q && body?.query) {
        return json({ error: 'validation_error', message: 'send q or query, not both' }, 422);
      }
      return json({
        items: this.searchResults.map((row) => ({
          noteId: row.noteId,
          title: row.title,
          snippet: row.snippet,
          score: row.score ?? 1,
          signals: { fts: 1, vector: null },
        })),
        total: this.searchResults.length,
        nextCursor: null,
        closest: this.searchClosest,
      });
    }

    if (rawPath === '/v1/matters' && method === 'GET') {
      return json(this.matterRows);
    }
    if (segments[1] === 'matters' && segments.length === 3 && method === 'GET') {
      const key = decodeURIComponent(segments[2]);
      const view = this.matterViews.get(key);
      if (!view) return json({ error: 'not_found', message: 'No such matter' }, 404);
      return json(view);
    }

    if (rawPath === '/v1/views' && method === 'GET') {
      return json([...this.savedViews.values()]);
    }
    if (rawPath === '/v1/views' && method === 'POST') {
      return json(this.addSavedView({ name: body.name, query: body.query }), 201);
    }
    if (rawPath === '/v1/views/preview' && method === 'POST') {
      this.previewRequests.push(body.query);
      if (this.holdPreview) await this.holdPreview;
      return json({ items: [], total: this.searchResults.length, nextCursor: null, closest: false });
    }
    if (segments[1] === 'views' && segments.length >= 3) {
      const view = this.savedViews.get(segments[2]);
      if (!view) return json({ error: 'not_found', message: 'No such view' }, 404);
      if (segments[3] === 'results' && method === 'GET') {
        return json({
          items: this.searchResults.map((row) => ({
            id: row.noteId,
            title: row.title,
            snippet: row.snippet,
            updatedAt: this.now(),
          })),
          total: this.searchResults.length,
          nextCursor: null,
          closest: false,
        });
      }
      if (method === 'PATCH') {
        Object.assign(view, body, { updatedAt: this.now() });
        return json(view);
      }
      if (method === 'DELETE') {
        this.savedViews.delete(segments[2]);
        return empty();
      }
    }

    if (segments[1] === 'notes' && segments[3] === 'related' && method === 'GET') {
      return json(this.relatedRows);
    }

    // ── /v1/outcomes ── (BE-1)
    if (rawPath === '/v1/outcomes' && method === 'GET') {
      const rows = [...this.outcomes.values()].filter((o) => {
        if (query.get('noteId') && o.noteId !== query.get('noteId')) return false;
        if (query.get('status') && o.status !== query.get('status')) return false;
        if (query.get('kind') && o.kind !== query.get('kind')) return false;
        // `me` is resolved server-side against an alias list; the fake mirrors
        // the behaviour rather than the alias table.
        const owedBy = query.get('owedBy');
        if (owedBy === 'me' && !isMe(o.owedBy)) return false;
        if (owedBy && owedBy !== 'me' && owedBy !== 'others' && o.owedBy !== owedBy) return false;
        if (owedBy === 'others' && isMe(o.owedBy)) return false;
        const owedTo = query.get('owedTo');
        if (owedTo === 'me' && !isMe(o.owedTo)) return false;
        if (query.get('overdue') === 'true' && !(o.dueAt && o.dueAt < Date.now())) return false;
        const tag = query.get('tag');
        if (tag && !(this.notes.get(o.noteId)?.tags ?? []).includes(tag)) return false;
        // Dropped items are gone from every view; that is what reject means.
        return o.status !== 'dropped';
      });
      return json({
        items: rows,
        total: rows.length,
        nextCursor: null,
        facets: {
          byDue: { overdue: 0, today: 0, week: 0, later: 0, none: 0 },
          byNotebook: [],
          byOwedBy: [],
        },
      });
    }

    if (rawPath === '/v1/outcomes/summary' && method === 'GET') {
      const open = [...this.outcomes.values()].filter((o) => o.status === 'open');
      const mine = open.filter((o) => isMe(o.owedBy));
      const theirs = open.filter((o) => isMe(o.owedTo));
      const side = (rows: FakeOutcome[]) => ({
        open: rows.length,
        overdue: rows.filter((o) => o.dueAt && o.dueAt < Date.now()).length,
        today: 0,
        week: 0,
      });
      return json({
        mine: side(mine),
        theirs: side(theirs),
        unconfirmed: [...this.outcomes.values()].filter((o) => o.status === 'proposed').length,
        byTag: [],
      });
    }

    if (rawPath === '/v1/outcomes/confirm-batch' && method === 'POST') {
      const editsById = new Map<string, Record<string, unknown>>(
        (body.edits ?? []).map((e: { id: string }) => [e.id, e]),
      );
      const confirmed: FakeOutcome[] = [];
      const failed: Array<{ id: string; error: string }> = [];
      for (const id of body.ids ?? []) {
        const outcome = this.outcomes.get(id);
        if (!outcome || outcome.status !== 'proposed') {
          failed.push({ id, error: 'not_proposed' });
          continue;
        }
        const edit = editsById.get(id);
        if (edit) {
          for (const key of ['text', 'owedBy', 'owedTo', 'dueAt', 'dueText', 'kind', 'detail']) {
            if (key in edit) (outcome as never as Record<string, unknown>)[key] = edit[key];
          }
        }
        outcome.status = 'open';
        outcome.confirmedAt = this.now();
        confirmed.push(outcome);
      }
      return json({ confirmed, failed });
    }

    if (segments[1] === 'outcomes' && segments.length >= 3) {
      const outcome = this.outcomes.get(segments[2]);
      if (!outcome) return json({ error: 'not_found', message: 'No such outcome' }, 404);
      const verb = segments[3];

      if (method === 'POST' && verb === 'confirm') {
        outcome.status = 'open';
        outcome.confirmedAt = this.now();
        return json(outcome);
      }
      if (method === 'POST' && verb === 'reject') {
        outcome.status = 'dropped';
        return json(outcome);
      }
      if (method === 'POST' && verb === 'complete') {
        outcome.status = 'done';
        outcome.completedAt = this.now();
        return json(outcome);
      }
      if (method === 'POST' && verb === 'reopen') {
        outcome.status = 'open';
        outcome.completedAt = null;
        return json(outcome);
      }
      if (method === 'PATCH' && !verb) {
        // `status` is deliberately not patchable — the real service 422s.
        if ('status' in (body ?? {})) {
          return json({ error: 'validation_error', message: 'status is not patchable' }, 422);
        }
        Object.assign(outcome, body, { updatedAt: this.now() });
        return json(outcome);
      }
      if (method === 'DELETE' && !verb) {
        this.outcomes.delete(outcome.id);
        return empty();
      }
    }

    // ── /v1/tags ──
    if (rawPath === '/v1/tags') {
      const counts = new Map<string, number>();
      for (const n of this.notes.values()) {
        if (n.trashed) continue;
        for (const t of n.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
      }
      return json(
        [...counts.entries()]
          .map(([name, count]) => ({ name, count, color: '#3b82f6' }))
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
      );
    }

    // ── /v1/trash ──
    if (rawPath === '/v1/trash' && method === 'DELETE') {
      for (const [id, n] of [...this.notes]) if (n.trashed) this.notes.delete(id);
      return empty();
    }

    // ── /v1/notes/{id}/extract and /outcomes ──
    if (segments[1] === 'notes' && segments[3] === 'extract' && method === 'POST') {
      const note = this.notes.get(segments[2]);
      if (!note) return json({ error: 'not_found', message: 'No such note' }, 404);
      const created = this.nextExtraction.map((init) =>
        this.addOutcome({ ...init, noteId: note.id, sourceVersion: note.version }),
      );
      this.nextExtraction = [];
      return json({
        extractionId: this.id('extraction'),
        outcomes: created,
        stats: {
          requested: { task: created.length },
          proposed: created.length,
          duplicates: 0,
          discardedEmpty: 0,
          discardedUnanchorable: 0,
          capped: 0,
        },
      });
    }

    if (segments[1] === 'notes' && segments[3] === 'outcomes' && method === 'POST') {
      const note = this.notes.get(segments[2]);
      if (!note) return json({ error: 'not_found', message: 'No such note' }, 404);
      // Manual items skip the gate: it exists for what the model produced.
      return json(
        this.addOutcome({
          ...body,
          noteId: note.id,
          origin: 'manual',
          status: 'open',
          sourceVersion: note.version,
          anchor: { quote: body.quote ?? body.text, state: 'anchored' },
        }),
        201,
      );
    }

    // ── /v1/notes/daily ──
    if (rawPath === '/v1/notes/daily' && method === 'POST') {
      const existing = [...this.notes.values()].find((n) => n.daily && !n.trashed);
      if (existing) return json(wire(existing, true), 200);
      return json(
        wire(this.addNote({ daily: true, tags: ['daily'], title: 'Daily note' }), true),
        201,
      );
    }

    // ── /v1/notes/quick ──
    if (rawPath === '/v1/notes/quick' && method === 'POST') {
      const text = String(body.text ?? '');
      const tags = [...text.matchAll(/#([a-z0-9-]+)/gi)].map((m) => m[1].toLowerCase());
      return json(
        wire(
          this.addNote({
            tags,
            content: {
              type: 'doc',
              content: text
                .split('\n')
                .filter(Boolean)
                .map((line) => ({ type: 'paragraph', content: [{ type: 'text', text: line }] })),
            },
          }),
          true,
        ),
        201,
      );
    }

    // ── /v1/notes (collection) ──
    if (rawPath === '/v1/notes') {
      if (method === 'POST') {
        const note = this.addNote({
          title: body.title,
          content: body.content ?? { type: 'doc', content: [{ type: 'paragraph' }] },
          notebookId: body.notebookId ?? null,
          tags: body.tags ?? [],
          pinned: Boolean(body.pinned),
          daily: body.daily,
          suggestedTags: body.suggestedTags,
          sortIndex: body.sortIndex,
        });
        return json(wire(note, true), 201);
      }
      if (method === 'GET') {
        const trashed = query.get('trashed') === 'true';
        const q = query.get('q');
        const tag = query.get('tag');
        const notebookId = query.get('notebookId');
        const includeContent = query.get('include') === 'content';
        const limit = Number(query.get('limit') ?? 50);
        const cursor = query.get('cursor');

        let rows = [...this.notes.values()].filter((n) => n.trashed === trashed);
        if (tag) rows = rows.filter((n) => n.tags.includes(tag));
        if (notebookId) rows = rows.filter((n) => n.notebookId === notebookId);
        if (q) {
          const needle = q.toLowerCase();
          rows = rows.filter(
            (n) =>
              (n.title ?? '').toLowerCase().includes(needle) ||
              JSON.stringify(n.content).toLowerCase().includes(needle),
          );
        }
        rows.sort((a, b) => b.updatedAt - a.updatedAt);

        // Keyset pagination on the note id, which is what the client follows.
        const start = cursor ? rows.findIndex((n) => n.id === cursor) : 0;
        const page = rows.slice(Math.max(start, 0), Math.max(start, 0) + limit);
        const after = rows[Math.max(start, 0) + limit];

        return json({
          items: page.map((n) => wire(n, includeContent)),
          nextCursor: after ? after.id : null,
          total: rows.length,
        });
      }
    }

    // ── /v1/reminders/{id} ──
    if (segments[1] === 'reminders' && segments.length === 3) {
      const reminderId = segments[2];
      for (const note of this.notes.values()) {
        const reminder = note.reminders.find((r) => r.id === reminderId);
        if (!reminder) continue;
        if (method === 'PATCH') {
          Object.assign(reminder, body);
          return json(reminder);
        }
        if (method === 'DELETE') {
          note.reminders = note.reminders.filter((r) => r.id !== reminderId);
          return empty();
        }
      }
      return json({ error: 'not_found', message: 'No such reminder' }, 404);
    }

    // ── /v1/notes/{id}… ──
    if (segments[1] === 'notes' && segments.length >= 3) {
      const note = this.notes.get(segments[2]);
      if (!note) return json({ error: 'not_found', message: 'No such note' }, 404);
      const action = segments[3];

      if (!action) {
        if (method === 'GET') return json(wire(note, true));
        if (method === 'DELETE') {
          note.trashed = true;
          note.pinned = false;
          note.version += 1;
          note.updatedAt = this.now();
          return json(wire(note, true));
        }
        if (method === 'PATCH') {
          if (body.baseVersion !== note.version) {
            return json(
              {
                error: 'version_conflict',
                message: 'This note changed since you loaded it.',
                requestId: 'req-1',
                serverNote: wire(note, true),
              },
              409,
            );
          }
          Object.assign(note, body.patch);
          note.version += 1;
          note.updatedAt = this.now();
          return json(wire(note, true));
        }
      }

      if (action === 'restore' && method === 'POST') {
        note.trashed = false;
        note.version += 1;
        return json(wire(note, true));
      }

      if (action === 'pin' && method === 'POST') {
        const pinned = [...this.notes.values()].filter((n) => n.pinned && !n.trashed).length;
        // Silently capped, exactly like the real service.
        if (note.pinned || pinned < PIN_CAP) note.pinned = !note.pinned;
        note.version += 1;
        return json(wire(note, true));
      }

      if (action === 'tags' && method === 'PUT') {
        note.tags = body.tags;
        note.version += 1;
        return json(wire(note, true));
      }

      if (action === 'suggested-tags' && method === 'PUT') {
        note.suggestedTags = body.tags;
        note.version += 1;
        return json(wire(note, true));
      }

      if (action === 'notebook' && method === 'PUT') {
        note.notebookId = body.notebookId;
        note.version += 1;
        return json(wire(note, true));
      }

      if (action === 'sort-index' && method === 'PUT') {
        note.sortIndex = body.index;
        return empty();
      }

      if (action === 'links') {
        if (method === 'POST') {
          const link = { type: body.type, targetId: body.targetId, label: body.label, source: 'manual' };
          note.links.push(link);
          return json(link, 201);
        }
        if (method === 'DELETE') {
          const [, , , , type, targetId] = segments;
          note.links = note.links.filter(
            (l) => !(l.type === type && l.targetId === decodeURIComponent(targetId)),
          );
          return empty();
        }
      }

      if (action === 'reminders' && method === 'POST') {
        const reminder = {
          id: this.id('rem'),
          noteId: note.id,
          dueAt: body.dueAt,
          location: body.location,
          // Null on creation: the Calendar Mirror fills it in later.
          calendarEventId: null,
          dismissed: false,
        };
        note.reminders.push(reminder);
        return json(reminder, 201);
      }

      if (action === 'backlinks' && method === 'GET') {
        const rows = [...this.notes.values()].filter(
          (n) => !n.trashed && n.links.some((l) => l.type === 'note' && l.targetId === note.id),
        );
        return json(
          rows.map((n) => ({
            noteId: n.id,
            title: n.title ?? 'Untitled',
            snippet: '',
            linkType: 'note',
            fromNoteId: n.id,
            fromNoteTitle: n.title ?? 'Untitled',
          })),
        );
      }

      if (action === 'versions' && method === 'GET') {
        return json(
          Array.from({ length: note.version }, (_, i) => ({
            version: note.version - i,
            createdAt: note.updatedAt - i * 1000,
            authorId: 'user-1',
            sizeBytes: 100,
          })),
        );
      }

      if (action === 'export.md' && method === 'GET') {
        return new Response(`# ${note.title ?? 'Untitled'}\n`, {
          status: 200,
          headers: { 'Content-Type': 'text/markdown' },
        });
      }
    }

    return json({ error: 'not_found', message: `unhandled ${method} ${path}` }, 404);
  };
}

/** `response_model_exclude_none`: optional fields are absent, never null. */
function wire(note: FakeNote, includeContent: boolean): Record<string, unknown> {
  const out: Record<string, unknown> = {
    id: note.id,
    tags: note.tags,
    pinned: note.pinned,
    trashed: note.trashed,
    links: note.links,
    reminders: note.reminders,
    version: note.version,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    notebookId: note.notebookId,
  };
  if (note.title !== undefined) out.title = note.title;
  if (note.daily !== undefined) out.daily = note.daily;
  if (note.sortIndex !== undefined) out.sortIndex = note.sortIndex;
  if (note.suggestedTags !== undefined) out.suggestedTags = note.suggestedTags;
  if (includeContent) out.content = note.content;
  else out.snippet = 'server snippet';
  return out;
}

/** The alias resolution `owedBy=me` performs server-side. */
function isMe(owed: string | null | undefined): boolean {
  return Boolean(owed && /^(me|ich)$/i.test(owed.trim()));
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function empty(): Response {
  return new Response(null, { status: 204 });
}
