import type { Editor } from '@tiptap/react';

export default function StatusBar({ editor }: { editor: Editor | null }) {
  const stats = editor?.storage.characterCount;
  const words = stats?.words?.() ?? 0;
  const chars = stats?.characters?.() ?? 0;

  return (
    <footer className="flex h-7 items-center justify-end gap-3 border-t border-zinc-200 bg-white px-4 text-[11px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
      <span>{words} words</span>
      <span>·</span>
      <span>{chars} chars</span>
    </footer>
  );
}
