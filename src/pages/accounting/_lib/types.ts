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
