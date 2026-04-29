import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Link as LinkIcon, FileText, StickyNote, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { LinkType } from '@/pages/notes/_lib/types';

const ICONS: Record<LinkType, React.ComponentType<{ className?: string }>> = {
  note: StickyNote,
  doc: FileText,
  event: CalendarClock,
};

const ROUTES: Record<LinkType, (id: string) => string> = {
  note: (id) => `/notes/${id}`,
  doc: (id) => `/docs/${id}`,
  event: (id) => `/calendar?event=${encodeURIComponent(id)}`,
};

const COLORS: Record<LinkType, string> = {
  note: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
  doc: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
  event: 'bg-violet-50 text-violet-800 border-violet-200 hover:bg-violet-100',
};

function WikiLinkView({ node }: NodeViewProps) {
  const navigate = useNavigate();
  const linkType = (node.attrs.linkType as LinkType) ?? 'note';
  const targetId = node.attrs.targetId as string;
  const label = (node.attrs.label as string) || targetId;
  const Icon = ICONS[linkType] ?? LinkIcon;

  return (
    <NodeViewWrapper as="span" className="inline-block align-baseline">
      <button
        type="button"
        contentEditable={false}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate(ROUTES[linkType](targetId));
        }}
        className={`mx-0.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.85em] font-medium transition-colors ${COLORS[linkType]}`}
      >
        <Icon className="h-3 w-3" />
        {label}
      </button>
    </NodeViewWrapper>
  );
}

export const WikiLink = Node.create({
  name: 'wikiLink',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,
  addAttributes() {
    return {
      label: { default: '' },
      linkType: { default: 'note' },
      targetId: { default: '' },
    };
  },
  parseHTML() {
    return [{ tag: 'span[data-wiki-link]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-wiki-link': 'true' })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(WikiLinkView);
  },
});
