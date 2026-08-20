import { useState } from 'react';
import { Sparkles, X, Loader2, Check, RefreshCw } from 'lucide-react';
import {
  useTodoStore,
  selectTasksMap,
} from '@/pages/todo/_hooks/use-todo-store';
import { useTodoUiStore } from '@/pages/todo/_hooks/use-todo-ui-store';
import { generateDailyPlan } from '@/pages/docs/_lib/mockAi';
import { deriveTitle as _ } from '@/pages/notes/_lib/backlinks';
import type { DailyPlan } from '@/pages/todo/_lib/types';

interface Props {
  todayTaskIds: string[];
}

export default function DailyPlanCard({ todayTaskIds }: Props) {
  const tasksMap = useTodoStore(selectTasksMap);
  const reorder = useTodoStore((s) => s.reorderWithin);
  const setScheduledAt = useTodoStore((s) => s.updateTask);
  const dismissed = useTodoUiStore((s) => s.dailyPlanDismissed);
  const setDismissed = useTodoUiStore((s) => s.setDailyPlanDismissed);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(false);

  if (dismissed) return null;

  const generate = async () => {
    setLoading(true);
    try {
      const tasks = todayTaskIds
        .map((id) => tasksMap[id])
        .filter(Boolean)
        .map((t) => ({
          id: t!.id,
          title: t!.title,
          completed: t!.completed,
          dueAt: t!.dueAt,
          scheduledAt: t!.scheduledAt,
          priority: t!.priority,
          estimate: t!.estimate,
          projectId: t!.projectId ?? null,
          listId: t!.listId ?? null,
          tags: t!.tags,
          parentId: t!.parentId ?? null,
          createdAt: t!.createdAt,
          updatedAt: t!.updatedAt,
        }));
      // Mock empty events for now — Calendar integration deferred.
      const result = await generateDailyPlan(tasks, [], { startHour: 9, endHour: 18 });
      setPlan({ ...result });
    } catch {
      alert('Mock AI failed — try again.');
    } finally {
      setLoading(false);
    }
  };

  const accept = async () => {
    if (!plan) return;
    // Reorder Today within the inbox-like virtual selector — we only update
    // `order`/`scheduledAt`. Calendar event creation is deferred.
    let i = 1;
    for (const id of plan.orderedTaskIds) {
      const block = plan.blocks.find((b) => b.taskId === id);
      await setScheduledAt(id, {
        order: i++,
        scheduledAt: block?.startAt,
      });
    }
    setDismissed(true);
  };

  return (
    <div className="plat-panel mx-6 mt-4 !p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
          <Sparkles className="h-4 w-4" style={{ color: 'var(--text-4)' }} />
          AI plan for today
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-[6px] p-1 text-[var(--text-5)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {!plan ? (
        <div className="mt-2 flex items-center gap-3">
          <p className="flex-1 text-xs text-[var(--text-3)]">
            Let AI propose an order for today's {todayTaskIds.length} tasks based on priority,
            deadlines, and free time on your calendar.
          </p>
          <button
            type="button"
            onClick={generate}
            disabled={loading || todayTaskIds.length === 0}
            className="plat-btn !h-8 !px-4 !text-xs"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            Generate
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-xs italic text-[var(--text-4)]">{plan.rationale}</p>
          <ol className="mt-2 overflow-hidden rounded-[12px] border border-[var(--line-soft)]">
            {plan.orderedTaskIds.map((id, i) => {
              const t = tasksMap[id];
              const block = plan.blocks.find((b) => b.taskId === id);
              if (!t) return null;
              return (
                <li
                  key={id}
                  className="flex items-center justify-between border-b border-[var(--line-soft)] px-3 py-2 text-xs last:border-b-0"
                >
                  <span className="flex items-center gap-2 text-[var(--ink)]">
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--text-5)' }}>{i + 1}.</span>
                    {t.title}
                  </span>
                  {block && (
                    <span className="text-[var(--text-4)]">
                      {new Date(block.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' – '}
                      {new Date(block.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="mt-3 flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={generate}
              className="plat-btn-ghost !h-7 !px-3 !text-xs"
            >
              <RefreshCw className="h-3 w-3" /> Regenerate
            </button>
            <button
              type="button"
              onClick={() => setPlan(null)}
              className="plat-btn-ghost !h-7 !px-3 !text-xs"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={accept}
              className="plat-btn !h-7 !px-4 !text-xs"
            >
              <Check className="h-3 w-3" /> Accept plan
            </button>
          </div>
          <p className="mt-2 text-[10px] italic text-[var(--text-5)]">
            Note: calendar event creation is deferred — this version only reorders today and
            stamps a scheduled time on each task.
          </p>
        </div>
      )}
    </div>
  );
}
