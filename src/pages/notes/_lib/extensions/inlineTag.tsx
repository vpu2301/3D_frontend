import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { useNavigate } from 'react-router-dom';

function InlineTagView({ node }: NodeViewProps) {
  const navigate = useNavigate();
  const name = (node.attrs.name as string) ?? '';
  return (
    <NodeViewWrapper as="span" className="inline-block align-baseline">
      <button
            data-command-exempt="inline chip inside the document; clicking it filters by that tag"
        type="button"
        contentEditable={false}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate(`/notes/tag/${encodeURIComponent(name)}`);
        }}
        className="mx-0.5 inline-flex items-center rounded-full bg-[var(--sand)] px-2 py-0.5 text-[0.85em] font-medium text-[var(--text-2)] transition-colors hover:bg-[var(--sand-deep)] hover:text-[var(--ink)]"
      >
        #{name}
      </button>
    </NodeViewWrapper>
  );
}

export const InlineTag = Node.create({
  name: 'inlineTag',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      name: { default: '' },
    };
  },
  parseHTML() {
    return [{ tag: 'span[data-inline-tag]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-inline-tag': 'true' })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(InlineTagView);
  },
});
