
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bot, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';

const Dashboard = () => {
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

  // Key metrics data
  const metrics = [
    {
      title: 'Active AI Workers',
      value: '24',
      change: '+12%',
      icon: Bot,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Tasks Completed',
      value: '1,234',
      change: '+8%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Hours Saved',
      value: '456',
      change: '+15%',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Active Users',
      value: '89',
      change: '+5%',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userEmail={userEmail} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's what's happening with your AI automation platform today.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <QuickActions />
          <RecentActivity />
        </div>

        {/* Performance Chart Placeholder */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-medium flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Performance charts and analytics will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
