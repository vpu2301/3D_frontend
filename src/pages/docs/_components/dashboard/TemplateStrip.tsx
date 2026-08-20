import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { TEMPLATES } from '@/pages/docs/_lib/seed';
import type { DocTemplate } from '@/pages/docs/_lib/types';

interface TemplatePreviewProps {
  template: DocTemplate;
}

function TemplatePreview({ template }: TemplatePreviewProps) {
  if (template.id === 'blank') {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <Plus className="h-10 w-10 text-[var(--text-4)]" strokeWidth={1.5} />
      </div>
    );
  }

  // Render a small fake page based on the template's first child
  const node = (template.content.content ?? [])[0];
  const headingText =
    node?.type === 'heading' ? (node.content?.[0]?.text ?? '') : template.name;

  return (
    <div className="h-full w-full bg-white px-4 py-3">
      <div className="mb-2 text-[9px] font-bold leading-snug text-[var(--ink)] line-clamp-2">
        {headingText}
      </div>
      <div className="space-y-1">
        {(template.content.content ?? []).slice(1, 8).map((child, i) => {
          if (child.type === 'heading') {
            return (
              <div
                key={i}
                className="mt-1.5 text-[7px] font-semibold text-[var(--text-2)] line-clamp-1"
              >
                {child.content?.[0]?.text ?? ''}
              </div>
            );
          }
          if (child.type === 'paragraph') {
            return (
              <div key={i} className="space-y-0.5">
                <div className="h-[3px] w-full rounded-sm bg-[var(--sand-deep)]" />
                <div className="h-[3px] w-[88%] rounded-sm bg-[var(--sand-deep)]" />
                <div className="h-[3px] w-[60%] rounded-sm bg-[var(--sand-deep)]" />
              </div>
            );
          }
          if (child.type === 'bulletList' || child.type === 'taskList') {
            const items = child.content ?? [];
            return (
              <div key={i} className="space-y-0.5">
                {items.slice(0, 3).map((_li, j) => (
                  <div key={j} className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-[var(--text-5)]" />
                    <div className="h-[3px] flex-1 rounded-sm bg-[var(--sand-deep)]" />
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default function TemplateStrip() {
  const createDoc = useDocsStore((s) => s.createDoc);
  const navigate = useNavigate();

  const onPick = async (t: DocTemplate) => {
    const doc = await createDoc({
      title: t.id === 'blank' ? 'Untitled document' : t.name,
      content: t.content,
    });
    navigate(`/docs/${doc.id}`);
  };

  return (
    <div className="flex gap-5 overflow-x-auto pb-2">
      {TEMPLATES.map((t) => (
        <button
          type="button"
          key={t.id}
          onClick={() => onPick(t)}
          className="group flex w-40 shrink-0 flex-col items-start text-left"
        >
          <div className="aspect-[3/4] w-full overflow-hidden rounded-[12px] border border-[var(--line-soft)] bg-white transition-colors group-hover:border-[var(--ink)]">
            <TemplatePreview template={t} />
          </div>
          <div className="mt-2 text-sm font-semibold text-[var(--ink)]">
            {t.name}
          </div>
          <div className="text-xs text-[var(--text-4)]">{t.description.split('.')[0]}</div>
        </button>
      ))}
    </div>
  );
}
