import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Star,
  Share2,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  FileText,
  StickyNote,
} from 'lucide-react';
import type { DriveItem, FileMeta } from '@/pages/drive/_lib/types';
import { useDriveStore, selectItemsMap } from '@/pages/drive/_hooks/use-drive-store';
import { useDriveUiStore } from '@/pages/drive/_hooks/use-drive-ui-store';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { classifyFile, fileKindIcon, fileKindColor, formatBytes } from '@/pages/drive/_lib/fileTypes';
import { askAboutFile } from '@/pages/docs/_lib/mockAi';
import PreviewBody from './PreviewBody';
import { cn } from '@/lib/utils';

interface Props {
  itemId: string;
  /** Sibling ids in the current view, for keyboard nav. */
  siblings: string[];
  onClose: () => void;
}

export default function FilePreview({ itemId, siblings, onClose }: Props) {
  const itemsMap = useDriveStore(selectItemsMap);
  const item = itemsMap[itemId];
  const star = useDriveStore((s) => s.toggleStar);
  const trash = useDriveStore((s) => s.trash);
  const getBlob = useDriveStore((s) => s.getBlob);
  const navigate = useNavigate();
  const { setShareTargetId, previewTab, setPreviewTab, setPreviewId } = useDriveUiStore();

  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (item?.blobKey) {
      getBlob(item.blobKey).then((url) => {
        if (!cancelled) setBlobUrl(url ?? null);
      });
    } else {
      setBlobUrl(null);
    }
    return () => {
      cancelled = true;
    };
  }, [item?.blobKey, getBlob]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') {
        const idx = siblings.indexOf(itemId);
        if (idx >= 0 && idx < siblings.length - 1) setPreviewId(siblings[idx + 1]);
      } else if (e.key === 'ArrowLeft') {
        const idx = siblings.indexOf(itemId);
        if (idx > 0) setPreviewId(siblings[idx - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [itemId, siblings, setPreviewId, onClose]);

  if (!item) return null;
  const kind = classifyFile(item);
  const Icon = fileKindIcon(kind);

  const onDownload = () => {
    if (!blobUrl) {
      alert('Preview-only — no blob attached.');
      return;
    }
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const openInSourceModule = () => {
    if (item.sourceModule === 'docs' && item.sourceId) {
      navigate(`/docs/${item.sourceId}`);
    } else if (item.sourceModule === 'notes' && item.sourceId) {
      navigate(`/notes/${item.sourceId}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="m-auto flex h-[90vh] w-[95vw] max-w-7xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Icon className={cn('h-4 w-4', fileKindColor(kind))} />
            <span className="truncate text-sm font-medium text-gray-900">{item.name}</span>
            {item.starred && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />}
          </div>
          <div className="flex items-center gap-1">
            {item.sourceModule && (
              <button
                type="button"
                onClick={openInSourceModule}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open in {item.sourceModule === 'docs' ? 'Docs' : 'Notes'}
              </button>
            )}
            <button
              type="button"
              onClick={() => star(item.id)}
              className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
              aria-label={item.starred ? 'Unstar' : 'Star'}
            >
              <Star className={cn('h-4 w-4', item.starred && 'fill-yellow-400 text-yellow-400')} />
            </button>
            <button
              type="button"
              onClick={() => setShareTargetId(item.id)}
              className="flex items-center gap-1 rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="flex items-center gap-1 rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
              aria-label="Download"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Move "${item.name}" to trash?`)) {
                  trash(item.id);
                  onClose();
                }
              }}
              className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
              aria-label="Trash"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="mx-1 h-5 w-px bg-gray-200" />
            <button
              type="button"
              onClick={() => {
                const idx = siblings.indexOf(itemId);
                if (idx > 0) setPreviewId(siblings[idx - 1]);
              }}
              className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const idx = siblings.indexOf(itemId);
                if (idx < siblings.length - 1) setPreviewId(siblings[idx + 1]);
              }}
              className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Body */}
          <div className="flex flex-1 items-stretch overflow-auto bg-gray-50">
            <PreviewBody item={item} blobUrl={blobUrl} />
          </div>

          {/* Right rail */}
          <aside className="flex w-80 shrink-0 flex-col border-l border-gray-200 bg-white">
            <div className="flex border-b border-gray-200 text-xs">
              {(['details', 'activity', 'ai'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPreviewTab(t)}
                  className={cn(
                    'flex-1 px-3 py-2 capitalize transition-colors',
                    previewTab === t ? 'border-b-2 border-blue-500 font-medium text-gray-900' : 'text-gray-500 hover:bg-gray-50',
                  )}
                >
                  {t === 'ai' ? (
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> AI
                    </span>
                  ) : (
                    t
                  )}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {previewTab === 'details' && <DetailsPanel item={item} />}
              {previewTab === 'activity' && <ActivityPanel item={item} />}
              {previewTab === 'ai' && <AskAboutFile item={item} />}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DetailsPanel({ item }: { item: DriveItem }) {
  const itemsMap = useDriveStore(selectItemsMap);
  const docs = useDocsStore((s) => s.docs);
  const notes = useNotesStore((s) => s.notes);

  // Linked-from: which docs/notes/events reference this file
  const linkedFromNotes = Object.values(notes).filter((n) =>
    (n.links ?? []).some((l) => l.targetId === item.id),
  );

  const folder = item.parentId ? itemsMap[item.parentId] : null;

  return (
    <div className="space-y-4 text-sm">
      <Section label="Name">{item.name}</Section>
      <Section label="Type">{item.type === 'folder' ? 'Folder' : (item.mimeType ?? '—')}</Section>
      {item.type === 'file' && <Section label="Size">{formatBytes(item.size)}</Section>}
      <Section label="Location">{folder ? folder.name : 'My Drive'}</Section>
      <Section label="Created">{new Date(item.createdAt).toLocaleString()}</Section>
      <Section label="Modified">{new Date(item.updatedAt).toLocaleString()}</Section>
      {item.tags.length > 0 && (
        <Section label="Tags">
          <div className="flex flex-wrap gap-1">
            {item.tags.map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
                #{t}
              </span>
            ))}
          </div>
        </Section>
      )}
      {item.sharedWith.length > 0 && (
        <Section label="Shared with">
          <ul className="space-y-0.5 text-xs">
            {item.sharedWith.map((p) => (
              <li key={p.userId} className="flex items-center justify-between">
                <span>{p.userId}</span>
                <span className="text-gray-500">{p.role}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {linkedFromNotes.length > 0 && (
        <Section label="Linked from">
          <ul className="space-y-1">
            {linkedFromNotes.map((n) => (
              <li key={n.id} className="flex items-center gap-1.5 text-xs text-gray-700">
                <StickyNote className="h-3 w-3 text-amber-500" />
                <span className="truncate">{n.title || 'Untitled note'}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {item.versions && item.versions.length > 0 && (
        <Section label={`Versions (${item.versions.length})`}>
          <ul className="space-y-1 text-xs">
            {item.versions.map((v) => (
              <li key={v.id} className="flex items-center justify-between">
                <span>{new Date(v.uploadedAt).toLocaleString()}</span>
                <span className="text-gray-500">{formatBytes(v.size)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  );
}

function ActivityPanel({ item }: { item: DriveItem }) {
  const activity = item.activity ?? [];
  if (!activity.length) {
    return <div className="text-xs italic text-gray-500">No activity recorded yet.</div>;
  }
  return (
    <ul className="space-y-2">
      {activity.map((a) => (
        <li key={a.id} className="flex items-start gap-2 text-xs">
          <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
          <div className="min-w-0 flex-1">
            <div className="text-gray-900">
              <span className="font-medium">{a.by}</span> {a.kind}
            </div>
            <div className="text-[10px] text-gray-500">{new Date(a.at).toLocaleString()}</div>
            {a.detail && <div className="text-[11px] text-gray-600">{a.detail}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}

function AskAboutFile({ item }: { item: DriveItem }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const meta: FileMeta & { extractedText?: string } = {
    id: item.id,
    name: item.name,
    kind: classifyFile(item),
    size: item.size ?? 0,
    tags: item.tags,
    parentId: item.parentId,
    updatedAt: item.updatedAt,
    ownerId: item.ownerId,
    extractedText: item.extractedText,
  };

  const ask = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input.trim() };
    setMessages((m) => [...m, userMsg, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);
    let acc = '';
    try {
      for await (const chunk of askAboutFile(userMsg.content, meta as any)) {
        acc += chunk.chunk;
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = { role: 'assistant', content: acc };
          return next;
        });
      }
    } catch {
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = { role: 'assistant', content: '⚠️ Mock AI failed.' };
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {item.summary?.extended && (
        <div className="mb-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-xs leading-relaxed text-blue-900">
          <div className="mb-1 flex items-center gap-1 font-medium">
            <Sparkles className="h-3 w-3" /> AI summary
          </div>
          <div className="whitespace-pre-wrap">{item.summary.extended}</div>
        </div>
      )}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-600">
            Ask anything about this file. Mock AI will stream a plausible answer with citations.
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                'rounded-md px-2.5 py-2 text-xs',
                m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900',
              )}
            >
              <div className="whitespace-pre-wrap">{m.content || (m.role === 'assistant' ? 'Thinking…' : '')}</div>
            </div>
          ))
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
        className="mt-2"
      >
        <div className="flex items-center gap-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this file…"
            className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Ask
          </button>
        </div>
      </form>
    </div>
  );
}
