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
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-gray-100 p-1.5">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
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
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      {hint && <p className="mb-1.5 text-[11px] text-gray-400">{hint}</p>}
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
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors',
          checked ? 'bg-[#5aacee]' : 'bg-gray-200',
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
        className="w-24 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-[#8fc4e4]"
      />
      {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
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
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 pt-5 pb-4">
        <div>
          <h1 className="text-2xl font-light text-gray-900">Call Policies</h1>
          <p className="mt-0.5 text-xs text-gray-400">Safety rails & compliance settings for your tenant</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            saved
              ? 'bg-green-500 text-white'
              : 'bg-[#bdd8ec] text-gray-800 hover:bg-[#a5c8e0]',
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
                      ? 'border-[#8fc4e4] bg-[#dde9f4] text-gray-900'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50',
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

          <div className="mt-3 divide-y divide-gray-100 rounded-lg border border-gray-200">
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
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
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
            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
              ⚠️ PII masking disabled. This requires DPO sign-off. Ensure DSGVO Art. 5(1)(e) compliance.
            </div>
          )}
        </Section>

        {/* Allowed countries */}
        <Section icon={Globe} title="Number policy">
          <Field label="Allowed call destinations">
            <div className="flex flex-wrap gap-2">
              {['🇩🇪 DE', '🇦🇹 AT', '🇨🇭 CH'].map((c) => (
                <span key={c} className="rounded-full bg-[#dde9f4] border border-[#8fc4e4] px-3 py-1 text-xs text-gray-800">
                  {c}
                </span>
              ))}
              <button type="button" className="rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-400 hover:border-gray-400">
                + Add country
              </button>
            </div>
          </Field>
          <Field label="Blocked numbers (E.164, one per line)">
            <textarea
              placeholder="+49123456789&#10;+43987654321"
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono outline-none placeholder:text-gray-400 focus:border-[#8fc4e4]"
            />
          </Field>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <p className="text-xs text-gray-400 mb-3">Choose when to notify which channel</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 text-left font-medium text-gray-500">Event</th>
                  <th className="pb-2 text-center font-medium text-gray-500">Email</th>
                  <th className="pb-2 text-center font-medium text-gray-500">Telegram</th>
                  <th className="pb-2 text-center font-medium text-gray-500">Slack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  'Call completed',
                  'Call failed',
                  'Call awaiting approval',
                  'Budget at 75%',
                  'Budget at 95%',
                  'PII revealed',
                ].map((event) => (
                  <tr key={event}>
                    <td className="py-2 text-gray-700">{event}</td>
                    {['email', 'telegram', 'slack'].map((ch) => (
                      <td key={ch} className="py-2 text-center">
                        <input type="checkbox" defaultChecked={ch === 'email'} className="accent-[#5aacee]" />
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
