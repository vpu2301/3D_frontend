
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Demos = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Demos</h1>
                <p className="text-gray-600">Watch step-by-step demonstrations of our platform features</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Demo Videos Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">We're preparing interactive video demonstrations to help you get started with the platform.</p>
                </CardContent>
              </Card>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Demos;
