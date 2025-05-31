
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ActivityItem from './ActivityItem';

const RecentActivity = () => {
  const activities = [
    { id: 1, type: 'automation', message: 'Email automation workflow completed', time: '2 minutes ago', status: 'success' as const },
    { id: 2, type: 'user', message: 'New user joined the platform', time: '15 minutes ago', status: 'info' as const },
    { id: 3, type: 'task', message: 'Document processing task failed', time: '1 hour ago', status: 'error' as const },
    { id: 4, type: 'automation', message: 'Analytics report generated', time: '2 hours ago', status: 'success' as const },
    { id: 5, type: 'system', message: 'System maintenance completed', time: '3 hours ago', status: 'info' as const }
  ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} {...activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
