import { create } from 'zustand';
import type { ViewMode, DashboardFilter } from '@/pages/docs/_lib/types';

interface UiState {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;

  filter: DashboardFilter;
  setFilter: (f: DashboardFilter) => void;

  query: string;
  setQuery: (q: string) => void;

  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;

  selectedDocIds: string[];
  toggleSelected: (id: string) => void;
  clearSelection: () => void;
  setSelection: (ids: string[]) => void;

  aiSidebarOpen: boolean;
  setAiSidebarOpen: (v: boolean) => void;

  shortcutsOpen: boolean;
  setShortcutsOpen: (v: boolean) => void;

  templatesOpen: boolean;
  setTemplatesOpen: (v: boolean) => void;

  shareOpen: boolean;
  setShareOpen: (v: boolean) => void;

  suggestingMode: boolean;
  setSuggestingMode: (v: boolean) => void;
}

export const useDocsUiStore = create<UiState>((set) => ({
  viewMode: 'grid',
  setViewMode: (m) => set({ viewMode: m }),

  filter: 'all',
  setFilter: (f) => set({ filter: f }),

  query: '',
  setQuery: (q) => set({ query: q }),

  selectedFolderId: null,
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),

  selectedDocIds: [],
  toggleSelected: (id) =>
    set((s) => ({
      selectedDocIds: s.selectedDocIds.includes(id)
        ? s.selectedDocIds.filter((x) => x !== id)
        : [...s.selectedDocIds, id],
    })),
  clearSelection: () => set({ selectedDocIds: [] }),
  setSelection: (ids) => set({ selectedDocIds: ids }),

  aiSidebarOpen: false,
  setAiSidebarOpen: (v) => set({ aiSidebarOpen: v }),

  shortcutsOpen: false,
  setShortcutsOpen: (v) => set({ shortcutsOpen: v }),

  templatesOpen: false,
  setTemplatesOpen: (v) => set({ templatesOpen: v }),

  shareOpen: false,
  setShareOpen: (v) => set({ shareOpen: v }),

  suggestingMode: false,
  setSuggestingMode: (v) => set({ suggestingMode: v }),
}));
