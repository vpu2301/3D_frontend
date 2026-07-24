import { create } from 'zustand';
import type {
  AuditEntry,
  ClientRequest,
  CloseCase,
  Mandate,
  MandateReadiness,
  Right,
  Role,
} from '@/pages/accounting/_lib/types';
import { ROLE_RIGHTS } from '@/pages/accounting/_lib/types';
import {
  MOCK_AUDIT,
  MOCK_CASES,
  MOCK_MANDATES,
  MOCK_REQUESTS,
} from '@/pages/accounting/_lib/mock-data';

// Mock operator identity per role — a real backend would supply this.
const ROLE_NAMES: Record<Role, string> = {
  operator: 'A. Kovalenko',
  preparer: 'M. Weber',
  approver: 'S. Brandt',
};

let auditSeq = 9100;

interface AccountingState {
  mandates: Mandate[];
  cases: CloseCase[];
  requests: ClientRequest[];
  audit: AuditEntry[];
  role: Role;

  setRole: (role: Role) => void;
  can: (right: Right) => boolean;

  approveCase: (id: string) => void;
  rejectCase: (id: string) => void;
  editCaseProposal: (id: string, proposedAction: string) => void;

  editRequest: (id: string, patch: Pick<Partial<ClientRequest>, 'title' | 'body'>) => void;
  approveAndSendRequest: (id: string) => void;
}

function appendAudit(
  audit: AuditEntry[],
  entry: Omit<AuditEntry, 'id' | 'timestamp'>,
): AuditEntry[] {
  // Append-only: new entries are prepended (newest first), existing ones never change.
  return [
    { ...entry, id: `a-${auditSeq++}`, timestamp: new Date().toISOString() },
    ...audit,
  ];
}

export const useAccountingStore = create<AccountingState>()((set, get) => ({
  mandates: MOCK_MANDATES,
  cases: MOCK_CASES,
  requests: MOCK_REQUESTS,
  audit: MOCK_AUDIT,
  role: 'operator',

  setRole: (role) => set({ role }),
  can: (right) => ROLE_RIGHTS[get().role].includes(right),

  approveCase: (id) => {
    const { cases, mandates, audit, role } = get();
    const c = cases.find((x) => x.id === id && x.status === 'pending');
    if (!c) return;
    const mandate = mandates.find((m) => m.id === c.mandateId);
    set({
      cases: cases.map((x) => (x.id === id ? { ...x, status: 'approved' } : x)),
      audit: appendAudit(audit, {
        action: 'case.approved',
        detail: `${mandate?.name ?? c.mandateId} · ${c.transactionRef} · ${c.proposedAction}`,
        outcome: 'approved',
        payload: {
          mandate: mandate?.name ?? c.mandateId,
          transactionRef: c.transactionRef,
          source: c.source,
          ruleApplied: c.ruleCheck,
          modelVersion: c.modelVersion,
          approver: ROLE_NAMES[role],
          systemChange: 'DATEV posting prepared',
          before: c.problem,
          after: c.proposedAction,
        },
      }),
    });
  },

  rejectCase: (id) => {
    const { cases, mandates, audit, role } = get();
    const c = cases.find((x) => x.id === id && x.status === 'pending');
    if (!c) return;
    const mandate = mandates.find((m) => m.id === c.mandateId);
    set({
      cases: cases.map((x) => (x.id === id ? { ...x, status: 'rejected' } : x)),
      audit: appendAudit(audit, {
        action: 'case.rejected',
        detail: `${mandate?.name ?? c.mandateId} · ${c.transactionRef} · proposal rejected`,
        outcome: 'rejected',
        payload: {
          mandate: mandate?.name ?? c.mandateId,
          transactionRef: c.transactionRef,
          source: c.source,
          ruleApplied: c.ruleCheck,
          modelVersion: c.modelVersion,
          approver: ROLE_NAMES[role],
          systemChange: 'No posting — case returned to agent',
          before: c.problem,
          after: 'Rejected (manual follow-up)',
        },
      }),
    });
  },

  editCaseProposal: (id, proposedAction) =>
    set((s) => ({
      cases: s.cases.map((x) => (x.id === id ? { ...x, proposedAction } : x)),
    })),

  editRequest: (id, patch) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id && r.status === 'draft' ? { ...r, ...patch } : r,
      ),
    })),

  approveAndSendRequest: (id) => {
    const { requests, mandates, audit, role } = get();
    const r = requests.find((x) => x.id === id && x.status === 'draft');
    if (!r) return;
    const mandate = mandates.find((m) => m.id === r.mandateId);
    set({
      requests: requests.map((x) => (x.id === id ? { ...x, status: 'sent' } : x)),
      audit: appendAudit(audit, {
        action: 'request.sent',
        detail: `${mandate?.name ?? r.mandateId} · ${r.title} · ${r.channel}`,
        outcome: 'sent',
        payload: {
          mandate: mandate?.name ?? r.mandateId,
          approver: ROLE_NAMES[role],
          systemChange: `Delivered via ${r.channel} to ${r.recipient}`,
          before: 'Draft',
          after: 'Sent',
        },
      }),
    });
  },
}));

// ─── Derived selectors ────────────────────────────────────────────────────────

export const selectPendingCases = (s: AccountingState) =>
  s.cases.filter((c) => c.status === 'pending');

export const selectDraftRequests = (s: AccountingState) =>
  s.requests.filter((r) => r.status === 'draft');

export function openItemCount(s: AccountingState, mandateId: string): number {
  return s.cases.filter((c) => c.mandateId === mandateId && c.status === 'pending').length;
}

export function mandateReadiness(s: AccountingState, mandate: Mandate): MandateReadiness {
  const open = openItemCount(s, mandate.id);
  if (open === 0) return 'ready';
  return mandate.risk === 'high' ? 'blocked' : 'open_items';
}
