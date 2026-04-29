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
        className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Keyboard shortcuts</h3>
          <button
            type="button"
            onClick={() => setShortcutsOpen(false)}
            className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-5">
          {SHORTCUTS.map((g) => (
            <div key={g.group}>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {g.group}
              </div>
              <div className="space-y-1">
                {g.items.map((s) => (
                  <div key={s.keys} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">{s.desc}</span>
                    <kbd className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[11px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
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
