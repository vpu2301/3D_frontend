
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';

const Billing = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    
    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
    
    if (email) {
      setUserEmail(email);
    }
  }, [navigate]);

  const invoices = [
    { id: 'INV-001', date: '2024-01-01', amount: '$299', status: 'Paid' },
    { id: 'INV-002', date: '2023-12-01', amount: '$299', status: 'Paid' },
    { id: 'INV-003', date: '2023-11-01', amount: '$299', status: 'Paid' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-light text-gray-900">Billing</h1>
                  <p className="text-gray-600">Manage your subscription and billing information</p>
                </div>
              </div>

              <div className="max-w-4xl space-y-8">
                {/* Current Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Current Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Professional Plan</h3>
                        <p className="text-gray-600">Up to 50 AI employees and unlimited workflows</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">$299/month</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-4">
                      <Button variant="outline">Change Plan</Button>
                      <Button variant="outline">Cancel Subscription</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      This Month's Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">24/50</p>
                        <p className="text-sm text-gray-600">AI Employees</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">1,234</p>
                        <p className="text-sm text-gray-600">Tasks Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">456</p>
                        <p className="text-sm text-gray-600">Hours Automated</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">**** **** **** 4242</p>
                          <p className="text-sm text-gray-600">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline">Update</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {invoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{invoice.id}</p>
                              <p className="text-sm text-gray-600">{invoice.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">{invoice.amount}</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {invoice.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Billing;
