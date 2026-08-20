// src/lib/api/dashboard.ts
// API client + types for the Pincer dashboard endpoints:
// /api/status, /api/costs/*, /api/audit, /api/schedules, /api/skills.
// Same pattern as voice.ts — auth single-sourced through pincerClient,
// TanStack Query hooks gated on a connected backend.

import { useQuery } from "@tanstack/react-query";
import { isConnected, PincerError } from "@/lib/pincerClient";
import { apiFetch } from "@/lib/api/voice";
import { REFETCH_INTERVALS } from "@/lib/constants";

// ── Types (mirror the Pincer API responses) ─────────────────────────

export interface AgentStatus {
  agent_running: boolean;
  version: string;
  channels: Record<string, boolean>;
}

export interface BudgetStatus {
  daily_limit: number;
  spent_today: number;
  spent_pct: number;
  remaining: number;
  is_downgraded: boolean;
}

export interface TodayCosts {
  date: string;
  total_usd: number;
  by_model: Record<string, number>;
  by_tool: Record<string, number>;
  request_count: number;
  budget: BudgetStatus;
}

export interface CostHistoryDay {
  date: string;
  total_usd: number;
  request_count: number;
}

export interface CostHistory {
  period_days: number;
  data: CostHistoryDay[];
  totals: { total_usd: number; total_requests: number; avg_daily_usd: number };
}

export interface ModelCost {
  model: string;
  total_usd: number;
  request_count: number;
  total_tokens: number;
  avg_cost_per_request: number;
}

export interface ToolCost {
  tool: string;
  total_usd: number;
  call_count: number;
  avg_cost: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user_id: string;
  action: string;
  tool: string | null;
  input_summary: string | null;
  output_summary: string | null;
  approved: boolean;
  cost_usd: number | null;
  duration_ms: number | null;
  /** Parsed metadata_json — free-form context recorded with the action. */
  metadata?: Record<string, unknown> | null;
}

export interface AuditStats {
  total_entries: number;
  by_action: Record<string, number>;
  by_tool: Record<string, number>;
  total_cost_usd: number;
  failed_actions: number;
}

export interface ScheduledTask {
  id: string | number;
  name: string;
  kind: "one_time" | "recurring";
  cron_expr: string;
  timezone: string;
  channel: string;
  enabled: boolean;
  /** The scheduled payload — what the agent will actually do when it fires. */
  action?: Record<string, unknown> | null;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SchedulesOut {
  tasks: ScheduledTask[];
  total: number;
  future_count: number;
  past_count: number;
}

export interface SkillEntry {
  name: string;
  description: string;
  status: string;
  source: string;
  dir: string;
}

// ── Hooks ────────────────────────────────────────────────────────────

const DASH_REFETCH = REFETCH_INTERVALS.VOICE ?? 5_000;

export function useAgentStatus() {
  return useQuery<AgentStatus, PincerError>({
    queryKey: ["dash", "status"],
    queryFn: () => apiFetch("/api/status"),
    refetchInterval: DASH_REFETCH * 3,
    enabled: isConnected(),
  });
}

export function useTodayCosts() {
  return useQuery<TodayCosts, PincerError>({
    queryKey: ["dash", "costs", "today"],
    queryFn: () => apiFetch("/api/costs/today"),
    refetchInterval: DASH_REFETCH,
    enabled: isConnected(),
  });
}

export function useCostHistory(days = 14) {
  return useQuery<CostHistory, PincerError>({
    queryKey: ["dash", "costs", "history", days],
    queryFn: () => apiFetch(`/api/costs/history?days=${days}`),
    refetchInterval: DASH_REFETCH * 6,
    enabled: isConnected(),
  });
}

export function useCostsByModel(days = 7) {
  return useQuery<{ models: ModelCost[] }, PincerError>({
    queryKey: ["dash", "costs", "by-model", days],
    queryFn: () => apiFetch(`/api/costs/by-model?days=${days}`),
    refetchInterval: DASH_REFETCH * 6,
    enabled: isConnected(),
  });
}

export function useCostsByTool(days = 7) {
  return useQuery<{ tools: ToolCost[] }, PincerError>({
    queryKey: ["dash", "costs", "by-tool", days],
    queryFn: () => apiFetch(`/api/costs/by-tool?days=${days}`),
    refetchInterval: DASH_REFETCH * 6,
    enabled: isConnected(),
  });
}

export function useRecentAudit(limit = 8) {
  return useQuery<{ entries: AuditEntry[]; total: number }, PincerError>({
    queryKey: ["dash", "audit", limit],
    queryFn: () => apiFetch(`/api/audit?limit=${limit}`),
    refetchInterval: DASH_REFETCH,
    enabled: isConnected(),
  });
}

export function useAuditStats(sinceIsoDate?: string) {
  const qs = sinceIsoDate ? `?since=${sinceIsoDate}` : "";
  return useQuery<AuditStats, PincerError>({
    queryKey: ["dash", "audit-stats", sinceIsoDate ?? "all"],
    queryFn: () => apiFetch(`/api/audit/stats${qs}`),
    refetchInterval: DASH_REFETCH * 3,
    enabled: isConnected(),
  });
}

export function useSchedules(includePast = false) {
  return useQuery<SchedulesOut, PincerError>({
    queryKey: ["dash", "schedules", includePast],
    queryFn: () => apiFetch(`/api/schedules${includePast ? "?include_past=true" : ""}`),
    refetchInterval: DASH_REFETCH * 6,
    enabled: isConnected(),
  });
}

export function useSkills() {
  return useQuery<{ skills: SkillEntry[] }, PincerError>({
    queryKey: ["dash", "skills"],
    queryFn: () => apiFetch("/api/skills"),
    staleTime: 60_000,
    enabled: isConnected(),
  });
}
