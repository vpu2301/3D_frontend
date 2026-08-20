import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';

export default function TelephonyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SidebarProvider>
        <div className="flex min-h-0 w-full flex-1 overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
