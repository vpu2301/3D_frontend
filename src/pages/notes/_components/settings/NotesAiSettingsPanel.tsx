/**
 * Settings → AI, and Settings → AI log (FE-5 §6).
 *
 * Two tabs in one sheet:
 *
 *  - **Usage** — provider, model, region, the daily budget with a bar against
 *    the cap, a local-only switch, and the spend chart. Owner-only for the
 *    writable parts; everyone can see what is being spent on their data.
 *  - **AI log** — the `agent_actions` table with filters and CSV export. Every
 *    AI action the system has taken, exportable. For a firm that has to answer
 *    "what did you send where", this is the answer, and it is why the export
 *    button is not a nice-to-have.
 *
 * One deliberate departure from the spec stands from Sprint 3: this is a sheet
 * inside /notes rather than a section of the platform `/settings` page. The
 * Notes app owns its own surfaces; the platform shell is outside its boundary.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Sparkles, RefreshCw, ShieldCheck, Download, AlertTriangle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { notesApi, type AgentActionRow } from '@/pages/notes/_lib/apiClient';
import {
  spendSummary,
  aiConfig,
  updateAiConfig,
  type AiConfig,
  type AiSpendSummary,
  type SpendRange,
} from '@/pages/notes/_lib/aiClient';
import { toCsv, downloadCsv } from '@/pages/notes/_lib/csv';
import { resetAiConfigCache } from '@/pages/notes/_lib/aiConfigCache';
import AiSpendChart from './AiSpendChart';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Identity {
  userId: string;
  tenantName?: string | null;
  roles: string[];
  authMethod: string;
}

const STATUS_STYLE: Record<string, string> = {
  succeeded: 'plat-pill plat-pill-ok',
  approved: 'plat-pill plat-pill-ok',
  pending: 'plat-pill plat-pill-warn',
  rejected: 'plat-pill plat-pill-mute',
  failed: 'plat-pill bg-[rgba(179,56,46,0.1)] text-[var(--bad-fg)]',
  aborted: 'plat-pill plat-pill-mute',
  expired: 'plat-pill plat-pill-mute',
};

const RANGE_LABEL: Record<SpendRange, string> = {
  today: 'Today',
  '7d': '7 days',
  '30d': '30 days',
};

function money(usd: number): string {
  return usd > 0 && usd < 0.01 ? '<$0.01' : `$${usd.toFixed(2)}`;
}

/** The audit row, plus the fields BE-4 adds. Absent ones export as empty. */
type AuditRow = AgentActionRow & {
  provider?: string;
  region?: string;
  latencyMs?: number;
  noteId?: string;
  noteTitle?: string;
  source?: string;
};

