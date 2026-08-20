import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Pause,
  Play,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Unlink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  RequestChannel,
  Role,
  Workflow,
  WorkflowNode,
} from '@/pages/accounting/_lib/types';
import {
  useWorkflowsStore,
  hasGuardedActions,
} from '@/pages/accounting/_hooks/use-workflows-store';
import {
  BLOCKS,
  BLOCK_CATEGORIES,
  BLOCK_MAP,
  CATEGORY_STYLE,
  NODE_W,
  NODE_H,
} from '@/pages/accounting/_lib/workflow-blocks';

const CANVAS_W = 2000;
const CANVAS_H = 1200;
const CHANNELS: RequestChannel[] = ['email', 'teams', 'whatsapp', 'viber', 'portal'];
const ROLES: Role[] = ['operator', 'preparer', 'approver'];

type Selection = { type: 'node' | 'edge'; id: string } | null;

// ─── Palette ──────────────────────────────────────────────────────────────────

function Palette({ onAdd }: { onAdd: (blockId: (typeof BLOCKS)[number]['id']) => void }) {
  const { t } = useTranslation('accounting');
  return (
    <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-r border-[var(--line-soft)]">
      <div className="px-4 pb-1 pt-4">
        <p className="plat-eyebrow">{t('builder.palette')}</p>
        <p className="mt-1 text-[11px] text-[var(--text-4)]">{t('builder.paletteHint')}</p>
      </div>
      {BLOCK_CATEGORIES.map((cat) => (
        <div key={cat}>
          <p className="plat-eyebrow mb-1 mt-4 px-4">{t(`blockCat.${cat}`)}</p>
          <div className="space-y-0.5 px-2 pb-1">
            {BLOCKS.filter((b) => b.category === cat).map((b) => {
              const Icon = b.icon;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onAdd(b.id)}
                  className="flex w-full items-center gap-2.5 rounded-[10px] px-2 py-1.5 text-left transition-colors hover:bg-[rgba(20,22,26,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]',
                      CATEGORY_STYLE[cat].chip,
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-[var(--ink)]">
                      {t(`blocks.${b.id}.name`)}
                    </span>
                    <span className="block truncate text-[10px] text-[var(--text-4)]">
                      {t(`blocks.${b.id}.desc`)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}

// ─── Node card on the canvas ──────────────────────────────────────────────────

interface NodeCardProps {
  workflowId: string;
  node: WorkflowNode;
  selected: boolean;
  pendingFrom: string | null;
  onSelect: () => void;
  onStartConnect: () => void;
  onCompleteConnect: () => void;
}

function NodeCard({
  workflowId,
  node,
  selected,
  pendingFrom,
  onSelect,
  onStartConnect,
  onCompleteConnect,
}: NodeCardProps) {
  const { t } = useTranslation('accounting');
  const moveNode = useWorkflowsStore((s) => s.moveNode);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const def = BLOCK_MAP[node.blockId];
  const Icon = def.icon;
  const style = CATEGORY_STYLE[def.category];

  const summary: string[] = [];
  if (node.config.role) summary.push(t(`role.${node.config.role}`).split(' ')[0]);
  if (node.config.channel) summary.push(t(`requests.channel.${node.config.channel}`));
  if (node.config.threshold !== undefined) summary.push(`≥ ${node.config.threshold}%`);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-port]')) return;
    e.stopPropagation();
    onSelect();
    drag.current = { px: e.clientX, py: e.clientY, x: node.x, y: node.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const x = Math.min(CANVAS_W - NODE_W, Math.max(0, drag.current.x + e.clientX - drag.current.px));
    const y = Math.min(CANVAS_H - NODE_H, Math.max(0, drag.current.y + e.clientY - drag.current.py));
    moveNode(workflowId, node.id, x, y);
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const isPendingSource = pendingFrom === node.id;
  const isConnectTarget = pendingFrom !== null && pendingFrom !== node.id;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn(
        'absolute cursor-grab select-none rounded-[12px] border bg-white shadow-sm transition-shadow active:cursor-grabbing',
        selected
          ? cn('border-transparent ring-2', style.ring)
          : 'border-[var(--line)] hover:shadow-md',
        node.blockId === 'human_decision' && 'border-[var(--ink)]',
      )}
      style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
    >
      <div className="flex h-full items-center gap-2.5 px-3">
        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]', style.chip)}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-[var(--ink)]">{t(`blocks.${node.blockId}.name`)}</p>
          <p className="truncate text-[10px] text-[var(--text-4)]">{t(`blockCat.${def.category}`)}</p>
          {summary.length > 0 && (
            <p className="truncate text-[10px] font-medium text-[var(--text-2)]">{summary.join(' · ')}</p>
          )}
        </div>
      </div>

      {/* Input port */}
      <button
        type="button"
        data-port="in"
        onClick={(e) => {
          e.stopPropagation();
          if (isConnectTarget) onCompleteConnect();
        }}
        aria-label={`${t(`blocks.${node.blockId}.name`)} — in`}
        className={cn(
          'absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white transition-transform',
          isConnectTarget ? 'scale-150 bg-[var(--ok-fg)]' : 'bg-[rgba(20,22,26,0.25)] hover:bg-[var(--ink)]',
        )}
      />
      {/* Output port */}
      <button
        type="button"
        data-port="out"
        onClick={(e) => {
          e.stopPropagation();
          onStartConnect();
        }}
        aria-label={`${t(`blocks.${node.blockId}.name`)} — out`}
        className={cn(
          'absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white transition-transform',
          isPendingSource ? 'scale-150 bg-[var(--ink)]' : 'bg-[rgba(20,22,26,0.25)] hover:bg-[var(--ink)]',
        )}
      />
    </div>
  );
}

// ─── Inspector ────────────────────────────────────────────────────────────────

function Inspector({
  workflow,
  selection,
  onClearSelection,
}: {
  workflow: Workflow;
  selection: Selection;
  onClearSelection: () => void;
}) {
  const { t } = useTranslation('accounting');
  const updateNodeConfig = useWorkflowsStore((s) => s.updateNodeConfig);
  const removeNode = useWorkflowsStore((s) => s.removeNode);
  const removeEdge = useWorkflowsStore((s) => s.removeEdge);

  const node =
    selection?.type === 'node' ? workflow.nodes.find((n) => n.id === selection.id) : undefined;
  const edge =
    selection?.type === 'edge' ? workflow.edges.find((e) => e.id === selection.id) : undefined;

  const selectCls =
    'w-full rounded-[10px] border border-[var(--line)] bg-white px-2 py-1.5 text-xs text-[var(--text-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25';
  const labelCls = 'plat-eyebrow mb-1.5 block';

  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-l border-[var(--line-soft)]">
      <div className="px-4 pb-2 pt-4">
        <p className="plat-eyebrow">{t('builder.inspector')}</p>
      </div>

      {!node && !edge && (
        <p className="px-4 text-xs text-[var(--text-4)]">{t('builder.inspectorEmpty')}</p>
      )}

      {edge && (
        <div className="space-y-3 px-4">
          <p className="text-xs text-[var(--text-2)]">{t('builder.edgeSelected')}</p>
          <button
            type="button"
            onClick={() => {
              removeEdge(workflow.id, edge.id);
              onClearSelection();
            }}
            className="plat-btn-ghost h-8 px-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
          >
            <Unlink className="h-3.5 w-3.5" /> {t('builder.removeEdge')}
          </button>
        </div>
      )}

      {node && (
        <div className="space-y-4 px-4 pb-6">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]',
                CATEGORY_STYLE[BLOCK_MAP[node.blockId].category].chip,
              )}
            >
              {(() => {
                const Icon = BLOCK_MAP[node.blockId].icon;
                return <Icon className="h-4 w-4" />;
              })()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--ink)]">
                {t(`blocks.${node.blockId}.name`)}
              </p>
              <p className="text-[10px] text-[var(--text-4)]">
                {t(`blockCat.${BLOCK_MAP[node.blockId].category}`)}
              </p>
            </div>
          </div>
          <p className="text-xs text-[var(--text-3)]">{t(`blocks.${node.blockId}.desc`)}</p>

          {node.blockId === 'human_decision' && (
            <div className="rounded-[12px] border border-[var(--line-soft)] bg-[var(--sand)] p-3 text-[11px] leading-relaxed text-[var(--text-2)]">
              {t('builder.humanHint')}
            </div>
          )}
          {node.blockId === 'confidence_gate' && (
            <div className="rounded-[12px] bg-[var(--sand)] p-3 text-[11px] leading-relaxed text-[var(--text-2)]">
              {t('builder.gateHint')}
            </div>
          )}

          {BLOCK_MAP[node.blockId].configurable.includes('role') && (
            <div>
              <label htmlFor="wf-role" className={labelCls}>
                {t('builder.config.role')}
              </label>
              <select
                id="wf-role"
                value={node.config.role ?? 'approver'}
                onChange={(e) =>
                  updateNodeConfig(workflow.id, node.id, { role: e.target.value as Role })
                }
                className={selectCls}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {t(`role.${r}`)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {BLOCK_MAP[node.blockId].configurable.includes('channel') && (
            <div>
              <label htmlFor="wf-channel" className={labelCls}>
                {node.blockId === 'human_decision'
                  ? t('builder.config.channel')
                  : t('builder.config.sendChannel')}
              </label>
              <select
                id="wf-channel"
                value={node.config.channel ?? 'email'}
                onChange={(e) =>
                  updateNodeConfig(workflow.id, node.id, {
                    channel: e.target.value as RequestChannel,
                  })
                }
                className={selectCls}
              >
                {CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {t(`requests.channel.${c}`)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {BLOCK_MAP[node.blockId].configurable.includes('threshold') && (
            <div>
              <label htmlFor="wf-threshold" className={labelCls}>
                {t('builder.config.threshold')} · {node.config.threshold ?? 85}%
              </label>
              <input
                id="wf-threshold"
                type="range"
                min={50}
                max={99}
                value={node.config.threshold ?? 85}
                onChange={(e) =>
                  updateNodeConfig(workflow.id, node.id, { threshold: Number(e.target.value) })
                }
                className="w-full accent-[#14161a]"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              removeNode(workflow.id, node.id);
              onClearSelection();
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[rgba(179,56,46,0.25)] px-3.5 text-xs font-semibold text-[var(--bad-fg)] transition-colors hover:bg-[rgba(179,56,46,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bad-fg)]/25"
          >
            <Trash2 className="h-3.5 w-3.5" /> {t('builder.removeBlock')}
          </button>
        </div>
      )}
    </aside>
  );
}

// ─── Builder view ─────────────────────────────────────────────────────────────

export default function WorkflowBuilderView() {
  const { t } = useTranslation('accounting');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const workflows = useWorkflowsStore((s) => s.workflows);
  const renameWorkflow = useWorkflowsStore((s) => s.renameWorkflow);
  const toggleStatus = useWorkflowsStore((s) => s.toggleStatus);
  const addNode = useWorkflowsStore((s) => s.addNode);
  const connectNodes = useWorkflowsStore((s) => s.connectNodes);
  const removeNode = useWorkflowsStore((s) => s.removeNode);
  const removeEdge = useWorkflowsStore((s) => s.removeEdge);

  const workflow = useMemo(() => workflows.find((w) => w.id === id), [workflows, id]);

  const [selection, setSelection] = useState<Selection>(null);
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);

  if (!workflow) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-[var(--text-4)]">{t('builder.notFound')}</p>
      </div>
    );
  }

  const guarded = hasGuardedActions(workflow);
  const nodeById = new Map(workflow.nodes.map((n) => [n.id, n]));

  const onCanvasKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setPendingFrom(null);
      setSelection(null);
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && selection) {
      if (selection.type === 'node') removeNode(workflow.id, selection.id);
      else removeEdge(workflow.id, selection.id);
      setSelection(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 border-b border-[var(--line-soft)] px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/accounting/workflows')}
            aria-label={t('builder.back')}
            className="rounded-[10px] p-2 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="plat-crumb px-2 text-[12px] text-[var(--text-4)]">3days.close</p>
            <input
              value={workflow.name}
              onChange={(e) => renameWorkflow(workflow.id, e.target.value)}
              aria-label={t('builder.nameLabel')}
              style={{ fontFamily: 'var(--display)', letterSpacing: '-0.03em' }}
              className="w-full min-w-0 truncate rounded-[10px] border border-transparent bg-transparent px-2 py-0.5 text-xl font-semibold text-[var(--ink)] hover:border-[var(--line)] focus-visible:border-[var(--line)] focus-visible:outline-none"
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn('plat-pill', guarded ? 'plat-pill-ok' : 'plat-pill-warn')}
          >
            {guarded ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
            {guarded ? t('workflows.guarded') : t('workflows.unguarded')}
          </span>
          <button
            type="button"
            onClick={() => toggleStatus(workflow.id)}
            className="plat-btn h-9 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
          >
            {workflow.status === 'active' ? (
              <>
                <Pause className="h-3.5 w-3.5" /> {t('workflows.pause')}
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> {t('workflows.activate')}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Palette onAdd={(blockId) => addNode(workflow.id, blockId)} />

        {/* Canvas */}
        <div className="relative min-w-0 flex-1 overflow-auto">
          <div
            role="application"
            aria-label={t('workflows.title')}
            tabIndex={0}
            onKeyDown={onCanvasKeyDown}
            onPointerDown={() => {
              setSelection(null);
              setPendingFrom(null);
            }}
            className="relative focus-visible:outline-none"
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              backgroundImage: 'radial-gradient(circle, rgba(20,22,26,0.13) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            <svg
              aria-hidden
              width={CANVAS_W}
              height={CANVAS_H}
              className="pointer-events-none absolute inset-0"
            >
              {workflow.edges.map((e) => {
                const from = nodeById.get(e.from);
                const to = nodeById.get(e.to);
                if (!from || !to) return null;
                const x1 = from.x + NODE_W;
                const y1 = from.y + NODE_H / 2;
                const x2 = to.x;
                const y2 = to.y + NODE_H / 2;
                const d = `M ${x1} ${y1} C ${x1 + 70} ${y1}, ${x2 - 70} ${y2}, ${x2} ${y2}`;
                const active = selection?.type === 'edge' && selection.id === e.id;
                return (
                  <g key={e.id}>
                    <path
                      d={d}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={14}
                      className="pointer-events-auto cursor-pointer"
                      onPointerDown={(ev) => {
                        ev.stopPropagation();
                        setSelection({ type: 'edge', id: e.id });
                        setPendingFrom(null);
                      }}
                    />
                    <path
                      d={d}
                      fill="none"
                      stroke={active ? '#14161a' : 'rgba(20,22,26,0.25)'}
                      strokeWidth={active ? 2.5 : 1.5}
                    />
                    <circle cx={x2 - 2} cy={y2} r={3} fill={active ? '#14161a' : 'rgba(20,22,26,0.25)'} />
                  </g>
                );
              })}
            </svg>

            {workflow.nodes.map((n) => (
              <NodeCard
                key={n.id}
                workflowId={workflow.id}
                node={n}
                selected={selection?.type === 'node' && selection.id === n.id}
                pendingFrom={pendingFrom}
                onSelect={() => {
                  setSelection({ type: 'node', id: n.id });
                }}
                onStartConnect={() => setPendingFrom(n.id)}
                onCompleteConnect={() => {
                  if (pendingFrom) connectNodes(workflow.id, pendingFrom, n.id);
                  setPendingFrom(null);
                }}
              />
            ))}
          </div>

          {/* Hint bar */}
          <div className="pointer-events-none sticky bottom-0 left-0 px-4 pb-3">
            <span
              className={cn(
                'inline-block rounded-full px-3.5 py-1.5 text-[11px] font-medium shadow-sm',
                pendingFrom
                  ? 'bg-[var(--ink)] text-white'
                  : 'bg-white/90 text-[var(--text-3)] ring-1 ring-[rgba(20,22,26,0.1)]',
              )}
            >
              {pendingFrom ? t('builder.connecting') : t('builder.canvasHint')}
            </span>
          </div>
        </div>

        <Inspector
          workflow={workflow}
          selection={selection}
          onClearSelection={() => setSelection(null)}
        />
      </div>
    </div>
  );
}
