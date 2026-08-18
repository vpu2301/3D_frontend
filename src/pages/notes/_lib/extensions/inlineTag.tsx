import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { useNavigate } from 'react-router-dom';

function InlineTagView({ node }: NodeViewProps) {
  const navigate = useNavigate();
  const name = (node.attrs.name as string) ?? '';
  return (
    <NodeViewWrapper as="span" className="inline-block align-baseline">
      <button
        type="button"
        contentEditable={false}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate(`/notes/tag/${encodeURIComponent(name)}`);
        }}
        className="mx-0.5 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[0.85em] font-medium text-gray-700 transition-colors hover:bg-gray-200"
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
