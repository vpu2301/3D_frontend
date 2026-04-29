import { useEffect, useMemo, useState } from 'react';
import { StickyNote, FileText, CalendarClock } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { useNotesStore, selectNotesMap } from '@/pages/notes/_hooks/use-notes-store';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { deriveTitle } from '@/pages/notes/_lib/backlinks';
import type { LinkType } from '@/pages/notes/_lib/types';
import { cn } from '@/lib/utils';

export interface WikiTriggerState {
  triggerFrom: number;
  query: string;
  position: { x: number; y: number };
}

interface Candidate {
  type: LinkType;
  targetId: string;
  label: string;
  snippet?: string;
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

export default function WikiLinkAutocomplete({ editor, state, onClose }: Props) {
  const notesMap = useNotesStore(selectNotesMap);
  const docsMap = useDocsStore((s) => s.docs);
  const addLink = useNotesStore((s) => s.addLink);
  const [active, setActive] = useState(0);

  const candidates: Candidate[] = useMemo(() => {
    const out: Candidate[] = [];
    for (const note of Object.values(notesMap)) {
      if (note.trashed) continue;
      out.push({ type: 'note', targetId: note.id, label: deriveTitle(note) });
    }
    for (const doc of Object.values(docsMap)) {
      if (doc.trashed) continue;
      out.push({ type: 'doc', targetId: doc.id, label: doc.title || 'Untitled' });
    }
    // Mock event candidates — in a fully integrated calendar these would come
    // from the calendar store; we surface a few plausible placeholders so the
    // wiki-link UI demonstrates cross-module linking on first run.
    out.push({ type: 'event', targetId: 'evt_design_review', label: 'Design review (Thu 3pm)' });
    out.push({ type: 'event', targetId: 'evt_q2_kickoff', label: 'Q2 kickoff' });
    return out;
  }, [notesMap, docsMap]);

  const filtered = useMemo(() => {
    const q = state.query.toLowerCase();
    if (!q) return candidates.slice(0, 12);
    return candidates
      .filter((c) => c.label.toLowerCase().includes(q))
      .slice(0, 12);
  }, [candidates, state.query]);

  useEffect(() => setActive(0), [state.query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(filtered.length - 1, a + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const c = filtered[active];
        if (c) commit(c);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, filtered, onClose]);

  const commit = (c: Candidate) => {
    // Determine current note id (so we can record the outgoing link on the
    // notes store too). The editor's `noteId` isn't directly reachable here,
    // so we infer from the URL since editor renders on /notes/:id paths.
    const m = window.location.pathname.match(/^\/notes\/([^/]+)/);
    const sourceNoteId = m && m[1] !== 'graph' && m[1] !== 'trash' && m[1] !== 'daily' ? m[1] : null;

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
    if (sourceNoteId) {
      addLink(sourceNoteId, { type: c.type, targetId: c.targetId, label: c.label });
    }
    onClose();
  };

  if (filtered.length === 0) {
    return (
      <div
        className="fixed z-50 w-72 rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-500 shadow-lg"
        style={{ left: state.position.x, top: state.position.y }}
      >
        No matches for "{state.query}". Press Esc.
      </div>
    );
  }

  return (
    <div
      className="fixed z-50 w-80 max-h-72 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
      style={{ left: state.position.x, top: state.position.y }}
    >
      <div className="px-2 pb-1 pt-1 text-[10px] uppercase tracking-wider text-gray-400">
        Link to…
      </div>
      {filtered.map((c, i) => {
        const Icon = ICONS[c.type];
        const isActive = i === active;
        return (
          <button
            key={`${c.type}:${c.targetId}`}
            type="button"
            onMouseEnter={() => setActive(i)}
            onClick={() => commit(c)}
            className={cn(
              'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left',
              isActive ? 'bg-gray-100' : 'hover:bg-gray-50',
            )}
          >
            <Icon className="h-3.5 w-3.5 text-gray-500" />
            <span className="flex-1 truncate text-sm text-gray-900">{c.label}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">
              {TYPE_LABELS[c.type]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
