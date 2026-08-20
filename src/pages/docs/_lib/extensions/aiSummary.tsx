import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { generateSummary } from '@/pages/docs/_lib/mockAi';
import { toPlainText } from '@/pages/docs/_lib/export';

function AiSummaryView({ editor, getPos, node, updateAttributes }: NodeViewProps) {
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const pos = typeof getPos === 'function' ? getPos() : 0;
      const before = editor.state.doc.cut(0, Math.max(0, pos));
      const text = toPlainText(before.toJSON() as any);
      const summary = await generateSummary(text);
      updateAttributes({ summary });
    } finally {
      setLoading(false);
    }
  };

  const summary = (node.attrs.summary as string) || '';

  return (
    <NodeViewWrapper className="my-3">
      <div className="rounded-[12px] border border-[var(--line-soft)] bg-[var(--sand)] p-4" contentEditable={false}>
        <div className="mb-2 flex items-center justify-between">
          <div className="plat-eyebrow flex items-center gap-1.5 text-[var(--text-3)]">
            <Sparkles className="h-3.5 w-3.5" /> AI summary
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1 rounded-[8px] px-2 py-1 text-xs font-medium text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)] disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating…' : 'Regenerate'}
          </button>
        </div>
        <div className="text-sm leading-relaxed text-[var(--ink)]">
          {summary || (
            <button
              type="button"
              onClick={refresh}
              className="text-[var(--text-3)] underline decoration-[var(--line)] underline-offset-2 transition-colors hover:text-[var(--ink)]"
            >
              Click regenerate to summarize the document above.
            </button>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export const AiSummaryNode = Node.create({
  name: 'aiSummary',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      summary: { default: '' },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-ai-summary]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-ai-summary': 'true' })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(AiSummaryView);
  },
});
