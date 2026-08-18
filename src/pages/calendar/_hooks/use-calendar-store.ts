import { useSyncExternalStore } from 'react';
import { addMinutes } from 'date-fns';
import type {
  ActivityLogEntry,
  CalendarAccount,
  CalendarEvent,
  CalendarView,
  ChatMessage,
  SubCalendar,
} from '../_lib/types';

interface State {
  accounts: CalendarAccount[];
  calendars: SubCalendar[];
  events: CalendarEvent[];
  view: CalendarView;
  anchorISO: string;
  selectedEventId: string | null;
  chatOpen: boolean;
  chatMessages: ChatMessage[];
  paletteOpen: boolean;
  activity: ActivityLogEntry[];
}

type Listener = () => void;

const listeners = new Set<Listener>();
let state: State = initial();

function initial(): State {
  const now = new Date();
  const todayISO = now.toISOString();
  const t = (hOffset: number, mins = 60) => {
    const d = new Date(now);
    d.setHours(hOffset, 0, 0, 0);
    return { start: d.toISOString(), end: addMinutes(d, mins).toISOString() };
  };

  const accounts: CalendarAccount[] = [
    { id: 'acc-work', provider: 'google', email: 'you@company.com', displayName: 'Work', connected: true },
    { id: 'acc-personal', provider: 'outlook', email: 'you@personal.com', displayName: 'Personal', connected: true },
  ];
  const calendars: SubCalendar[] = [
    { id: 'cal-work', accountId: 'acc-work', name: 'Work', colorToken: 'blue', visible: true },
    { id: 'cal-focus', accountId: 'acc-work', name: 'Focus blocks', colorToken: 'violet', visible: true },
    { id: 'cal-personal', accountId: 'acc-personal', name: 'Personal', colorToken: 'emerald', visible: true },
    { id: 'cal-team', accountId: 'acc-work', name: 'Team', colorToken: 'amber', visible: true },
  ];

  const events: CalendarEvent[] = [
    {
      id: 'e1',
      calendarId: 'cal-work',
      title: 'Standup',
      ...t(9, 30),
      attendees: [
        { email: 'sana@company.com', name: 'Sana', response: 'yes' },
        { email: 'marco@company.com', name: 'Marco', response: 'yes' },
      ],
      conferencing: { provider: 'meet', url: 'https://meet.example.com/abc-defg-hij' },
    },
    {
      id: 'e2',
      calendarId: 'cal-focus',
      title: 'Deep work',
      ...t(10, 120),
      isFocusBlock: true,
    },
    {
      id: 'e3',
      calendarId: 'cal-work',
      title: 'Design review — Calendar v1',
      ...t(14, 60),
      location: 'Zoom',
      prepNotes: 'Walk through week/day grid, palette, and AI sidebar. Push for parity sign-off.',
      attendees: [{ email: 'design-lead@company.com', name: 'Riya', response: 'pending' }],
    },
    {
      id: 'e4',
      calendarId: 'cal-personal',
      title: 'Gym',
      ...t(18, 60),
    },
    {
      id: 'e5',
      calendarId: 'cal-team',
      title: 'Hiring sync',
      ...t(11, 45),
    },
  ];

  return {
    accounts,
    calendars,
    events,
    view: 'week',
    anchorISO: todayISO,
    selectedEventId: null,
    chatOpen: true,
    chatMessages: [
      {
        id: 'm0',
        role: 'assistant',
        at: new Date().toISOString(),
        content:
          "I'm watching your week. Try: \"lunch with Sana Thursday at 1\", \"protect 2 hours every morning for deep work\", or ask me to summarize today.",
      },
    ],
    paletteOpen: false,
    activity: [],
  };
}

function notify() {
  for (const l of listeners) l();
}

function set(patch: Partial<State> | ((s: State) => Partial<State>)) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p };
  notify();
}

