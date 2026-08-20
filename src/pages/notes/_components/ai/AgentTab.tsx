/**
 * Tab two of the ask panel (FE-5 §4) — the tool-using agent.
 *
 * Hidden behind `VITE_NOTES_AGENT_CHAT` until BE-4 flips its own server-side
 * flag. Shipping it dark is the point: the transcript, the event rendering and
 * the approval path are all exercised by then, so the day the backend flag
 * flips is a configuration change rather than a release.
 *
 * The turn protocol (ADR 0006): the server ends its turn at
 * `approval_required` and holds nothing open. The client decides, then
 * reconnects `continue`, and the agent picks up from persisted state.
 *
 * **Resume must not duplicate.** The resumed stream continues into a *new*
 * bubble appended after the approval, and the approval bubble keeps its own
 * text. Re-rendering the session from history on resume — the obvious
 * implementation — replays turns the user already read and makes the agent look
 * like it repeated itself, which on a transcript of writes is alarming.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Send, Square, Wrench, Brain, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  agentChat,
  continueAgentTurn,
  BudgetExceededError,
  type AgentEvent,
  type AnswerMeta,
} from '@/pages/notes/_lib/aiClient';
import { createFrameBatcher } from '@/pages/notes/_lib/rafBatch';
import { notesApi, type AgentSessionSummary } from '@/pages/notes/_lib/apiClient';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useApprovalsStore, type PendingApproval } from '@/pages/notes/_hooks/use-approvals-store';
import { newId } from '@/pages/notes/_lib/storage';
import ApprovalCard from './ApprovalCard';
import AnswerFooter from './AnswerFooter';
import { scrollToBottom } from '@/pages/notes/_lib/scrollToBottom';
import { cn } from '@/lib/utils';

interface ToolActivity {
  tool: string;
  preview: string;
  input?: Record<string, unknown>;
  result?: string;
}

interface Turn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  thinking?: string;
  tools: ToolActivity[];
  approval?: PendingApproval;
  meta?: AnswerMeta;
  budgetWarning?: { ratio: number; resetAt?: number };
  error?: string;
  streaming?: boolean;
}

function emptyTurn(role: Turn['role'], text = ''): Turn {
  return { id: newId('t'), role, text, tools: [], streaming: role === 'assistant' };
}

export default function AgentTab({ noteId }: { noteId?: string }) {
  const reload = useNotesStore((s) => s.reload);
  const refreshNote = useNotesStore((s) => s.refreshNote);
  const refreshApprovals = useApprovalsStore((s) => s.refresh);

  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<AgentSessionSummary[]>([]);
  const [busy, setBusy] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom(scrollRef.current);
  }, [turns]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const loadSessions = useCallback(async () => {
    try {
      setSessions(await notesApi.agentSessions());
    } catch {
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const patch = (id: string, changes: Partial<Turn>) =>
    setTurns((list) => list.map((t) => (t.id === id ? { ...t, ...changes } : t)));

  /**
   * Drains one turn's events into `targetId`.
   *
   * Returns whether the turn stopped at an approval, because that decides
   * whether the caller waits for a human or is finished.
   */
  const consume = async (stream: AsyncIterable<AgentEvent>, targetId: string) => {
    let text = '';
    let thinking = '';
    const tools: ToolActivity[] = [];
    let touchedNotes = false;

    const batcher = createFrameBatcher<string>((value) => patch(targetId, { text: value }));

    try {
      for await (const event of stream) {
        switch (event.event) {
          case 'session':
            setSessionId(event.sessionId);
            break;

          case 'chunk':
            text += event.chunk;
            batcher.push(text);
            break;

          case 'thinking':
            thinking += event.text;
            patch(targetId, { thinking });
            break;

          case 'tool_call':
            tools.push({ tool: event.tool, preview: event.inputPreview, input: event.input });
            patch(targetId, { tools: [...tools] });
            break;

          case 'tool_result': {
            touchedNotes = true;
            const last = tools[tools.length - 1];
            if (last) last.result = event.summary;
            patch(targetId, { tools: [...tools] });
            break;
          }

          case 'budget_warning':
            patch(targetId, { budgetWarning: { ratio: event.ratio, resetAt: event.resetAt } });
            break;

          case 'approval_required':
            batcher.flush();
            patch(targetId, {
              text,
              streaming: false,
              approval: {
                actionId: event.actionId,
                tool: event.tool,
                input: event.input,
                explanation: event.explanation,
                noteId: event.noteId,
                diff: event.diff,
                costUsd: event.costUsd,
                expiresAt: event.expiresAt,
              },
            });
            // The bell and any note banner must learn about this action too —
            // it is the same pending write seen from three places.
            void refreshApprovals();
            return;

          case 'done':
            batcher.flush();
            patch(targetId, { text, streaming: false, meta: event.meta });
            if (touchedNotes) void reload();
            return;

          case 'error':
            batcher.flush();
            patch(targetId, {
              text,
              streaming: false,
              error:
                event.error === 'budget_exceeded' && event.resetAt
                  ? `Today’s AI budget is spent. It resets at ${new Date(
                      event.resetAt,
                    ).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}.`
                  : event.message,
            });
            return;
        }
      }
      // The stream ended without `done`: keep the text, drop the spinner.
      batcher.flush();
      patch(targetId, { text, streaming: false });
    } finally {
      batcher.flush();
    }
  };

  const run = async (stream: AsyncIterable<AgentEvent>, targetId: string, controller: AbortController) => {
    setBusy(true);
    try {
      await consume(stream, targetId);
    } catch (error) {
      if (controller.signal.aborted) {
        patch(targetId, { streaming: false });
        return;
      }
      patch(targetId, {
        streaming: false,
        error:
          error instanceof BudgetExceededError
            ? `Today’s AI budget is spent.${
                error.resetAt
                  ? ` It resets at ${new Date(error.resetAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}.`
                  : ''
              }`
            : error instanceof Error
              ? error.message
              : 'The agent failed.',
      });
    } finally {
      setBusy(false);
      if (abortRef.current === controller) abortRef.current = null;
      void loadSessions();
    }
  };

  const send = () => {
    const message = input.trim();
    if (!message || busy) return;
    setInput('');

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const assistant = emptyTurn('assistant');
    setTurns((list) => [...list, emptyTurn('user', message), assistant]);
    void run(agentChat(message, sessionId ?? undefined, controller.signal), assistant.id, controller);
  };

  /** After a decision, reconnect so the agent can finish the turn. */
  const onDecided = async (turnId: string, approved: boolean) => {
    patch(turnId, { approval: undefined });
    if (!sessionId) return;

    if (approved) {
      // The write has landed by the time `continue` opens; pull the corpus back
      // into agreement before the agent describes what it did.
      if (noteId) void refreshNote(noteId);
      void reload();
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // A fresh bubble, appended. The transcript above it is what the user
    // already read and is never re-rendered from history.
    const resumed = emptyTurn('assistant');
    setTurns((list) => [...list, resumed]);
    void run(continueAgentTurn(sessionId, controller.signal), resumed.id, controller);
  };

  const openSession = async (id: string) => {
    try {
      const detail = await notesApi.agentSession(id);
      setSessionId(detail.id);
      setTurns(replayHistory(detail.history as Array<Record<string, unknown>>));
    } catch (error) {
      toast.error('Could not open that conversation', {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const startNew = () => {
    abortRef.current?.abort();
    setTurns([]);
    setSessionId(null);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-[var(--line-soft)] px-3 py-2">
        <Select value={sessionId ?? 'new'} onValueChange={(v) => (v === 'new' ? startNew() : void openSession(v))}>
          <SelectTrigger className="h-8 flex-1 rounded-[10px] border-[var(--line)] bg-[var(--paper)] text-xs">
            <SelectValue placeholder="New conversation" />
          </SelectTrigger>
          <SelectContent className="rounded-[12px] border-[var(--line)]">
            <SelectItem value="new" className="text-xs">
              New conversation
            </SelectItem>
            {sessions.map((s) => (
              <SelectItem key={s.id} value={s.id} className="text-xs">
                {s.title || 'Untitled conversation'} · {new Date(s.updatedAt).toLocaleDateString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {turns.length === 0 ? (
          <div className="rounded-[12px] border border-[var(--line-soft)] bg-[var(--sand)] p-3 text-sm text-[var(--text-2)]">
            The agent can read your notes and, with your approval, change them. Nothing is written
            until you approve it.
            <ul className="mt-2 space-y-1 text-xs text-[var(--text-4)]">
              <li>“Tag every meeting note from last week.”</li>
              <li>“Draft a summary note of my open decisions.”</li>
              <li>“Link this note to the Q2 kickoff.”</li>
            </ul>
            {/* Said out loud rather than discovered as an empty list later. */}
            <p className="mt-2 text-[11px] text-[var(--text-5)]">
              Conversations are kept for 30 days.
            </p>
          </div>
        ) : (
          turns.map((turn) => (
            <TurnView key={turn.id} turn={turn} onDecided={(ok) => void onDecided(turn.id, ok)} />
          ))
        )}
      </div>

      <form
        className="border-t border-[var(--line-soft)] p-3"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <div className="flex items-end gap-2">
          <label htmlFor="notes-agent-input" className="sr-only">
            Tell the agent what to do
          </label>
          <textarea
            id="notes-agent-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder="Tell the agent what to do…"
            rows={2}
            className="flex-1 resize-none rounded-[10px] border border-[var(--line)] bg-[var(--paper)] p-2 text-sm text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
          />
          {busy ? (
            <button
              data-command-exempt="stops the agent turn currently streaming in this panel"
              type="button"
              onClick={() => abortRef.current?.abort()}
              aria-label="Stop the agent"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--line)] text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              <Square aria-hidden className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              data-command-exempt="sends the instruction typed in the agent tab"
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--ink)] text-white transition-opacity hover:opacity-[0.86] disabled:opacity-35"
            >
              <Send aria-hidden className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function TurnView({ turn, onDecided }: { turn: Turn; onDecided: (approved: boolean) => void }) {
  if (turn.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-[12px] bg-[var(--ink)] px-3 py-2 text-sm text-white">
          {turn.text}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="rounded-[12px] bg-[var(--sand)] px-3 py-2">
        {turn.thinking && <ThinkingBlock text={turn.thinking} />}

        {turn.tools.map((activity, index) => (
          <ToolBlock key={`${activity.tool}-${index}`} activity={activity} />
        ))}

        {(turn.text || turn.streaming) && (
          // Text node, never a Markdown or HTML renderer — see gate A12.
          <p className="whitespace-pre-wrap break-words text-sm text-[var(--ink)]">
            {turn.text}
            {turn.streaming && (
              <Loader2 aria-hidden className="ml-1 inline h-3 w-3 animate-spin align-middle" />
            )}
          </p>
        )}

        {turn.budgetWarning && (
          <Alert
            className="mt-2 rounded-[10px] border-[rgba(154,83,18,0.25)] py-2"
            style={{ background: 'var(--warn-bg)' }}
          >
            <AlertDescription className="text-xs" style={{ color: 'var(--warn-fg)' }}>
              {Math.round(turn.budgetWarning.ratio * 100)}% of today’s AI budget is used.
            </AlertDescription>
          </Alert>
        )}

        {turn.error && (
          <Alert variant="destructive" className="mt-2 rounded-[10px] py-2">
            <AlertDescription className="text-xs">{turn.error}</AlertDescription>
          </Alert>
        )}

        {!turn.streaming && <AnswerFooter meta={turn.meta} />}
      </div>

      {turn.approval && (
        <ApprovalCard approval={turn.approval} onDecided={onDecided} />
      )}
    </div>
  );
}

/**
 * Reasoning, collapsed, with no visual styling to speak of (§9.3).
 *
 * Presenting a model's intermediate reasoning as a dramatic reveal makes it
 * look like evidence. It is not evidence; the citations and the diff are.
 */
function ThinkingBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        data-command-exempt="expands the agent's reasoning for one turn; scoped to that turn"
        className="plat-eyebrow mb-1 flex items-center gap-1 hover:text-[var(--text-3)]"
      >
        <ChevronRight aria-hidden className={cn('h-3 w-3 transition-transform', open && 'rotate-90')} />
        <Brain aria-hidden className="h-3 w-3" />
        Reasoning
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="mb-2 whitespace-pre-wrap break-words border-l-2 border-[var(--line)] pl-2 text-[11px] text-[var(--text-4)]">
          {text}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ToolBlock({ activity }: { activity: ToolActivity }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge
          variant="secondary"
          className="gap-1 rounded-full border-transparent bg-[var(--sand-deep)] font-mono text-[10px] text-[var(--text-3)]"
        >
          <Wrench aria-hidden className="h-2.5 w-2.5" />
          {activity.tool}
        </Badge>
        {activity.result ? (
          <span className="text-[11px] text-[var(--text-4)]">→ {activity.result}</span>
        ) : (
          <Loader2 aria-hidden className="h-3 w-3 animate-spin text-[var(--text-5)]" />
        )}
        <CollapsibleTrigger
          data-command-exempt="expands one tool call's arguments; scoped to that call"
          className="text-[10px] text-[var(--text-5)] underline underline-offset-2 hover:text-[var(--text-2)]"
        >
          {open ? 'hide' : 'details'}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <pre className="mt-1 max-h-32 overflow-auto rounded-[8px] bg-[var(--paper)] p-1.5 text-[10px] text-[var(--text-3)]">
          {JSON.stringify(activity.input ?? activity.preview, null, 2)}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Rebuilds a transcript from `agent_sessions.history`.
 *
 * Tool entries fold into the assistant turn they belong to, which is the same
 * shape a live turn produces — so a resumed session and a fresh one render
 * identically instead of through two divergent code paths.
 */
function replayHistory(history: Array<Record<string, unknown>>): Turn[] {
  const turns: Turn[] = [];
  for (const entry of history) {
    const role = String(entry.role ?? '');
    if (role === 'user' || role === 'assistant') {
      turns.push({
        id: newId('t'),
        role,
        text: String(entry.content ?? ''),
        tools: [],
        streaming: false,
      });
    } else if (role === 'tool_call' || role === 'tool_result') {
      const last = turns[turns.length - 1];
      if (last?.role !== 'assistant') continue;
      if (role === 'tool_call') {
        last.tools.push({
          tool: String(entry.tool ?? 'tool'),
          preview: String(entry.inputPreview ?? ''),
          input: (entry.input ?? undefined) as Record<string, unknown> | undefined,
        });
      } else {
        const lastTool = last.tools[last.tools.length - 1];
        if (lastTool) lastTool.result = String(entry.summary ?? entry.content ?? 'done');
      }
    }
  }
  return turns;
}
