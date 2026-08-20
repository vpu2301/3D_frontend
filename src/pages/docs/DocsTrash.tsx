import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, RotateCcw, Trash2 } from 'lucide-react';
import DocsLayout from '@/pages/docs/_components/shared/DocsLayout';
import DocsMiniRail from '@/pages/docs/_components/sidebar/DocsMiniRail';
import { useDocsStore, selectDocsMap } from '@/pages/docs/_hooks/use-docs-store';

export default function DocsTrash() {
  const load = useDocsStore((s) => s.load);
  const docsMap = useDocsStore(selectDocsMap);
  const docs = useMemo(() => Object.values(docsMap), [docsMap]);
  const restore = useDocsStore((s) => s.restoreDoc);
  const remove = useDocsStore((s) => s.deleteDoc);

  useEffect(() => {
    load();
  }, [load]);

  const trashed = useMemo(
    () => docs.filter((d) => d.trashed).sort((a, b) => b.updatedAt - a.updatedAt),
    [docs],
  );

  return (
    <DocsLayout>
      <div className="flex flex-1 overflow-hidden">
        <DocsMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-[var(--line-soft)] px-8 pt-6 pb-4">
            <div className="plat-crumb">3days.docs</div>
            <h1 className="mt-1.5 text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
              Trash <span className="text-[var(--text-5)]">({trashed.length})</span>
            </h1>
            <p className="mt-1 text-xs text-[var(--text-4)]">Soft-deleted documents. Restore or delete forever.</p>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-5">
            {trashed.length === 0 ? (
              <div className="rounded-[14px] border border-[var(--line-soft)] bg-white py-16 text-center">
                <Trash2 className="mx-auto mb-3 h-7 w-7 text-[var(--text-5)]" />
                <p className="text-sm text-[var(--text-3)]">Trash is empty.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[14px] border border-[var(--line-soft)] bg-white">
                {trashed.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-4 border-b border-[var(--line-soft)] px-4 py-3 transition-colors last:border-0 hover:bg-[rgba(20,22,26,0.02)]"
                  >
                    <Link
                      to={`/docs/${d.id}`}
                      className="flex min-w-0 items-center gap-2.5 hover:underline"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-[var(--text-4)]" />
                      <span className="truncate text-sm font-medium text-[var(--ink)]">
                        {d.icon && <span className="mr-1">{d.icon}</span>}
                        {d.title || 'Untitled document'}
                      </span>
                      <span className="shrink-0 text-xs text-[var(--text-4)]">
                        · trashed {new Date(d.updatedAt).toLocaleDateString()}
                      </span>
                    </Link>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => restore(d.id)}
                        className="plat-btn-ghost h-8 px-3 text-[11.5px]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Permanently delete "${d.title}"?`)) remove(d.id);
                        }}
                        className="flex h-8 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-semibold text-[var(--bad-fg)] transition-colors hover:bg-[rgba(179,56,46,0.07)]"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete forever
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </DocsLayout>
  );
}
