import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ArrowRight } from 'lucide-react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';

/**
 * Global quick-capture composer. Mounted at the app root so it can be opened
 * from anywhere via Cmd/Ctrl+Shift+N.
 */
export default function QuickCapture() {
  const open = useNotesUiStore((s) => s.quickCaptureOpen);
  const setOpen = useNotesUiStore((s) => s.setQuickCaptureOpen);
  const createNote = useNotesStore((s) => s.createNote);
  const load = useNotesStore((s) => s.load);
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Global hotkey
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        load();
        setOpen(true);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen, load]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setText('');
    }
  }, [open]);

  if (!open) return null;

  const save = async (then?: 'open' | 'close') => {
    const trimmed = text.trim();
    if (!trimmed) {
      setOpen(false);
      return;
    }
    const lines = trimmed.split('\n').filter(Boolean);
    const content = {
      type: 'doc',
      content: lines.length
        ? lines.map((l) => ({ type: 'paragraph', content: [{ type: 'text', text: l }] }))
        : [{ type: 'paragraph' }],
    } as any;
    const note = await createNote({ content });
    setOpen(false);
    setText('');
    if (then === 'open') navigate(`/notes/${note.id}`);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/30 pt-24 backdrop-blur-sm"
      onClick={() => save('close')}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
            <Plus className="h-4 w-4 text-amber-500" /> Quick capture
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              save('open');
            } else if (e.key === 'Enter' && e.shiftKey) {
              // newline
            } else if (e.key === 'Escape') {
              save('close');
            }
          }}
          placeholder="Capture a thought… first line becomes the title."
          rows={5}
          className="w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-sm focus:border-amber-400 focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
          <span>Esc saves and closes · ⌘/Ctrl+Enter saves and opens</span>
          <button
            type="button"
            onClick={() => save('open')}
            disabled={!text.trim()}
            className="flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-600 disabled:opacity-50"
          >
            Save & open <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