export const calendarStore = {
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getState(): State {
    return state;
  },
  // ── view / nav ────────────────────────────────────────────────
  setView(v: CalendarView) { set({ view: v }); },
  setAnchor(iso: string) { set({ anchorISO: iso }); },
  // ── selection / panels ────────────────────────────────────────
  select(id: string | null) { set({ selectedEventId: id }); },
  toggleChat() { set(s => ({ chatOpen: !s.chatOpen })); },
  setPalette(open: boolean) { set({ paletteOpen: open }); },
  // ── calendars ─────────────────────────────────────────────────
  toggleCalendar(id: string) {
    set(s => ({
      calendars: s.calendars.map(c => (c.id === id ? { ...c, visible: !c.visible } : c)),
    }));
  },
  // ── events ────────────────────────────────────────────────────
  createEvent(
    e: Omit<CalendarEvent, 'id'>,
    opts: { actor?: 'user' | 'ai'; summary?: string } = {},
  ): CalendarEvent {
    const id = `e-${Math.random().toString(36).slice(2, 10)}`;
    const full: CalendarEvent = { ...e, id, createdBy: opts.actor ?? 'user' };
    set(s => ({ events: [...s.events, full] }));
    logActivity({
      actor: opts.actor ?? 'user',
      action: e.isFocusBlock ? 'focus' : 'create',
      eventId: id,
      summary: opts.summary ?? `Created "${full.title}"`,
      before: null,
      after: full,
    });
    return full;
  },
  updateEvent(
    id: string,
    patch: Partial<CalendarEvent>,
    opts: { actor?: 'user' | 'ai'; summary?: string } = {},
  ) {
    const before = state.events.find(e => e.id === id) ?? null;
    if (!before) return;
    const after: CalendarEvent = { ...before, ...patch };
    set(s => ({ events: s.events.map(e => (e.id === id ? after : e)) }));
    logActivity({
      actor: opts.actor ?? 'user',
      action: 'update',
      eventId: id,
      summary: opts.summary ?? `Updated "${after.title}"`,
      before,
      after,
    });
  },
  moveEvent(
    id: string,
    newStart: string,
    newEnd: string,
    opts: { actor?: 'user' | 'ai'; summary?: string } = {},
  ) {
    const before = state.events.find(e => e.id === id) ?? null;
    if (!before) return;
    const after: CalendarEvent = { ...before, start: newStart, end: newEnd };
    set(s => ({ events: s.events.map(e => (e.id === id ? after : e)) }));
    logActivity({
      actor: opts.actor ?? 'user',
      action: 'move',
      eventId: id,
      summary: opts.summary ?? `Moved "${before.title}"`,
      before,
      after,
    });
  },
  deleteEvent(id: string, opts: { actor?: 'user' | 'ai' } = {}) {
    const before = state.events.find(e => e.id === id) ?? null;
    if (!before) return;
    set(s => ({ events: s.events.filter(e => e.id !== id), selectedEventId: null }));
    logActivity({
      actor: opts.actor ?? 'user',
      action: 'delete',
      eventId: id,
      summary: `Deleted "${before.title}"`,
      before,
      after: null,
    });
  },
  // ── undo ──────────────────────────────────────────────────────
  undo(entryId: string) {
    const entry = state.activity.find(a => a.id === entryId);
    if (!entry || entry.undone) return;
    set(s => {
      let events = s.events;
      if (entry.action === 'create' || entry.action === 'focus') {
        events = events.filter(e => e.id !== entry.eventId);
      } else if (entry.action === 'delete' && entry.before) {
        events = [...events, entry.before];
      } else if ((entry.action === 'move' || entry.action === 'update') && entry.before) {
        events = events.map(e => (e.id === entry.eventId ? entry.before! : e));
      }
      return {
        events,
        activity: s.activity.map(a => (a.id === entryId ? { ...a, undone: true } : a)),
      };
    });
  },
  // ── chat ──────────────────────────────────────────────────────
  appendMessage(m: Omit<ChatMessage, 'id' | 'at'>) {
    const msg: ChatMessage = {
      ...m,
      id: `m-${Math.random().toString(36).slice(2, 10)}`,
      at: new Date().toISOString(),
    };
    set(s => ({ chatMessages: [...s.chatMessages, msg] }));
    return msg.id;
  },
  patchMessage(id: string, patch: Partial<ChatMessage>) {
    set(s => ({
      chatMessages: s.chatMessages.map(m => (m.id === id ? { ...m, ...patch } : m)),
    }));
  },
};

function logActivity(entry: Omit<ActivityLogEntry, 'id' | 'at'>) {
  set(s => ({
    activity: [
      {
        ...entry,
        id: `a-${Math.random().toString(36).slice(2, 10)}`,
        at: new Date().toISOString(),
      },
      ...s.activity,
    ].slice(0, 200),
  }));
}

export function useCalendar<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    calendarStore.subscribe,
    () => selector(calendarStore.getState()),
    () => selector(calendarStore.getState()),
  );
}
