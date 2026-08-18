import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Theme, EditorFont, PageWidth, AiTone } from '@/pages/docs/_lib/types';

interface SettingsState {
  theme: Theme;
  font: EditorFont;
  fontSize: number; // px
  lineSpacing: number; // multiplier
  pageWidth: PageWidth;

  defaultTone: AiTone;
  ghostTextEnabled: boolean;
  aiSidebarDefaultOpen: boolean;
  mockFailureRate: number;

  profileName: string;
  profileAvatar: string | null;

  setTheme: (t: Theme) => void;
  setFont: (f: EditorFont) => void;
  setFontSize: (n: number) => void;
  setLineSpacing: (n: number) => void;
  setPageWidth: (w: PageWidth) => void;
  setDefaultTone: (t: AiTone) => void;
  setGhostTextEnabled: (v: boolean) => void;
  setAiSidebarDefaultOpen: (v: boolean) => void;
  setMockFailureRate: (n: number) => void;
  setProfileName: (n: string) => void;
  setProfileAvatar: (a: string | null) => void;
}

export const useDocsSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      font: 'sans',
      fontSize: 16,
      lineSpacing: 1.6,
      pageWidth: 'wide',

      defaultTone: 'professional',
      ghostTextEnabled: true,
      aiSidebarDefaultOpen: false,
      mockFailureRate: 0.05,

      profileName: 'You',
      profileAvatar: null,

      setTheme: (t) => set({ theme: t }),
      setFont: (f) => set({ font: f }),
      setFontSize: (n) => set({ fontSize: n }),
      setLineSpacing: (n) => set({ lineSpacing: n }),
      setPageWidth: (w) => set({ pageWidth: w }),
      setDefaultTone: (t) => set({ defaultTone: t }),
      setGhostTextEnabled: (v) => set({ ghostTextEnabled: v }),
      setAiSidebarDefaultOpen: (v) => set({ aiSidebarDefaultOpen: v }),
      setMockFailureRate: (n) => set({ mockFailureRate: n }),
      setProfileName: (n) => set({ profileName: n }),
      setProfileAvatar: (a) => set({ profileAvatar: a }),
    }),
    {
      name: 'ai-docs-settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
