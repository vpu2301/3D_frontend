import type { JSONContent } from '@tiptap/react';

export type NoteId = string;
export type NotebookId = string;
export type ReminderId = string;

export type LinkType = 'note' | 'doc' | 'event';

export interface NoteLink {
  type: LinkType;
  targetId: string;
  /** Cached display label captured at link time. Resolves at render. */
  label?: string;
}

export interface Reminder {
  id: ReminderId;
  noteId: NoteId;
  dueAt: number; // ms epoch
  location?: string;
  /** Mock calendar mirror id when reminder mirroring is enabled. */
  calendarEventId?: string;
  dismissed: boolean;
}

export interface Note {
  id: NoteId;
  /** Optional explicit title; usually derived from first heading or first line. */
  title?: string;
  content: JSONContent;
  notebookId?: NotebookId | null;
  tags: string[];
  pinned: boolean;
  trashed: boolean;
  reminders: Reminder[];
  links: NoteLink[];
  createdAt: number;
  updatedAt: number;
  /** Optional AI-suggested tags awaiting user approval. */
  suggestedTags?: string[];
  /** True for the auto-generated daily note (one per day). */
  daily?: boolean;
  /** Manual sort weight inside notebook (lower = higher in list). */
  sortIndex?: number;
}

export interface Notebook {
  id: NotebookId;
  name: string;
  color: string;
  createdAt: number;
}

export interface TagInfo {
  name: string;
  color: string;
  count: number;
}

export interface Task {
  text: string;
  done?: boolean;
}

export interface Decision {
  text: string;
  context?: string;
}

export interface LinkCandidate {
  type: LinkType;
  targetId: string;
  label: string;
  snippet?: string;
}

export interface LinkSuggestion extends LinkCandidate {
  reason: string;
  score: number;
}

export interface NoteListSort {
  by: 'updated' | 'created' | 'title' | 'manual';
  dir: 'asc' | 'desc';
}

export interface NoteListFilter {
  tag?: string;
  notebookId?: NotebookId;
  hasReminder?: boolean;
  linkedToDoc?: boolean;
  linkedToEvent?: boolean;
  query?: string;
}

export interface SmartView {
  id: string;
  name: string;
  description: string;
  /** Returns notes that match this view, computed from current notes. */
  predicate: (note: Note) => boolean;
}

export type NotesViewMode = 'list' | 'split' | 'focused';
