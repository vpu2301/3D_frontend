import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload as UploadIcon, X, AlertTriangle, Sparkles } from 'lucide-react';
import { useDriveStore } from '@/pages/drive/_hooks/use-drive-store';
import { readFileAsDataUrl } from '@/pages/drive/_lib/storage';
import { classifyFile, formatBytes, MAX_UPLOAD_BYTES } from '@/pages/drive/_lib/fileTypes';
import { summarizeFile, suggestFileTags } from '@/pages/docs/_lib/mockAi';
import { cn } from '@/lib/utils';
import type { FileMeta } from '@/pages/drive/_lib/types';

interface ProgressEntry {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'done' | 'error' | 'too-large';
  error?: string;
  fileId?: string;
}

interface Props {
  parentId: string | null;
  /** Render the dropzone overlay over the page; when null, only the button works. */
  children: React.ReactNode;
  triggerRef?: React.MutableRefObject<(() => void) | null>;
}

export default function UploadDropzone({ parentId, children, triggerRef }: Props) {
  const createFile = useDriveStore((s) => s.createFile);
  const setSummary = useDriveStore((s) => s.setSummary);
  const setSuggestedTags = useDriveStore((s) => s.setSuggestedTags);
  const [over, setOver] = useState(false);
  const [queue, setQueue] = useState<ProgressEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropDepth = useRef(0);

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  useEffect(() => {
    if (triggerRef) triggerRef.current = openPicker;
  }, [triggerRef, openPicker]);

  // Allow the mini-rail's New → Upload menu item to trigger this picker
  useEffect(() => {
    const handler = () => openPicker();
    window.addEventListener('drive:upload', handler);
    return () => window.removeEventListener('drive:upload', handler);
  }, [openPicker]);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      const entries: ProgressEntry[] = list.map((f) => ({
        id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: f.name,
        size: f.size,
        progress: 0,
        status: 'uploading',
      }));
      setQueue((q) => [...q, ...entries]);

      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        const entry = entries[i];

        if (file.size > MAX_UPLOAD_BYTES) {
          setQueue((q) =>
            q.map((e) =>
              e.id === entry.id
                ? {
                    ...e,
                    status: 'too-large',
                    error: `Too large for mock storage (${formatBytes(file.size)} > ${formatBytes(MAX_UPLOAD_BYTES)})`,
                  }
                : e,
            ),
          );
          continue;
        }

        try {
          // Simulate upload progress — 1–3s window
          const totalMs = 1000 + Math.random() * 2000;
          const start = performance.now();
          const tick = () => {
            const elapsed = performance.now() - start;
            const pct = Math.min(95, Math.floor((elapsed / totalMs) * 100));
            setQueue((q) => q.map((e) => (e.id === entry.id ? { ...e, progress: pct } : e)));
            if (elapsed < totalMs && entry.status === 'uploading') {
              requestAnimationFrame(tick);
            }
          };
          requestAnimationFrame(tick);

          const dataUrl = await readFileAsDataUrl(file);
          await new Promise((r) => setTimeout(r, Math.max(0, totalMs - (performance.now() - start))));

          const driveFile = await createFile(
            file.name,
            parentId,
            {
              mimeType: file.type || undefined,
              size: file.size,
            },
            dataUrl,
          );
          setQueue((q) =>
            q.map((e) => (e.id === entry.id ? { ...e, progress: 100, status: 'done', fileId: driveFile.id } : e)),
          );

          // Async post-processing: summary + suggested tags (auto-summary toggle defaults on)
          const fileMeta: FileMeta & { extractedText?: string } = {
            id: driveFile.id,
            name: driveFile.name,
            kind: classifyFile(driveFile),
            size: driveFile.size ?? 0,
            tags: driveFile.tags,
            parentId: driveFile.parentId,
            updatedAt: driveFile.updatedAt,
            ownerId: driveFile.ownerId,
            extractedText: undefined,
          };
          // Fire-and-forget; mock AI may fail (silently OK)
          (async () => {
            try {
              const sum = await summarizeFile(fileMeta);
              await setSummary(driveFile.id, sum);
            } catch {
              /* mock failure */
            }
          })();
          (async () => {
            try {
              const tags = await suggestFileTags(fileMeta, driveFile.tags);
              if (tags.length) await setSuggestedTags(driveFile.id, tags);
            } catch {
              /* mock failure */
            }
          })();
        } catch (e: any) {
          setQueue((q) =>
            q.map((x) =>
              x.id === entry.id ? { ...x, status: 'error', error: e?.message ?? 'Upload failed' } : x,
            ),
          );
        }
      }

      // Auto-clear completed entries after a delay
      setTimeout(() => {
        setQueue((q) => q.filter((e) => e.status === 'uploading'));
      }, 4000);
    },
    [createFile, parentId, setSummary, setSuggestedTags],
  );

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        dropDepth.current += 1;
        setOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        dropDepth.current = Math.max(0, dropDepth.current - 1);
        if (dropDepth.current === 0) setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        dropDepth.current = 0;
        setOver(false);
        if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
      }}
      className="relative flex flex-1 flex-col overflow-hidden"
    >
      {children}

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) upload(e.target.files);
          e.currentTarget.value = '';
        }}
      />

      {over && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[rgba(20,22,26,0.06)] backdrop-blur-sm">
          <div className="rounded-[12px] border border-dashed border-[var(--ink)] bg-white px-6 py-4 text-sm font-semibold text-[var(--ink)] shadow-lg">
            <UploadIcon className="mb-1 inline-block h-4 w-4" /> Drop files here to upload
          </div>
        </div>
      )}

      {queue.length > 0 && (
        <div className="absolute bottom-4 right-4 z-40 w-80 rounded-[14px] border border-[var(--line-soft)] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-3.5 py-2.5">
            <div className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--ink)]">
              <UploadIcon className="h-4 w-4" />
              {queue.filter((e) => e.status === 'uploading').length > 0
                ? `Uploading ${queue.filter((e) => e.status === 'uploading').length}`
                : `Uploaded ${queue.filter((e) => e.status === 'done').length}`}
            </div>
            <button
              type="button"
              onClick={() => setQueue([])}
              className="rounded-[8px] p-1 text-[var(--text-5)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="max-h-64 overflow-y-auto p-2">
            {queue.map((e) => (
              <li key={e.id} className="mb-2 last:mb-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate text-[var(--ink)]">{e.name}</span>
                  <span className="ml-2 shrink-0 text-[var(--text-4)]">{formatBytes(e.size)}</span>
                </div>
                {e.status === 'uploading' && (
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--sand-deep)]">
                    <div
                      className="h-full bg-[var(--ink)] transition-[width] duration-150"
                      style={{ width: `${e.progress}%` }}
                    />
                  </div>
                )}
                {e.status === 'done' && (
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--ok-fg)]">
                    <Sparkles className="h-3 w-3" />
                    Summarizing & tagging…
                  </div>
                )}
                {e.status === 'too-large' && (
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--bad-fg)]">
                    <AlertTriangle className="h-3 w-3" />
                    {e.error}
                  </div>
                )}
                {e.status === 'error' && (
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--bad-fg)]">
                    <AlertTriangle className="h-3 w-3" />
                    {e.error ?? 'Upload failed'}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
