/**
 * Full search. The *only* search page — there is no second box anywhere in the
 * module, and `src/test/notes/searchGates.test.ts` fails the build if one
 * appears. A professional should never have to work out which search to use.
 *
 * Three things here are the sprint's argument rather than decoration:
 *
 *  - **Empty is never empty.** BE-2 retries a query that matched nothing with
 *    the semantic leg alone and labels the result `closest`. Those render under
 *    "Similar matches", clearly labelled. A half-remembered fragment that comes
 *    back with a blank page is where people conclude search is broken, and they
 *    are not wrong to.
 *  - **Mode is invisible.** Hybrid runs by default. "Keyword or semantic?" is not
 *    a question anyone can answer about a sentence they half-remember, so the
 *    toggle lives behind the filter panel for the rare case where exactness
 *    matters.
 *  - **Snippets are parsed, never injected.** `ts_headline` output is note
 *    content with markers in it; `_lib/highlight.ts` turns it into text nodes.
 *
 * The filter chips narrow by adding a clause to BE-2's DSL and re-running. They
 * carry **no counts**: `SearchOut` has no facets, and a count computed here
 * would be a count of the current page pretending to be a count of the corpus.
 * See `docs/notes-backend.md` for the gap.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Bookmark,
  FileText,
  Hash,
  Loader2,
  Paperclip,
  Search as SearchIcon,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import NotesLayout from '@/pages/notes/_components/shared/NotesLayout';
import NotesMiniRail from '@/pages/notes/_components/sidebar/NotesMiniRail';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { useNotesTags } from '@/pages/notes/_hooks/use-notes-tags';
import { useSavedViewsStore } from '@/pages/notes/_hooks/use-saved-views-store';
import { notesApi, type SearchResponse, type TextMode } from '@/pages/notes/_lib/apiClient';
import { reportError } from '@/pages/notes/_lib/errors';
import {
  andQuery,
  attachmentClause,
  openObligationClause,
  tagClause,
  textClause,
  updatedWithinClause,
} from '@/pages/notes/_lib/queryDsl';
import Highlighted from '@/pages/notes/_components/search/Highlighted';
import { cn } from '@/lib/utils';

const SEARCH_DEBOUNCE_MS = 200;
const LIMIT = 30;

type FilterId = 'attachment' | 'obligations' | 'recent';

const TOGGLES: Array<{ id: FilterId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'obligations', label: 'Has open items', icon: FileText },
  { id: 'attachment', label: 'Has an attachment', icon: Paperclip },
  { id: 'recent', label: 'Updated in 90 days', icon: SlidersHorizontal },
];

const MODES: Array<{ id: TextMode; label: string; hint: string }> = [
  { id: 'hybrid', label: 'Balanced', hint: 'Words and meaning together. The default.' },
  { id: 'fts', label: 'Exact words', hint: 'Only literal matches. For a term you know verbatim.' },
  { id: 'semantic', label: 'By meaning', hint: 'Ignores wording. For a half-remembered idea.' },
];

export default function NotesSearch() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const activeTag = params.get('tag');

  const navigate = useNavigate();
  const loadNotes = useNotesStore((s) => s.load);
  const notes = useNotesStore((s) => s.notes);
  const setSelectedNoteId = useNotesUiStore((s) => s.setSelectedNoteId);
  const { tags } = useNotesTags();
  const createView = useSavedViewsStore((s) => s.create);

  const [draft, setDraft] = useState(query);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Set<FilterId>>(new Set());
  const [mode, setMode] = useState<TextMode>('hybrid');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [saving, setSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  // Arriving from the palette: the query is in the URL and the caret belongs at
  // the end of it, so the user can keep typing where they left off.
  useEffect(() => {
    setDraft(query);
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    input.setSelectionRange(query.length, query.length);
  }, [query]);

  /** The DSL this page is currently asking. One builder, here. */
  const dslQuery = useMemo(() => {
    const clauses = [];
    if (query.trim()) clauses.push(textClause(query.trim(), mode));
    if (activeTag) clauses.push(tagClause(activeTag));
    if (filters.has('obligations')) clauses.push(openObligationClause());
    if (filters.has('attachment')) clauses.push(attachmentClause());
    if (filters.has('recent')) clauses.push(updatedWithinClause('-90d'));
    return andQuery(clauses, { sort: 'relevance', limit: LIMIT });
  }, [query, activeTag, filters, mode]);

  const narrowed = Boolean(activeTag) || filters.size > 0 || mode !== 'hybrid';

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        // A bare query goes as `q`, so the server's own tuning path runs; only a
        // narrowed one needs the DSL. Sending both is a 422 by design.
        const response = narrowed
          ? await notesApi.searchQuery(dslQuery, LIMIT, controller.signal)
          : await notesApi.search(query.trim(), { limit: LIMIT, signal: controller.signal });
        if (!controller.signal.aborted) {
          setResults(response);
          setCursor(0);
        }
      } catch (error) {
        if (!controller.signal.aborted) reportError(error, { title: 'Search failed' });
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, dslQuery, narrowed]);

  const submit = (value: string) => {
    const next = new URLSearchParams(params);
    if (value.trim()) next.set('q', value.trim());
    else next.delete('q');
    setParams(next, { replace: true });
  };

  const open = useCallback(
    (noteId: string) => {
      setSelectedNoteId(noteId);
      navigate(`/notes/${noteId}`);
    },
    [navigate, setSelectedNoteId],
  );

  const items = results?.items ?? [];

  /** Arrows move, Enter opens. The list never steals a keystroke from the box. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCursor((c) => Math.min(c + 1, items.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (event.key === 'Enter' && items[cursor]) {
      event.preventDefault();
      open(items[cursor].noteId);
    }
  };

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-result-index="${cursor}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const toggleFilter = (id: FilterId) =>
    setFilters((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const saveAsView = async () => {
    if (!query.trim()) return;
    setSaving(true);
    // The view is exactly this search — the DSL the page is running, not a
    // re-derivation of it. That is what makes the saved view reproduce the same
    // rows (S11).
    await createView(query.trim().slice(0, 60), dslQuery);
    setSaving(false);
  };

  return (
    <NotesLayout>
      <div className="flex flex-1 overflow-hidden">
        <NotesMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden" onKeyDown={onKeyDown}>
          <div className="border-b border-[var(--line-soft)] px-8 pt-6 pb-3">
            <p className="plat-crumb mb-2.5">3days.notes</p>
            <div className="relative">
              <SearchIcon
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: 'var(--text-5)' }}
              />
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  submit(event.target.value);
                }}
                placeholder="Search every note…"
                aria-label="Search every note"
                data-notes-search-input
                className="h-11 w-full rounded-full border border-[var(--line)] bg-white pl-10 pr-4 text-sm text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
              />
              {loading && (
                <Loader2
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin"
                  style={{ color: 'var(--text-5)' }}
                />
              )}
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {tags.slice(0, 6).map((tag) => (
                <Chip
                  key={tag.name}
                  active={activeTag === tag.name}
                  icon={Hash}
                  label={tag.name}
                  onClick={() => {
                    const next = new URLSearchParams(params);
                    if (activeTag === tag.name) next.delete('tag');
                    else next.set('tag', tag.name);
                    setParams(next, { replace: true });
                  }}
                />
              ))}
              {TOGGLES.map((toggle) => (
                <Chip
                  key={toggle.id}
                  active={filters.has(toggle.id)}
                  icon={toggle.icon}
                  label={toggle.label}
                  onClick={() => toggleFilter(toggle.id)}
                />
              ))}
              <button
                type="button"
                data-command-exempt="opens this page's own advanced options; not an action of its own"
                onClick={() => setShowAdvanced((open) => !open)}
                className="ml-auto rounded-full px-2.5 py-0.5 text-[11px] transition-colors hover:bg-[rgba(20,22,26,0.04)]"
                style={{ color: 'var(--text-4)' }}
              >
                {showAdvanced ? 'Hide options' : 'Options'}
              </button>
              {query.trim() && (
                <button
                  type="button"
                  data-command-exempt="saves the search on screen as a view; the query only exists on this page"
                  disabled={saving}
                  onClick={() => void saveAsView()}
                  className="plat-btn-ghost !h-7 !gap-1 !px-3 !text-[11px] disabled:opacity-50"
                >
                  <Bookmark className="h-3 w-3" /> Save this search
                </button>
              )}
            </div>

            {showAdvanced && (
              <div className="mt-2 rounded-[12px] border border-[var(--line-soft)] bg-white p-2.5">
                <p className="mb-1.5 text-[11px]" style={{ color: 'var(--text-4)' }}>
                  Search runs on words and meaning together. Change this only when you know the
                  exact wording — or only the idea.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {MODES.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      data-command-exempt="picks the retrieval mode for this search; an option, not an action"
                      title={entry.hint}
                      onClick={() => setMode(entry.id)}
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[11px] transition-colors',
                        mode === entry.id
                          ? 'bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]'
                          : 'text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.04)]',
                      )}
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-8 py-4">
            {!query.trim() ? (
              <Prompt />
            ) : loading && !results ? (
              <div className="space-y-3" aria-busy="true">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <NothingFound query={query} />
            ) : (
              <>
                {results?.closest && (
                  <div
                    className="mb-3 rounded-[12px] border px-3 py-2"
                    style={{ borderColor: 'rgba(154,83,18,0.22)', background: 'var(--warn-bg)' }}
                  >
                    <p
                      className="flex items-center gap-1.5 text-xs font-semibold"
                      style={{ color: 'var(--warn-fg)' }}
                    >
                      <Sparkles aria-hidden className="h-3.5 w-3.5" /> Similar matches
                    </p>
                    <p className="mt-0.5 text-[11px]" style={{ color: 'var(--warn-fg)' }}>
                      Nothing contains those exact words, so these are the notes closest in
                      meaning.
                    </p>
                  </div>
                )}

                <p className="mb-2 text-[11px]" style={{ color: 'var(--text-5)' }}>
                  {results?.total ?? items.length} result
                  {(results?.total ?? items.length) === 1 ? '' : 's'}
                </p>

                <ul className="plat-list">
                  {items.map((item, index) => (
                    <li
                      key={item.noteId}
                      className="border-b border-[var(--line-soft)] last:border-b-0"
                    >
                      <button
                        type="button"
                        data-result-index={index}
                        data-command-exempt="opens a search result; navigation"
                        onMouseEnter={() => setCursor(index)}
                        onClick={() => open(item.noteId)}
                        className={cn(
                          'w-full px-4 py-2.5 text-left transition-colors',
                          index === cursor
                            ? 'bg-[rgba(20,22,26,0.06)]'
                            : 'hover:bg-[rgba(20,22,26,0.03)]',
                        )}
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="truncate text-sm font-medium text-[var(--ink)]">
                            {item.title || 'Untitled'}
                          </span>
                          {notes[item.noteId]?.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="shrink-0 text-[10px]"
                              style={{ color: 'var(--text-5)' }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs" style={{ color: 'var(--text-3)' }}>
                          <Highlighted snippet={item.snippet} />
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </main>
      </div>
    </NotesLayout>
  );
}

function Chip({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-command-exempt="narrows the result set on this page; an argument to the search, not an action"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] transition-colors',
        active
          ? 'bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]'
          : 'bg-[var(--sand-deep)] text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.08)]',
      )}
    >
      <Icon className="h-2.5 w-2.5" />
      {label}
    </button>
  );
}

function Prompt() {
  return (
    <div className="py-16 text-center">
      <SearchIcon aria-hidden className="mx-auto mb-3 h-7 w-7" style={{ color: 'var(--text-5)' }} />
      <p className="text-sm" style={{ color: 'var(--text-2)' }}>
        Type a fragment of what you remember.
      </p>
      <p className="mx-auto mt-1 max-w-md text-xs" style={{ color: 'var(--text-4)' }}>
        Part of a sentence, a client's name, a word from a document. Search reads words and
        meaning together, and it splits German compounds — “Frist” finds “Fristverlängerung”.
      </p>
    </div>
  );
}

/**
 * The genuinely-nothing case. It only appears when the server's semantic
 * fallback also came back empty, which means the corpus really does not contain
 * anything like this — so it says that, and offers the next move.
 */
function NothingFound({ query }: { query: string }) {
  return (
    <div className="py-16 text-center">
      <SearchIcon aria-hidden className="mx-auto mb-3 h-7 w-7" style={{ color: 'var(--text-5)' }} />
      <p className="text-sm" style={{ color: 'var(--text-2)' }}>
        Nothing matches “{query}”, by words or by meaning.
      </p>
      <p className="mx-auto mt-1 max-w-md text-xs" style={{ color: 'var(--text-4)' }}>
        Try fewer words — search widens as you remove them, not the other way round.
      </p>
    </div>
  );
}
