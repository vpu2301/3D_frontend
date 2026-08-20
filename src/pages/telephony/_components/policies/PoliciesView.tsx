import { useState } from 'react';
import { Save, Shield, Clock, Euro, Globe, Bell, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[14px] border border-[var(--line-soft)] bg-white p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="rounded-[10px] bg-[var(--sand)] p-1.5">
          <Icon className="h-4 w-4 text-[var(--ink)]" />
        </div>
        <h2 className="text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="mb-1 block text-xs font-medium text-[var(--text-3)]">{label}</label>
      {hint && <p className="mb-1.5 text-[11px] text-[var(--text-5)]">{hint}</p>}
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[var(--text-2)]">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors',
          checked ? 'bg-[var(--ink)]' : 'bg-[var(--sand-deep)]',
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  suffix,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 rounded-[10px] border border-[var(--line)] px-3 py-1.5 text-sm outline-none focus:border-[var(--ink)]"
      />
      {suffix && <span className="text-xs text-[var(--text-4)]">{suffix}</span>}
    </div>
  );
}

export default function PoliciesView() {
  const [saved, setSaved] = useState(false);

  // Hard limits
  const [maxDuration, setMaxDuration] = useState(600);
  const [maxDailyCalls, setMaxDailyCalls] = useState(20);
  const [maxCostPerCall, setMaxCostPerCall] = useState(2.0);
  const [maxMonthlySpend, setMaxMonthlySpend] = useState(100);

  // Approval rules
  const [outboundApproval, setOutboundApproval] = useState<'always' | 'threshold' | 'never'>('always');
  const [approvalThreshold, setApprovalThreshold] = useState(1.0);
  const [confirmFinancial, setConfirmFinancial] = useState(true);
  const [confirmMedical, setConfirmMedical] = useState(true);
  const [confirmLegal, setConfirmLegal] = useState(true);
  const [confirmPersonalData, setConfirmPersonalData] = useState(false);

  // Recording & retention
  const [piiMasking, setPiiMasking] = useState(true);
  const [recordingConsent, setRecordingConsent] = useState(true);
  const [retentionDays, setRetentionDays] = useState(90);

  const onSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-6 pt-5 pb-4">
        <div>
          <p className="plat-crumb" style={{ color: 'var(--text-4)' }}>3days.telephony</p>
          <h1 className="mt-1 text-[26px] text-[var(--ink)]">Call Policies</h1>
          <p className="mt-1 text-xs text-[var(--text-4)]">Safety rails & compliance settings for your tenant</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            saved
              ? 'bg-green-500 text-white'
              : 'bg-[var(--ink)] text-white hover:opacity-85',
          )}
        >
          <Save className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Hard limits */}
        <Section icon={Shield} title="Hard limits">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Max call duration" hint="Calls are terminated after this time">
              <NumberInput value={maxDuration} onChange={setMaxDuration} suffix="seconds" min={60} max={3600} />
            </Field>
            <Field label="Max daily calls" hint="Outbound + inbound combined">
              <NumberInput value={maxDailyCalls} onChange={setMaxDailyCalls} suffix="calls/day" min={1} max={500} />
            </Field>
            <Field label="Max cost per call" hint="Single call budget ceiling">
              <NumberInput value={maxCostPerCall} onChange={setMaxCostPerCall} suffix="€" min={0.1} max={50} />
            </Field>
            <Field label="Max monthly spend" hint="Tenant-wide ceiling; alerts at 75% and 95%">
              <NumberInput value={maxMonthlySpend} onChange={setMaxMonthlySpend} suffix="€/month" min={10} max={5000} />
            </Field>
          </div>
        </Section>

        {/* Approval rules */}
        <Section icon={Clock} title="Outbound approval">
          <Field label="Approval requirement">
            <div className="flex gap-2">
              {(['always', 'threshold', 'never'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setOutboundApproval(opt)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs capitalize transition-colors',
                    outboundApproval === opt
                      ? 'border-[var(--ink)] bg-[rgba(20,22,26,0.06)] text-[var(--ink)]'
                      : 'border-[var(--line)] text-[var(--text-3)] hover:bg-[var(--sand)]',
                  )}
                >
                  {opt === 'threshold' ? 'Above threshold' : opt}
                </button>
              ))}
            </div>
          </Field>
          {outboundApproval === 'threshold' && (
            <Field label="Cost threshold">
              <NumberInput value={approvalThreshold} onChange={setApprovalThreshold} suffix="€" min={0.1} max={10} />
            </Field>
          )}

          <div className="mt-3 divide-y divide-[var(--line-soft)] overflow-hidden rounded-[12px] border border-[var(--line-soft)]">
            <div className="px-4">
              <Toggle checked={confirmFinancial} onChange={setConfirmFinancial} label="Pause for financial commitments" />
            </div>
            <div className="px-4">
              <Toggle checked={confirmMedical} onChange={setConfirmMedical} label="Pause for medical information" />
            </div>
            <div className="px-4">
              <Toggle checked={confirmLegal} onChange={setConfirmLegal} label="Pause for legal commitments" />
            </div>
            <div className="px-4">
              <Toggle checked={confirmPersonalData} onChange={setConfirmPersonalData} label="Pause for personal data sharing" />
            </div>
          </div>
        </Section>

        {/* Recording & retention */}
        <Section icon={Mic} title="Recording & retention">
          <div className="divide-y divide-[var(--line-soft)] overflow-hidden rounded-[12px] border border-[var(--line-soft)]">
            <div className="px-4">
              <Toggle checked={piiMasking} onChange={setPiiMasking} label="PII masking in transcripts (default: on)" />
            </div>
            <div className="px-4">
              <Toggle checked={recordingConsent} onChange={setRecordingConsent} label='Play "This call may be recorded" announcement' />
            </div>
          </div>
          <div className="mt-4">
            <Field label="Transcript retention" hint="Transcripts older than this are permanently deleted">
              <NumberInput value={retentionDays} onChange={setRetentionDays} suffix="days" min={7} max={2555} />
            </Field>
          </div>
          {!piiMasking && (
            <div className="mt-2 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
              ⚠️ PII masking disabled. This requires DPO sign-off. Ensure DSGVO Art. 5(1)(e) compliance.
            </div>
          )}
        </Section>

        {/* Allowed countries */}
        <Section icon={Globe} title="Number policy">
          <Field label="Allowed call destinations">
            <div className="flex flex-wrap gap-2">
              {['🇩🇪 DE', '🇦🇹 AT', '🇨🇭 CH'].map((c) => (
                <span key={c} className="rounded-full bg-[rgba(20,22,26,0.06)] border border-[var(--ink)] px-3 py-1 text-xs text-[var(--ink)]">
                  {c}
                </span>
              ))}
              <button type="button" className="rounded-full border border-dashed border-[var(--line)] px-3 py-1 text-xs text-[var(--text-5)] hover:border-[var(--line)]">
                + Add country
              </button>
            </div>
          </Field>
          <Field label="Blocked numbers (E.164, one per line)">
            <textarea
              placeholder="+49123456789&#10;+43987654321"
              rows={3}
              className="w-full rounded-[10px] border border-[var(--line)] px-3 py-2 text-sm font-mono outline-none placeholder:text-[var(--text-5)] focus:border-[var(--ink)]"
            />
          </Field>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <p className="text-xs text-[var(--text-5)] mb-3">Choose when to notify which channel</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="[&_th]:bg-[var(--sand)] [&_th]:px-3 [&_th]:py-2 [&_th:first-child]:rounded-l-[8px] [&_th:last-child]:rounded-r-[8px]">
                  <th className="text-left font-medium text-[var(--text-4)]">Event</th>
                  <th className="text-center font-medium text-[var(--text-4)]">Email</th>
                  <th className="text-center font-medium text-[var(--text-4)]">Telegram</th>
                  <th className="text-center font-medium text-[var(--text-4)]">Slack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line-soft)]">
                {[
                  'Call completed',
                  'Call failed',
                  'Call awaiting approval',
                  'Budget at 75%',
                  'Budget at 95%',
                  'PII revealed',
                ].map((event) => (
                  <tr key={event}>
                    <td className="py-2 text-[var(--text-2)]">{event}</td>
                    {['email', 'telegram', 'slack'].map((ch) => (
                      <td key={ch} className="py-2 text-center">
                        <input type="checkbox" defaultChecked={ch === 'email'} className="accent-[var(--ink)]" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </div>
  );
}
