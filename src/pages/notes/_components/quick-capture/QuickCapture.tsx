import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { dialogButton } from '@/pages/notes/_components/shared/dialog-styles';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { notesApi } from '@/pages/notes/_lib/apiClient';

/**
 * Global quick-capture composer. Mounted at the app root so it can be opened
 * from anywhere via Cmd/Ctrl+Shift+N.
 *
 * Saves through `POST /v1/notes/quick` (Sprint 5 §2.1): the server parses
 * `#tags` and `[[label]]` out of the plain text and builds the TipTap document.
 * Doing that here as well would mean two parsers that have to agree forever —
 * and the client's version never handled `[[…]]` at all.
 */
export default function QuickCapture() {
  const open = useNotesUiStore((s) => s.quickCaptureOpen);
  const setOpen = useNotesUiStore((s) => s.setQuickCaptureOpen);
  const load = useNotesStore((s) => s.load);
  const reload = useNotesStore((s) => s.reload);
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Global hotkey. Escape is Radix's to handle now that this is a real dialog —
  // it closes through `onOpenChange`, which saves rather than dropping the text.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        load();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen, load]);

  useEffect(() => {
    if (!open) {
      setText('');
      setError(null);
    }
  }, [open]);

  const save = async (then?: 'open' | 'close') => {
    const trimmed = text.trim();
    if (!trimmed) {
      setOpen(false);
      return;
    }
    if (saving) return;

    setSaving(true);
    setError(null);
    try {
      const note = await notesApi.quickCapture(trimmed);
      setOpen(false);
      setText('');
      // Quick capture can fire from anywhere in the app, including routes where
      // the notes store was never loaded, so pull the new note in rather than
      // splicing it into a possibly-empty map.
      void reload();
      if (then === 'open') navigate(`/notes/${note.id}`);
    } catch (err) {
      // Inline rather than a toast: quick capture is mounted at the app root,
      // where the `sonner` Toaster (mounted by `NotesLayout`) does not exist.
      // The dialog stays open so the text is not lost.
      setError(err instanceof Error ? err.message : 'Could not save the note.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      // Escape, the close button and a click outside all mean "I am done
      // typing", not "throw it away" — so every one of them saves.
      onOpenChange={(next) => {
        if (!next) void save('close');
      }}
    >
      <DialogContent
        /* Radix portals to <body>, outside `.platform` — `plat` re-declares the
           design tokens so the vars below resolve inside the portal. */
        className="plat top-[18%] max-w-xl translate-y-0 gap-4 rounded-[14px] border-[var(--line)]"
        style={{ background: 'var(--paper)' }}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="plat-display flex items-center gap-2 text-[19px] text-[var(--ink)]">
            <Plus aria-hidden className="h-4 w-4" style={{ color: 'var(--text-4)' }} /> Quick capture
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--text-4)]">
            The first line becomes the title. #tags and [[links]] are parsed on save.
          </DialogDescription>
        </DialogHeader>

        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              save('open');
            }
          }}
          placeholder="Capture a thought…"
          rows={5}
          className="w-full resize-none rounded-[10px] border border-[var(--line)] bg-[var(--sand)] p-3 text-sm text-[var(--ink)] placeholder:text-[var(--text-5)] focus-visible:border-[var(--ink)] focus-visible:outline-none"
        />

        {error && (
          <div
            className="rounded-[10px] border px-3 py-2 text-xs"
            style={{ borderColor: 'rgba(179,56,46,0.3)', background: 'rgba(179,56,46,0.06)', color: 'var(--bad-fg)' }}
          >
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-[var(--text-5)]">
            Esc saves and closes · ⌘/Ctrl+Enter saves and opens
          </span>
          <button
            data-command-exempt="submit inside the capture composer, which is the capture.quick command"
            type="button"
            onClick={() => save('open')}
            disabled={!text.trim() || saving}
            className={dialogButton.primary}
          >
            Save &amp; open
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
