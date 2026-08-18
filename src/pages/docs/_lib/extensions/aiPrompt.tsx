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
      <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/30" contentEditable={false}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <Wand2 className="h-3.5 w-3.5" /> AI prompt
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setEditing((e) => !e)}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-amber-100 dark:hover:bg-amber-900"
            >
              <Pencil className="h-3 w-3" />
              {editing ? 'Done' : 'Edit'}
            </button>
            <button
              type="button"
              onClick={run}
              disabled={loading}
              className="flex items-center gap-1 rounded bg-amber-600 px-2 py-1 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50"
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
            className="w-full rounded-md border border-amber-200 bg-white p-2 text-sm focus:border-amber-400 focus:outline-none dark:border-amber-900 dark:bg-zinc-900"
            rows={2}
          />
        ) : (
          <div className="mb-2 text-xs italic text-amber-800 dark:text-amber-300">"{prompt}"</div>
        )}
        {output && (
          <div className="mt-2 whitespace-pre-wrap rounded-md bg-white/60 p-2 text-sm leading-relaxed dark:bg-zinc-900/60">
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
