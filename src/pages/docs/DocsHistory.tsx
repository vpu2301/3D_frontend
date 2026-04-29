import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import DocsLayout from '@/pages/docs/_components/shared/DocsLayout';
import DiffView from '@/pages/docs/_components/ai/DiffView';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { toPlainText } from '@/pages/docs/_lib/export';

export default function DocsHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const load = useDocsStore((s) => s.load);
  const docs = useDocsStore((s) => s.docs);
  const restoreSnapshot = useDocsStore((s) => s.restoreSnapshot);

  useEffect(() => {
    load();
  }, [load]);

  const doc = id ? docs[id] : undefined;
  const [selected, setSelected] = useState<string | null>(null);

  const currentText = useMemo(() => (doc ? toPlainText(doc.content) : ''), [doc]);
  const snap = doc?.snapshots.find((s) => s.id === selected) ?? doc?.snapshots[0];
  const snapText = useMemo(() => (snap ? toPlainText(snap.content) : ''), [snap]);

  if (!doc) {
    return (
      <DocsLayout>
        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
          Document not found.
        </div>
      </DocsLayout>
    );
  }

  return (
    <DocsLayout>
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <Link
              to={`/docs/${doc.id}`}
              className="rounded-md p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl font-semibold">Version history</h1>
            <span className="text-sm text-zinc-500">— {doc.title}</span>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 shrink-0 overflow-y-auto border-r border-zinc-200 dark:border-zinc-800">
            {doc.snapshots.length === 0 ? (
              <div className="p-4 text-sm text-zinc-500">
                No snapshots yet — they're taken every 2 minutes while you edit, or when you press Cmd/Ctrl+S.
              </div>
            ) : (
              <ul>
                {doc.snapshots.map((s, i) => {
                  const active = (selected ?? doc.snapshots[0].id) === s.id;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(s.id)}
                        className={`block w-full border-b border-zinc-100 px-4 py-3 text-left text-sm dark:border-zinc-800 ${
                          active
                            ? 'bg-blue-50 dark:bg-blue-950/30'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
                        }`}
                      >
                        <div className="font-medium">
                          {i === 0 ? 'Latest snapshot' : `Snapshot ${doc.snapshots.length - i}`}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {new Date(s.takenAt).toLocaleString()}
                        </div>
                        <div className="text-[11px] text-zinc-400">{s.wordCount} words</div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
          <div className="flex flex-1 flex-col">
            {snap ? (
              <>
                <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
                  <div className="text-sm">
                    <span className="font-medium">{new Date(snap.takenAt).toLocaleString()}</span>
                    <span className="ml-2 text-zinc-500">vs. current</span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm('Replace current document with this snapshot?')) return;
                      await restoreSnapshot(doc.id, snap.id);
                      navigate(`/docs/${doc.id}`);
                    }}
                    className="flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
                  >
                    <RotateCcw className="h-4 w-4" /> Restore this version
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <DiffView before={snapText} after={currentText} />
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
                Select a snapshot to view the diff.
              </div>
            )}
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
