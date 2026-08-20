// Pincer Close — domain types (frontend contracts, §9 of the requirements)

export type CaseCategory =
  | 'missing_receipt'
  | 'vat_mismatch'
  | 'duplicate_booking'
  | 'unmatched_payment'
  | 'wrong_account'
  | 'accrual_needed';

export type CaseStatus = 'pending' | 'approved' | 'rejected';

export interface EvidenceRow {
  /** i18n key under accounting:evidence.* */
  labelKey: string;
  value: string;
}

export interface CloseCase {
  id: string;
  mandateId: string;
  transactionRef: string;
  amount: number;
  currency: string;
  category: CaseCategory;
  problem: string;
  suspectedCause: string;
  source: string;
  ruleCheck: string;
  ruleCheckPassed: boolean;
  proposedAction: string;
  /** 0–100 */
  confidence: number;
  status: CaseStatus;
  modelVersion: string;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Mandate {
  id: string;
  name: string;
  /** ISO date */
  deadline: string;
  risk: RiskLevel;
  missing: string;
}

export type MandateReadiness = 'ready' | 'open_items' | 'blocked';

export type RequestChannel = 'email' | 'teams' | 'whatsapp' | 'viber' | 'portal';

export type RequestStatus = 'draft' | 'sent';

export interface ClientRequest {
  id: string;
  mandateId: string;
  recipient: string;
  channel: RequestChannel;
  title: string;
  body: string;
  bundledItems: string[];
  status: RequestStatus;
}

export type AuditOutcome = 'approved' | 'rejected' | 'sent';

export interface AuditEntry {
  id: string;
  /** ISO timestamp */
  timestamp: string;
  action: string;
  detail: string;
  outcome: AuditOutcome;
  /** Full reconstruction payload (§8) */
  payload: {
    mandate: string;
    transactionRef?: string;
    source?: string;
    ruleApplied?: string;
    modelVersion?: string;
    approver: string;
    systemChange?: string;
    before?: string;
    after?: string;
  };
}

// ─── Permissions (§2: read, prepare, approve, send, upload, post) ─────────────

export type Right = 'read' | 'prepare' | 'approve' | 'send' | 'upload' | 'post';

export type Role = 'operator' | 'preparer' | 'approver';

export const ROLE_RIGHTS: Record<Role, Right[]> = {
  operator: ['read', 'prepare', 'approve', 'send', 'upload', 'post'],
  preparer: ['read', 'prepare', 'upload'],
  approver: ['read', 'approve', 'send', 'post'],
};

/** Cases at or above this confidence are considered high-confidence (§4). */
export const CONFIDENCE_THRESHOLD = 85;

// ─── Workflows (§5: automations with a mandatory human decision gate) ─────────

export type BlockCategory = 'trigger' | 'integration' | 'agent' | 'logic' | 'human' | 'action';

export type BlockId =
  // triggers
  | 'schedule'
  | 'bank_feed'
  | 'inbox_document'
  // integrations
  | 'datev'
  | 'ocr'
  | 'vies'
  | 'dms'
  // agent steps
  | 'detect'
  | 'propose'
  | 'draft_request'
  // logic
  | 'rule_check'
  | 'confidence_gate'
  // human in the loop
  | 'human_decision'
  // actions
  | 'send_request'
  | 'datev_post'
  | 'audit';

export interface NodeConfig {
  /** Delivery channel — for human_decision the decision request, for send_request the client message. */
  channel?: RequestChannel;
  /** Role whose decision is required (human_decision). */
  role?: Role;
  /** Confidence threshold 0–100 (confidence_gate). */
  threshold?: number;
}

export interface WorkflowNode {
  id: string;
  blockId: BlockId;
  /** Canvas position (px). */
  x: number;
  y: number;
  config: NodeConfig;
}

export interface WorkflowEdge {
  id: string;
  /** Source node id (output port). */
  from: string;
  /** Target node id (input port). */
  to: string;
}

export type WorkflowStatus = 'active' | 'paused' | 'draft';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  runs30d: number;
  /** ISO timestamp of the last run, if any. */
  lastRun?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
