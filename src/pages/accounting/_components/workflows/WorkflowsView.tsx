import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Pause, Play, Plus, ShieldAlert, ShieldCheck, UserCheck, Workflow as WorkflowIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Workflow, WorkflowStatus } from '@/pages/accounting/_lib/types';
import {
  useWorkflowsStore,
  humanGates,
  hasGuardedActions,
} from '@/pages/accounting/_hooks/use-workflows-store';
import { BLOCK_MAP, CATEGORY_STYLE } from '@/pages/accounting/_lib/workflow-blocks';
import { formatDate } from '@/pages/accounting/_lib/format';
import ViewHeader from '@/pages/accounting/_components/shared/ViewHeader';

const STATUS_STYLE: Record<WorkflowStatus, { dot: string; text: string }> = {
  active: { dot: 'bg-[var(--ok-fg)]', text: 'text-[var(--ok-fg)]' },
  paused: { dot: 'bg-[var(--text-5)]', text: 'text-[var(--text-3)]' },
  draft: { dot: 'bg-amber-400', text: 'text-[var(--warn-fg)]' },
};

function BlockChain({ workflow }: { workflow: Workflow }) {
  const { t } = useTranslation('accounting');
  const shown = workflow.nodes.slice(0, 7);
  return (
    <div className="flex items-center gap-1 overflow-hidden">
      {shown.map((n, i) => {
        const def = BLOCK_MAP[n.blockId];
        const Icon = def.icon;
        return (
          <span key={n.id} className="flex shrink-0 items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden className="h-3 w-3 text-[var(--text-5)]" />}
            <span
              title={t(`blocks.${n.blockId}.name`)}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-[10px]',
                CATEGORY_STYLE[def.category].chip,
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          </span>
        );
      })}
      {workflow.nodes.length > shown.length && (
        <span className="shrink-0 text-[10px] text-[var(--text-4)]">+{workflow.nodes.length - shown.length}</span>
      )}
    </div>
  );
}

function WorkflowRow({ workflow }: { workflow: Workflow }) {
  const { t, i18n } = useTranslation('accounting');
  const navigate = useNavigate();
  const toggleStatus = useWorkflowsStore((s) => s.toggleStatus);

  const status = STATUS_STYLE[workflow.status];
  const gates = humanGates(workflow);
  const guarded = hasGuardedActions(workflow);
  const open = () => navigate(`/accounting/workflows/${workflow.id}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      className="group cursor-pointer border-b border-[var(--line-soft)] px-5 py-4 text-left transition-colors last:border-0 hover:bg-[rgba(20,22,26,0.02)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ink)]/25"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-semibold', status.text)}>
            <span aria-hidden className={cn('h-2 w-2 rounded-full', status.dot)} />
            {t(`workflows.status.${workflow.status}`)}
          </span>
          <p className="mt-1 truncate text-[15px] font-semibold text-[var(--ink)]">{workflow.name}</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleStatus(workflow.id);
          }}
          className="shrink-0 rounded-full border border-[var(--line)] p-2 text-[var(--text-3)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
          aria-label={workflow.status === 'active' ? t('workflows.pause') : t('workflows.activate')}
          title={workflow.status === 'active' ? t('workflows.pause') : t('workflows.activate')}
        >
          {workflow.status === 'active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>

      {workflow.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-[var(--text-3)]">{workflow.description}</p>
      )}

      <div className="mt-3">
        <BlockChain workflow={workflow} />
      </div>

      {/* Human-in-the-loop summary — the concept's core guarantee, surfaced per row */}
      <div className="mt-3 space-y-1">
        {gates.length > 0 ? (
          gates.map((g) => (
            <p key={g.id} className="flex items-center gap-1.5 text-[11px] text-[var(--text-2)]">
              <UserCheck aria-hidden className="h-3.5 w-3.5 text-[var(--text-4)]" />
              {t('workflows.humanGate', {
                role: g.config.role ? t(`role.${g.config.role}`) : '—',
                channel: g.config.channel ? t(`requests.channel.${g.config.channel}`) : '—',
              })}
            </p>
          ))
        ) : (
          <p className="flex items-center gap-1.5 text-[11px] text-[var(--warn-fg)]">
            <ShieldAlert aria-hidden className="h-3.5 w-3.5" />
            {t('workflows.noHumanGate')}
          </p>
        )}
        <p
          className={cn(
            'flex items-center gap-1.5 text-[11px]',
            guarded ? 'text-[var(--ok-fg)]' : 'text-[var(--warn-fg)]',
          )}
        >
          {guarded ? (
            <ShieldCheck aria-hidden className="h-3.5 w-3.5" />
          ) : (
            <ShieldAlert aria-hidden className="h-3.5 w-3.5" />
          )}
          {guarded ? t('workflows.guarded') : t('workflows.unguarded')}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-[var(--text-4)]">
        <span>
          {t('workflows.blockCount', { count: workflow.nodes.length })} · {t('workflows.runs30d', { count: workflow.runs30d })}
        </span>
        <span>
          {workflow.lastRun
            ? `${t('workflows.lastRun')}: ${formatDate(i18n.language, workflow.lastRun)}`
            : t('workflows.never')}
        </span>
      </div>
    </div>
  );
}

export default function WorkflowsView() {
  const { t } = useTranslation('accounting');
  const navigate = useNavigate();
  const workflows = useWorkflowsStore((s) => s.workflows);
  const createWorkflow = useWorkflowsStore((s) => s.createWorkflow);

  const onNew = () => {
    const id = createWorkflow(t('workflows.untitled'));
    navigate(`/accounting/workflows/${id}`);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ViewHeader
        title={t('workflows.title')}
        subtitle={t('workflows.subtitle')}
        right={
          <button
            type="button"
            onClick={onNew}
            className="plat-btn h-9 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
          >
            <Plus className="h-3.5 w-3.5" /> {t('workflows.newWorkflow')}
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {workflows.length === 0 ? (
          <div className="py-20 text-center">
            <WorkflowIcon aria-hidden className="mx-auto h-8 w-8 text-[var(--text-5)]" />
            <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{t('workflows.emptyTitle')}</p>
            <p className="mt-1 text-xs text-[var(--text-4)]">{t('workflows.emptyBody')}</p>
          </div>
        ) : (
          <div className="plat-list">
            {workflows.map((w) => (
              <WorkflowRow key={w.id} workflow={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
