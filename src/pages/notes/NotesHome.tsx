import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import NotesLayout from '@/pages/notes/_components/shared/NotesLayout';
import NotesMiniRail from '@/pages/notes/_components/sidebar/NotesMiniRail';
import NotesList from '@/pages/notes/_components/list/NotesList';
import NoteEditor from '@/pages/notes/_components/editor/NoteEditor';
import NotesAiSidebar from '@/pages/notes/_components/ai/NotesAiSidebar';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { formatShortcut } from '@/pages/notes/_lib/commands';

export default function NotesHome() {
  const load = useNotesStore((s) => s.load);
  const docsLoad = useDocsStore((s) => s.load);
  const notesMap = useNotesStore((s) => s.notes);
  const loaded = useNotesStore((s) => s.loaded);
  const refreshNote = useNotesStore((s) => s.refreshNote);
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const { selectedNoteId, setSelectedNoteId, aiSidebarOpen, setAiSidebarOpen } = useNotesUiStore();
  // The AI panel's own shortcut is `view.ai` in the registry now, bound by
  // `NotesLayout` along with every other one — there is no second key handler
  // here to drift out of sync with the shortcut sheet.
  const mod = formatShortcut('mod').replace('+', '');

  useEffect(() => {
    load();
    docsLoad();
  }, [load, docsLoad]);

  // Resolve the note to show in the editor pane
  useEffect(() => {
    const isReservedSegment = location.pathname.match(/^\/notes\/(graph|trash|daily|notebook|tag)/);
    if (id && !isReservedSegment) {
      setSelectedNoteId(id);
      // Deep link to a note this session has not loaded (a citation, a
      // bookmark): fetch it rather than render "select a note".
      if (loaded && !notesMap[id]) void refreshNote(id);
      return;
    }
    if (location.pathname === '/notes' && !selectedNoteId) {
      const first = Object.values(notesMap)
        .filter((n) => !n.trashed)
        .sort((a, b) => b.updatedAt - a.updatedAt)[0];
      if (first) setSelectedNoteId(first.id);
    }
  }, [id, location.pathname, notesMap, selectedNoteId, setSelectedNoteId, loaded, refreshNote]);

  const activeId = selectedNoteId ?? id ?? null;

  return (
    <NotesLayout>
      <div className="flex flex-1 overflow-hidden">
        <NotesMiniRail />
        <NotesList />
        <div className="flex flex-1 overflow-hidden">
          {activeId ? (
            <NoteEditor noteId={activeId} />
          ) : (
            <div
              className="flex flex-1 items-center justify-center p-8 text-center text-sm"
              style={{ color: 'var(--text-3)' }}
            >
              <div>
                <p>Select a note to start writing.</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-5)' }}>
                  {mod}+N for a new one · {mod}+K for everything else.
                </p>
              </div>
            </div>
          )}
          {aiSidebarOpen && (
            <NotesAiSidebar
              noteId={activeId ?? undefined}
              onClose={() => setAiSidebarOpen(false)}
            />
          )}
        </div>
      </div>
    </NotesLayout>
  );
}
