import { useState } from 'react';
import { Sparkles, X, Check, Loader2, AlertTriangle } from 'lucide-react';
import {
  useTodoStore,
  selectTasksMap,
  selectProjectsMap,
  selectListsMap,
} from '@/pages/todo/_hooks/use-todo-store';
import { useTodoUiStore } from '@/pages/todo/_hooks/use-todo-ui-store';
import { triageInbox } from '@/pages/docs/_lib/mockAi';
import type { Priority, TriageProposal } from '@/pages/todo/_lib/types';

const PRIORITY_LABEL = ['', 'P1', 'P2', 'P3', 'P4'];
const PRIORITY_COLOR = ['', 'bg-[var(--bad-fg)]', 'bg-[var(--warn-fg)]', 'bg-[var(--text-5)]', 'bg-[var(--text-5)]'];

export default function TriagePanel() {
  const open = useTodoUiStore((s) => s.triageOpen);
  const setOpen = useTodoUiStore((s) => s.setTriageOpen);
  const tasksMap = useTodoStore(selectTasksMap);
  const projectsMap = useTodoStore(selectProjectsMap);
  const listsMap = useTodoStore(selectListsMap);
  const updateTask = useTodoStore((s) => s.updateTask);

  const [proposals, setProposals] = useState<TriageProposal[] | null>(null);
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const inbox = Object.values(tasksMap).filter(
    (t) => !t.trashed && !t.completed && !t.parentId && !t.projectId && !t.listId && !t.dueAt,
  );

  const runTriage = async () => {
    setRunning(true);
    setError(null);
    try {
      const result = await triageInbox(
        inbox.map((t) => ({
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
        })),
        {
          projects: Object.values(projectsMap).map((p) => ({ id: p.id, name: p.name })),
          lists: Object.values(listsMap).map((l) => ({ id: l.id, name: l.name })),
        },
      );
      setProposals(result);
      const acc: Record<string, boolean> = {};
      for (const r of result) acc[r.taskId] = true;
      setAccepted(acc);
    } catch (e: any) {
      setError(e?.message ?? 'Mock AI failed');
    } finally {
      setRunning(false);
    }
  };

  const applyAccepted = async () => {
    if (!proposals) return;
    for (const p of proposals) {
      if (!accepted[p.taskId]) continue;
      await updateTask(p.taskId, {
        priority: (p.priority ?? tasksMap[p.taskId]?.priority ?? 3) as Priority,
        dueAt: p.dueAt ?? tasksMap[p.taskId]?.dueAt,
        projectId: p.projectId ?? tasksMap[p.taskId]?.projectId,
      });
    }
    setOpen(false);
    setProposals(null);
    setAccepted({});
  };

  const toggleAccepted = (taskId: string) => {
    setAccepted((a) => ({ ...a, [taskId]: !a[taskId] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[14px] border border-[var(--line-soft)] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
            <Sparkles className="h-4 w-4" style={{ color: 'var(--text-4)' }} />
            AI Triage — process Inbox
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-[6px] p-1 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!proposals ? (
          <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="max-w-md text-sm text-[var(--text-3)]">
              Run AI triage on {inbox.length} Inbox task{inbox.length === 1 ? '' : 's'}. The mock AI
              will propose a destination, due date, priority, and project. Review per-task and
              accept what looks right.
            </p>
            {error && (
              <div className="text-xs" style={{ color: 'var(--bad-fg)' }}>
                ⚠️ {error}
              </div>
            )}
            <button
              type="button"
              onClick={runTriage}
              disabled={running || inbox.length === 0}
              className="plat-btn"
            >
              {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Triage Inbox
            </button>
            {inbox.length === 0 && (
              <div
                className="flex items-center gap-1 rounded-[10px] px-3 py-1.5 text-xs"
                style={{ background: 'var(--warn-bg)', color: 'var(--warn-fg)' }}
              >
                <AlertTriangle className="h-3 w-3" /> Inbox is empty — nothing to triage.
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-2 flex items-center justify-between text-xs text-[var(--text-4)]">
                <span>{proposals.length} proposals</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const next: Record<string, boolean> = {};
                      for (const r of proposals) next[r.taskId] = true;
                      setAccepted(next);
                    }}
                    className="rounded-full px-2 py-1 transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
                  >
                    Accept all
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccepted({})}
                    className="rounded-full px-2 py-1 transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
                  >
                    Reject all
                  </button>
                </div>
              </div>
              <ul className="plat-list">
                {proposals.map((p) => {
                  const t = tasksMap[p.taskId];
                  if (!t) return null;
                  const isAccepted = !!accepted[p.taskId];
                  const proj = p.projectId ? projectsMap[p.projectId] : null;
                  return (
                    <li
                      key={p.taskId}
                      className={`border-b border-[var(--line-soft)] px-4 py-3 transition-colors last:border-b-0 ${
                        isAccepted ? 'bg-[rgba(20,22,26,0.06)]' : 'hover:bg-[rgba(20,22,26,0.02)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm text-[var(--ink)]">{t.title}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px]">
                            {p.priority && (
                              <Diff field="Priority" before={`P${t.priority}`} after={PRIORITY_LABEL[p.priority]}>
                                <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_COLOR[p.priority]}`} />
                              </Diff>
                            )}
                            {p.dueAt && (
                              <Diff
                                field="Due"
                                before={t.dueAt ? new Date(t.dueAt).toLocaleDateString() : '—'}
                                after={new Date(p.dueAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                              />
                            )}
                            {proj && (
                              <Diff
                                field="Project"
                                before={t.projectId ? projectsMap[t.projectId]?.name ?? '—' : '—'}
                                after={proj.name}
                              />
                            )}
                          </div>
                          <div className="mt-1 text-[11px] italic text-[var(--text-4)]">{p.reason}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleAccepted(p.taskId)}
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            isAccepted
                              ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                              : 'border-[var(--line)] text-[var(--text-5)]'
                          }`}
                          aria-label={isAccepted ? 'Reject' : 'Accept'}
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--line-soft)] px-4 py-3">
              <div className="text-xs text-[var(--text-4)]">
                {Object.values(accepted).filter(Boolean).length} of {proposals.length} accepted
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="plat-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyAccepted}
                  className="plat-btn !h-9 !px-5 !text-xs"
                >
                  <Check className="h-3.5 w-3.5" /> Apply accepted
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Diff({
  field,
  before,
  after,
  children,
}: {
  field: string;
  before: string;
  after: string;
  children?: React.ReactNode;
}) {
  return (
    <span className="plat-pill plat-pill-mute !gap-1 !px-1.5 !py-0.5 !text-[10px] !font-medium">
      <span className="plat-eyebrow !text-[9px]">{field}:</span>
      <span className="text-[var(--text-5)] line-through">{before}</span>
      <span>→</span>
      {children}
      <span className="font-semibold text-[var(--ink)]">{after}</span>
    </span>
  );
}
