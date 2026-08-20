import {
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Code2,
  Archive,
  FileType,
  StickyNote,
  Folder,
  File as FileIcon,
} from 'lucide-react';
import type { FileKind, DriveItem } from './types';

/** Map a mime type (or sourceModule) to a normalized FileKind. */
export function classifyFile(item: Pick<DriveItem, 'mimeType' | 'name' | 'sourceModule'>): FileKind {
  if (item.sourceModule === 'docs') return 'doc';
  if (item.sourceModule === 'notes') return 'note';
  const mime = (item.mimeType ?? '').toLowerCase();
  const name = (item.name ?? '').toLowerCase();

  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (mime === 'text/markdown' || name.endsWith('.md') || name.endsWith('.markdown')) return 'markdown';
  if (
    mime === 'application/zip' ||
    name.endsWith('.zip') ||
    name.endsWith('.tar') ||
    name.endsWith('.tar.gz') ||
    name.endsWith('.tgz')
  )
    return 'archive';
  if (
    /\.(docx?|xlsx?|pptx?|odt|ods|odp)$/i.test(name) ||
    mime.includes('officedocument') ||
    mime.includes('msword')
  )
    return 'office';
  if (
    /\.(ts|tsx|js|jsx|mjs|cjs|py|rb|go|rs|java|c|cpp|cs|kt|swift|sh|sql|css|scss|html?|json|xml|yaml|yml|toml)$/i.test(
      name,
    )
  )
    return 'code';
  if (mime.startsWith('text/')) return 'text';
  return 'other';
}

export function fileKindIcon(kind: FileKind): React.ComponentType<{ className?: string }> {
  switch (kind) {
    case 'image':
      return ImageIcon;
    case 'video':
      return Video;
    case 'audio':
      return Music;
    case 'pdf':
      return FileType;
    case 'markdown':
    case 'text':
      return FileText;
    case 'code':
      return Code2;
    case 'archive':
      return Archive;
    case 'office':
      return FileType;
    case 'doc':
      return FileText;
    case 'note':
      return StickyNote;
    default:
      return FileIcon;
  }
}

export function folderIcon() {
  return Folder;
}

/**
 * Tailwind text color for a file kind icon.
 *
 * Deliberately desaturated: the platform surface is neutral, so file-type
 * coding survives only as a low-chroma hint, never as a colour accent.
 */
export function fileKindColor(kind: FileKind): string {
  switch (kind) {
    case 'image':
      return 'text-rose-400/80';
    case 'video':
      return 'text-violet-400/80';
    case 'audio':
      return 'text-indigo-400/80';
    case 'pdf':
      return 'text-red-400/80';
    case 'markdown':
      return 'text-emerald-500/70';
    case 'text':
      return 'text-[var(--text-4)]';
    case 'code':
      return 'text-amber-500/80';
    case 'archive':
      return 'text-amber-600/70';
    case 'office':
      return 'text-blue-500/70';
    case 'doc':
      return 'text-blue-400/80';
    case 'note':
      return 'text-amber-400/80';
    default:
      return 'text-[var(--text-5)]';
  }
}

export function formatBytes(bytes: number | undefined): string {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/** Human-readable file kind labels for filter dropdowns. */
export const FILE_KIND_LABELS: Record<FileKind, string> = {
  image: 'Images',
  video: 'Videos',
  audio: 'Audio',
  pdf: 'PDFs',
  text: 'Text',
  markdown: 'Markdown',
  code: 'Code',
  archive: 'Archives',
  office: 'Office',
  doc: 'Docs',
  note: 'Notes',
  other: 'Other',
};

/** Soft cap on per-file blob size in mock mode (5 MB). */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Mock total storage budget (15 GB). */
export const MOCK_STORAGE_BUDGET = 15 * 1024 * 1024 * 1024;
