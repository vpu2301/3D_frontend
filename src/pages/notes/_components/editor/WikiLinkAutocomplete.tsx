/**
 * `[[` autocomplete (Sprint 2 §4.1).
 *
 * Candidates come from `GET /v1/link-candidates`, so the pool is every note,
 * doc and calendar event the tenant has — not just what this session loaded, and
 * not the two hardcoded placeholder events the mock offered.
 *
 * Requests are debounced and abortable: a fast typist would otherwise leave a
 * trail of in-flight requests whose responses can land out of order, and the
 * last response to arrive is not necessarily the one for the current query.
 *
 * The inserted chip's shape (`{type, targetId, label}`) is unchanged.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { StickyNote, FileText, CalendarClock, Loader2 } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { notesApi } from '@/pages/notes/_lib/apiClient';
import type { LinkCandidate } from '@/pages/notes/_lib/types';
import { cn } from '@/lib/utils';

export interface WikiTriggerState {
  triggerFrom: number;
  query: string;
  position: { x: number; y: number };
}

interface Props {
  editor: Editor;
  state: WikiTriggerState;
  onClose: () => void;
}

const ICONS = {
  note: StickyNote,
  doc: FileText,
  event: CalendarClock,
} as const;

const TYPE_LABELS = {
  note: 'Note',
  doc: 'Doc',
  event: 'Event',
} as const;

const DEBOUNCE_MS = 150;
const LIMIT = 12;

export default function WikiLinkAutocomplete({ editor, state, onClose }: Props) {
  const addLink = useNotesStore((s) => s.addLink);
  const [candidates, setCandidates] = useState<LinkCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      notesApi
        .linkCandidates(state.query, { limit: LIMIT, signal: controller.signal })
        .then((rows) => {
          if (!controller.signal.aborted) {
            setCandidates(rows);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setCandidates([]);
            setLoading(false);
          }
        });
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [state.query]);

  // Abort whatever is in flight when the popup closes.
  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => setActive(0), [state.query]);

  /** The note the chip is being inserted into — the editor renders on /notes/:id. */
  const sourceNoteId = useMemo(() => {
    const m = window.location.pathname.match(/^\/notes\/([^/]+)/);
    const reserved = ['graph', 'trash', 'daily', 'notebook', 'tag'];
    return m && !reserved.includes(m[1]) ? m[1] : null;
  }, []);

  const commit = (c: LinkCandidate) => {
    const to = editor.state.selection.from;
    editor
      .chain()
      .focus()
      .deleteRange({ from: state.triggerFrom, to })
      .insertContent({
        type: 'wikiLink',
        attrs: { label: c.label, linkType: c.type, targetId: c.targetId },
      })
      .insertContent(' ')
      .run();
    // The server also extracts links from the saved content; recording it
    // explicitly means the outgoing-links panel updates without waiting for the
    // autosave round trip.
    if (sourceNoteId) {
      addLink(sourceNoteId, { type: c.type, targetId: c.targetId, label: c.label });
    }
    onClose();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(candidates.length - 1, a + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const c = candidates[active];
        if (c) commit(c);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, candidates, onClose]);

  if (loading && candidates.length === 0) {
    return (
      <div
        className="fixed z-50 flex w-72 items-center gap-2 rounded-[12px] border border-[var(--line)] bg-white p-3 text-xs text-[var(--text-4)] shadow-lg"
        style={{ left: state.position.x, top: state.position.y }}
      >
        <Loader2 className="h-3 w-3 animate-spin" /> Searching…
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div
        className="fixed z-50 w-72 rounded-[12px] border border-[var(--line)] bg-white p-3 text-xs text-[var(--text-4)] shadow-lg"
        style={{ left: state.position.x, top: state.position.y }}
      >
        No matches for "{state.query}". Press Esc.
      </div>
    );
  }

  return (
    <div
      className="fixed z-50 max-h-72 w-80 overflow-y-auto rounded-[12px] border border-[var(--line)] bg-white p-1 shadow-lg"
      style={{ left: state.position.x, top: state.position.y }}
    >
      <div className="plat-eyebrow flex items-center gap-1 px-2 pb-1 pt-1">
        Link to…
        {loading && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
      </div>
      {candidates.map((c, i) => {
        const Icon = ICONS[c.type];
        const isActive = i === active;
        return (
          <button
            data-command-exempt="picks a link target while typing [[; an argument, not an action"
            key={`${c.type}:${c.targetId}`}
            type="button"
            onMouseEnter={() => setActive(i)}
            onClick={() => commit(c)}
            className={cn(
              'flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left transition-colors',
              isActive ? 'bg-[rgba(20,22,26,0.06)]' : 'hover:bg-[rgba(20,22,26,0.05)]',
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--text-4)]" />
            <span className="flex-1 truncate text-sm text-[var(--ink)]">{c.label}</span>
            <span className="plat-eyebrow">
              {TYPE_LABELS[c.type]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
