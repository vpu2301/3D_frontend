import { create } from 'zustand';
import type { NoteListSort, NoteListFilter, NotesViewMode } from '@/pages/notes/_lib/types';

interface UiState {
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;

  query: string;
  setQuery: (q: string) => void;

  sort: NoteListSort;
  setSort: (s: NoteListSort) => void;

  filter: NoteListFilter;
  setFilter: (f: NoteListFilter) => void;
  resetFilter: () => void;

  viewMode: NotesViewMode;
  setViewMode: (v: NotesViewMode) => void;

  selectedIds: string[];
  toggleSelected: (id: string) => void;
  clearSelection: () => void;

  aiSidebarOpen: boolean;
  setAiSidebarOpen: (v: boolean) => void;

  quickCaptureOpen: boolean;
  setQuickCaptureOpen: (v: boolean) => void;

  /** Active smart view id, if any */
  smartViewId: string | null;
  setSmartViewId: (id: string | null) => void;
}

export const useNotesUiStore = create<UiState>((set) => ({
  selectedNoteId: null,
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),

  query: '',
  setQuery: (q) => set({ query: q }),

  sort: { by: 'updated', dir: 'desc' },
  setSort: (s) => set({ sort: s }),

  filter: {},
  setFilter: (f) => set({ filter: f }),
  resetFilter: () => set({ filter: {} }),

  viewMode: 'split',
  setViewMode: (v) => set({ viewMode: v }),

  selectedIds: [],
  toggleSelected: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),
  clearSelection: () => set({ selectedIds: [] }),

  aiSidebarOpen: false,
  setAiSidebarOpen: (v) => set({ aiSidebarOpen: v }),

  quickCaptureOpen: false,
  setQuickCaptureOpen: (v) => set({ quickCaptureOpen: v }),

  smartViewId: null,
  setSmartViewId: (id) => set({ smartViewId: id }),
}));
