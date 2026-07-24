import { useLocation } from 'react-router-dom';
import '@/pages/accounting/_lib/i18n';
import AccountingLayout from '@/pages/accounting/_components/shared/AccountingLayout';
import AccountingRail from '@/pages/accounting/_components/sidebar/AccountingRail';
import CloseRadarView from '@/pages/accounting/_components/radar/CloseRadarView';
import ReviewQueueView from '@/pages/accounting/_components/queue/ReviewQueueView';
import RequestsView from '@/pages/accounting/_components/requests/RequestsView';
import AuditLogView from '@/pages/accounting/_components/audit/AuditLogView';

export default function AccountingHome() {
  const location = useLocation();
  const path = location.pathname;

  const renderContent = () => {
    if (path === '/accounting/queue') return <ReviewQueueView />;
    if (path === '/accounting/requests') return <RequestsView />;
    if (path === '/accounting/audit') return <AuditLogView />;
    // Default: Close Radar (handles /accounting and /accounting/radar)
    return <CloseRadarView />;
  };

  return (
    <AccountingLayout>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <AccountingRail />
        <div className="flex min-h-0 flex-1 overflow-hidden md:mr-14">{renderContent()}</div>
      </div>
    </AccountingLayout>
  );
}
