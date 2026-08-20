import { useNavigate } from 'react-router-dom';
import { FileText, MoreVertical, Star, Trash2, Copy, Users } from 'lucide-react';
import { useState } from 'react';
import type { Doc } from '@/pages/docs/_lib/types';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';
import { toPlainText } from '@/pages/docs/_lib/export';
import { cn } from '@/lib/utils';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DocCard({ doc }: { doc: Doc }) {
  const star = useDocsStore((s) => s.starDoc);
  const trash = useDocsStore((s) => s.trashDoc);
  const dup = useDocsStore((s) => s.duplicateDoc);
  const { selectedDocIds, toggleSelected } = useDocsUiStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const selected = selectedDocIds.includes(doc.id);
  const preview = toPlainText(doc.content);
  const navigate = useNavigate();

  const open = () => navigate(`/docs/${doc.id}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/doc-id', doc.id)}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-[14px] border bg-white text-left transition-colors hover:border-[var(--line)]',
        selected ? 'border-[var(--ink)]' : 'border-[var(--line-soft)]',
      )}
    >
      {/* Preview area — first-page mini render */}
      <div className="relative aspect-[3/4] overflow-hidden border-b border-[var(--line-soft)] bg-white">
        {doc.cover && (
          <img
            src={doc.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="px-4 py-3">
          {(() => {
            const lines = preview.split('\n').filter(Boolean).slice(0, 14);
            if (lines.length === 0) {
              return (
                <div className="text-[9px] italic text-[var(--text-5)]">Empty document</div>
              );
            }
            return (
              <div className="space-y-1.5">
                <div className="text-[10px] font-semibold leading-tight text-[var(--ink)] line-clamp-2">
                  {lines[0]}
                </div>
                {lines.slice(1).map((line, i) => (
                  <div
                    key={i}
                    className="text-[8px] leading-tight text-[var(--text-4)] line-clamp-1"
                  >
                    {line}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Footer strip */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <FileText className="h-4 w-4 shrink-0 text-[var(--text-4)]" />
        {doc.shared && <Users className="h-3.5 w-3.5 shrink-0 text-[var(--text-5)]" />}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-[var(--ink)]">
            {doc.icon && <span className="mr-1">{doc.icon}</span>}
            {doc.title || 'Untitled document'}
          </div>
          <div className="text-[11px] text-[var(--text-4)]">
            Opened {formatDate(doc.updatedAt)}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          className="shrink-0 rounded-[8px] p-1 text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
          aria-label="More actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Selection checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSelected(doc.id);
        }}
        className={cn(
          'absolute left-2 top-2 z-10 h-4 w-4 rounded-[4px] border bg-white transition-opacity',
          selected
            ? 'border-[var(--ink)] bg-[var(--ink)] opacity-100'
            : 'border-[var(--line)] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto',
        )}
        aria-label={selected ? 'Deselect' : 'Select'}
      >
        {selected && (
          <svg viewBox="0 0 16 16" className="h-full w-full fill-white">
            <path d="M6.5 11.5L3 8l1-1 2.5 2.5L11.5 4.5l1 1z" />
          </svg>
        )}
      </button>

      {/* Hover star */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          star(doc.id, !doc.starred);
        }}
        className={cn(
          'absolute right-1.5 top-1.5 z-10 rounded-[8px] bg-white/90 p-1 backdrop-blur transition-opacity hover:bg-[rgba(20,22,26,0.06)]',
          doc.starred
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto',
        )}
        aria-label={doc.starred ? 'Unstar' : 'Star'}
      >
        <Star
          className={cn(
            'h-3.5 w-3.5',
            doc.starred ? 'fill-[var(--ink)] text-[var(--ink)]' : 'text-[var(--text-4)]',
          )}
        />
      </button>

      {menuOpen && (
        <div
          className="absolute bottom-9 right-2 z-20 w-44 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-[0_8px_24px_rgba(20,22,26,0.1)]"
          onClick={(e) => e.stopPropagation()}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen(false);
              dup(doc.id);
            }}
            className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          >
            <Copy className="h-3.5 w-3.5" /> Make a copy
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen(false);
              star(doc.id, !doc.starred);
            }}
            className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          >
            <Star className="h-3.5 w-3.5" />{' '}
            {doc.starred ? 'Remove star' : 'Add to starred'}
          </button>
          <div className="my-1 border-t border-[var(--line-soft)]" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen(false);
              trash(doc.id);
            }}
            className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-sm text-[var(--bad-fg)] hover:bg-[rgba(179,56,46,0.07)]"
          >
            <Trash2 className="h-3.5 w-3.5" /> Move to trash
          </button>
        </div>
      )}
    </div>
  );
}
