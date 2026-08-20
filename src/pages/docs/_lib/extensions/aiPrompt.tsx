import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { useState } from 'react';
import { Wand2, Play, Pencil } from 'lucide-react';
import { streamCompletion } from '@/pages/docs/_lib/mockAi';
import { toPlainText } from '@/pages/docs/_lib/export';

function AiPromptView({ editor, updateAttributes, node }: NodeViewProps) {
  const initialPrompt = (node.attrs.prompt as string) || 'List action items from this document';
  const initialOutput = (node.attrs.output as string) || '';
  const [editing, setEditing] = useState(!initialPrompt || initialPrompt === '');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [output, setOutput] = useState(initialOutput);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setOutput('');
    try {
      const ctx = toPlainText(editor.getJSON() as any);
      let acc = '';
      for await (const chunk of streamCompletion(prompt, ctx)) {
        acc += chunk;
        setOutput(acc);
      }
      updateAttributes({ prompt, output: acc });
    } catch (e) {
      setOutput('⚠️ Mock AI failed. Click run again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NodeViewWrapper className="my-3">
      <div className="rounded-[12px] border border-[var(--line-soft)] bg-[var(--sand)] p-4" contentEditable={false}>
        <div className="mb-2 flex items-center justify-between">
          <div className="plat-eyebrow flex items-center gap-1.5 text-[var(--text-3)]">
            <Wand2 className="h-3.5 w-3.5" /> AI prompt
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setEditing((e) => !e)}
              className="flex items-center gap-1 rounded-[8px] px-2 py-1 text-xs font-medium text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            >
              <Pencil className="h-3 w-3" />
              {editing ? 'Done' : 'Edit'}
            </button>
            <button
              type="button"
              onClick={run}
              disabled={loading}
              className="flex items-center gap-1 rounded-full bg-[var(--ink)] px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-35"
            >
              <Play className="h-3 w-3" />
              {loading ? 'Running…' : 'Run'}
            </button>
          </div>
        </div>
        {editing ? (
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full rounded-[10px] border border-[var(--line-soft)] bg-white p-2 text-sm text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
            rows={2}
          />
        ) : (
          <div className="mb-2 text-xs italic text-[var(--text-3)]">"{prompt}"</div>
        )}
        {output && (
          <div className="mt-2 whitespace-pre-wrap rounded-[10px] border border-[var(--line-soft)] bg-white p-2 text-sm leading-relaxed text-[var(--ink)]">
            {output}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const AiPromptNode = Node.create({
  name: 'aiPrompt',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      prompt: { default: '' },
      output: { default: '' },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-ai-prompt]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-ai-prompt': 'true' })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(AiPromptView);
  },
});
