/**
 * The ask panel — entry point two of two (FE-5 §4).
 *
 * One right-hand panel, two tabs, opened with `Cmd+J` or from the palette.
 * Together with the bubble menu that is every AI surface in this module, and
 * `aiGates.test.ts` scans for a third appearing.
 *
 * The Agent tab is behind `VITE_NOTES_AGENT_CHAT` until BE-4 flips its own
 * server-side flag. With the flag off there is one tab, and the tab strip is
 * not rendered at all — a lone disabled tab advertising a feature nobody can
 * use is worse than no tab.
 *
 * Width is §9.2's acknowledged debt: it matches the existing sidebar. If a
 * diff in an approval card proves cramped at this width, that is a layout
 * decision for a designer rather than a number to nudge here.
 */

import { X, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { agentChatEnabled } from '@/pages/notes/_lib/aiClient';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import AskTab from './AskTab';
import AgentTab from './AgentTab';
import LocalOnlyIndicator from './LocalOnlyIndicator';

interface Props {
  noteId?: string;
  onClose: () => void;
}

export default function NotesAiSidebar({ noteId, onClose }: Props) {
  const tab = useNotesUiStore((s) => s.aiPanelTab);
  const setTab = useNotesUiStore((s) => s.setAiPanelTab);

  // The tab lives in the UI store because the inline "Ask…" action has to be
  // able to land on Ask from outside this component.
  const active = agentChatEnabled ? tab : 'ask';

  return (
    <aside
      aria-label="AI panel"
      className="flex h-full w-96 shrink-0 flex-col border-l border-[var(--line-soft)]"
    >
      <div className="flex items-center gap-2 border-b border-[var(--line-soft)] px-3 py-2.5">
        <Sparkles aria-hidden className="h-4 w-4 shrink-0" style={{ color: 'var(--text-4)' }} />
        <span className="flex-1 truncate text-[13.5px] font-semibold text-[var(--ink)]">Ask</span>
        <LocalOnlyIndicator />
        <button
          data-command-exempt="closes the AI panel; the panel itself is the view.ai command"
          type="button"
          onClick={onClose}
          className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          aria-label="Close the AI panel"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      </div>

      {agentChatEnabled ? (
        <Tabs
          value={active}
          onValueChange={(value) => setTab(value as 'ask' | 'agent')}
          className="flex min-h-0 flex-1 flex-col"
        >
          <TabsList className="mx-3 mt-2 grid w-auto grid-cols-2 rounded-[10px] bg-[var(--sand-deep)]">
            <TabsTrigger value="ask" className="rounded-[8px] text-xs data-[state=active]:bg-[var(--paper)] data-[state=active]:text-[var(--ink)]">
              Ask
            </TabsTrigger>
            <TabsTrigger value="agent" className="rounded-[8px] text-xs data-[state=active]:bg-[var(--paper)] data-[state=active]:text-[var(--ink)]">
              Agent
            </TabsTrigger>
          </TabsList>

          {/*
            `forceMount` is deliberately not used: switching tabs should abort
            the stream the other tab was running, and unmounting is what fires
            the abort that stops the server billing for it.
          */}
          <TabsContent value="ask" className="mt-2 flex min-h-0 flex-1 flex-col">
            <AskTab noteId={noteId} />
          </TabsContent>
          <TabsContent value="agent" className="mt-2 flex min-h-0 flex-1 flex-col">
            <AgentTab noteId={noteId} />
          </TabsContent>
        </Tabs>
      ) : (
        <AskTab noteId={noteId} />
      )}
    </aside>
  );
}
