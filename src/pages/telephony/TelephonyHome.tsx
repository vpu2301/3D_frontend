import { useLocation, useParams } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import TelephonyLayout from '@/pages/telephony/_components/shared/TelephonyLayout';
import TelephonyMiniRail from '@/pages/telephony/_components/sidebar/TelephonyMiniRail';
import VoicePage from '@/pages/telephony/_components/voice/VoicePage';
import LiveView from '@/pages/telephony/_components/voice/LiveView';
import PendingApprovalView from '@/pages/telephony/_components/voice/PendingApprovalView';
import PlannedCallsView from '@/pages/telephony/_components/voice/PlannedCallsView';
import MessagesView from '@/pages/telephony/_components/voice/MessagesView';
import PolicyPanel from '@/pages/telephony/_components/voice/PolicyPanel';
import CallDetailView from '@/pages/telephony/_components/calls/CallDetailView';
import NumbersView from '@/pages/telephony/_components/numbers/NumbersView';
import UsageView from '@/pages/telephony/_components/usage/UsageView';
import PoliciesView from '@/pages/telephony/_components/policies/PoliciesView';
import AuditView from '@/pages/telephony/_components/audit/AuditView';
import { MockedRouteBanner } from '@/components/voice/MockedBadge';

import { queryClient } from '@/lib/queryClient';

function SettingsView() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-[var(--line-soft)] px-6 pt-5 pb-4">
        <p className="plat-crumb" style={{ color: 'var(--text-4)' }}>3days.telephony</p>
        <h1 className="mt-1 text-[26px] text-[var(--ink)]">Settings</h1>
        <p className="mt-1 text-xs text-[var(--text-4)]">Twilio credentials · webhooks · voice defaults</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Tool policy — real, read-only, the S11 mirror of `pincer doctor` */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--ink)]">
            In-call tool policy
          </h2>
          <PolicyPanel />
        </section>

        {/* Twilio connection */}
        <div className="rounded-[14px] border border-[var(--line-soft)] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm">Twilio connection</h2>
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Connected
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-3)]">Account SID</label>
              <div className="flex items-center gap-2 rounded-[10px] border border-[var(--line)] bg-[var(--sand)] px-3 py-2">
                <span className="flex-1 font-mono text-sm text-[var(--text-2)]">AC••••••••••••••••••••••••••••••••</span>
                <button type="button" className="text-xs text-[var(--text-5)] hover:text-[var(--text-3)]">Edit</button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-3)]">Auth Token</label>
              <div className="flex items-center gap-2 rounded-[10px] border border-[var(--line)] bg-[var(--sand)] px-3 py-2">
                <span className="flex-1 font-mono text-sm text-[var(--text-2)]">••••••••••••••••••••••••••••••••</span>
                <button type="button" className="text-xs text-[var(--text-5)] hover:text-[var(--text-3)]">Edit</button>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--text-3)] hover:bg-[var(--sand)]"
          >
            Test connection
          </button>
        </div>

        {/* Webhook URLs */}
        <div className="rounded-[14px] border border-[var(--line-soft)] bg-white p-5">
          <h2 className="mb-4 text-sm">Webhook URLs</h2>
          <p className="mb-3 text-xs text-[var(--text-5)]">Configure these in your Twilio console</p>
          <div className="space-y-2">
            {[
              { label: 'Voice webhook', url: 'https://api.pincer.sh/webhooks/twilio/voice' },
              { label: 'Status callback', url: 'https://api.pincer.sh/webhooks/twilio/status' },
              { label: 'ConversationRelay', url: 'https://api.pincer.sh/webhooks/relay' },
            ].map((w) => (
              <div key={w.label}>
                <p className="mb-1 text-xs font-medium text-[var(--text-3)]">{w.label}</p>
                <div className="flex items-center gap-2 rounded-[10px] border border-[var(--line)] bg-[var(--sand)] px-3 py-2">
                  <span className="flex-1 font-mono text-xs text-[var(--text-2)]">{w.url}</span>
                  <button type="button" className="text-xs text-[var(--text-5)] hover:text-[var(--text-3)]">Copy</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-processor disclosure */}
        <div className="rounded-[14px] border border-[var(--line)] bg-[var(--sand)] p-4 text-xs text-[var(--text-4)]">
          <p className="font-medium text-[var(--text-2)] mb-1">Sub-processor disclosure</p>
          <p>Twilio Inc. acts as a sub-processor for voice communications under our Data Processing Agreement. By using this feature you confirm that Twilio's DPA is in place for your organization.</p>
          <button type="button" className="mt-2 font-semibold text-[var(--ink)] hover:underline">Download DPA →</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Wraps a view that still renders demo data with the loud amber banner the
 * de-mock contract requires: visible, and honest about why.
 */
function MockedRoute({ reason, children }: { reason: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <MockedRouteBanner reason={reason} />
      <div className="flex min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export default function TelephonyHome() {
  const location = useLocation();
  const params = useParams<{ callSid?: string }>();
  const path = location.pathname;

  const renderContent = () => {
    // Deep link into the OLD mocked call explorer (mock-data call ids).
    if (params.callSid) {
      return (
        <MockedRoute reason="Deep-linked call details still come from the demo dataset; real call transcripts open from the Voice page's history table.">
          <CallDetailView callSid={params.callSid} onBack={() => window.history.back()} />
        </MockedRoute>
      );
    }

    // Messages: the receptionist's inbox (S12 §11) — real rows, no demo data.
    if (path === '/telephony/messages') return <MessagesView />;

    // Live: real active-call monitor with expandable call detail.
    if (path === '/telephony/calls/live') return <LiveView />;

    // Pending Approval: its own screen — gates resolve live in-call today,
    // the parked-queue part is demo and badged as such.
    if (path === '/telephony/calls/pending-approval') return <PendingApprovalView />;

    // Planned: locally-stored scheduled calls + queues from the composer (demo).
    if (path === '/telephony/planned') return <PlannedCallsView />;

    if (path === '/telephony/numbers')
      return (
        <MockedRoute reason="There is no number-management API on the backend yet.">
          <NumbersView />
        </MockedRoute>
      );
    if (path === '/telephony/usage')
      return (
        <MockedRoute reason="Costs are tracked per LLM budget, not per call yet (planned: Sprint 4 T4.5 character counting).">
          <UsageView />
        </MockedRoute>
      );
    if (path === '/telephony/policies')
      return (
        <MockedRoute reason="The policy engine is not exposed over the API yet.">
          <PoliciesView />
        </MockedRoute>
      );
    if (path === '/telephony/audit')
      return (
        <MockedRoute reason="Voice actions are audited per call (see a call's transcript panel); a cross-call audit endpoint does not exist yet.">
          <AuditView />
        </MockedRoute>
      );
    if (path === '/telephony/settings')
      return (
        <MockedRoute reason="Twilio credentials and webhooks are configured server-side via environment; there is no settings API yet.">
          <SettingsView />
        </MockedRoute>
      );

    // Default (/telephony, /telephony/calls, /telephony/calls/live,
    // /telephony/calls/pending-approval): the REAL voice page on backend data.
    return <VoicePage />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TelephonyLayout>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <TelephonyMiniRail />
          <div className="flex min-h-0 flex-1 overflow-hidden md:mr-14">
            {renderContent()}
          </div>
        </div>
      </TelephonyLayout>
    </QueryClientProvider>
  );
}
