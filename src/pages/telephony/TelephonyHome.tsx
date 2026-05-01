import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TelephonyLayout from '@/pages/telephony/_components/shared/TelephonyLayout';
import TelephonyMiniRail from '@/pages/telephony/_components/sidebar/TelephonyMiniRail';
import CallsView from '@/pages/telephony/_components/calls/CallsView';
import CallDetailView from '@/pages/telephony/_components/calls/CallDetailView';
import NumbersView from '@/pages/telephony/_components/numbers/NumbersView';
import UsageView from '@/pages/telephony/_components/usage/UsageView';
import PoliciesView from '@/pages/telephony/_components/policies/PoliciesView';
import AuditView from '@/pages/telephony/_components/audit/AuditView';

function SettingsView() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <div className="border-b border-gray-100 px-6 pt-5 pb-4">
        <h1 className="text-2xl font-light text-gray-900">Settings</h1>
        <p className="mt-0.5 text-xs text-gray-400">Twilio credentials · webhooks · voice defaults</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Twilio connection */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Twilio connection</h2>
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Connected
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Account SID</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <span className="flex-1 font-mono text-sm text-gray-700">AC••••••••••••••••••••••••••••••••</span>
                <button type="button" className="text-xs text-gray-400 hover:text-gray-600">Edit</button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Auth Token</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <span className="flex-1 font-mono text-sm text-gray-700">••••••••••••••••••••••••••••••••</span>
                <button type="button" className="text-xs text-gray-400 hover:text-gray-600">Edit</button>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
          >
            Test connection
          </button>
        </div>

        {/* Webhook URLs */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Webhook URLs</h2>
          <p className="mb-3 text-xs text-gray-400">Configure these in your Twilio console</p>
          <div className="space-y-2">
            {[
              { label: 'Voice webhook', url: 'https://api.pincer.sh/webhooks/twilio/voice' },
              { label: 'Status callback', url: 'https://api.pincer.sh/webhooks/twilio/status' },
              { label: 'ConversationRelay', url: 'https://api.pincer.sh/webhooks/relay' },
            ].map((w) => (
              <div key={w.label}>
                <p className="mb-1 text-xs font-medium text-gray-600">{w.label}</p>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <span className="flex-1 font-mono text-xs text-gray-700">{w.url}</span>
                  <button type="button" className="text-xs text-gray-400 hover:text-gray-600">Copy</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-processor disclosure */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
          <p className="font-medium text-gray-700 mb-1">Sub-processor disclosure</p>
          <p>Twilio Inc. acts as a sub-processor for voice communications under our Data Processing Agreement. By using this feature you confirm that Twilio's DPA is in place for your organization.</p>
          <button type="button" className="mt-2 text-[#5aacee] hover:underline">Download DPA →</button>
        </div>
      </div>
    </div>
  );
}

export default function TelephonyHome() {
  const location = useLocation();
  const params = useParams<{ callSid?: string }>();
  const path = location.pathname;

  const [selectedCallSid, setSelectedCallSid] = useState<string | null>(null);

  const effectiveCallSid = params.callSid ?? selectedCallSid;

  const renderContent = () => {
    // Call detail view (via URL param or selected row)
    if (params.callSid) {
      return (
        <CallDetailView
          callSid={params.callSid}
          onBack={() => window.history.back()}
        />
      );
    }

    if (path === '/telephony/numbers') return <NumbersView />;
    if (path === '/telephony/usage') return <UsageView />;
    if (path === '/telephony/policies') return <PoliciesView />;
    if (path === '/telephony/audit') return <AuditView />;
    if (path === '/telephony/settings') return <SettingsView />;

    // Default: calls view (handles /telephony, /telephony/calls, /telephony/calls/live, /telephony/calls/pending-approval)
    if (effectiveCallSid && !params.callSid) {
      return (
        <>
          <div className="flex min-h-0 w-[420px] shrink-0 flex-col overflow-hidden border-r border-gray-100">
            <CallsView
              onSelectCall={setSelectedCallSid}
              selectedCallSid={effectiveCallSid}
            />
          </div>
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <CallDetailView
              callSid={effectiveCallSid}
              onBack={() => setSelectedCallSid(null)}
            />
          </div>
        </>
      );
    }

    return (
      <CallsView
        onSelectCall={setSelectedCallSid}
        selectedCallSid={null}
      />
    );
  };

  return (
    <TelephonyLayout>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <TelephonyMiniRail />
        <div className="flex min-h-0 flex-1 overflow-hidden md:mr-14">
          {renderContent()}
        </div>
      </div>
    </TelephonyLayout>
  );
}
