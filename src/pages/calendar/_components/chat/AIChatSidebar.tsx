import { useEffect, useRef, useState } from 'react';
import { Pencil, Send, Sparkles, Trash2, Undo2, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { calendarStore, useCalendar } from '../../_hooks/use-calendar-store';
import { mockParse } from '../../_lib/nl-schema';
import { parseUTC } from '../../_lib/time';
import type { CalendarEvent, ToolCall } from '../../_lib/types';

interface Props {
  onOpenEvent?: (id: string) => void;
}

export function AIChatSidebar({ onOpenEvent }: Props = {}) {
  const open = useCalendar(s => s.chatOpen);
  const messages = useCalendar(s => s.chatMessages);
  const activity = useCalendar(s => s.activity);
  const calendars = useCalendar(s => s.calendars);
  const events = useCalendar(s => s.events);
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length, open]);

  if (!open) return null;

  function runAssistant(userText: string) {
    const parsed = mockParse(userText);
    const assistantId = calendarStore.appendMessage({
      role: 'assistant',
      content: '',
      streaming: true,
    });

    // Streaming illusion
    const reply =
      parsed.confidence > 0.7
        ? `Scheduling "${parsed.title}" on ${format(parseUTC(parsed.start), 'EEE, MMM d')} at ${format(parseUTC(parsed.start), 'h:mm a')}.`
        : `I heard "${userText}". I can create this now or you can refine the details.`;

    let i = 0;
    const tick = () => {
      i = Math.min(reply.length, i + 4);
      calendarStore.patchMessage(assistantId, { content: reply.slice(0, i), streaming: i < reply.length });
      if (i < reply.length) setTimeout(tick, 24);
      else {
        if (parsed.confidence > 0.7 && parsed.title) {
          const calId =
            calendars.find(c => c.visible && !c.name.toLowerCase().includes('focus'))?.id
            ?? calendars[0]?.id;
          if (calId) {
            const created = calendarStore.createEvent(
              {
                calendarId: calId,
                title: parsed.title,
                start: parsed.start,
                end: parsed.end,
                location: parsed.location,
              },
              { actor: 'ai', summary: `AI created "${parsed.title}"` },
            );
            const toolCall: ToolCall = {
              id: `tc-${Math.random().toString(36).slice(2, 8)}`,
              name: 'createEvent',
              args: { title: parsed.title },
              before: null,
              after: created,
              status: 'applied',
            };
            calendarStore.patchMessage(assistantId, { toolCalls: [toolCall] });
          }
        }
      }
    };
    setTimeout(tick, 80);
  }

  function send() {
    const text = input.trim();
    if (!text) return;
    calendarStore.appendMessage({ role: 'user', content: text });
    setInput('');
    runAssistant(text);
  }

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col border-l border-gray-200/70 bg-white">
      <header className="flex items-center justify-between border-b border-gray-200/70 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Assistant</p>
        </div>
        <button
          type="button"
          onClick={calendarStore.toggleChat}
          aria-label="Close assistant"
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-3">
          {messages.map(m => (
            <div
              key={m.id}
              className={cn(
                'max-w-[90%] rounded-2xl px-3 py-2 text-sm',
                m.role === 'user'
                  ? 'ml-auto bg-gray-900 text-white'
                  : 'mr-auto bg-gray-100 text-gray-800',
              )}
            >
              <p className="whitespace-pre-wrap">
                {m.content}
                {m.streaming && <span className="inline-block w-1.5 animate-pulse">▍</span>}
              </p>
              {m.toolCalls?.map(tc => (
                <ToolCallCard
                  key={tc.id}
                  tc={tc}
                  liveEvent={
                    tc.after?.id
                      ? events.find(e => e.id === tc.after!.id)
                      : undefined
                  }
                  expanded={!!expanded[tc.id]}
                  onToggle={() =>
                    setExpanded(s => ({ ...s, [tc.id]: !s[tc.id] }))
                  }
                  onOpenEvent={onOpenEvent}
                />
              ))}
            </div>
          ))}
        </div>

        {activity.length > 0 && (
          <div className="mt-5 border-t border-gray-200/70 pt-3">
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Activity
            </h3>
            <ul className="space-y-1.5">
              {activity.slice(0, 6).map(a => {
                const live = events.find(e => e.id === a.eventId);
                const canOpen = !!live && !!onOpenEvent;
                return (
                  <li
                    key={a.id}
                    className={cn(
                      'flex items-start gap-2 rounded-md border border-gray-100 bg-white px-2 py-1.5 text-xs',
                      a.undone && 'opacity-50',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-1 h-1.5 w-1.5 shrink-0 rounded-full',
                        a.actor === 'ai'
                          ? 'bg-gradient-to-br from-blue-500 to-violet-500'
                          : 'bg-gray-400',
                      )}
                    />
                    <button
                      type="button"
                      disabled={!canOpen}
                      onClick={() => canOpen && onOpenEvent!(a.eventId)}
                      className={cn(
                        'min-w-0 flex-1 text-left',
                        canOpen && 'group cursor-pointer',
                      )}
                    >
                      <p
                        className={cn(
                          'truncate text-gray-700',
                          canOpen && 'group-hover:text-blue-600 group-hover:underline',
                        )}
                      >
                        {a.summary}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {format(parseUTC(a.at), 'h:mm a')} · {a.actor}
                      </p>
                    </button>
                    {!a.undone && (a.before || a.action !== 'delete') && (
                      <button
                        type="button"
                        onClick={() => calendarStore.undo(a.id)}
                        className="inline-flex shrink-0 items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-600 hover:bg-gray-50"
                      >
                        <Undo2 className="h-2.5 w-2.5" />
                        Undo
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200/70 p-3">
        <div className="relative">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Ask or schedule anything…"
            className="resize-none pr-10 text-sm"
          />
          <Button
            size="sm"
            onClick={send}
            disabled={!input.trim()}
            className="absolute bottom-2 right-2 h-7 w-7 p-0"
            aria-label="Send"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="mt-1 text-[10px] text-gray-400">
          Every AI action is logged and undoable.
        </p>
      </div>
    </aside>
  );
}

interface ToolCallCardProps {
  tc: ToolCall;
  liveEvent?: CalendarEvent;
  expanded: boolean;
  onToggle: () => void;
  onOpenEvent?: (id: string) => void;
}

function ToolCallCard({
  tc,
  liveEvent,
  expanded,
  onToggle,
  onOpenEvent,
}: ToolCallCardProps) {
  const eventId = tc.after?.id;
  const canManage = !!liveEvent && tc.status !== 'undone';
  const display = liveEvent ?? tc.after ?? undefined;

  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white/80 text-[11px] text-gray-700">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-1.5 px-2 py-2 text-left hover:bg-gray-50"
      >
        <span className="rounded bg-gray-900 px-1 py-0.5 font-mono text-[9px] text-white">
          {tc.name}
        </span>
        <span
          className={cn(
            'rounded px-1 py-0.5 text-[9px] uppercase',
            tc.status === 'applied' && 'bg-emerald-100 text-emerald-700',
            tc.status === 'proposed' && 'bg-amber-100 text-amber-700',
            tc.status === 'undone' && 'bg-gray-100 text-gray-500',
          )}
        >
          {tc.status}
        </span>
        {display && (
          <span className="ml-auto truncate text-gray-500">
            {display.title}
          </span>
        )}
        <span className="ml-1 text-gray-400">{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && display && (
        <div className="space-y-2 border-t border-gray-100 px-2 py-2">
          <div>
            <p className="font-medium text-gray-900">{display.title}</p>
            <p className="text-[10px] text-gray-500">
              {format(parseUTC(display.start), 'EEE, MMM d · h:mm a')} –{' '}
              {format(parseUTC(display.end), 'h:mm a')}
            </p>
          </div>
          {display.location && (
            <p className="text-[10px] text-gray-600">📍 {display.location}</p>
          )}
          {display.attendees && display.attendees.length > 0 && (
            <p className="text-[10px] text-gray-600">
              👥 {display.attendees.map(a => a.name ?? a.email).join(', ')}
            </p>
          )}
          {display.description && (
            <p className="whitespace-pre-wrap text-[10px] text-gray-600">
              {display.description}
            </p>
          )}
          {!liveEvent && (
            <p className="text-[10px] italic text-gray-400">
              {tc.status === 'undone'
                ? 'This action was undone.'
                : 'Event no longer exists.'}
            </p>
          )}
          {canManage && eventId && (
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onOpenEvent?.(eventId);
                }}
                className="inline-flex items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-700 hover:bg-gray-50"
              >
                <Pencil className="h-2.5 w-2.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  if (
                    typeof window !== 'undefined' &&
                    !window.confirm(`Delete "${display.title}"?`)
                  )
                    return;
                  calendarStore.deleteEvent(eventId);
                }}
                className="inline-flex items-center gap-1 rounded border border-rose-200 bg-white px-1.5 py-0.5 text-[10px] text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-2.5 w-2.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
