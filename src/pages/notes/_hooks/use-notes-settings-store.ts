/**
 * Editor preferences that belong to this browser, not to the account.
 *
 * The Docs app used to own a much larger settings store; the editor is the only
 * thing that outlived it, and it reads exactly one value — how wide the writing
 * column should be — so that is all this keeps.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type PageWidth = 'narrow' | 'wide' | 'full';

interface NotesSettingsState {
  pageWidth: PageWidth;
  setPageWidth: (w: PageWidth) => void;
}

export const useNotesSettingsStore = create<NotesSettingsState>()(
  persist(
    (set) => ({
      pageWidth: 'wide',
      setPageWidth: (pageWidth) => set({ pageWidth }),
    }),
    { name: 'notes-settings', storage: createJSONStorage(() => localStorage) },
  ),
);
