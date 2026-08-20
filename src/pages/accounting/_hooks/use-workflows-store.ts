import { create } from 'zustand';
import type {
  BlockId,
  NodeConfig,
  Workflow,
  WorkflowEdge,
  WorkflowNode,
  WorkflowStatus,
} from '@/pages/accounting/_lib/types';
import { BLOCK_MAP } from '@/pages/accounting/_lib/workflow-blocks';

// Mock seed — stands in for the agent backend. Every workflow that reaches an
// outward or system action routes through a human_decision block (the concept's
// core rule: the agent prepares, a person decides).

let seq = 100;
const nid = () => `n-${seq++}`;
const eid = () => `e-${seq++}`;
const wid = () => `wf-${seq++}`;

function chain(nodes: WorkflowNode[]): WorkflowEdge[] {
  return nodes.slice(0, -1).map((n, i) => ({ id: eid(), from: n.id, to: nodes[i + 1].id }));
}

function node(blockId: BlockId, x: number, y: number, config: NodeConfig = {}): WorkflowNode {
  return { id: nid(), blockId, x, y, config };
}

const receiptChaseNodes = [
  node('bank_feed', 40, 120),
  node('detect', 320, 48),
  node('rule_check', 600, 150),
  node('draft_request', 880, 48),
  node('human_decision', 1160, 130, { role: 'approver', channel: 'teams' }),
  node('send_request', 1440, 48, { channel: 'whatsapp' }),
  node('audit', 1720, 150),
];

const vatFixNodes = [
  node('datev', 40, 60),
  node('vies', 320, 160),
  node('propose', 600, 60),
  node('confidence_gate', 880, 160, { threshold: 85 }),
  node('human_decision', 1160, 60, { role: 'approver', channel: 'email' }),
  node('datev_post', 1440, 160),
  node('audit', 1720, 60),
];

const accrualNodes = [
  node('schedule', 40, 100),
  node('detect', 320, 60),
  node('human_decision', 600, 130, { role: 'preparer', channel: 'portal' }),
];

const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-receipt-chase',
    name: 'Missing receipt chase',
    description:
      'Bank feed lines without a matching document trigger a drafted client request — sent only after approval.',
    status: 'active',
    runs30d: 42,
    lastRun: '2026-07-24T07:40:00Z',
    nodes: receiptChaseNodes,
    edges: chain(receiptChaseNodes),
  },
  {
    id: 'wf-vat-fix',
    name: 'VAT reverse-charge fix',
    description:
      'EU suppliers are checked against VIES; rebooking proposals above the confidence gate go to the approver.',
    status: 'active',
    runs30d: 17,
    lastRun: '2026-07-23T16:05:00Z',
    nodes: vatFixNodes,
    edges: chain(vatFixNodes),
  },
  {
    id: 'wf-accrual-review',
    name: 'Month-end accrual review',
    description: 'Scheduled sweep for accruals — findings land with the preparer in the portal.',
    status: 'draft',
    runs30d: 0,
    nodes: accrualNodes,
    edges: chain(accrualNodes),
  },
];

interface WorkflowsState {
  workflows: Workflow[];

  createWorkflow: (name: string) => string;
  renameWorkflow: (id: string, name: string) => void;
  toggleStatus: (id: string) => void;

  addNode: (wfId: string, blockId: BlockId) => void;
  moveNode: (wfId: string, nodeId: string, x: number, y: number) => void;
  removeNode: (wfId: string, nodeId: string) => void;
  updateNodeConfig: (wfId: string, nodeId: string, patch: Partial<NodeConfig>) => void;

  connectNodes: (wfId: string, from: string, to: string) => void;
  removeEdge: (wfId: string, edgeId: string) => void;
}

function patchWorkflow(
  workflows: Workflow[],
  id: string,
  fn: (w: Workflow) => Workflow,
): Workflow[] {
  return workflows.map((w) => (w.id === id ? fn(w) : w));
}

