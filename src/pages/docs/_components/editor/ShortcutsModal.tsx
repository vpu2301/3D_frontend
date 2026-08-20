import { X } from 'lucide-react';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';

const SHORTCUTS: { group: string; items: { keys: string; desc: string }[] }[] = [
  {
    group: 'AI',
    items: [
      { keys: 'Cmd/Ctrl + J', desc: 'Open inline AI prompt at cursor' },
      { keys: 'Tab', desc: 'Accept ghost-text completion' },
      { keys: 'Esc', desc: 'Dismiss ghost text or close menus' },
      { keys: 'Cmd/Ctrl + I', desc: 'Toggle AI sidebar' },
    ],
  },
  {
    group: 'Editor',
    items: [
      { keys: '/', desc: 'Open slash menu (insert block)' },
      { keys: 'Cmd/Ctrl + B', desc: 'Bold' },
      { keys: 'Cmd/Ctrl + I', desc: 'Italic' },
      { keys: 'Cmd/Ctrl + U', desc: 'Underline' },
      { keys: 'Cmd/Ctrl + E', desc: 'Inline code' },
      { keys: 'Cmd/Ctrl + Shift + 1/2/3', desc: 'Heading 1/2/3' },
      { keys: 'Cmd/Ctrl + Shift + 7', desc: 'Numbered list' },
      { keys: 'Cmd/Ctrl + Shift + 8', desc: 'Bulleted list' },
    ],
  },
  {
    group: 'Markdown shortcuts',
    items: [
      { keys: '# ', desc: 'Heading 1' },
      { keys: '## ', desc: 'Heading 2' },
      { keys: '### ', desc: 'Heading 3' },
      { keys: '- ', desc: 'Bulleted list' },
      { keys: '1. ', desc: 'Numbered list' },
      { keys: '> ', desc: 'Blockquote' },
      { keys: '``` ', desc: 'Code block' },
    ],
  },
  {
    group: 'Doc',
    items: [
      { keys: 'Cmd/Ctrl + S', desc: 'Force save snapshot' },
      { keys: 'Cmd/Ctrl + /', desc: 'This shortcuts modal' },
    ],
  },
];

export default function ShortcutsModal() {
  const { shortcutsOpen, setShortcutsOpen } = useDocsUiStore();
  if (!shortcutsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => setShortcutsOpen(false)}
    >
      <div
        className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-[14px] border border-[var(--line-soft)] bg-white p-5 shadow-[0_16px_48px_rgba(20,22,26,0.16)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-[var(--ink)]">Keyboard shortcuts</h3>
          <button
            type="button"
            onClick={() => setShortcutsOpen(false)}
            className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-5">
          {SHORTCUTS.map((g) => (
            <div key={g.group}>
              <div className="plat-eyebrow mb-2">
                {g.group}
              </div>
              <div className="space-y-1">
                {g.items.map((s) => (
                  <div key={s.keys} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-2)]">{s.desc}</span>
                    <kbd className="rounded-[8px] border border-[var(--line-soft)] bg-[var(--sand)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text-2)]">
                      {s.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