export default function NotesAiSettingsPanel({ open, onOpenChange }: Props) {
  const [range, setRange] = useState<SpendRange>('today');
  const [summary, setSummary] = useState<AiSpendSummary | null>(null);
  const [actions, setActions] = useState<AuditRow[]>([]);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toolFilter, setToolFilter] = useState<string>('all');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // `aiConfig` resolves to null on a backend without the endpoint, and the
      // panel falls back to describing what last ran. `allSettled` keeps one
      // slow or missing endpoint from blanking the whole sheet.
      const [spend, page, me, cfg] = await Promise.allSettled([
        spendSummary(range),
        notesApi.agentActions(),
        notesApi.me(),
        aiConfig(),
      ]);

      if (spend.status === 'fulfilled') setSummary(spend.value);
      if (page.status === 'fulfilled') setActions(page.value.items as AuditRow[]);
      if (me.status === 'fulfilled') setIdentity(me.value);
      if (cfg.status === 'fulfilled') setConfig(cfg.value);

      if (spend.status === 'rejected' && page.status === 'rejected') {
        throw spend.reason;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load AI usage.');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    if (open) void refresh();
  }, [open, refresh]);

  const isOwner = identity?.roles.includes('owner') ?? false;
  const canEdit = isOwner && config !== null && config.editable !== false;

  // Falls back to what actually ran when there is no config endpoint. "What we
  // last sent your data through" is a weaker claim than "what is configured",
  // and the label below says which one is on screen.
  const lastAction = actions.find((a) => a.model || a.provider);
  const provider = config?.provider ?? lastAction?.provider ?? null;
  const model = config?.model ?? lastAction?.model ?? null;
  const region = config?.region ?? lastAction?.region ?? null;

  const budget = config?.dailyBudgetUsd ?? summary?.dailyBudgetUsd ?? null;
  const spent = summary?.costUsd ?? 0;
  const budgetRatio = budget && budget > 0 ? Math.min(1, spent / budget) : null;

  const tools = useMemo(
    () => [...new Set(actions.map((a) => a.toolName ?? a.kind))].sort(),
    [actions],
  );

  const filtered = useMemo(
    () =>
      actions.filter(
        (a) =>
          (statusFilter === 'all' || a.status === statusFilter) &&
          (toolFilter === 'all' || (a.toolName ?? a.kind) === toolFilter),
      ),
    [actions, statusFilter, toolFilter],
  );

  const saveConfig = async (patch: Partial<AiConfig>) => {
    setSaving(true);
    setError(null);
    try {
      setConfig(await updateAiConfig(patch));
      // The local-only pill reads a module-level cache; without this the header
      // would keep claiming the old posture until a page reload.
      resetAiConfigCache();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save that setting.');
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const csv = toCsv(
      [
        'time',
        'source',
        'tool',
        'note',
        'noteId',
        'status',
        'costUsd',
        'latencyMs',
        'provider',
        'model',
        'region',
        'userId',
        'approvedBy',
      ],
      filtered.map((a) => [
        new Date(a.createdAt).toISOString(),
        a.source ?? a.kind,
        a.toolName ?? '',
        a.noteTitle ?? '',
        a.noteId ?? '',
        a.status,
        a.costUsd.toFixed(6),
        a.latencyMs ?? '',
        a.provider ?? '',
        a.model ?? '',
        a.region ?? '',
        a.userId,
        a.approvedBy ?? '',
      ]),
    );
    // Date only: a filename is a label, and a timestamp to the second makes a
    // folder of exports impossible to scan.
    downloadCsv(`ai-log-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        /* Radix portals to <body>, outside `.platform` — `plat` re-declares the
           design tokens so the vars below resolve inside the portal. */
        className="plat flex w-full flex-col gap-0 border-[var(--line)] sm:max-w-2xl"
        style={{ background: 'var(--paper)' }}
      >
        <SheetHeader className="pb-3 text-left">
          <SheetTitle className="plat-display flex items-center gap-2 text-[19px] text-[var(--ink)]">
            <Sparkles aria-hidden className="h-4 w-4" style={{ color: 'var(--text-4)' }} /> AI
          </SheetTitle>
          <SheetDescription className="text-xs text-[var(--text-4)]">
            What the AI is configured to do, what it cost, and everything it has done.
          </SheetDescription>
        </SheetHeader>

        {error && (
          <Alert variant="destructive" className="mb-3 rounded-[10px] py-2">
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="usage" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="grid w-full grid-cols-2 rounded-[10px] bg-[var(--sand-deep)]">
            <TabsTrigger
              value="usage"
              className="rounded-[8px] text-xs data-[state=active]:bg-[var(--paper)] data-[state=active]:text-[var(--ink)]"
            >
              Usage &amp; settings
            </TabsTrigger>
            <TabsTrigger
              value="log"
              className="rounded-[8px] text-xs data-[state=active]:bg-[var(--paper)] data-[state=active]:text-[var(--ink)]"
            >
              AI log
            </TabsTrigger>
          </TabsList>

          {/* ── Usage ─────────────────────────────────────────────────── */}
          <TabsContent value="usage" className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
            <section className="mb-4 rounded-[14px] border border-[var(--line-soft)] p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)]">
                <ShieldCheck aria-hidden className="h-3.5 w-3.5" style={{ color: 'var(--text-4)' }} />
                Where your notes are processed
                {!config && (
                  <span className="plat-pill plat-pill-mute ml-auto !px-2 !py-0.5 !text-[10px] !font-normal">
                    last used
                  </span>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[var(--text-3)]">
                <Row label="Provider" value={provider} />
                <Row label="Model" value={model} />
                <Row label="Region" value={region === 'local' ? 'this machine' : region} />
                <Row label="Workspace" value={identity?.tenantName ?? null} />
              </dl>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--line-soft)] pt-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[var(--ink)]">Local only</div>
                  <p className="text-[11px] text-[var(--text-4)]">
                    Run every AI call inside this deployment. No note content leaves it.
                  </p>
                </div>
                <Switch
                  checked={Boolean(config?.localOnly)}
                  disabled={!canEdit || saving}
                  onCheckedChange={(checked) => void saveConfig({ localOnly: checked })}
                  aria-label="Local only"
                />
              </div>

              {!canEdit && (
                <p className="mt-2 text-[11px] text-[var(--text-5)]">
                  {config
                    ? 'Only a workspace owner can change these.'
                    : 'This deployment does not expose AI configuration to the browser; it is set on the server.'}
                </p>
              )}
            </section>

            <section className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex rounded-full border border-[var(--line)] p-0.5">
                  {(['today', '7d', '30d'] as const).map((r) => (
                    <button
                      data-command-exempt="range toggle inside the AI panel; the panel is reachable as nav.settings"
                      key={r}
                      type="button"
                      onClick={() => setRange(r)}
                      aria-pressed={range === r}
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs transition-colors',
                        range === r
                          ? 'bg-[var(--ink)] font-semibold text-white'
                          : 'text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
                      )}
                    >
                      {RANGE_LABEL[r]}
                    </button>
                  ))}
                </div>
                <button
                  data-command-exempt="reloads the AI usage figures; the panel is reachable as nav.settings"
                  type="button"
                  onClick={() => void refresh()}
                  disabled={loading}
                  className="plat-btn-ghost !h-7 !px-3 !text-[11px] ml-auto disabled:opacity-40"
                >
                  {loading ? (
                    <Loader2 aria-hidden className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw aria-hidden className="h-3 w-3" />
                  )}
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[14px] border border-[var(--line-soft)] p-3">
                  <div className="plat-eyebrow">Spend</div>
                  <div className="plat-num !text-[24px] mt-1.5">
                    {summary ? money(summary.costUsd) : '—'}
                  </div>
                </div>
                <div className="rounded-[14px] border border-[var(--line-soft)] p-3">
                  <div className="plat-eyebrow">Calls</div>
                  <div className="plat-num !text-[24px] mt-1.5">{summary?.calls ?? '—'}</div>
                </div>
              </div>

              {budgetRatio !== null && budget !== null && (
                <div className="mt-2 rounded-[14px] border border-[var(--line-soft)] p-3">
                  <div className="mb-1.5 flex items-center gap-2 text-xs">
                    <span className="text-[var(--text-3)]">Daily budget</span>
                    <span className="ml-auto tabular-nums text-[var(--ink)]">
                      {money(spent)} <span className="text-[var(--text-5)]">/ {money(budget)}</span>
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={Math.round(budgetRatio * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Daily AI budget used"
                    className="h-2 overflow-hidden rounded-full bg-[var(--sand-deep)]"
                  >
                    <div
                      className="h-full rounded-full transition-[width]"
                      style={{
                        width: `${budgetRatio * 100}%`,
                        background:
                          budgetRatio >= 1
                            ? 'var(--bad-fg)'
                            : budgetRatio >= 0.8
                              ? 'var(--warn-fg)'
                              : 'var(--ink)',
                      }}
                    />
                  </div>
                  {budgetRatio >= 0.8 && (
                    <p
                      className="mt-1.5 flex items-center gap-1 text-[11px]"
                      style={{ color: 'var(--warn-fg)' }}
                    >
                      <AlertTriangle aria-hidden className="h-3 w-3" />
                      {budgetRatio >= 1
                        ? 'Spent. AI features resume tomorrow; writing and saving are unaffected.'
                        : `${Math.round(budgetRatio * 100)}% used.`}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-2 rounded-[14px] border border-[var(--line-soft)] p-3">
                <div className="plat-eyebrow mb-2">By source</div>
                {summary ? (
                  <AiSpendChart summary={summary} range={range} />
                ) : (
                  <p className="py-3 text-xs text-[var(--text-4)]">No usage data yet.</p>
                )}
              </div>
            </section>
          </TabsContent>

          {/* ── AI log ────────────────────────────────────────────────── */}
          <TabsContent value="log" className="mt-3 flex min-h-0 flex-1 flex-col">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={['all', ...new Set(actions.map((a) => a.status))]}
              />
              <FilterSelect
                label="Tool"
                value={toolFilter}
                onChange={setToolFilter}
                options={['all', ...tools]}
              />
              <button
                data-command-exempt="exports the filtered AI log; the panel is reachable as nav.settings"
                type="button"
                onClick={exportCsv}
                disabled={filtered.length === 0}
                className="plat-btn-ghost !h-7 !px-3 !text-[11px] ml-auto disabled:opacity-40"
              >
                <Download aria-hidden className="h-3 w-3" />
                Export CSV ({filtered.length})
              </button>
            </div>

            {filtered.length === 0 ? (
              <p className="py-6 text-center text-xs text-[var(--text-4)]">
                {actions.length === 0 ? 'No AI actions recorded yet.' : 'Nothing matches these filters.'}
              </p>
            ) : (
              <ScrollArea className="min-h-0 flex-1">
                <table className="w-full text-left text-[11px]">
                  <thead className="sticky top-0 bg-[var(--paper)]">
                    <tr className="plat-eyebrow border-b border-[var(--line)]">
                      <th scope="col" className="py-1.5 pr-2 font-medium">Time</th>
                      <th scope="col" className="py-1.5 pr-2 font-medium">Tool</th>
                      <th scope="col" className="py-1.5 pr-2 font-medium">Note</th>
                      <th scope="col" className="py-1.5 pr-2 font-medium">Status</th>
                      <th scope="col" className="py-1.5 pr-2 text-right font-medium">Cost</th>
                      <th scope="col" className="py-1.5 pr-2 text-right font-medium">Latency</th>
                      <th scope="col" className="py-1.5 font-medium">Where</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr
                        key={a.id}
                        className="border-b border-[var(--line-soft)] transition-colors hover:bg-[rgba(20,22,26,0.03)]"
                      >
                        <td className="py-1.5 pr-2 whitespace-nowrap text-[var(--text-4)]">
                          {new Date(a.createdAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-1.5 pr-2 font-medium text-[var(--ink)]">
                          {a.toolName ?? a.kind}
                        </td>
                        <td className="max-w-[10rem] truncate py-1.5 pr-2 text-[var(--text-3)]">
                          {a.noteTitle ?? '—'}
                        </td>
                        <td className="py-1.5 pr-2">
                          <span
                            className={cn(
                              '!px-2 !py-0.5 !text-[10px]',
                              STATUS_STYLE[a.status] ?? 'plat-pill plat-pill-mute',
                            )}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="py-1.5 pr-2 text-right tabular-nums text-[var(--text-3)]">
                          {money(a.costUsd)}
                        </td>
                        <td className="py-1.5 pr-2 text-right tabular-nums text-[var(--text-4)]">
                          {a.latencyMs ? `${Math.round(a.latencyMs)} ms` : '—'}
                        </td>
                        <td className="py-1.5 text-[var(--text-4)]">
                          {a.provider || a.region
                            ? `${a.provider ?? '?'}${a.region ? ` · ${a.region}` : ''}`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-[var(--text-5)]">{label}</dt>
      <dd className="truncate">{value ?? '—'}</dd>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const id = `ai-log-filter-${label.toLowerCase()}`;
  return (
    <span className="flex items-center gap-1">
      <label htmlFor={id} className="plat-eyebrow">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-full border border-[var(--line)] bg-transparent px-2.5 py-1 text-xs text-[var(--text-2)] focus:border-[var(--ink)] focus:outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 'all' ? 'All' : option}
          </option>
        ))}
      </select>
    </span>
  );
}
