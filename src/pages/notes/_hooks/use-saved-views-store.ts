/**
 * Saved views — standing queries over BE-2's DSL.
 *
 * The thing that makes these worth having, and that no folder-based tool can
 * match: a view can contain a semantic clause, so "anything that reads like a
 * deadline commitment" keeps finding notes written after the view was saved.
 *
 * Two rules:
 *
 *  1. **The primary way a view is created is from a search**, not from the
 *     builder. "I just searched for this, keep it" is the moment someone
 *     actually wants one; a trip to a builder is a different, rarer intent.
 *  2. **The server's seeded defaults arrive with no setup**, and a deleted
 *     default stays deleted — `seeded` is a flag on the row, not a re-seed on
 *     every boot.
 */

import { create } from 'zustand';
import { toast } from 'sonner';
import { notesApi, type NoteQuery, type SavedView } from '@/pages/notes/_lib/apiClient';
import { reportError } from '@/pages/notes/_lib/errors';

interface SavedViewsState {
  views: SavedView[];
  loaded: boolean;
  loading: boolean;

  load: () => Promise<void>;
  create: (name: string, query: NoteQuery) => Promise<SavedView | null>;
  rename: (id: string, name: string) => Promise<void>;
  update: (id: string, query: NoteQuery) => Promise<void>;
  reorder: (id: string, pinnedOrder: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useSavedViewsStore = create<SavedViewsState>((set, get) => ({
  views: [],
  loaded: false,
  loading: false,

  load: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    try {
      set({ views: sort(await notesApi.views()), loaded: true, loading: false });
    } catch {
      // A failed load means no views section, not a broken sidebar.
      set({ loading: false });
    }
  },

  create: async (name, query) => {
    try {
      const view = await notesApi.createView(name, query);
      set((s) => ({ views: sort([...s.views, view]) }));
      toast.success('Saved as a view', {
        description: 'It is in the sidebar, and it stays current as you write.',
      });
      return view;
    } catch (error) {
      reportError(error, { title: 'Could not save that view' });
      return null;
    }
  },

  rename: async (id, name) => {
    const before = get().views;
    set((s) => ({ views: s.views.map((v) => (v.id === id ? { ...v, name } : v)) }));
    try {
      const saved = await notesApi.patchView(id, { name });
      set((s) => ({ views: sort(s.views.map((v) => (v.id === id ? saved : v))) }));
    } catch (error) {
      set({ views: before });
      reportError(error, { title: 'Could not rename that view' });
    }
  },

  update: async (id, query) => {
    const before = get().views;
    try {
      const saved = await notesApi.patchView(id, { query });
      set((s) => ({ views: sort(s.views.map((v) => (v.id === id ? saved : v))) }));
    } catch (error) {
      set({ views: before });
      reportError(error, { title: 'Could not save that query' });
      throw error;
    }
  },

  reorder: async (id, pinnedOrder) => {
    const before = get().views;
    set((s) => ({
      views: sort(s.views.map((v) => (v.id === id ? { ...v, pinnedOrder } : v))),
    }));
    try {
      await notesApi.patchView(id, { pinnedOrder });
    } catch (error) {
      set({ views: before });
      reportError(error, { title: 'Could not reorder' });
    }
  },

  remove: async (id) => {
    const before = get().views;
    set((s) => ({ views: s.views.filter((v) => v.id !== id) }));
    try {
      await notesApi.deleteView(id);
    } catch (error) {
      set({ views: before });
      reportError(error, { title: 'Could not delete that view' });
    }
  },
}));

/** Pinned order first, then by name — a stable order the user can predict. */
function sort(views: SavedView[]): SavedView[] {
  return [...views].sort(
    (a, b) =>
      (a.pinnedOrder ?? Number.MAX_SAFE_INTEGER) - (b.pinnedOrder ?? Number.MAX_SAFE_INTEGER) ||
      a.name.localeCompare(b.name),
  );
}
