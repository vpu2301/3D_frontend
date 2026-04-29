import { useState, useEffect } from 'react';
import { Download, Archive, FileText } from 'lucide-react';
import type { DriveItem } from '@/pages/drive/_lib/types';
import { classifyFile, fileKindIcon, fileKindColor, formatBytes } from '@/pages/drive/_lib/fileTypes';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { toHtml } from '@/pages/docs/_lib/export';
import { cn } from '@/lib/utils';

interface Props {
  item: DriveItem;
  blobUrl: string | null;
}

export default function PreviewBody({ item, blobUrl }: Props) {
  const kind = classifyFile(item);

  if (item.sourceModule === 'docs' || item.sourceModule === 'notes') {
    return <SourceModulePreview item={item} />;
  }

  if (!blobUrl) {
    if (item.extractedText && (kind === 'pdf' || kind === 'text' || kind === 'markdown' || kind === 'code')) {
      return <ExtractedTextFallback item={item} />;
    }
    if (kind === 'archive' && item.archiveManifest) {
      return <ArchivePreview item={item} />;
    }
    return <NoBlobFallback item={item} />;
  }

  switch (kind) {
    case 'image':
      return <ImagePreview src={blobUrl} alt={item.name} />;
    case 'video':
      return (
        <video
          controls
          src={blobUrl}
          className="m-auto max-h-full max-w-full"
        />
      );
    case 'audio':
      return (
        <div className="flex flex-1 items-center justify-center p-8">
          <audio controls src={blobUrl} className="w-full max-w-md" />
        </div>
      );
    case 'pdf':
      return (
        <object data={blobUrl} type="application/pdf" className="m-auto h-full w-full">
          <PdfFallback item={item} />
        </object>
      );
    case 'text':
    case 'markdown':
    case 'code':
      return <TextPreview src={blobUrl} item={item} />;
    case 'archive':
      return <ArchivePreview item={item} />;
    case 'office':
      return <OfficeFallback item={item} blobUrl={blobUrl} />;
    default:
      return <NoBlobFallback item={item} />;
  }
}

function ImagePreview({ src, alt }: { src: string; alt: string }) {
  const [scale, setScale] = useState(1);
  return (
    <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2 p-4">
      <img
        src={src}
        alt={alt}
        className="max-h-[calc(90vh-100px)] max-w-full select-none object-contain transition-transform"
        style={{ transform: `scale(${scale})` }}
      />
      <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 shadow-sm">
        <button type="button" onClick={() => setScale((s) => Math.max(0.25, s - 0.25))} className="px-1 hover:bg-gray-100">−</button>
        <span className="px-1">{Math.round(scale * 100)}%</span>
        <button type="button" onClick={() => setScale((s) => Math.min(4, s + 0.25))} className="px-1 hover:bg-gray-100">+</button>
        <button type="button" onClick={() => setScale(1)} className="ml-1 px-1 text-blue-600 hover:bg-gray-100">Fit</button>
      </div>
    </div>
  );
}

function TextPreview({ src, item }: { src: string; item: DriveItem }) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.text())
      .then((t) => {
        if (!cancelled) setText(t);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (text === null) {
    return <div className="m-auto text-sm text-gray-500">Loading…</div>;
  }
  return (
    <pre className="m-auto h-full w-full max-w-4xl overflow-auto whitespace-pre-wrap rounded-lg border border-gray-200 bg-white p-4 font-mono text-xs leading-relaxed text-gray-900">
      {text}
    </pre>
  );
}

function ExtractedTextFallback({ item }: { item: DriveItem }) {
  return (
    <div className="m-auto h-full w-full max-w-3xl overflow-auto p-8">
      <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        Showing mock-extracted text. The original {classifyFile(item)} file isn't directly previewable in this build.
      </div>
      <pre className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-white p-6 font-mono text-sm leading-relaxed text-gray-900">
        {item.extractedText}
      </pre>
    </div>
  );
}

function PdfFallback({ item }: { item: DriveItem }) {
  return <NoBlobFallback item={item} note="Inline PDF rendering is deferred — wire up react-pdf to render." />;
}

function OfficeFallback({ item, blobUrl }: { item: DriveItem; blobUrl: string }) {
  return (
    <div className="m-auto flex flex-col items-center justify-center gap-2 p-8 text-center">
      <FileText className="h-10 w-10 text-blue-500" strokeWidth={1.4} />
      <div className="text-sm font-medium text-gray-900">{item.name}</div>
      <div className="max-w-sm text-xs text-gray-500">
        Office documents aren't previewable in the mock build. Download to open in your editor.
      </div>
      <a
        href={blobUrl}
        download={item.name}
        className="mt-2 flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs hover:bg-gray-50"
      >
        <Download className="h-3.5 w-3.5" /> Download
      </a>
    </div>
  );
}

function ArchivePreview({ item }: { item: DriveItem }) {
  const manifest = item.archiveManifest ?? [];
  return (
    <div className="m-auto h-full w-full max-w-2xl overflow-auto p-8">
      <div className="mb-3 flex items-center gap-2">
        <Archive className="h-5 w-5 text-amber-600" />
        <h3 className="text-base font-medium text-gray-900">Archive contents</h3>
      </div>
      {manifest.length === 0 ? (
        <div className="text-xs italic text-gray-500">Archive manifest unavailable.</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {manifest.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gray-100 px-4 py-2 text-xs last:border-0"
            >
              <span className="truncate text-gray-900">{m.name}</span>
              <span className="text-gray-500">{formatBytes(m.size)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SourceModulePreview({ item }: { item: DriveItem }) {
  const docs = useDocsStore((s) => s.docs);
  const notes = useNotesStore((s) => s.notes);
  const doc = item.sourceModule === 'docs' && item.sourceId ? docs[item.sourceId] : null;
  const note = item.sourceModule === 'notes' && item.sourceId ? notes[item.sourceId] : null;

  const node = doc ?? note;
  if (!node) {
    return (
      <div className="m-auto p-8 text-sm text-gray-500">
        Source {item.sourceModule} item not loaded yet.
      </div>
    );
  }
  // Render TipTap JSON to read-only HTML via toHtml.
  const html = toHtml((node as any).content, item.name);
  return (
    <div className="m-auto h-full w-full max-w-3xl overflow-auto p-8">
      <div
        className="prose prose-sm prose-zinc max-w-none rounded-lg border border-gray-200 bg-white p-6"
        dangerouslySetInnerHTML={{ __html: html.replace(/^[\s\S]*?<body>|<\/body>[\s\S]*$/g, '') }}
      />
    </div>
  );
}

function NoBlobFallback({ item, note }: { item: DriveItem; note?: string }) {
  const kind = classifyFile(item);
  const Icon = fileKindIcon(kind);
  return (
    <div className="m-auto flex flex-col items-center justify-center gap-2 p-8 text-center">
      <Icon className={cn('h-12 w-12', fileKindColor(kind))} strokeWidth={1.3} />
      <div className="text-sm font-medium text-gray-900">{item.name}</div>
      <div className="text-xs text-gray-500">{formatBytes(item.size)}</div>
      <div className="max-w-sm text-xs italic text-gray-500">
        {note ?? "Preview not available — this file doesn't have an attached blob."}
      </div>
    </div>
  );
}
