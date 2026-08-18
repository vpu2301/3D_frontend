import { create } from 'zustand';
import type { ContactView, ContactSort, ContactFilter } from '@/pages/contacts/_lib/types';

interface UiState {
  view: ContactView;
  setView: (v: ContactView) => void;
  sort: ContactSort;
  setSort: (s: ContactSort) => void;
  filter: ContactFilter;
  setFilter: (f: ContactFilter) => void;
  resetFilter: () => void;
  query: string;
  setQuery: (q: string) => void;
  selectedIds: string[];
  toggleSelected: (id: string) => void;
  setSelection: (ids: string[]) => void;
  clearSelection: () => void;
  askOpen: boolean;
  setAskOpen: (v: boolean) => void;
}

export const useContactsUiStore = create<UiState>((set) => ({
  view: 'list',
  setView: (v) => set({ view: v }),
  sort: 'name-asc',
  setSort: (s) => set({ sort: s }),
  filter: {},
  setFilter: (f) => set({ filter: f }),
  resetFilter: () => set({ filter: {} }),
  query: '',
  setQuery: (q) => set({ query: q }),
  selectedIds: [],
  toggleSelected: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),
  setSelection: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
  askOpen: false,
  setAskOpen: (v) => set({ askOpen: v }),
}));
