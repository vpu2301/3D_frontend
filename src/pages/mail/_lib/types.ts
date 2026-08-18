export type MailCategory = 'important' | 'updates' | 'promos' | 'calendar';
export type MailFolder =
  | 'inbox'
  | 'important'
  | 'sent'
  | 'drafts'
  | 'scheduled'
  | 'snoozed'
  | 'archive'
  | 'spam'
  | 'all'
  | 'trash';

export interface ContactRef {
  contactId?: string;
  name: string;
  email: string;
}

export interface AttachmentRef {
  driveFileId: string;
  filename: string;
  mimeType?: string;
  size?: number;
}

export type ContextRefType = 'doc' | 'note' | 'event' | 'task';

export interface ContextRef {
  type: ContextRefType;
  targetId: string;
  label?: string;
}

export interface AiTone {
  tone: 'urgent' | 'frustrated' | 'casual' | 'formal' | 'friendly' | 'neutral';
  confidence: number;
}

export interface ThreadSummary {
  paragraph: string;
  keyPoints: string[];
  decisions: string[];
  openQuestions: string[];
  generatedAt: number;
}

export interface RsvpInfo {
  eventTitle: string;
  proposedStart: number;
  proposedEnd: number;
  organizer: ContactRef;
  status?: 'pending' | 'accepted' | 'declined' | 'tentative';
}

export interface Email {
  id: string;
  threadId: string;
  inReplyTo?: string;
  references?: string[];

  from: ContactRef;
  to: ContactRef[];
  cc: ContactRef[];
  bcc: ContactRef[];

  subject: string;
  snippet: string;
  /** HTML body — stored separately; this metadata holds true if there is an HTML body. */
  hasHtml: boolean;
  /** Plain-text fallback. */
  bodyText?: string;

  attachments: AttachmentRef[];
  contextRefs: ContextRef[];

  receivedAt: number;
  sentAt?: number;
  direction: 'incoming' | 'outgoing';

  labels: string[];
  category?: MailCategory;
  aiTone?: AiTone;
  rsvp?: RsvpInfo;

  isRead: boolean;
  isStarred: boolean;
  isSnoozed: boolean;
  snoozeUntil?: number;
  isScheduled: boolean;
  scheduledFor?: number;
  isDraft: boolean;
  draftLastSavedAt?: number;
  isSpam: boolean;
  isTrashed: boolean;
  /** Manual override beyond category. */
  folderOverride?: 'archive' | 'spam';
}

export interface Thread {
  id: string;
  subject: string;
  participants: ContactRef[];
  emailIds: string[];
  lastMessageAt: number;
  hasUnread: boolean;
  hasAttachments: boolean;
  summary?: ThreadSummary;
  awaitingReplyFromUser: boolean;
  awaitingReplyFromOthers: boolean;
  /** Set when the user has applied a category override; this category sticks. */
  categoryOverride?: MailCategory;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  emoji?: string;
  parentId?: string | null;
}

export interface Draft {
  id: string;
  threadId?: string;
  replyToEmailId?: string;
  subject: string;
  to: ContactRef[];
  cc: ContactRef[];
  bcc: ContactRef[];
  bodyHtml: string;
  attachments: AttachmentRef[];
  contextRefs: ContextRef[];
  scheduledFor?: number;
  createdAt: number;
  updatedAt: number;
}

export type FilterCondition =
  | { kind: 'from'; value: string }
  | { kind: 'to'; value: string }
  | { kind: 'subject-contains'; value: string }
  | { kind: 'has-attachment'; value: boolean };

export type FilterAction =
  | { kind: 'apply-label'; labelId: string }
  | { kind: 'archive' }
  | { kind: 'mark-read' }
  | { kind: 'star' }
  | { kind: 'set-category'; category: MailCategory };

export interface FilterRule {
  id: string;
  conditions: FilterCondition[];
  actions: FilterAction[];
  createdBy: 'user' | 'ai';
  createdAt: number;
}

export interface SmartView {
  id: string;
  name: string;
  emoji?: string;
  definition: string;
  isAiCurated: boolean;
  /** When falsy, computed live by predicate. When set, fixed list of email ids. */
  emailIds?: string[];
  /** Built-in views supply a predicate; custom AI-curated views populate emailIds. */
  builtInKey?: 'awaiting-reply' | 'sent-awaiting' | 'mentions-me' | 'vips';
  lastComputedAt?: number;
}

export interface CategoryOverride {
  fromPattern: string;
  targetCategory: MailCategory;
  createdAt: number;
}

export interface SearchFilters {
  text?: string;
  from?: string;
  to?: string;
  hasAttachment?: boolean;
  before?: number;
  after?: number;
  label?: string;
  folder?: MailFolder;
  category?: MailCategory;
}

export interface DailyDigest {
  generatedAt: number;
  totalImportant: number;
  needReplyToday: number;
  meetings: number;
  fyi: number;
  highlights: { threadId: string; reason: string }[];
}

export interface PreSendIssue {
  kind: 'missing-attachment' | 'name-mismatch' | 'tone' | 'promised-action';
  message: string;
  /** Optional: a suggested action e.g. create a follow-up task. */
  suggestion?: string;
}

export type ReplyIntent =
  | 'acknowledge'
  | 'decline'
  | 'ask-more-info'
  | 'confirm-and-propose-time'
  | 'push-back'
  | 'free-form';

export interface TriageSuggestion {
  action:
    | 'reply'
    | 'archive'
    | 'snooze'
    | 'make-task'
    | 'forward';
  reason: string;
  /** For snooze: hours from now. For forward: target email. */
  snoozeHours?: number;
  forwardTo?: string;
}
