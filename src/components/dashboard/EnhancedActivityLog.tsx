
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  MessageCircle,
  FileText,
  Settings,
  Users,
  ExternalLink
} from 'lucide-react';

interface ActivityDetail {
  timestamp: string;
  description: string;
  metadata?: Record<string, any>;
}

interface ActivityItem {
  id: string;
  action: string;
  time: string;
  status: 'completed' | 'pending' | 'failed' | 'in_progress';
  category: 'communication' | 'task' | 'system' | 'collaboration';
  priority: 'low' | 'medium' | 'high';
  details: ActivityDetail[];
  participants?: string[];
  relatedConnections?: string[];
}

interface EnhancedActivityLogProps {
  activities: ActivityItem[];
}

const EnhancedActivityLog = ({ activities }: EnhancedActivityLogProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'in_progress':
        return <Activity className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication':
        return <MessageCircle className="h-4 w-4" />;
      case 'task':
        return <FileText className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      case 'collaboration':
        return <Users className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-orange-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = selectedCategory === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === selectedCategory);

  const categories = ['all', 'communication', 'task', 'system', 'collaboration'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Activity Log
        </CardTitle>
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === 'all' ? 'All' : category}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(activity.status)}
                  {getCategoryIcon(activity.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-sm">{activity.action}</h4>
                    <Badge 
                      variant="secondary"
                      className={getStatusColor(activity.status)}
                    >
                      {activity.status.replace('_', ' ')}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={getPriorityColor(activity.priority)}
                    >
                      {activity.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>{activity.time}</span>
                    <span className="capitalize">{activity.category}</span>
                    {activity.participants && (
                      <span>{activity.participants.length} participants</span>
                    )}
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      {getCategoryIcon(activity.category)}
                      <span>{activity.action}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="connections">Connections</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Status</p>
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Priority</p>
                          <Badge variant="outline" className={getPriorityColor(activity.priority)}>
                            {activity.priority}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Category</p>
                          <p className="text-sm capitalize">{activity.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Time</p>
                          <p className="text-sm">{activity.time}</p>
                        </div>
                      </div>
                      {activity.participants && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Participants</p>
                          <div className="flex flex-wrap gap-2">
                            {activity.participants.map((participant, index) => (
                              <Badge key={index} variant="outline">{participant}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="timeline" className="space-y-4">
                      <div className="space-y-3">
                        {activity.details.map((detail, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{detail.description}</p>
                              <p className="text-xs text-gray-500">{detail.timestamp}</p>
                              {detail.metadata && (
                                <div className="mt-2 text-xs text-gray-600">
                                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                    {JSON.stringify(detail.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="connections" className="space-y-4">
                      {activity.relatedConnections ? (
                        <div className="space-y-2">
                          {activity.relatedConnections.map((connection, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm">{connection}</span>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No related connections</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedActivityLog;
