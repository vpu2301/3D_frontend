
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Settings, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface AssistantOverviewTabProps {
  assistant: any;
}

const AssistantOverviewTab = ({ assistant }: AssistantOverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tasks Completed</span>
              <span className="font-medium">{assistant.tasksCompleted.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Conversations</span>
              <span className="font-medium">{assistant.conversations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="font-medium">{assistant.uptime}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Working Hours</span>
              <Badge variant="outline">{assistant.workingHours}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Scope</span>
              <Badge variant="outline" className="capitalize">{assistant.scope}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Autonomy Level</span>
              <Badge variant="outline" className="capitalize">{assistant.autonomyLevel.replace('-', ' ')}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Budget Authority</span>
              <span className="font-medium">${assistant.maxBudgetLimit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Department</span>
              <Badge variant="outline">{assistant.department}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assistant.recentActivities.map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {activity.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
                <Badge 
                  variant={activity.status === 'completed' ? 'default' : 'secondary'}
                  className={activity.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}
                >
                  {activity.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistantOverviewTab;
