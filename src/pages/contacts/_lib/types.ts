import type { JSONContent } from '@tiptap/react';

export type ContactId = string;
export type GroupId = string;
export type SmartViewId = string;

export interface LabeledValue<T = string> {
  value: T;
  label: string;
  primary?: boolean;
}

export interface ImportantDate {
  value: number; // ms epoch
  label: string;
}

export interface CustomField {
  key: string;
  value: string;
}

export interface RelationshipStrength {
  score: number; // 0–100
  label: 'strong' | 'active' | 'cooling' | 'quiet';
  computedAt: number;
  factors: { label: string; weight: number; value: string }[];
}

export interface AiSummary {
  text: string;
  generatedAt: number;
  /** Cited interaction ids used to ground the summary. */
  citedInteractionIds?: string[];
}

export type CadenceType = 'every-x-days' | 'monthly' | 'quarterly' | 'never';

export interface Cadence {
  type: CadenceType;
  days?: number;
}

export interface StalenessState {
  intent: Cadence;
  lastSignaledAt?: number;
  suppressedUntil?: number;
}

export interface LinkedContact {
  id: ContactId;
  /** Free-text relationship label, e.g., "Reports to", "Spouse", "Co-author". */
  relationship: string;
}

export type ContactSource = 'manual' | 'import' | 'auto-from-email' | 'merged';

export interface Contact {
  id: ContactId;
  firstName: string;
  lastName: string;
  /** Optional display-name override. */
  displayName?: string;
  pronouns?: string;
  /** Data URL or undefined → fall back to generated boring-avatar. */
  photoUrl?: string;
  organization?: string;
  title?: string;
  emails: LabeledValue[];
  phones: LabeledValue[];
  urls: LabeledValue[];
  addresses: LabeledValue[];
  importantDates: ImportantDate[];
  customFields: CustomField[];
  /** Free-text relationship notes, TipTap JSON. */
  notes?: JSONContent;
  aiSummary?: AiSummary;
  relationshipStrength?: RelationshipStrength;
  staleness?: StalenessState;
  tags: string[];
  groupIds: GroupId[];
  starred: boolean;
  /** Mocked: true when primary email domain differs from the user's. */
  isExternal: boolean;
  linkedContactIds: LinkedContact[];
  source: ContactSource;
  trashed: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Group {
  id: GroupId;
  name: string;
  color?: string;
  emoji?: string;
  description?: string;
  contactIds: ContactId[];
}

export type InteractionType =
  | 'email'
  | 'meeting'
  | 'doc-share'
  | 'note-mention'
  | 'drive-share'
  | 'task-assign';

export type InteractionDirection = 'incoming' | 'outgoing' | 'neutral';

export interface Interaction {
  id: string;
  contactId: ContactId;
  type: InteractionType;
  direction: InteractionDirection;
  occurredAt: number;
  summary: string;
  sourceModule: 'mail' | 'calendar' | 'docs' | 'notes' | 'drive' | 'todo';
  sourceId: string;
  /** For mail: did the user reply to this thread. Used by relationship strength. */
  replied?: boolean;
}

export interface DuplicateGroup {
  id: string;
  contactIds: ContactId[];
  /** 0–100. */
  confidence: number;
  reason: string;
  resolution: 'merged' | 'not-duplicate' | 'pending';
}

export interface ContactSmartView {
  id: SmartViewId;
  name: string;
  /** Natural-language definition that mock AI uses to populate. */
  definition: string;
  isAiCurated: boolean;
  /** When false, view is computed at render time from a synchronous predicate. */
  precomputed: boolean;
  emoji?: string;
  contactIds: ContactId[];
  lastComputedAt?: number;
}

export type EnrichmentStatus = 'pending' | 'accepted' | 'rejected';

export interface EnrichmentSuggestion {
  id: string;
  contactId: ContactId;
  /** Field name on Contact, e.g. "title", "organization", "pronouns". */
  field: string;
  value: string;
  source: {
    /** Where the snippet came from inside the platform. */
    module: 'mail' | 'calendar' | 'docs' | 'notes' | 'drive' | 'todo';
    sourceId: string;
    snippet: string;
  };
  confidence: number;
  status: EnrichmentStatus;
}

export interface ActionSuggestion {
  id: string;
  contactId: ContactId;
  kind:
    | 'check-in'
    | 'birthday-soon'
    | 'unreplied-email'
    | 'meeting-followup'
    | 'introduce'
    | 'thank-you';
  reason: string;
  /** Optional CTA target route (Mail compose, Calendar composer, etc.). */
  route?: string;
}

export interface StalenessSignal {
  contactId: ContactId;
  reason: string;
  daysSinceLast: number;
  expectedCadenceDays: number;
  /** Suggested next-action route. */
  suggestedRoute?: string;
  suggestedAction?: string;
}

export type ContactView = 'list' | 'grid';
export type ContactSort =
  | 'name-asc'
  | 'name-desc'
  | 'last-interaction'
  | 'recently-added'
  | 'frequency';

export interface ContactFilter {
  groupId?: GroupId;
  tag?: string;
  organization?: string;
  external?: boolean;
  hasPhoto?: boolean;
  missingFields?: boolean;
  query?: string;
}
