export type CalendarView = 'day' | '3day' | 'week' | 'month' | 'agenda';

export type AccountProvider = 'google' | 'outlook' | 'local';

export interface CalendarAccount {
  id: string;
  provider: AccountProvider;
  email: string;
  displayName: string;
  connected: boolean;
}

export interface SubCalendar {
  id: string;
  accountId: string;
  name: string;
  colorToken: PaletteToken;
  visible: boolean;
}

export type PaletteToken =
  | 'blue'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'sky'
  | 'indigo';

export interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  start: string; // ISO UTC
  end: string;   // ISO UTC
  allDay?: boolean;
  location?: string;
  description?: string;
  attendees?: { email: string; name?: string; response?: 'yes' | 'no' | 'maybe' | 'pending'; isAgent?: boolean }[];
  conferencing?: { provider: 'meet' | 'zoom' | 'teams'; url: string };
  isFocusBlock?: boolean;
  prepNotes?: string;
  createdBy?: 'user' | 'ai';
}

export interface ActivityLogEntry {
  id: string;
  at: string; // ISO UTC
  actor: 'user' | 'ai';
  action: 'create' | 'move' | 'delete' | 'update' | 'focus';
  eventId: string;
  summary: string;
  // snapshot for undo
  before?: CalendarEvent | null;
  after?: CalendarEvent | null;
  undone?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  at: string;
  content: string;
  toolCalls?: ToolCall[];
  streaming?: boolean;
}

export interface ToolCall {
  id: string;
  name: 'createEvent' | 'moveEvent' | 'findTime' | 'summarizeDay' | 'prepForMeeting';
  args: Record<string, unknown>;
  before?: CalendarEvent | null;
  after?: CalendarEvent | null;
  status: 'proposed' | 'applied' | 'undone';
}
