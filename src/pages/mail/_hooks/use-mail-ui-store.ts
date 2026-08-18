import { create } from 'zustand';
import type { MailCategory } from '@/pages/mail/_lib/types';

interface UiState {
  selectedThreadId: string | null;
  setSelectedThreadId: (id: string | null) => void;

  selectedEmailIds: string[];
  toggleSelected: (id: string) => void;
  clearSelection: () => void;

  query: string;
  setQuery: (q: string) => void;

  category: MailCategory | 'all';
  setCategory: (c: MailCategory | 'all') => void;

  digestDismissed: boolean;
  dismissDigest: () => void;

  // Compose: list of open compose ids; presence keyed by drafts in store
  openComposeDraftIds: string[];
  openCompose: (draftId: string) => void;
  closeCompose: (draftId: string) => void;

  // Undo-send queue: keys = email id, value = timeout deadline
  undoSendable: Record<string, { deadline: number }>;
  registerUndoSend: (emailId: string, deadline: number) => void;
  clearUndoSend: (emailId: string) => void;

  // Right rail
  aiSidebarOpen: boolean;
  setAiSidebarOpen: (v: boolean) => void;

  showBlockedImages: Record<string, boolean>;
  showImagesFor: (emailId: string) => void;
}

export const useMailUiStore = create<UiState>((set, get) => ({
  selectedThreadId: null,
  setSelectedThreadId: (id) => set({ selectedThreadId: id }),

  selectedEmailIds: [],
  toggleSelected: (id) =>
    set((s) => ({
      selectedEmailIds: s.selectedEmailIds.includes(id)
        ? s.selectedEmailIds.filter((x) => x !== id)
        : [...s.selectedEmailIds, id],
    })),
  clearSelection: () => set({ selectedEmailIds: [] }),

  query: '',
  setQuery: (q) => set({ query: q }),

  category: 'all',
  setCategory: (c) => set({ category: c }),

  digestDismissed: false,
  dismissDigest: () => set({ digestDismissed: true }),

  openComposeDraftIds: [],
  openCompose: (draftId) =>
    set((s) =>
      s.openComposeDraftIds.includes(draftId)
        ? s
        : { openComposeDraftIds: [...s.openComposeDraftIds, draftId] },
    ),
  closeCompose: (draftId) =>
    set((s) => ({ openComposeDraftIds: s.openComposeDraftIds.filter((x) => x !== draftId) })),

  undoSendable: {},
  registerUndoSend: (emailId, deadline) =>
    set((s) => ({ undoSendable: { ...s.undoSendable, [emailId]: { deadline } } })),
  clearUndoSend: (emailId) =>
    set((s) => {
      const { [emailId]: _, ...rest } = s.undoSendable;
      return { undoSendable: rest };
    }),

  aiSidebarOpen: false,
  setAiSidebarOpen: (v) => set({ aiSidebarOpen: v }),

  showBlockedImages: {},
  showImagesFor: (emailId) =>
    set((s) => ({ showBlockedImages: { ...s.showBlockedImages, [emailId]: true } })),
}));
