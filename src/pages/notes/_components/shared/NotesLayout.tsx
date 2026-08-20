import { ReactNode, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { onBudgetWarning } from '@/pages/notes/_lib/aiClient';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useGlobalShortcuts } from '@/pages/notes/_hooks/use-notes-commands';
import { getActiveEditor } from '@/pages/notes/_lib/editorBridge';
import NotesCommandPalette from '@/pages/notes/_components/command/NotesCommandPalette';
import NotesShortcutSheet from '@/pages/notes/_components/command/NotesShortcutSheet';
import NotesSessionDialog from '@/pages/notes/_components/shared/NotesSessionDialog';

/**
 * Once per session, not once per warning: the server sets
 * `X-AI-Budget-Warning` on *every* response past 80%, so an un-throttled
 * subscriber would toast on each keystroke's tag suggestion.
 */
let budgetWarned = false;

export default function NotesLayout({ children }: { children: ReactNode }) {
  const flushSync = useNotesStore((s) => s.flushSync);

  // The keyboard shell. Mounted here rather than per page so every /notes route
  // — list, editor, trash, graph — answers the same keys.
  useGlobalShortcuts();

  useEffect(() => {
    return onBudgetWarning((ratio) => {
      if (budgetWarned) return;
      budgetWarned = true;
      toast.warning(`AI budget ${Math.round(ratio * 100)}% used`, {
        description: "Today's AI features stop working once the budget is spent.",
        duration: 8000,
      });
    });
  }, []);

  /**
   * Closing the tab mid-debounce.
   *
   * The 300 ms autosave means there is almost always something unsent, and a
   * normal `fetch` is cancelled the moment the document goes away. `keepalive`
   * survives that. There is deliberately no `returnValue` prompt: "you have
   * unsaved changes" would be a lie in an app that autosaves, and the whole
   * point of this sprint is that leaving costs nothing.
   */
  useEffect(() => {
    const onBeforeUnload = () => {
      const editor = getActiveEditor();
      if (!editor) return;
      flushSync(editor.noteId, editor.getJSON());
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [flushSync]);

  return (
    <div className="plat flex h-screen flex-col overflow-hidden">
      <SidebarProvider>
        <div className="flex min-h-0 w-full flex-1 overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>

      <NotesCommandPalette />
      <NotesShortcutSheet />
      <NotesSessionDialog />

      {/*
        The notes store reports failures through `sonner`, which the app shell
        does not mount (it uses the radix `Toaster`). Mounting it here keeps the
        change inside /notes rather than in the platform shell.
      */}
      <Toaster position="bottom-right" />
    </div>
  );
}