export const useWorkflowsStore = create<WorkflowsState>()((set) => ({
  workflows: MOCK_WORKFLOWS,

  createWorkflow: (name) => {
    const id = wid();
    const start = node('schedule', 60, 120);
    set((s) => ({
      workflows: [
        ...s.workflows,
        {
          id,
          name,
          description: '',
          status: 'draft',
          runs30d: 0,
          nodes: [start],
          edges: [],
        },
      ],
    }));
    return id;
  },

  renameWorkflow: (id, name) =>
    set((s) => ({ workflows: patchWorkflow(s.workflows, id, (w) => ({ ...w, name })) })),

  toggleStatus: (id) =>
    set((s) => ({
      workflows: patchWorkflow(s.workflows, id, (w) => {
        const next: WorkflowStatus = w.status === 'active' ? 'paused' : 'active';
        return { ...w, status: next };
      }),
    })),

  addNode: (wfId, blockId) =>
    set((s) => ({
      workflows: patchWorkflow(s.workflows, wfId, (w) => {
        // Stagger new blocks so consecutive adds don't stack exactly on top of each other.
        const i = w.nodes.length;
        const defaults: NodeConfig =
          blockId === 'human_decision'
            ? { role: 'approver', channel: 'email' }
            : blockId === 'send_request'
              ? { channel: 'email' }
              : blockId === 'confidence_gate'
                ? { threshold: 85 }
                : {};
        return {
          ...w,
          nodes: [...w.nodes, node(blockId, 60 + (i % 5) * 70, 48 + (i % 4) * 64, defaults)],
        };
      }),
    })),

  moveNode: (wfId, nodeId, x, y) =>
    set((s) => ({
      workflows: patchWorkflow(s.workflows, wfId, (w) => ({
        ...w,
        nodes: w.nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)),
      })),
    })),

  removeNode: (wfId, nodeId) =>
    set((s) => ({
      workflows: patchWorkflow(s.workflows, wfId, (w) => ({
        ...w,
        nodes: w.nodes.filter((n) => n.id !== nodeId),
        edges: w.edges.filter((e) => e.from !== nodeId && e.to !== nodeId),
      })),
    })),

  updateNodeConfig: (wfId, nodeId, patch) =>
    set((s) => ({
      workflows: patchWorkflow(s.workflows, wfId, (w) => ({
        ...w,
        nodes: w.nodes.map((n) =>
          n.id === nodeId ? { ...n, config: { ...n.config, ...patch } } : n,
        ),
      })),
    })),

  connectNodes: (wfId, from, to) =>
    set((s) => ({
      workflows: patchWorkflow(s.workflows, wfId, (w) => {
        if (from === to) return w;
        if (w.edges.some((e) => e.from === from && e.to === to)) return w;
        return { ...w, edges: [...w.edges, { id: eid(), from, to }] };
      }),
    })),

  removeEdge: (wfId, edgeId) =>
    set((s) => ({
      workflows: patchWorkflow(s.workflows, wfId, (w) => ({
        ...w,
        edges: w.edges.filter((e) => e.id !== edgeId),
      })),
    })),
}));

// ─── Derived helpers (plain functions — call with a workflow, not the store) ──

/** The human decision gates of a workflow — the concept requires at least one before any action. */
export function humanGates(w: Workflow): WorkflowNode[] {
  return w.nodes.filter((n) => n.blockId === 'human_decision');
}

/** True when every action block is preceded (transitively) by a human_decision. */
export function hasGuardedActions(w: Workflow): boolean {
  const actions = w.nodes.filter((n) => BLOCK_MAP[n.blockId].category === 'action');
  if (actions.length === 0) return true;
  const inbound = new Map<string, string[]>();
  for (const e of w.edges) inbound.set(e.to, [...(inbound.get(e.to) ?? []), e.from]);
  const nodeById = new Map(w.nodes.map((n) => [n.id, n]));
  const guarded = (id: string, seen: Set<string>): boolean => {
    if (seen.has(id)) return false;
    seen.add(id);
    return (inbound.get(id) ?? []).some((src) => {
      const srcNode = nodeById.get(src);
      if (!srcNode) return false;
      if (srcNode.blockId === 'human_decision') return true;
      return guarded(src, seen);
    });
  };
  return actions.every((a) => guarded(a.id, new Set()));
}
