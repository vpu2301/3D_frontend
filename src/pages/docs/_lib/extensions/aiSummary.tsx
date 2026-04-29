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
      <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/30" contentEditable={false}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" /> AI summary
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-blue-100 disabled:opacity-50 dark:hover:bg-blue-900"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating…' : 'Regenerate'}
          </button>
        </div>
        <div className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
          {summary || (
            <button
              type="button"
              onClick={refresh}
              className="text-blue-600 hover:underline dark:text-blue-400"
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
