import { create } from 'zustand';
import type { DriveViewMode, DriveSortBy, SortDirection, DriveListFilter } from '@/pages/drive/_lib/types';

interface UiState {
  viewMode: DriveViewMode;
  setViewMode: (m: DriveViewMode) => void;

  sortBy: DriveSortBy;
  sortDir: SortDirection;
  setSort: (by: DriveSortBy, dir?: SortDirection) => void;

  filter: DriveListFilter;
  setFilter: (f: DriveListFilter) => void;
  resetFilter: () => void;

  query: string;
  setQuery: (q: string) => void;
  /** When true, the next search should run as semantic; otherwise keyword. */
  semanticMode: boolean;
  setSemanticMode: (v: boolean) => void;

  selectedIds: string[];
  toggleSelected: (id: string) => void;
  setSelection: (ids: string[]) => void;
  clearSelection: () => void;

  previewId: string | null;
  setPreviewId: (id: string | null) => void;

  shareTargetId: string | null;
  setShareTargetId: (id: string | null) => void;

  organizeFolderId: string | null;
  setOrganizeFolderId: (id: string | null) => void;

  /** Right-rail panel state inside the file preview. */
  previewTab: 'details' | 'activity' | 'ai';
  setPreviewTab: (t: 'details' | 'activity' | 'ai') => void;

  driveAiOpen: boolean;
  setDriveAiOpen: (v: boolean) => void;
}

export const useDriveUiStore = create<UiState>((set) => ({
  viewMode: 'grid',
  setViewMode: (m) => set({ viewMode: m }),

  sortBy: 'modified',
  sortDir: 'desc',
  setSort: (by, dir) => set({ sortBy: by, sortDir: dir ?? 'desc' }),

  filter: {},
  setFilter: (f) => set({ filter: f }),
  resetFilter: () => set({ filter: {} }),

  query: '',
  setQuery: (q) => set({ query: q }),
  semanticMode: true,
  setSemanticMode: (v) => set({ semanticMode: v }),

  selectedIds: [],
  toggleSelected: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),
  setSelection: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  previewId: null,
  setPreviewId: (id) => set({ previewId: id }),

  shareTargetId: null,
  setShareTargetId: (id) => set({ shareTargetId: id }),

  organizeFolderId: null,
  setOrganizeFolderId: (id) => set({ organizeFolderId: id }),

  previewTab: 'details',
  setPreviewTab: (t) => set({ previewTab: t }),

  driveAiOpen: false,
  setDriveAiOpen: (v) => set({ driveAiOpen: v }),
}));
