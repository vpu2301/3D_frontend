import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import {
  CreditCard, Download, Calendar, TrendingUp, Users, ClipboardCheck,
  Clock, Check,
} from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

const INVOICES: Invoice[] = [
  { id: 'INV-001', date: '2024-01-01', amount: '$299', status: 'Paid' },
  { id: 'INV-002', date: '2023-12-01', amount: '$299', status: 'Paid' },
  { id: 'INV-003', date: '2023-11-01', amount: '$299', status: 'Paid' },
];

const Billing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#bdd8ec]">
              <CreditCard className="h-4 w-4 text-gray-700" />
            </div>
            <span className="text-sm font-semibold text-gray-800">Billing</span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-emerald-50 border-emerald-200 text-emerald-700">
              <Check className="h-3 w-3" />
              Active
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">

            {/* Current plan */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-800">Current plan</h2>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-gray-900">Professional</div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Up to 50 AI employees and unlimited workflows
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-semibold text-gray-900">$299</div>
                  <div className="text-xs text-gray-500">/month</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all">
                  Change plan
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all">
                  Cancel subscription
                </button>
              </div>
            </section>

            {/* This month's usage */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-800">This month's usage</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <UsageStat icon={Users} label="AI employees" value="24" suffix="/ 50" />
                <UsageStat icon={ClipboardCheck} label="Tasks completed" value="1,234" />
                <UsageStat icon={Clock} label="Hours automated" value="456" />
              </div>
            </section>

            {/* Payment method */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-800">Payment method</h2>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/60">
                <CreditCard className="h-4 w-4 text-gray-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono text-gray-800">•••• •••• •••• 4242</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Expires 12/25</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all">
                  Update
                </button>
              </div>
            </section>

            {/* Invoice history */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-800">Invoice history</h2>
              </div>
              <div className="space-y-2">
                {INVOICES.map(inv => (
                  <div
                    key={inv.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/60"
                  >
                    <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800">{inv.id}</div>
                      <div className="text-[11px] text-gray-500">{inv.date}</div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{inv.amount}</span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border bg-emerald-50 border-emerald-200 text-emerald-700">
                      <Check className="h-2.5 w-2.5" />
                      {inv.status}
                    </span>
                    <button
                      className="flex items-center justify-center h-7 w-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                      title="Download invoice"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

function UsageStat({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 uppercase tracking-wide">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="text-xl font-semibold text-gray-900">{value}</span>
        {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
      </div>
    </div>
  );
}

export default Billing;
