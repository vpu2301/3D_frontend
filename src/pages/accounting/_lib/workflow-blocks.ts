import {
  CalendarClock,
  Landmark,
  Inbox,
  Database,
  ScanText,
  ShieldCheck,
  FolderSearch,
  Sparkles,
  Wand2,
  PenLine,
  ListChecks,
  Gauge,
  UserCheck,
  Send,
  Upload,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';
import type { BlockCategory, BlockId } from './types';

// Block catalog for the workflow builder. Names/descriptions live in i18n under
// accounting:blocks.<id>.* — this file only carries structure and visuals.

export type ConfigurableField = 'channel' | 'role' | 'threshold';

export interface BlockDef {
  id: BlockId;
  category: BlockCategory;
  icon: LucideIcon;
  configurable: ConfigurableField[];
}

export const BLOCK_CATEGORIES: BlockCategory[] = [
  'trigger',
  'integration',
  'agent',
  'logic',
  'human',
  'action',
];

export const BLOCKS: BlockDef[] = [
  // Triggers — what starts a run
  { id: 'schedule', category: 'trigger', icon: CalendarClock, configurable: [] },
  { id: 'bank_feed', category: 'trigger', icon: Landmark, configurable: [] },
  { id: 'inbox_document', category: 'trigger', icon: Inbox, configurable: [] },
  // Integrations — external systems the run reads from
  { id: 'datev', category: 'integration', icon: Database, configurable: [] },
  { id: 'ocr', category: 'integration', icon: ScanText, configurable: [] },
  { id: 'vies', category: 'integration', icon: ShieldCheck, configurable: [] },
  { id: 'dms', category: 'integration', icon: FolderSearch, configurable: [] },
  // Agent steps — the model prepares, never decides
  { id: 'detect', category: 'agent', icon: Sparkles, configurable: [] },
  { id: 'propose', category: 'agent', icon: Wand2, configurable: [] },
  { id: 'draft_request', category: 'agent', icon: PenLine, configurable: [] },
  // Logic
  { id: 'rule_check', category: 'logic', icon: ListChecks, configurable: [] },
  { id: 'confidence_gate', category: 'logic', icon: Gauge, configurable: ['threshold'] },
  // Human in the loop — the only block that can unlock outward/system actions
  { id: 'human_decision', category: 'human', icon: UserCheck, configurable: ['role', 'channel'] },
  // Actions — only reachable after a human decision
  { id: 'send_request', category: 'action', icon: Send, configurable: ['channel'] },
  { id: 'datev_post', category: 'action', icon: Upload, configurable: [] },
  { id: 'audit', category: 'action', icon: ScrollText, configurable: [] },
];

export const BLOCK_MAP: Record<BlockId, BlockDef> = Object.fromEntries(
  BLOCKS.map((b) => [b.id, b]),
) as Record<BlockId, BlockDef>;

/** Icon-chip tint per category — neutral platform chips; the human gate is the
    only one that inverts to ink so the guarantee still stands out. */
export const CATEGORY_STYLE: Record<BlockCategory, { chip: string; ring: string }> = {
  trigger: { chip: 'bg-[#f4f5f7] text-[#14161a]', ring: 'ring-[rgba(20,22,26,0.2)]' },
  integration: { chip: 'bg-[#f4f5f7] text-[#14161a]', ring: 'ring-[rgba(20,22,26,0.2)]' },
  agent: { chip: 'bg-[#f4f5f7] text-[#14161a]', ring: 'ring-[rgba(20,22,26,0.2)]' },
  logic: { chip: 'bg-[#f4f5f7] text-[#14161a]', ring: 'ring-[rgba(20,22,26,0.2)]' },
  human: { chip: 'bg-[#14161a] text-white', ring: 'ring-[rgba(20,22,26,0.35)]' },
  action: { chip: 'bg-[#e9ebef] text-[#14161a]', ring: 'ring-[rgba(20,22,26,0.2)]' },
};

/** Node card geometry — edges are computed from these, keep in sync with WorkflowNodeCard. */
export const NODE_W = 224;
export const NODE_H = 80;
