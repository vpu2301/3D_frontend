import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import DriveLayout from '@/pages/drive/_components/shared/DriveLayout';
import DriveMiniRail from '@/pages/drive/_components/sidebar/DriveMiniRail';
import DriveToolbar from '@/pages/drive/_components/list/DriveToolbar';
import Breadcrumb from '@/pages/drive/_components/list/Breadcrumb';
import FileCard from '@/pages/drive/_components/list/FileCard';
import FileRow from '@/pages/drive/_components/list/FileRow';
import UploadDropzone from '@/pages/drive/_components/upload/UploadDropzone';
import FilePreview from '@/pages/drive/_components/preview/FilePreview';
import DriveAiSidebar from '@/pages/drive/_components/ai/DriveAiSidebar';
import { useDriveStore, selectItemsMap } from '@/pages/drive/_hooks/use-drive-store';
import { useDriveUiStore } from '@/pages/drive/_hooks/use-drive-ui-store';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { classifyFile } from '@/pages/drive/_lib/fileTypes';
import type { DriveItem } from '@/pages/drive/_lib/types';
import { cn } from '@/lib/utils';

type ViewKind = 'folder' | 'recent' | 'starred' | 'shared' | 'all';

export default function DriveHome() {
  const load = useDriveStore((s) => s.load);
  const docsLoad = useDocsStore((s) => s.load);
  const notesLoad = useNotesStore((s) => s.load);
  const itemsMap = useDriveStore(selectItemsMap);
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const location = useLocation();
  const {
    viewMode, sortBy, sortDir, filter, query, semanticMode,
    previewId, setPreviewId, driveAiOpen,
  } = useDriveUiStore();

  const uploadTriggerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    load();
    docsLoad();
    notesLoad();
  }, [load, docsLoad, notesLoad]);

  // Resolve which view we're on from the URL
  const { kind, folderId } = useMemo<{ kind: ViewKind; folderId: string | null }>(() => {
    const path = location.pathname;
    if (path === '/drive/recent') return { kind: 'recent', folderId: null };
    if (path === '/drive/starred') return { kind: 'starred', folderId: null };
    if (path === '/drive/shared') return { kind: 'shared', folderId: null };
    if (path.startsWith('/drive/folder/') && params.id) return { kind: 'folder', folderId: params.id };
    if (path.startsWith('/drive/file/') && params.id) {
      // File preview deep-link — open the preview, scope view to the file's folder.
      const file = itemsMap[params.id];
      return { kind: 'folder', folderId: file?.parentId ?? 'drive_root' };
    }
    return { kind: 'folder', folderId: 'drive_root' };
  }, [location.pathname, params.id, itemsMap]);

  // Open file preview if URL deep-links to one
  useEffect(() => {
    if (location.pathname.startsWith('/drive/file/') && params.id) {
      setPreviewId(params.id);
    }
  }, [location.pathname, params.id, setPreviewId]);

  const items = Object.values(itemsMap);

  const visible: DriveItem[] = useMemo(() => {
    let arr = items.filter((i) => !i.trashed);

    if (kind === 'folder') {
      arr = arr.filter((i) => i.parentId === folderId);
    } else if (kind === 'recent') {
      arr = arr.filter((i) => i.type === 'file').sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 50);
    } else if (kind === 'starred') {
      arr = arr.filter((i) => i.starred);
    } else if (kind === 'shared') {
      arr = arr.filter((i) => i.sharedWith.length > 0);
    }

    // Filters
    if (filter.kind) {
      arr = arr.filter((i) => i.type === 'file' && classifyFile(i) === filter.kind);
    }
    if (filter.starred) arr = arr.filter((i) => i.starred);
    if (filter.tag) arr = arr.filter((i) => i.tags.includes(filter.tag!));

    // Keyword query — keyword fallback when query is short or non-natural
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)) ||
          (i.summary?.oneLine ?? '').toLowerCase().includes(q),
      );
    }

    // Sort — folders first
    const folders = arr.filter((i) => i.type === 'folder');
    const files = arr.filter((i) => i.type === 'file');
    const cmp = (a: DriveItem, b: DriveItem) => {
      let v = 0;
      switch (sortBy) {
        case 'name':
          v = a.name.localeCompare(b.name);
          break;
        case 'modified':
          v = b.updatedAt - a.updatedAt;
          break;
        case 'created':
          v = b.createdAt - a.createdAt;
          break;
        case 'size':
          v = (b.size ?? 0) - (a.size ?? 0);
          break;
        case 'type':
          v = (a.mimeType ?? '').localeCompare(b.mimeType ?? '');
          break;
      }
      return sortDir === 'asc' ? -v : v;
    };
    folders.sort(cmp);
    files.sort(cmp);
    return [...folders, ...files];
  }, [items, kind, folderId, filter, query, sortBy, sortDir]);

  const onOpen = (item: DriveItem) => {
    if (item.type === 'folder') {
      navigate(`/drive/folder/${item.id}`);
    } else {
      setPreviewId(item.id);
    }
  };

  // Cmd+J — toggle Ask across Drive
  const setDriveAiOpen = useDriveUiStore((s) => s.setDriveAiOpen);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setDriveAiOpen(!driveAiOpen);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [driveAiOpen, setDriveAiOpen]);

  // Slash to focus search — DriveToolbar's input is the only search input on the page.
  // We don't grab focus globally to avoid stealing keystrokes from text inputs.

  const heading = useMemo(() => {
    if (kind === 'recent') return 'Recent';
    if (kind === 'starred') return 'Starred';
    if (kind === 'shared') return 'Shared with me';
    if (kind === 'folder' && folderId && folderId !== 'drive_root') {
      return itemsMap[folderId]?.name ?? 'Folder';
    }
    return 'My Drive';
  }, [kind, folderId, itemsMap]);

  const fileSiblings = useMemo(() => visible.filter((i) => i.type === 'file').map((i) => i.id), [visible]);

  return (
    <DriveLayout>
      <div className="flex flex-1 overflow-hidden">
        <DriveMiniRail />
        <UploadDropzone parentId={folderId} triggerRef={uploadTriggerRef}>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3">
              <div>
                <Breadcrumb folderId={folderId} />
                <h1 className="mt-1 text-2xl font-light text-gray-900">
                  {heading}{' '}
                  <span className="text-gray-400">({visible.length})</span>
                </h1>
              </div>
            </div>
            <DriveToolbar
              folderId={folderId}
              onUploadClick={() => uploadTriggerRef.current?.()}
            />
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {visible.length === 0 ? (
                <EmptyState onUploadClick={() => uploadTriggerRef.current?.()} />
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                  {visible.map((item) => (
                    <FileCard key={item.id} item={item} onOpen={onOpen} />
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
                  <div className="grid grid-cols-[20px_minmax(0,2fr)_minmax(0,2fr)_120px_100px_28px] items-center gap-3 border-b border-gray-200 bg-gray-50 px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                    <span />
                    <span>Name</span>
                    <span>Summary</span>
                    <span>Modified</span>
                    <span>Size</span>
                    <span />
                  </div>
                  {visible.map((item) => (
                    <FileRow key={item.id} item={item} onOpen={onOpen} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </UploadDropzone>
        {driveAiOpen && <DriveAiSidebar />}
      </div>
      {previewId && (
        <FilePreview
          itemId={previewId}
          siblings={fileSiblings}
          onClose={() => {
            setPreviewId(null);
            if (location.pathname.startsWith('/drive/file/')) navigate('/drive', { replace: true });
          }}
        />
      )}
    </DriveLayout>
  );
}

function EmptyState({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-3 text-5xl">📂</div>
      <h3 className="text-base font-medium text-gray-900">Nothing here yet</h3>
      <p className={cn('mt-1 max-w-xs text-sm text-gray-500')}>
        Drag files anywhere on this surface, or click Upload.
      </p>
      <button
        type="button"
        onClick={onUploadClick}
        className="mt-3 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
      >
        Upload files
      </button>
    </div>
  );
}
