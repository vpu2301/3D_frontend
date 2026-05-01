import { useState } from 'react';
import { Download, Shield, Eye, Phone, FileText, Settings2, ChevronRight } from 'lucide-react';
import { MOCK_CALLS } from '@/pages/telephony/_lib/mock-data';
import { cn } from '@/lib/utils';

interface AuditEntry {
  id: string;
  ts: number;
  actor: string;
  actorType: 'user' | 'agent' | 'system';
  action: string;
  target: string;
  targetType: 'call' | 'number' | 'policy' | 'transcript' | 'pii';
  detail?: string;
}

const now = Date.now();
const min = 60_000;

const ENTRIES: AuditEntry[] = [
  { id: 'a1', ts: now - 2 * min, actor: 'Marie K.', actorType: 'user', action: 'call.viewed', target: 'CA_live_001', targetType: 'call', detail: 'Opened live call viewer' },
  { id: 'a2', ts: now - 5 * min, actor: 'Rezeptionistin Maria', actorType: 'agent', action: 'call.placed', target: 'CA_live_001', targetType: 'call', detail: '+4915123456789 · Outbound' },
  { id: 'a3', ts: now - 18 * min, actor: 'Marie K.', actorType: 'user', action: 'call.approved', target: 'CA_pend_002', targetType: 'call', detail: 'Approved outbound to Finanzamt' },
  { id: 'a4', ts: now - 34 * min, actor: 'Marie K.', actorType: 'user', action: 'transcript.exported', target: 'CA_comp_001', targetType: 'transcript', detail: 'Format: PDF' },
  { id: 'a5', ts: now - 42 * min, actor: 'System', actorType: 'system', action: 'call.completed', target: 'CA_comp_005', targetType: 'call', detail: 'Outcome: booked · Duration: 3m12s · Cost: €0.57' },
  { id: 'a6', ts: now - 60 * min, actor: 'Marie K.', actorType: 'user', action: 'pii.revealed', target: 'CA_comp_003', targetType: 'pii', detail: 'Reason: "Mandantendaten für Rückfrage" · Revealed for 5 min' },
  { id: 'a7', ts: now - 90 * min, actor: 'System', actorType: 'system', action: 'policy.enforced', target: 'max_duration', targetType: 'policy', detail: 'Call CA_fail_001 terminated after 600s' },
  { id: 'a8', ts: now - 120 * min, actor: 'Klaus B.', actorType: 'user', action: 'policy.updated', target: 'outboundRequiresApproval', targetType: 'policy', detail: 'Changed: true → false' },
  { id: 'a9', ts: now - 180 * min, actor: 'Sekretärin Sophie', actorType: 'agent', action: 'call.placed', target: 'CA_comp_007', targetType: 'call', detail: '+4930123456789 · Outbound' },
  { id: 'a10', ts: now - 240 * min, actor: 'Marie K.', actorType: 'user', action: 'number.configured', target: '+4989123456', targetType: 'number', detail: 'Updated greeting language to de-DE' },
];

const ACTION_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  'call.viewed': Eye,
  'call.placed': Phone,
  'call.completed': Phone,
  'call.approved': Shield,
  'transcript.exported': FileText,
  'pii.revealed': Eye,
  'policy.enforced': Shield,
  'policy.updated': Settings2,
  'number.configured': Settings2,
};

const ACTION_COLOR: Record<string, string> = {
  'call.viewed': 'text-blue-600 bg-blue-50',
  'call.placed': 'text-green-600 bg-green-50',
  'call.completed': 'text-gray-600 bg-gray-100',
  'call.approved': 'text-green-600 bg-green-50',
  'transcript.exported': 'text-violet-600 bg-violet-50',
  'pii.revealed': 'text-amber-600 bg-amber-50',
  'policy.enforced': 'text-red-600 bg-red-50',
  'policy.updated': 'text-orange-600 bg-orange-50',
  'number.configured': 'text-blue-600 bg-blue-50',
};

function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString('de-DE');
}

export default function AuditView() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 pt-5 pb-4">
        <div>
          <h1 className="text-2xl font-light text-gray-900">Audit Log</h1>
          <p className="mt-0.5 text-xs text-gray-400">
            DSGVO Art. 30 · EU AI Act Art. 12 · Chain-hashed
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-[#bdd8ec] px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-[#a5c8e0]"
        >
          <Download className="h-3.5 w-3.5" /> Export bundle
        </button>
      </div>

      {/* Compliance banner */}
      <div className="mx-6 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
        <span className="font-medium">🔒 Tamper-proof chain.</span> Every entry is hash-linked to
        the previous. Export this log as a JSONL bundle for BSI C5 / DSGVO evidence requests.
      </div>

      {/* Log table */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
          {ENTRIES.map((entry) => {
            const Icon = ACTION_ICON[entry.action] ?? Shield;
            const colorClass = ACTION_COLOR[entry.action] ?? 'text-gray-600 bg-gray-100';
            const isExpanded = expanded === entry.id;

            return (
              <div key={entry.id}>
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : entry.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className={cn('shrink-0 rounded-lg p-1.5', colorClass)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{entry.action}</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                          entry.actorType === 'agent'
                            ? 'bg-[#dde9f4] text-gray-700'
                            : entry.actorType === 'system'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-green-50 text-green-700',
                        )}
                      >
                        {entry.actor}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {entry.target} · {relativeTime(entry.ts)}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 shrink-0 text-gray-400 transition-transform',
                      isExpanded && 'rotate-90',
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="font-medium text-gray-400 uppercase tracking-wide text-[10px]">Timestamp</p>
                        <p className="mt-0.5 text-gray-700">
                          {new Date(entry.ts).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-400 uppercase tracking-wide text-[10px]">Target</p>
                        <p className="mt-0.5 font-mono text-gray-700">{entry.target}</p>
                      </div>
                      {entry.detail && (
                        <div className="col-span-2">
                          <p className="font-medium text-gray-400 uppercase tracking-wide text-[10px]">Detail</p>
                          <p className="mt-0.5 text-gray-700">{entry.detail}</p>
                        </div>
                      )}
                      <div className="col-span-2">
                        <p className="font-medium text-gray-400 uppercase tracking-wide text-[10px]">Hash</p>
                        <p className="mt-0.5 font-mono text-[10px] text-gray-400">
                          sha256:{entry.id.padEnd(8, '0')}e3f1a2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
