import { Link } from 'react-router-dom';
import { FileText, Star, Users, MoreVertical } from 'lucide-react';
import type { Doc } from '@/pages/docs/_lib/types';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';
import { cn } from '@/lib/utils';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DocRow({ doc }: { doc: Doc }) {
  const star = useDocsStore((s) => s.starDoc);
  const { selectedDocIds, toggleSelected } = useDocsUiStore();
  const selected = selectedDocIds.includes(doc.id);

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/doc-id', doc.id)}
      className={cn(
        'group grid grid-cols-[20px_minmax(0,1fr)_140px_140px_28px] items-center gap-3 border-b border-gray-100 px-3 py-2 text-sm transition-colors hover:bg-gray-50',
        selected && 'bg-blue-50',
      )}
    >
      <button
        type="button"
        onClick={() => toggleSelected(doc.id)}
        className={cn(
          'h-4 w-4 rounded border transition-opacity',
          selected
            ? 'border-blue-500 bg-blue-500'
            : 'border-gray-300 opacity-0 group-hover:opacity-100',
        )}
        aria-label={selected ? 'Deselect' : 'Select'}
      >
        {selected && (
          <svg viewBox="0 0 16 16" className="h-full w-full fill-white">
            <path d="M6.5 11.5L3 8l1-1 2.5 2.5L11.5 4.5l1 1z" />
          </svg>
        )}
      </button>

      <Link to={`/docs/${doc.id}`} className="flex min-w-0 items-center gap-2.5">
        <FileText className="h-4 w-4 shrink-0 text-blue-500" />
        {doc.shared && <Users className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
        <span className="truncate text-gray-900">
          {doc.icon && <span className="mr-1">{doc.icon}</span>}
          {doc.title || 'Untitled document'}
        </span>
        {doc.starred && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />}
      </Link>

      <div className="text-xs text-gray-500">You</div>

      <div className="text-xs text-gray-500">{formatDate(doc.updatedAt)}</div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          star(doc.id, !doc.starred);
        }}
        className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
        aria-label="More"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  );
}
