import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Pause,
  Play,
  RotateCcw,
  Crosshair,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import TodoLayout from '@/pages/todo/_components/shared/TodoLayout';
import { useTodoStore, selectTasksMap } from '@/pages/todo/_hooks/use-todo-store';
import { nextBestTask } from '@/pages/docs/_lib/mockAi';
import type { Task } from '@/pages/todo/_lib/types';

const FOCUS_MS = 25 * 60_000;
const BREAK_MS = 5 * 60_000;

export default function TodoFocus() {
  const load = useTodoStore((s) => s.load);
  const tasksMap = useTodoStore(selectTasksMap);
  const toggleComplete = useTodoStore((s) => s.toggleComplete);
  const navigate = useNavigate();
  const [running, setRunning] = useState(true);
  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [remaining, setRemaining] = useState(FOCUS_MS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [completedThisSession, setCompletedThisSession] = useState<string[]>([]);
  const [sessionStart] = useState<number>(Date.now());
  const tickerRef = useRef<number | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  // Pick a next-best task on mount and whenever active task is completed
  useEffect(() => {
    if (activeId !== null) return;
    let cancelled = false;
    (async () => {
      const eligible = Object.values(tasksMap)
        .filter((t) => !t.completed && !t.trashed && !t.parentId)
        .map((t) => ({
          id: t.id,
          title: t.title,
          completed: t.completed,
          dueAt: t.dueAt,
          scheduledAt: t.scheduledAt,
          priority: t.priority,
          estimate: t.estimate,
          projectId: t.projectId ?? null,
          listId: t.listId ?? null,
          tags: t.tags,
          parentId: t.parentId ?? null,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));
      if (eligible.length === 0) return;
      try {
        const r = await nextBestTask(eligible, { now: Date.now() });
        if (r && !cancelled) setActiveId(r.id);
      } catch {
        // pick any
        if (!cancelled && eligible.length > 0) setActiveId(eligible[0].id);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId, tasksMap]);

  // Timer tick
  useEffect(() => {
    if (!running) return;
    tickerRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1000) {
          // phase flip
          setPhase((p) => {
            const next = p === 'focus' ? 'break' : 'focus';
            return next;
          });
          return phase === 'focus' ? BREAK_MS : FOCUS_MS;
        }
        return r - 1000;
      });
    }, 1000);
    return () => {
      if (tickerRef.current) window.clearInterval(tickerRef.current);
    };
  }, [running, phase]);

  const active: Task | null = activeId ? tasksMap[activeId] ?? null : null;

  const onComplete = async () => {
    if (!active) return;
    await toggleComplete(active.id);
    setCompletedThisSession((c) => [...c, active.id]);
    setActiveId(null); // re-pick
  };

  const onSkip = () => setActiveId(null);

  const reset = () => {
    setRemaining(phase === 'focus' ? FOCUS_MS : BREAK_MS);
  };

  const minutes = Math.floor(remaining / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  const sessionMinutes = Math.round((Date.now() - sessionStart) / 60_000);

  return (
    <TodoLayout>
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-violet-50 to-white px-6 py-12">
        <Link
          to="/todo"
          className="absolute left-6 top-6 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Todo
        </Link>
        <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-violet-600">
          <Crosshair className="h-3.5 w-3.5" /> Focus mode
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-12 py-10 shadow-sm">
          <div className="mb-2 text-center text-[11px] uppercase tracking-wider text-gray-500">
            {phase === 'focus' ? 'Focus' : 'Break'}
          </div>
          <div className="text-center font-mono text-6xl tabular-nums text-gray-900">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700"
              aria-label={running ? 'Pause' : 'Play'}
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 w-full max-w-md">
          {active ? (
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-violet-600">
                <Sparkles className="h-3 w-3" /> Next-best task
              </div>
              <h2 className="mt-1 text-lg font-medium text-gray-900">{active.title}</h2>
              <div className="mt-1 text-xs text-gray-500">
                P{active.priority}
                {active.estimate ? ` · ~${active.estimate}m` : ''}
                {active.tags.length > 0 ? ` · ${active.tags.map((t) => `#${t}`).join(' ')}` : ''}
              </div>
              <div className="mt-3 flex items-center gap-1">
                <button
                  type="button"
                  onClick={onComplete}
                  className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  <Check className="h-3.5 w-3.5" /> Done
                </button>
                <button
                  type="button"
                  onClick={onSkip}
                  className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Skip <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center text-sm italic text-gray-500">
              All caught up — no eligible tasks. Step away from the keyboard.
            </div>
          )}
        </div>

        <div className="mt-8 text-xs text-gray-500">
          Session so far: completed {completedThisSession.length} task
          {completedThisSession.length === 1 ? '' : 's'} in {sessionMinutes} min.
        </div>
      </main>
    </TodoLayout>
  );
}
