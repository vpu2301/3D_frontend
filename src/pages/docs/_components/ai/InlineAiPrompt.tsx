import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, RefreshCw, Check, Loader2 } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { streamCompletion, runPreset } from '@/pages/docs/_lib/mockAi';
import { useDocsSettingsStore } from '@/pages/docs/_hooks/use-docs-settings-store';
import type { PresetAction } from '@/pages/docs/_lib/types';
import { toPlainText } from '@/pages/docs/_lib/export';

interface Props {
  editor: Editor;
  position: { x: number; y: number } | null;
  selectionRange: { from: number; to: number } | null;
  preset?: PresetAction;
  initialPrompt?: string;
  onClose: () => void;
}

type Phase = 'prompt' | 'streaming' | 'review';

export default function InlineAiPrompt({
  editor,
  position,
  selectionRange,
  preset,
  initialPrompt,
  onClose,
}: Props) {
  const [phase, setPhase] = useState<Phase>(preset ? 'streaming' : 'prompt');
  const [prompt, setPrompt] = useState(initialPrompt ?? '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const tone = useDocsSettingsStore((s) => s.defaultTone);

  useEffect(() => {
    if (phase === 'prompt') {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [phase]);

  useEffect(() => {
    if (preset && selectionRange) {
      runWithPreset(preset);
    }
    return () => {
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!position) return null;

  const selectionText = selectionRange
    ? editor.state.doc.textBetween(selectionRange.from, selectionRange.to, '\n', ' ')
    : '';

  async function runWithPreset(p: PresetAction) {
    if (!selectionRange) return;
    setError(null);
    setPhase('streaming');
    setOutput('');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const text = editor.state.doc.textBetween(selectionRange.from, selectionRange.to, '\n', ' ');
      let acc = '';
      for await (const chunk of runPreset(p, text, { signal: controller.signal, tone })) {
        acc += chunk;
        setOutput(acc);
      }
      setPhase('review');
    } catch (e: any) {
      if (e?.name !== 'AbortError') setError(e?.message || 'AI failed');
      setPhase('review');
    }
  }

  async function runWithPrompt() {
    if (!prompt.trim()) return;
    setError(null);
    setPhase('streaming');
    setOutput('');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const ctx = selectionRange ? selectionText : toPlainText(editor.getJSON() as any);
      let acc = '';
      for await (const chunk of streamCompletion(prompt, ctx, { signal: controller.signal, tone })) {
        acc += chunk;
        setOutput(acc);
      }
      setPhase('review');
    } catch (e: any) {
      if (e?.name !== 'AbortError') setError(e?.message || 'AI failed');
      setPhase('review');
    }
  }

  const accept = () => {
    if (!output) return onClose();
    if (selectionRange && selectionRange.from !== selectionRange.to) {
      editor.chain().focus().deleteRange(selectionRange).insertContentAt(selectionRange.from, output).run();
    } else {
      editor.chain().focus().insertContent(output).run();
    }
    onClose();
  };

  const retry = () => {
    if (preset && selectionRange) runWithPreset(preset);
    else runWithPrompt();
  };

  return (
    <div
      className="fixed z-50 w-[420px] rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
      style={{
        left: Math.min(position.x, window.innerWidth - 440),
        top: Math.min(position.y, window.innerHeight - 280),
      }}
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />
          {preset ? `AI: ${preset.replace(/-/g, ' ')}` : 'Ask AI'}
        </div>
        <button
          type="button"
          onClick={() => {
            abortRef.current?.abort();
            onClose();
          }}
          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {phase === 'prompt' && (
        <form
          className="p-3"
          onSubmit={(e) => {
            e.preventDefault();
            runWithPrompt();
          }}
        >
          {selectionRange && (
            <div className="mb-2 line-clamp-3 rounded-md bg-zinc-50 p-2 text-[11px] italic text-zinc-500 dark:bg-zinc-800/60">
              "{selectionText}"
            </div>
          )}
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                runWithPrompt();
              }
            }}
            rows={2}
            placeholder="Tell AI what to do…"
            className="w-full resize-none rounded-md border border-zinc-200 bg-white p-2 text-sm focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="text-[11px] text-zinc-400">Enter to run · Shift+Enter for newline</div>
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="h-3 w-3" /> Run
            </button>
          </div>
        </form>
      )}

      {(phase === 'streaming' || phase === 'review') && (
        <div className="p-3">
          <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-md bg-zinc-50 p-3 text-sm leading-relaxed dark:bg-zinc-800/60">
            {output || (
              <span className="flex items-center gap-2 text-zinc-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
              </span>
            )}
          </div>
          {error && <div className="mt-2 text-xs text-red-600">⚠️ {error}</div>}
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={retry}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
            <div className="flex items-center gap-1">
              {phase === 'review' && (
                <button
                  type="button"
                  onClick={() => {
                    setPhase('prompt');
                    setOutput('');
                    setPrompt('');
                  }}
                  className="rounded-md px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Refine
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={accept}
                disabled={phase === 'streaming' || !output}
                className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Check className="h-3 w-3" /> Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
