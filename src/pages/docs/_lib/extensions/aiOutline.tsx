import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { useEffect, useMemo } from 'react';
import { ListTree } from 'lucide-react';
import type { OutlineNode } from '@/pages/docs/_lib/types';

function collectHeadings(json: any): OutlineNode[] {
  const out: OutlineNode[] = [];
  const walk = (n: any) => {
    if (!n) return;
    if (n.type === 'heading') {
      const level = Number(n.attrs?.level ?? 1);
      const text = (n.content ?? [])
        .map((c: any) => c.text ?? '')
        .join('')
        .trim();
      if (text) out.push({ level, text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
    }
    if (n.content) for (const c of n.content) walk(c);
  };
  walk(json);
  return out;
}

function AiOutlineView({ editor }: NodeViewProps) {
  const headings = useMemo(() => collectHeadings(editor.getJSON()), [editor.state]);

  // re-render on every doc change
  useEffect(() => {
    const handler = () => {};
    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor]);

  return (
    <NodeViewWrapper className="my-3">
      <div className="rounded-lg border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-900 dark:bg-violet-950/30" contentEditable={false}>
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
          <ListTree className="h-3.5 w-3.5" /> AI outline
        </div>
        {headings.length === 0 ? (
          <div className="text-sm italic text-zinc-500">No headings yet — add some with /h1, /h2, /h3.</div>
        ) : (
          <ol className="space-y-1 text-sm">
            {headings.map((h, i) => (
              <li key={i} style={{ paddingLeft: (h.level - 1) * 16 }} className="text-zinc-700 dark:text-zinc-300">
                {h.text}
              </li>
            ))}
          </ol>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const AiOutlineNode = Node.create({
  name: 'aiOutline',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  parseHTML() {
    return [{ tag: 'div[data-ai-outline]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-ai-outline': 'true' })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(AiOutlineView);
  },
});
