import type { JSONContent } from '@tiptap/react';

export type DocId = string;
export type FolderId = string;

export interface Snapshot {
  id: string;
  takenAt: number;
  content: JSONContent;
  title: string;
  wordCount: number;
}

export interface CommentReply {
  id: string;
  author: string;
  body: string;
  createdAt: number;
}

export interface CommentThread {
  id: string;
  anchor: string; // serialized anchor (mark id) within the doc
  replies: CommentReply[];
  resolved: boolean;
  createdAt: number;
}

export interface Doc {
  id: DocId;
  title: string;
  icon?: string;
  cover?: string;
  content: JSONContent;
  folderId?: FolderId | null;
  starred: boolean;
  trashed: boolean;
  shared: boolean;
  createdAt: number;
  updatedAt: number;
  snapshots: Snapshot[];
  comments: CommentThread[];
  summary?: string;
}

export interface Folder {
  id: FolderId;
  name: string;
  parentId?: FolderId | null;
  createdAt: number;
}

export type ViewMode = 'grid' | 'list';
export type DashboardFilter = 'all' | 'owned' | 'shared' | 'recent' | 'starred';

export type PresetAction =
  | 'improve'
  | 'shorter'
  | 'longer'
  | 'grammar'
  | 'tone-professional'
  | 'tone-casual'
  | 'tone-confident'
  | 'tone-friendly'
  | 'translate-spanish'
  | 'translate-french'
  | 'translate-german'
  | 'translate-japanese'
  | 'summarize'
  | 'explain';

export type AiTone = 'professional' | 'casual' | 'confident' | 'friendly';

export type Theme = 'light' | 'dark' | 'system';
export type EditorFont = 'sans' | 'serif' | 'mono';
export type PageWidth = 'narrow' | 'wide' | 'full';

export interface OutlineNode {
  level: number;
  text: string;
  id: string;
}

export interface AiProposal {
  id: string;
  kind: 'replace-selection' | 'replace-doc' | 'insert' | 'replace-range';
  before: string;
  after: string;
  range?: { from: number; to: number };
  description: string;
  createdAt: number;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  proposal?: AiProposal;
  createdAt: number;
  pending?: boolean;
}

export interface DocTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  content: JSONContent;
  suggestedPrompts: string[];
}
