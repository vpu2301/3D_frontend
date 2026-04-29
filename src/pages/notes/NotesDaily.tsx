import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotesLayout from '@/pages/notes/_components/shared/NotesLayout';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';

export default function NotesDaily() {
  const load = useNotesStore((s) => s.load);
  const ensureDailyNote = useNotesStore((s) => s.ensureDailyNote);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await load();
      const note = await ensureDailyNote();
      if (!cancelled) navigate(`/notes/${note.id}`, { replace: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [load, ensureDailyNote, navigate]);

  return (
    <NotesLayout>
      <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
        Opening today's note…
      </div>
    </NotesLayout>
  );
}
