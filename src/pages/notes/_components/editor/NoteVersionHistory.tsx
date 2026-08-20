/**
 * Version history (Sprint 1 §6.7).
 *
 * Versions are append-only server-side: the 300 ms autosave coalesces into
 * roughly one version per minute, and blur/route change forces a checkpoint, so
 * this list is a session's restore points rather than a keystroke log.
 *
 * Restoring does not rewind history — it appends the old content as a new
 * version, so the restore itself is undoable.
 */

import { useCallback, useEffect, useState } from 'react';
import { History, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notesApi } from '@/pages/notes/_lib/apiClient';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import type { components } from '@/pages/notes/_lib/api-types';
import { cn } from '@/lib/utils';

type VersionSummary = components['schemas']['VersionSummaryOut'];

interface Props {
  noteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatWhen(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} kB`;
}

export default function NoteVersionHistory({ noteId, open, onOpenChange }: Props) {
  const refreshNote = useNotesStore((s) => s.refreshNote);
  const [versions, setVersions] = useState<VersionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [restoring, setRestoring] = useState<number | null>(null);

  const loadVersions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVersions(await notesApi.versions(noteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load history.');
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setPreview('');
    loadVersions();
  }, [open, loadVersions]);

  const onPreview = async (version: number) => {
    setSelected(version);
    setPreviewLoading(true);
    try {
      // `contentMd` rather than the TipTap JSON: a preview wants text, and the
      // server already renders the Markdown it exports.
      const detail = await notesApi.version(noteId, version);
      setPreview(detail.contentMd);
    } catch {
      setPreview('Could not load this version.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const onRestore = async (version: number) => {
    setRestoring(version);
    try {
      await notesApi.restoreVersion(noteId, version);
      await refreshNote(noteId);
      await loadVersions();
      toast.success(`Restored version ${version}`, {
        description: 'The previous content is still in history.',
      });
      onOpenChange(false);
    } catch (err) {
      toast.error('Could not restore that version', {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setRestoring(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        /* Radix portals to <body>, outside `.platform` — `plat` re-declares the
           tokens; the inline background suppresses its ambient gradient. */
        className="plat flex w-full flex-col gap-0 border-[var(--line)] sm:max-w-md"
        style={{ background: 'var(--paper)' }}
      >
        <SheetHeader className="pb-3 text-left">
          <SheetTitle className="flex items-center gap-2 font-display text-xl text-[#14161a]">
            <History aria-hidden className="h-4 w-4 text-[#7a8087]" /> Version history
          </SheetTitle>
          <SheetDescription className="text-xs text-[#9aa0a6]">
            Autosaves are coalesced; each entry is a restore point.
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-[#7a8087]">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading history…
          </div>
        ) : error ? (
          <div className="rounded-[12px] border border-[rgba(179,56,46,0.25)] bg-[#fdf3f2] p-3 text-sm text-[#b3382e]">
            {error}
          </div>
        ) : versions.length === 0 ? (
          <p className="py-8 text-sm text-[#7a8087]">
            No saved versions yet. Keep writing — one appears within a minute.
          </p>
        ) : (
          <ScrollArea className="-mx-2 flex-1 px-2">
            <ul className="mb-4 overflow-hidden rounded-[14px] border border-[var(--line-soft)]">
              {versions.map((v) => (
                <li key={v.version}>
                  <div
                    className={cn(
                      'border-b border-[var(--line-soft)] p-3 transition-colors last:border-b-0',
                      selected === v.version
                        ? 'bg-[rgba(20,22,26,0.05)]'
                        : 'hover:bg-[rgba(20,22,26,0.03)]',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <button
            data-command-exempt="preview and restore inside the history sheet, which is itself the note.history command"
                        type="button"
                        onClick={() => onPreview(v.version)}
                        className="flex min-w-0 flex-1 flex-col items-start text-left"
                      >
                        <span className="text-sm font-medium text-[#14161a]">
                          Version {v.version}
                        </span>
                        <span className="text-[11px] text-[#7a8087]">
                          {formatWhen(v.createdAt)} · {formatSize(v.sizeBytes)}
                        </span>
                      </button>
                      <button
            data-command-exempt="preview and restore inside the history sheet, which is itself the note.history command"
                        type="button"
                        onClick={() => onRestore(v.version)}
                        disabled={restoring !== null}
                        className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[#5a6067] transition-colors hover:border-[var(--ink)] hover:text-[#14161a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,22,26,0.15)] disabled:opacity-50"
                      >
                        {restoring === v.version ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3 w-3" />
                        )}
                        Restore
                      </button>
                    </div>

                    {selected === v.version && (
                      <div className="mt-2 rounded-[10px] border border-[var(--line-soft)] bg-white p-2">
                        {previewLoading ? (
                          <span className="text-xs text-[#7a8087]">Loading preview…</span>
                        ) : (
                          <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words font-sans text-[11px] leading-relaxed text-[#5a6067]">
                            {preview || '(empty)'}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
