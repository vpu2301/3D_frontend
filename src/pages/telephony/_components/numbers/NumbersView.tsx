import { useState } from 'react';
import {
  Phone,
  Plus,
  Settings2,
  Pause,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from 'lucide-react';
import { MOCK_NUMBERS, COUNTRY_FLAGS, type PhoneNumber } from '@/pages/telephony/_lib/mock-data';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<
  PhoneNumber['status'],
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  active: { label: 'Active', icon: CheckCircle2, className: 'text-green-600 bg-green-50' },
  provisioning: { label: 'Provisioning', icon: Loader2, className: 'text-blue-600 bg-blue-50' },
  disabled: { label: 'Disabled', icon: XCircle, className: 'text-[var(--text-4)] bg-[var(--sand-deep)]' },
};

function NumberCard({ number }: { number: PhoneNumber }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_CONFIG[number.status];
  const StatusIcon = status.icon;
  const flag = COUNTRY_FLAGS[number.country] ?? '🌐';

  return (
    <div className="group relative rounded-[14px] border border-[var(--line-soft)] bg-white p-5 transition-colors hover:border-[var(--line)]">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{flag}</span>
          <div>
            <p className="text-base font-medium text-[var(--ink)]">{number.national}</p>
            <p className="text-xs text-[var(--text-5)]">{number.e164}</p>
          </div>
        </div>
        <span
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
            status.className,
          )}
        >
          <StatusIcon className={cn('h-3 w-3', number.status === 'provisioning' && 'animate-spin')} />
          {status.label}
        </span>
      </div>

      {/* Agent */}
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-[rgba(20,22,26,0.06)] px-2.5 py-1 text-xs font-medium text-[var(--ink)]">
          {number.agentPersona}
        </span>
        <span className="rounded-full bg-[var(--sand-deep)] px-2.5 py-1 text-xs text-[var(--text-4)]">
          {number.country}
        </span>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-[10px] bg-[var(--sand)] px-3 py-2">
          <p className="plat-eyebrow">Calls (7d)</p>
          <p className="plat-num mt-1" style={{ fontSize: 22 }}>{number.callsLast7Days}</p>
        </div>
        <div className="rounded-[10px] bg-[var(--sand)] px-3 py-2">
          <p className="plat-eyebrow">Cost (7d)</p>
          <p className="plat-num mt-1" style={{ fontSize: 22 }}>
            €{number.costLast7Days.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Monthly fee */}
      <p className="mb-4 text-[10px] text-[var(--text-5)]">
        €{number.monthlyFee.toFixed(2)}/month · renews automatically
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--sand)] px-3 py-1.5 text-xs font-medium text-[var(--text-2)] transition-colors hover:bg-[var(--sand-deep)]"
        >
          <Settings2 className="h-3.5 w-3.5" /> Configure
        </button>
        <button
          type="button"
          title="Pause number"
          className="rounded-full p-1.5 text-[var(--text-5)] transition-colors hover:bg-[var(--sand-deep)] hover:text-[var(--text-3)]"
        >
          <Pause className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title="Release number"
          className="rounded-full p-1.5 text-[var(--text-5)] transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function NumbersView() {
  const [showProvision, setShowProvision] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-6 pt-5 pb-4">
        <div>
          <p className="plat-crumb" style={{ color: 'var(--text-4)' }}>3days.telephony</p>
          <h1 className="mt-1 text-[26px] text-[var(--ink)]">Numbers</h1>
          <p className="mt-1 text-xs text-[var(--text-4)]">
            {MOCK_NUMBERS.filter((n) => n.status === 'active').length} active ·{' '}
            {MOCK_NUMBERS.length} total
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowProvision(true)}
          className="flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-85"
        >
          <Plus className="h-4 w-4" /> Provision number
        </button>
      </div>

      {/* Cards grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {MOCK_NUMBERS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--sand-deep)]">
              <Phone className="h-8 w-8 text-[var(--text-5)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-4)]">No numbers provisioned</p>
            <p className="mt-1 text-xs text-[var(--text-5)]">
              Provision a number to start placing and receiving calls
            </p>
            <button
              type="button"
              onClick={() => setShowProvision(true)}
              className="mt-4 flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-medium text-white hover:opacity-85"
            >
              <Plus className="h-4 w-4" /> Provision number
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_NUMBERS.map((n) => (
              <NumberCard key={n.id} number={n} />
            ))}

            {/* Add new card */}
            <button
              type="button"
              onClick={() => setShowProvision(true)}
              className="flex min-h-[200px] flex-col items-center justify-center rounded-[14px] border border-dashed border-[var(--line)] text-[var(--text-4)] transition-colors hover:border-[var(--ink)] hover:bg-[rgba(20,22,26,0.03)] hover:text-[var(--ink)]"
            >
              <Plus className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">Add number</span>
              <span className="mt-1 text-xs">DE · AT · CH</span>
            </button>
          </div>
        )}
      </div>

      {/* Provision modal (mocked) */}
      {showProvision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[14px] border border-[var(--line-soft)] bg-white p-6 shadow-[0_20px_60px_rgba(20,22,26,0.18)]">
            <h2 className="mb-1 text-lg text-[var(--ink)]">Provision a number</h2>
            <p className="mb-6 text-sm text-[var(--text-4)]">
              Choose a country and area code to rent a virtual phone number.
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">Country</label>
                <div className="flex gap-2">
                  {(['DE', 'AT', 'CH'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-sm transition-colors first:bg-[rgba(20,22,26,0.06)] first:border-[var(--ink)] hover:bg-[var(--sand)]"
                    >
                      {COUNTRY_FLAGS[c]} {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">
                  Area code (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 089 (München)"
                  className="w-full rounded-[10px] border border-[var(--line)] px-3 py-2 text-sm outline-none placeholder:text-[var(--text-5)] focus:border-[var(--ink)]"
                />
              </div>
              <div className="rounded-[10px] bg-[var(--sand)] p-3 text-xs text-[var(--text-4)]">
                <p className="font-medium text-[var(--text-2)]">Cost preview</p>
                <p className="mt-1">Monthly rental: €1.15 · Outbound: ~€0.022/min · Inbound: free</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowProvision(false)}
                className="rounded-full px-4 py-2 text-sm text-[var(--text-4)] hover:bg-[var(--sand-deep)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowProvision(false)}
                className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-medium text-white hover:opacity-85"
              >
                Provision number
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
