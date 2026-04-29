import { create } from 'zustand';

interface UiState {
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;

  detailOpen: boolean;
  setDetailOpen: (v: boolean) => void;

  query: string;
  setQuery: (q: string) => void;

  hideCompleted: boolean;
  setHideCompleted: (v: boolean) => void;

  selectedIds: string[];
  toggleSelected: (id: string) => void;
  setSelection: (ids: string[]) => void;
  clearSelection: () => void;

  triageOpen: boolean;
  setTriageOpen: (v: boolean) => void;

  askOpen: boolean;
  setAskOpen: (v: boolean) => void;

  dailyPlanDismissed: boolean;
  setDailyPlanDismissed: (v: boolean) => void;
}

export const useTodoUiStore = create<UiState>((set) => ({
  selectedTaskId: null,
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  detailOpen: false,
  setDetailOpen: (v) => set({ detailOpen: v }),
  query: '',
  setQuery: (q) => set({ query: q }),
  hideCompleted: false,
  setHideCompleted: (v) => set({ hideCompleted: v }),
  selectedIds: [],
  toggleSelected: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),
  setSelection: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
  triageOpen: false,
  setTriageOpen: (v) => set({ triageOpen: v }),
  askOpen: false,
  setAskOpen: (v) => set({ askOpen: v }),
  dailyPlanDismissed: false,
  setDailyPlanDismissed: (v) => set({ dailyPlanDismissed: v }),
}));
