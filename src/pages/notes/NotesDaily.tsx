import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotesLayout from '@/pages/notes/_components/shared/NotesLayout';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';

/**
 * `POST /v1/notes/daily` is idempotent per (owner, date), so visiting this route
 * twice cannot produce two daily notes — the old client-side "scan the map for
 * today's daily" loop could, whenever the map was only partly loaded.
 */
export default function NotesDaily() {
  const load = useNotesStore((s) => s.load);
  const ensureDailyNote = useNotesStore((s) => s.ensureDailyNote);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
        const note = await ensureDailyNote();
        if (!cancelled) navigate(`/notes/${note.id}`, { replace: true });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not open today's note.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load, ensureDailyNote, navigate]);

  return (
    <NotesLayout>
      <div className="flex flex-1 items-center justify-center p-8 text-center text-sm">
        {error ? (
          <div
            className="max-w-md rounded-[14px] border bg-white p-5"
            style={{ borderColor: 'rgba(179,56,46,0.25)', color: 'var(--bad-fg)' }}
          >
            <p className="plat-crumb" style={{ color: 'var(--bad-fg)' }}>
              3days.notes
            </p>
            <p className="mt-1.5 font-semibold">Could not open today's note</p>
            <p className="mt-1 text-xs">{error}</p>
            <button
            data-command-exempt="error recovery on a route that has already failed to resolve a note"
              type="button"
              onClick={() => navigate('/notes')}
              className="plat-btn-ghost mt-4 !h-8 !px-3.5 !text-[11px]"
            >
              Back to all notes
            </button>
          </div>
        ) : (
          <span style={{ color: 'var(--text-4)' }}>Opening today's note…</span>
        )}
      </div>
    </NotesLayout>
  );
}
