import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Bot,
  Clock,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Users,
  Video,
  X,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { calendarStore, useCalendar } from '../../_hooks/use-calendar-store';
import { CALENDAR_AGENTS } from '../../_lib/agents';
import { PALETTE } from '../../_lib/palette';
import { parseUTC } from '../../_lib/time';
import type { CalendarEvent } from '../../_lib/types';
import { cn } from '@/lib/utils';

type Provider = 'none' | 'meet' | 'zoom' | 'teams';
type Attendee = NonNullable<CalendarEvent['attendees']>[number];

export type EventDialogState =
  | { mode: 'create'; draft: Omit<CalendarEvent, 'id'> }
  | { mode: 'edit'; id: string }
  | null;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  state: EventDialogState;
}

function toDateInput(iso: string): string {
  return format(parseUTC(iso), 'yyyy-MM-dd');
}
function toTimeInput(iso: string): string {
  return format(parseUTC(iso), 'HH:mm');
}
function fromInputs(date: string, time: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0).toISOString();
}

export function EventDialog({ open, onOpenChange, state }: Props) {
  const calendars = useCalendar(s => s.calendars);

  const [title, setTitle] = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [location, setLocation] = useState('');
  const [video, setVideo] = useState<Provider>('none');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [prepNotes, setPrepNotes] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [attendeeInput, setAttendeeInput] = useState('');

  useEffect(() => {
    if (!open || !state) return;
    let seed: Omit<CalendarEvent, 'id'> | CalendarEvent | null = null;
    if (state.mode === 'edit') {
      seed =
        calendarStore.getState().events.find(e => e.id === state.id) ?? null;
    } else {
      seed = state.draft;
    }
    if (!seed) return;
    setTitle(seed.title ?? '');
    setCalendarId(seed.calendarId);
    setStartDate(toDateInput(seed.start));
    setStartTime(toTimeInput(seed.start));
    setEndDate(toDateInput(seed.end));
    setEndTime(toTimeInput(seed.end));
    setAllDay(!!seed.allDay);
    setIsFocus(!!seed.isFocusBlock);
    setLocation(seed.location ?? '');
    setVideo(seed.conferencing?.provider ?? 'none');
    setVideoUrl(seed.conferencing?.url ?? '');
    setDescription(seed.description ?? '');
    setPrepNotes(seed.prepNotes ?? '');
    setAttendees(seed.attendees ?? []);
    setAttendeeInput('');
  }, [open, state]);

  if (!state) return null;
  const isEdit = state.mode === 'edit';

  function addAttendeeFromInput() {
    const v = attendeeInput.trim();
    if (!v) return;
    if (attendees.some(a => a.email.toLowerCase() === v.toLowerCase())) {
      setAttendeeInput('');
      return;
    }
    setAttendees([...attendees, { email: v, response: 'pending' }]);
    setAttendeeInput('');
  }
  function removeAttendee(email: string) {
    setAttendees(attendees.filter(a => a.email !== email));
  }
  function addAgent(agentId: string) {
    const ag = CALENDAR_AGENTS.find(a => a.id === agentId);
    if (!ag) return;
    if (attendees.some(a => a.email === ag.email)) return;
    setAttendees([
      ...attendees,
      { email: ag.email, name: ag.name, response: 'yes', isAgent: true },
    ]);
  }

  function buildPayload(): Omit<CalendarEvent, 'id'> {
    const start = allDay
      ? fromInputs(startDate, '00:00')
      : fromInputs(startDate, startTime);
    const end = allDay
      ? fromInputs(endDate, '23:59')
      : fromInputs(endDate, endTime);
    const conferencing =
      video !== 'none' && videoUrl.trim()
        ? { provider: video, url: videoUrl.trim() }
        : undefined;
    return {
      calendarId,
      title: title.trim() || 'Untitled event',
      start,
      end,
      allDay: allDay || undefined,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      attendees: attendees.length ? attendees : undefined,
      conferencing,
      isFocusBlock: isFocus || undefined,
      prepNotes: prepNotes.trim() || undefined,
    };
  }

  function save() {
    const payload = buildPayload();
    if (state && state.mode === 'edit') {
      calendarStore.updateEvent(state.id, payload);
    } else {
      calendarStore.createEvent(payload);
    }
    onOpenChange(false);
  }

  function deleteEvent() {
    if (state && state.mode === 'edit') {
      calendarStore.deleteEvent(state.id);
      onOpenChange(false);
    }
  }

  const palette =
    PALETTE[calendars.find(c => c.id === calendarId)?.colorToken ?? 'blue'];
  const availableAgents = CALENDAR_AGENTS.filter(
    a => !attendees.some(at => at.email === a.email),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] gap-0 overflow-hidden p-0">
        <header className="flex items-center justify-between border-b border-gray-200/70 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className={cn('h-2.5 w-2.5 rounded-full', palette.dot)} />
            <span className="text-sm font-semibold text-gray-900">
              {isEdit ? 'Edit event' : 'New event'}
            </span>
            {isFocus && (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                Focus
              </span>
            )}
          </div>
        </header>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
          <Input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Add title"
            className="h-auto border-0 px-0 text-xl font-semibold shadow-none focus-visible:ring-0"
          />

          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              Time
              <div className="ml-auto flex items-center gap-2">
                <Label
                  htmlFor="ed-allday"
                  className="text-xs font-medium text-gray-500"
                >
                  All-day
                </Label>
                <Switch
                  id="ed-allday"
                  checked={allDay}
                  onCheckedChange={setAllDay}
                />
              </div>
            </div>
            <div
              className={cn(
                'grid gap-2',
                allDay ? 'grid-cols-2' : 'grid-cols-2',
              )}
            >
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="h-9 text-sm"
              />
              {!allDay && (
                <Input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="h-9 text-sm"
                />
              )}
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="h-9 text-sm"
              />
              {!allDay && (
                <Input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="h-9 text-sm"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1 block text-xs font-medium text-gray-500">
                Calendar
              </Label>
              <Select value={calendarId} onValueChange={setCalendarId}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select calendar" />
                </SelectTrigger>
                <SelectContent>
                  {calendars.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full',
                            PALETTE[c.colorToken].dot,
                          )}
                        />
                        {c.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2 pb-1.5">
              <Switch
                id="ed-focus"
                checked={isFocus}
                onCheckedChange={setIsFocus}
              />
              <Label
                htmlFor="ed-focus"
                className="text-xs font-medium text-gray-600"
              >
                Mark as focus block
              </Label>
            </div>
          </div>

          <div>
            <Label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              Location
            </Label>
            <Input
              placeholder="Add location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <div>
            <Label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Video className="h-3.5 w-3.5" />
              Video conferencing
            </Label>
            <div className="grid grid-cols-[160px_1fr] gap-2">
              <Select
                value={video}
                onValueChange={v => setVideo(v as Provider)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="meet">Google Meet</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="teams">Teams</SelectItem>
                </SelectContent>
              </Select>
              <Input
                disabled={video === 'none'}
                placeholder={
                  video === 'none' ? 'Pick a provider' : 'Meeting URL'
                }
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Users className="h-3.5 w-3.5" />
              Attendees
            </Label>
            <div className="flex gap-2">
              <Input
                value={attendeeInput}
                onChange={e => setAttendeeInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAttendeeFromInput();
                  }
                }}
                placeholder="email@example.com"
                className="h-9 flex-1 text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttendeeFromInput}
                className="h-9 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Bot className="h-3.5 w-3.5 text-violet-500" />
              <span className="text-xs font-medium text-gray-500">
                Add AI agent:
              </span>
              <Select value="" onValueChange={addAgent}>
                <SelectTrigger className="h-8 w-[220px] text-xs">
                  <SelectValue
                    placeholder={
                      availableAgents.length
                        ? 'Pick an agent'
                        : 'All agents added'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableAgents.map(a => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} · {a.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {attendees.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {attendees.map(a => (
                  <li
                    key={a.email}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs',
                      a.isAgent
                        ? 'border-violet-200 bg-violet-50 text-violet-800'
                        : 'border-gray-200 bg-gray-50 text-gray-700',
                    )}
                  >
                    {a.isAgent && <Bot className="h-3 w-3 text-violet-500" />}
                    <span>{a.name ?? a.email}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${a.email}`}
                      className="text-gray-400 hover:text-rose-600"
                      onClick={() => removeAttendee(a.email)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <Label className="mb-1 block text-xs font-medium text-gray-500">
              Description
            </Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Notes, agenda, links…"
              className="text-sm"
            />
          </div>

          <div>
            <Label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Sparkles className="h-3.5 w-3.5" />
              Prep notes
            </Label>
            <Textarea
              value={prepNotes}
              onChange={e => setPrepNotes(e.target.value)}
              rows={2}
              placeholder="What the assistant should brief you on…"
              className="text-sm"
            />
          </div>
        </div>

        <footer className="flex items-center gap-2 border-t border-gray-200/70 bg-gray-50/40 px-5 py-3">
          {isEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              onClick={deleteEvent}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete
            </Button>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600"
              onClick={save}
            >
              {isEdit ? 'Save' : 'Create'}
            </Button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
