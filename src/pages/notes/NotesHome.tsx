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

export default function NotesHome() {
  const load = useNotesStore((s) => s.load);
  const docsLoad = useDocsStore((s) => s.load);
  const notesMap = useNotesStore((s) => s.notes);
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const { selectedNoteId, setSelectedNoteId, aiSidebarOpen, setAiSidebarOpen } = useNotesUiStore();

  useEffect(() => {
    load();
    docsLoad();
  }, [load, docsLoad]);

  // Resolve the note to show in the editor pane
  useEffect(() => {
    const isReservedSegment = location.pathname.match(/^\/notes\/(graph|trash|daily|notebook|tag)/);
    if (id && !isReservedSegment) {
      setSelectedNoteId(id);
      return;
    }
    if (location.pathname === '/notes' && !selectedNoteId) {
      const first = Object.values(notesMap)
        .filter((n) => !n.trashed)
        .sort((a, b) => b.updatedAt - a.updatedAt)[0];
      if (first) setSelectedNoteId(first.id);
    }
  }, [id, location.pathname, notesMap, selectedNoteId, setSelectedNoteId]);

  // Cmd/Ctrl+Shift+I — toggle AI sidebar (matches Docs)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setAiSidebarOpen(!aiSidebarOpen);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aiSidebarOpen, setAiSidebarOpen]);

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
            <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-gray-500">
              <div>
                <p>Select a note to start writing.</p>
                <p className="mt-1 text-xs text-gray-400">
                  Or press Cmd/Ctrl+Shift+N to capture a new one.
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
