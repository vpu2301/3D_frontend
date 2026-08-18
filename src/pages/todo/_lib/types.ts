import type { JSONContent } from '@tiptap/react';

export type TaskId = string;
export type ProjectId = string;
export type ListId = string;
export type SmartListId = string;
export type ReminderId = string;

export type Priority = 1 | 2 | 3 | 4; // 1 = highest

export type RecurrenceFreq = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface RecurrenceRule {
  freq: RecurrenceFreq;
  /** Every N units. */
  interval: number;
  /** For weekly: ['mo','we','fr']. */
  byday?: string[];
  /** ISO date — series ends after this. */
  until?: number;
  /** Free-form custom rule label, used when freq === 'custom'. */
  custom?: string;
}

export interface Reminder {
  id: ReminderId;
  taskId: TaskId;
  remindAt: number;
  dismissed: boolean;
}

export type AttachmentType = 'doc' | 'note' | 'drive' | 'event';

export interface Attachment {
  type: AttachmentType;
  targetId: string;
  /** Cached label captured at link time; resolves at render. */
  label?: string;
}

export type ActivityType = 'created' | 'edited' | 'completed' | 'uncompleted' | 'snoozed' | 'rescheduled' | 'broken-down';

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  at: number;
  meta?: string;
}

export interface Task {
  id: TaskId;
  title: string;
  description?: JSONContent;
  completed: boolean;
  completedAt?: number;
  /** Hard deadline. */
  dueAt?: number;
  /** Optional explicit scheduled date (e.g. when planned for Today). */
  scheduledAt?: number;
  reminders: Reminder[];
  priority: Priority;
  /** Estimate in minutes. */
  estimate?: number;
  /** Optional auto-suggested estimate, awaiting user accept/dismiss. */
  suggestedEstimate?: number;
  /** Subtask parent. */
  parentId?: TaskId | null;
  projectId?: ProjectId | null;
  listId?: ListId | null;
  tags: string[];
  recurrence?: RecurrenceRule;
  attachments: Attachment[];
  /** Set when this task was extracted from another module. */
  sourceModule?: 'notes' | 'docs' | 'calendar' | 'mail';
  sourceId?: string;
  activity: ActivityEntry[];
  /** Manual sort weight within its parent (project/list/inbox). */
  order: number;
  trashed: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: ProjectId;
  name: string;
  emoji?: string;
  color?: string;
  description?: JSONContent;
  /** Optional deadline for the whole project. */
  deadline?: number;
  archived: boolean;
  linkedDocIds: string[];
  linkedNoteIds: string[];
  linkedFileIds: string[];
  createdAt: number;
}

export interface List {
  id: ListId;
  name: string;
  projectId?: ProjectId;
  emoji?: string;
  color?: string;
  archived: boolean;
  createdAt: number;
}

export interface SmartList {
  id: SmartListId;
  name: string;
  /** Natural-language definition the mock AI uses to populate. */
  definition: string;
  isAiCurated: boolean;
  taskIds: TaskId[];
  lastComputedAt?: number;
  emoji?: string;
}

export interface ParsedTask {
  title: string;
  dueAt?: number;
  scheduledAt?: number;
  priority?: Priority;
  tags: string[];
  projectId?: ProjectId;
  listId?: ListId;
  assignee?: string;
  estimate?: number;
}

export interface TriageProposal {
  taskId: TaskId;
  priority?: Priority;
  dueAt?: number;
  projectId?: ProjectId;
  listId?: ListId;
  tags?: string[];
  reason: string;
}

export interface DailyPlanBlock {
  taskId: TaskId;
  startAt: number;
  endAt: number;
}

export interface DailyPlan {
  /** Ordered task ids for today (top to bottom). */
  orderedTaskIds: TaskId[];
  /** Optional time-blocks to mirror to Calendar. */
  blocks: DailyPlanBlock[];
  /** Why the plan is structured this way. */
  rationale: string;
}

export interface PrioritySuggestion {
  taskId: TaskId;
  newPriority: Priority;
  reason: string;
}

export type TodoView =
  | 'inbox'
  | 'today'
  | 'upcoming'
  | 'all'
  | 'completed'
  | 'focus'
  | 'list'
  | 'project'
  | 'tag'
  | 'smart'
  | 'trash';
