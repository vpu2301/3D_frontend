export interface CalendarAgent {
  id: string;
  name: string;
  role: string;
  email: string;
}

export const CALENDAR_AGENTS: CalendarAgent[] = [
  { id: 'agent-aria', name: 'Aria', role: 'Sales', email: 'aria@agents.local' },
  { id: 'agent-atlas', name: 'Atlas', role: 'Support', email: 'atlas@agents.local' },
  { id: 'agent-felix', name: 'Felix', role: 'Finance', email: 'felix@agents.local' },
  { id: 'agent-maya', name: 'Maya', role: 'Marketing', email: 'maya@agents.local' },
];
