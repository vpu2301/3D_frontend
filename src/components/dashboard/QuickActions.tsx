
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, BarChart3, Settings, Users } from 'lucide-react';

const QuickActions = () => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full justify-start" variant="outline">
          <Bot className="h-4 w-4 mr-2" />
          Create New AI Worker
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Manage Automations
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Users className="h-4 w-4 mr-2" />
          User Management
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
