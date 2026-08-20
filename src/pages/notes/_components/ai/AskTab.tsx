/**
 * Tab one of the ask panel (FE-5 §4).
 *
 * A question, a scope, a streamed answer, and citations that open their source.
 * The states below are not defensive padding — each one is a thing the mock
 * could not do and therefore a thing nobody has seen fail yet:
 *
 *  - **Latency is honest.** First token can be ~1.5 s against a real provider.
 *    The mock answered in 200 ms and trained everyone, including us, to expect
 *    it, so a progress affordance appears on submit rather than on first token.
 *  - **Abort keeps the partial.** Stopping is not cancelling: what arrived is
 *    real and stays on screen, marked incomplete. The backend closes the
 *    provider connection and bills only what was consumed.
 *  - **A mid-stream `error` frame renders under what arrived.** A stream that
 *    dies silently looks like the model stopped thinking.
 *  - **402 is its own state**, with the reset time, because "something went
 *    wrong" for a spent budget sends people to support instead of to tomorrow.
 *  - **No reconnect.** A half-answer resumed from freshly retrieved context is
 *    a different answer wearing the first one's opening sentence.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Send, Square, RotateCw, StickyNote, Quote, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  answerOverNotes,
  AnswerIncomplete,
  BudgetExceededError,
  type AnswerMeta,
  type AnswerScope,
  type Citation,
} from '@/pages/notes/_lib/aiClient';
import { createFrameBatcher } from '@/pages/notes/_lib/rafBatch';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { recentQuestions, rememberQuestion } from '@/lib/notesRecentQuestions';
import { newId } from '@/pages/notes/_lib/storage';
import CitationChips from './CitationChips';
import AnswerFooter from './AnswerFooter';
import { scrollToBottom } from '@/pages/notes/_lib/scrollToBottom';
import { cn } from '@/lib/utils';

type ExchangeStatus = 'streaming' | 'done' | 'incomplete' | 'error' | 'budget';

interface Exchange {
  id: string;
  question: string;
  answer: string;
  citations: Citation[];
  meta?: AnswerMeta;
  status: ExchangeStatus;
  error?: string;
  resetAt?: number;
  scope: AnswerScope;
  selection?: string | null;
}

interface Props {
  noteId?: string;
}

function resetTimeLabel(resetAt?: number): string | null {
  if (!resetAt) return null;
  return new Date(resetAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function AskTab({ noteId }: Props) {
  const note = useNotesStore((s) => (noteId ? s.notes[noteId] : undefined));
  const pendingSelection = useNotesUiStore((s) => s.aiPendingSelection);
  const clearPendingSelection = useNotesUiStore((s) => s.clearAiPendingSelection);

  const [scope, setScope] = useState<AnswerScope>('note+linked+recent');
  const [input, setInput] = useState('');
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [history, setHistory] = useState<string[]>(() => recentQuestions(noteId));
  const [selection, setSelection] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const notebookId = note?.notebookId ?? null;
  const streaming = exchanges.some((e) => e.status === 'streaming');

  // A note with no notebook has no matter to scope to, so the option is not
  // offered rather than offered-and-broken.
  const scopes = useMemo(
    () =>
      [
        { id: 'note+linked+recent' as const, label: 'This note', available: Boolean(noteId) },
        { id: 'notebook' as const, label: 'This notebook', available: Boolean(notebookId) },
        { id: 'all' as const, label: 'Everything', available: true },
      ].filter((s) => s.available),
    [noteId, notebookId],
  );

  // Switching to a note that cannot serve the current scope must not leave the
  // toggle pointing at an option that is no longer on screen.
  useEffect(() => {
    if (!scopes.some((s) => s.id === scope)) setScope(scopes[scopes.length - 1].id);
  }, [scopes, scope]);

  useEffect(() => {
    setHistory(recentQuestions(noteId));
  }, [noteId]);

  // The inline "Ask…" handoff. Consumed once and cleared, so a question asked
  // later in the session does not silently carry an old paragraph as context.
  useEffect(() => {
    if (pendingSelection) {
      setSelection(pendingSelection);
      clearPendingSelection();
    }
  }, [pendingSelection, clearPendingSelection]);

  useEffect(() => {
    scrollToBottom(scrollRef.current);
  }, [exchanges]);

  // Abort on unmount. This is what tells the server to drop the provider
  // connection; without it a closed panel keeps spending the tenant's budget.
  useEffect(() => () => abortRef.current?.abort(), []);

  const patch = (id: string, changes: Partial<Exchange>) =>
    setExchanges((list) => list.map((e) => (e.id === id ? { ...e, ...changes } : e)));

  const ask = async (question: string, withSelection: string | null, withScope: AnswerScope) => {
    // A new question supersedes the one in flight. Two live streams would
    // interleave into the same panel and bill for both.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const id = newId('ask');
    setExchanges((list) => [
      ...list,
      {
        id,
        question,
        answer: '',
        citations: [],
        status: 'streaming',
        scope: withScope,
        selection: withSelection,
      },
    ]);
    rememberQuestion(noteId, question);
    setHistory(recentQuestions(noteId));

    let text = '';
    const citations: Citation[] = [];
    let meta: AnswerMeta | undefined;

    // One state publish per animation frame rather than one per token: a
    // 2 000-word answer is thousands of chunks, and rendering each one drops
    // frames on exactly the screen that is asking to be trusted (gate A16).
    const batcher = createFrameBatcher<string>((value) => patch(id, { answer: value }));

    try {
      for await (const part of answerOverNotes(question, noteId ? [{ id: noteId }] : [], {
        signal: controller.signal,
        scope: withScope,
        notebookId,
        selection: withSelection,
      })) {
        if (part.chunk) {
          text += part.chunk;
          batcher.push(text);
        }
        if (part.citations?.length) {
          citations.push(...part.citations);
          patch(id, { citations: [...citations] });
        }
        if (part.meta) {
          meta = part.meta;
          patch(id, { meta });
        }
      }
      batcher.flush();
      patch(id, { answer: text, status: 'done' });
    } catch (error) {
      batcher.flush();

      if (controller.signal.aborted) {
        // Deliberate stop, or the panel closed. Keep what arrived and say so.
        patch(id, { answer: text, status: 'incomplete' });
        return;
      }
      if (error instanceof BudgetExceededError) {
        patch(id, { answer: text, status: 'budget', resetAt: error.resetAt });
        return;
      }
      if (error instanceof AnswerIncomplete) {
        patch(id, { answer: text, status: 'incomplete' });
        return;
      }
      patch(id, {
        answer: text,
        status: 'error',
        error: error instanceof Error ? error.message : 'The answer failed.',
      });
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const submit = () => {
    const question = input.trim();
    if (!question || streaming) return;
    setInput('');
    const carried = selection;
    setSelection(null);
    void ask(question, carried, scope);
  };

  const stop = () => abortRef.current?.abort();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Scope */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--line-soft)] px-3 py-2">
        <span className="plat-eyebrow mr-1">Search</span>
        {scopes.map(({ id, label }) => (
          <button
            data-command-exempt="scope toggle inside the ask panel; the panel itself is the view.ai command"
            key={id}
            type="button"
            onClick={() => setScope(id)}
            aria-pressed={scope === id}
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs transition-colors',
              scope === id
                ? 'bg-[var(--ink)] font-semibold text-white'
                : 'text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        {exchanges.length === 0 ? (
          <EmptyState history={history} onPick={(q) => setInput(q)} />
        ) : (
          exchanges.map((exchange) => (
            <ExchangeView
              key={exchange.id}
              exchange={exchange}
              onRetry={() => void ask(exchange.question, exchange.selection ?? null, exchange.scope)}
            />
          ))
        )}
      </div>

      {/* Composer */}
      <form
        className="border-t border-[var(--line-soft)] p-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {selection && (
          <div className="mb-2 flex items-start gap-1.5 rounded-[10px] border border-[var(--line)] bg-[var(--sand)] px-2 py-1.5 text-[11px] text-[var(--text-2)]">
            <Quote aria-hidden className="mt-0.5 h-3 w-3 shrink-0" />
            <span className="line-clamp-2 flex-1">{selection}</span>
            <button
              data-command-exempt="drops the selection carried into the ask panel; scoped to the pending question"
              type="button"
              onClick={() => setSelection(null)}
              aria-label="Remove the selected text from this question"
              className="shrink-0 rounded-[6px] p-0.5 transition-colors hover:bg-[rgba(20,22,26,0.07)]"
            >
              <X aria-hidden className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <label htmlFor="notes-ask-input" className="sr-only">
            Ask a question about your notes
          </label>
          <textarea
            id="notes-ask-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder={selection ? 'Ask about the selected text…' : 'Ask anything across your notes…'}
            rows={2}
            className="flex-1 resize-none rounded-[10px] border border-[var(--line)] bg-[var(--paper)] p-2 text-sm text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
          />
          {streaming ? (
            <button
              data-command-exempt="stops the answer currently streaming in this panel"
              type="button"
              onClick={stop}
              aria-label="Stop generating"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--line)] text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              <Square aria-hidden className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              data-command-exempt="submits the question typed in the ask panel"
              type="submit"
              disabled={!input.trim()}
              aria-label="Ask"
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

function EmptyState({ history, onPick }: { history: string[]; onPick: (q: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="rounded-[12px] border border-[var(--line-soft)] bg-[var(--sand)] p-3 text-sm text-[var(--text-2)]">
        Ask about what you have written. Every answer cites the notes it came from.
        <ul className="mt-2 space-y-1 text-xs text-[var(--text-4)]">
          <li>“What did I decide about diff-accept?”</li>
          <li>“What open tasks do I have?”</li>
          <li>“Summarise where this matter stands.”</li>
        </ul>
      </div>

      {history.length > 0 && (
        <div>
          <div className="plat-eyebrow mb-1">Recent questions</div>
          <ul className="space-y-1">
            {history.map((question) => (
              <li key={question}>
                <button
                  data-command-exempt="re-asks a question from this note's recent list; scoped to the ask panel"
                  type="button"
                  onClick={() => onPick(question)}
                  className="flex w-full items-start gap-1.5 rounded-[10px] border border-[var(--line-soft)] px-2 py-1.5 text-left text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.04)]"
                >
                  <StickyNote aria-hidden className="mt-0.5 h-3 w-3 shrink-0" style={{ color: 'var(--text-4)' }} />
                  <span className="line-clamp-2">{question}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ExchangeView({ exchange, onRetry }: { exchange: Exchange; onRetry: () => void }) {
  const waiting = exchange.status === 'streaming' && exchange.answer.length === 0;
  const reset = resetTimeLabel(exchange.resetAt);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-[12px] bg-[var(--ink)] px-3 py-2 text-sm text-white">
          {exchange.question}
        </p>
      </div>

      <div className="rounded-[12px] bg-[var(--sand)] px-3 py-2">
        {waiting ? (
          // Shown on submit, not on first token: the wait is the part that
          // needs covering, and it can be a second and a half.
          <p className="flex items-center gap-1.5 text-sm text-[var(--text-4)]">
            <Loader2 aria-hidden className="h-3 w-3 animate-spin" />
            Searching your notes…
          </p>
        ) : (
          /*
            `whitespace-pre-wrap` on a text node. Model output is never given to
            a Markdown or HTML renderer on any AI surface in this module — an
            answer is attacker-influenced text the moment a note is shared, and
            gate A12 asserts an `<img onerror=…>` fixture renders as characters.
          */
          <p className="whitespace-pre-wrap break-words text-sm text-[var(--ink)]">
            {exchange.answer}
            {exchange.status === 'streaming' && (
              <Loader2 aria-hidden className="ml-1 inline h-3 w-3 animate-spin align-middle" />
            )}
          </p>
        )}

        <CitationChips citations={exchange.citations} />

        {exchange.status === 'budget' && (
          <Alert
            className="mt-2 rounded-[10px] border-[rgba(154,83,18,0.25)] py-2"
            style={{ background: 'var(--warn-bg)' }}
          >
            <AlertDescription className="text-xs" style={{ color: 'var(--warn-fg)' }}>
              Today’s AI budget is spent.
              {reset ? ` It resets at ${reset}.` : ''} Writing and saving are unaffected.
            </AlertDescription>
          </Alert>
        )}

        {exchange.status === 'error' && (
          <Alert variant="destructive" className="mt-2 rounded-[10px] py-2">
            <AlertDescription className="text-xs">{exchange.error}</AlertDescription>
          </Alert>
        )}

        {exchange.status === 'incomplete' && (
          <p className="mt-2 text-[11px]" style={{ color: 'var(--warn-fg)' }}>
            This answer stopped before it finished.
          </p>
        )}

        {(exchange.status === 'incomplete' ||
          exchange.status === 'error' ||
          exchange.status === 'budget') && (
          <button
            data-command-exempt="re-runs the question in this exchange; scoped to the answer it sits under"
            type="button"
            onClick={onRetry}
            className="plat-btn-ghost !h-7 !px-3 !text-[11px] mt-1.5 bg-[var(--paper)]"
          >
            <RotateCw aria-hidden className="h-3 w-3" />
            Ask again
          </button>
        )}

        {exchange.status !== 'streaming' && (
          <AnswerFooter meta={exchange.meta} incomplete={exchange.status === 'incomplete'} />
        )}
      </div>
    </div>
  );
}
