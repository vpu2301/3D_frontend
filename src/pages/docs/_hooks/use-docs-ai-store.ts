import { create } from 'zustand';
import type { AiChatMessage, AiProposal } from '@/pages/docs/_lib/types';

interface AiState {
  // chat per docId
  chats: Record<string, AiChatMessage[]>;
  appendMessage: (docId: string, msg: AiChatMessage) => void;
  patchMessage: (docId: string, msgId: string, patch: Partial<AiChatMessage>) => void;
  clearChat: (docId: string) => void;

  // active streaming controllers per docId (not part of state for re-renders)
  activeProposal: AiProposal | null;
  setActiveProposal: (p: AiProposal | null) => void;
}

export const useDocsAiStore = create<AiState>((set) => ({
  chats: {},
  appendMessage: (docId, msg) =>
    set((s) => ({
      chats: { ...s.chats, [docId]: [...(s.chats[docId] ?? []), msg] },
    })),
  patchMessage: (docId, msgId, patch) =>
    set((s) => ({
      chats: {
        ...s.chats,
        [docId]: (s.chats[docId] ?? []).map((m) => (m.id === msgId ? { ...m, ...patch } : m)),
      },
    })),
  clearChat: (docId) =>
    set((s) => {
      const { [docId]: _, ...rest } = s.chats;
      return { chats: rest };
    }),

  activeProposal: null,
  setActiveProposal: (p) => set({ activeProposal: p }),
}));
