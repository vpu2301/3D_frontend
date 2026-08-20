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
    <SidebarProvider className="plat">
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden h-screen bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center h-7 w-7 rounded-[10px]" style={{ background: 'var(--sand)', color: 'var(--ink)' }}>
              <CreditCard className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="text-sm font-semibold">Billing</span>
            <span className="plat-pill plat-pill-ok">
              <Check className="h-3 w-3" />
              Active
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">

            {/* Page header */}
            <div>
              <p className="plat-crumb">3days.billing</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>
                Plan, usage, payment method and invoices
              </p>
            </div>

            {/* Current plan */}
            <section className="plat-panel !p-5" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
                <h2 className="text-sm font-semibold">Current plan</h2>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-base font-semibold">Professional</div>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-4)' }}>
                    Up to 50 AI employees and unlimited workflows
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="plat-num !text-[24px]">$299</div>
                  <div className="text-xs" style={{ color: 'var(--text-4)' }}>/month</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="plat-btn-ghost">
                  Change plan
                </button>
                <button className="plat-btn-ghost" style={{ color: 'var(--bad-fg)' }}>
                  Cancel subscription
                </button>
              </div>
            </section>

            {/* This month's usage */}
            <section className="plat-panel !p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
                <h2 className="text-sm font-semibold">This month's usage</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <UsageStat icon={Users} label="AI employees" value="24" suffix="/ 50" />
                <UsageStat icon={ClipboardCheck} label="Tasks completed" value="1,234" />
                <UsageStat icon={Clock} label="Hours automated" value="456" />
              </div>
            </section>

            {/* Payment method */}
            <section className="plat-panel !p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
                <h2 className="text-sm font-semibold">Payment method</h2>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-[12px]" style={{ background: 'var(--sand)', border: '1px solid var(--line-soft)' }}>
                <CreditCard className="h-4 w-4 shrink-0" style={{ color: 'var(--text-5)' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono">•••• •••• •••• 4242</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>Expires 12/25</div>
                </div>
                <button className="plat-btn-ghost !h-8 !px-3 !text-xs">
                  Update
                </button>
              </div>
            </section>

            {/* Invoice history */}
            <section className="plat-panel !p-0">
              <div className="flex items-center gap-2 px-5 pt-5 pb-4">
                <Calendar className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
                <h2 className="text-sm font-semibold">Invoice history</h2>
              </div>
              <div>
                {INVOICES.map(inv => (
                  <div
                    key={inv.id}
                    className="flex items-center gap-3 px-5 py-3"
                    style={{ borderTop: '1px solid var(--line-soft)' }}
                  >
                    <Calendar className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-5)' }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{inv.id}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-4)' }}>{inv.date}</div>
                    </div>
                    <span className="text-sm font-medium">{inv.amount}</span>
                    <span className="plat-pill plat-pill-ok">
                      <Check className="h-2.5 w-2.5" />
                      {inv.status}
                    </span>
                    <button
                      className="flex items-center justify-center h-7 w-7 rounded-[10px] transition-colors shrink-0 hover:bg-[rgba(20,22,26,0.05)]"
                      style={{ color: 'var(--text-5)' }}
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
    <div className="rounded-[12px] px-3 py-3" style={{ background: 'var(--sand)', border: '1px solid var(--line-soft)' }}>
      <div className="plat-eyebrow flex items-center gap-1.5">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="plat-num !text-[22px]">{value}</span>
        {suffix && <span className="text-xs" style={{ color: 'var(--text-4)' }}>{suffix}</span>}
      </div>
    </div>
  );
}

export default Billing;
