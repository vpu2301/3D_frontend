import { useNavigate } from 'react-router-dom';
import { CalendarClock, ClipboardList, FileText, PenLine, CalendarRange, X } from 'lucide-react';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';
import { TEMPLATES } from '@/pages/docs/_lib/seed';
import type { DocTemplate } from '@/pages/docs/_lib/types';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  CalendarClock,
  ClipboardList,
  PenLine,
  CalendarRange,
};

export default function TemplatesModal() {
  const { templatesOpen, setTemplatesOpen, selectedFolderId } = useDocsUiStore();
  const createDoc = useDocsStore((s) => s.createDoc);
  const navigate = useNavigate();

  if (!templatesOpen) return null;

  const onPick = async (t: DocTemplate) => {
    const doc = await createDoc({
      title: t.id === 'blank' ? 'Untitled' : t.name,
      content: t.content,
      folderId: selectedFolderId,
    });
    setTemplatesOpen(false);
    navigate(`/docs/${doc.id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => setTemplatesOpen(false)}
    >
      <div
        className="w-full max-w-3xl rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Start with a template</h2>
            <p className="text-sm text-zinc-500">Pick a starting point. You can customize anything.</p>
          </div>
          <button
            type="button"
            onClick={() => setTemplatesOpen(false)}
            className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => {
            const Icon = ICONS[t.icon] ?? FileText;
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => onPick(t)}
                className="flex flex-col items-start gap-2 rounded-lg border border-zinc-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-zinc-500">{t.description}</div>
                {t.suggestedPrompts.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {t.suggestedPrompts.slice(0, 1).map((p) => (
                      <span
                        key={p}
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        ✨ {p}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
