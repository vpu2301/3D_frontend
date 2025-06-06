
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, Building, Globe, Bot } from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  type: string;
  department: string;
  location: 'internal' | 'external';
  company?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  lastInteraction: string;
}

interface AIEmployeeConnectionsProps {
  connections: Connection[];
}

const AIEmployeeConnections = ({ connections }: AIEmployeeConnectionsProps) => {
  const internalConnections = connections.filter(c => c.location === 'internal');
  const externalConnections = connections.filter(c => c.location === 'external');

  const ConnectionItem = ({ connection }: { connection: Connection }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={connection.avatar} alt={connection.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
            {connection.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-sm">{connection.name}</h4>
            <Badge 
              variant={connection.status === 'active' ? 'default' : 'secondary'}
              className={connection.status === 'active' ? 'bg-green-500' : ''}
            >
              {connection.status}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">
            {connection.type} • {connection.department}
            {connection.company && ` • ${connection.company}`}
          </p>
          <p className="text-xs text-gray-500">Last interaction: {connection.lastInteraction}</p>
        </div>
      </div>
      <Button variant="outline" size="sm">
        View
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Network className="h-5 w-5 mr-2" />
          AI Employee Connections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Internal Connections */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Building className="h-4 w-4 text-blue-600" />
            <h3 className="font-medium text-gray-900">Internal ({internalConnections.length})</h3>
          </div>
          <div className="space-y-3">
            {internalConnections.length > 0 ? (
              internalConnections.map((connection) => (
                <ConnectionItem key={connection.id} connection={connection} />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No internal connections</p>
            )}
          </div>
        </div>

        {/* External Connections */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Globe className="h-4 w-4 text-green-600" />
            <h3 className="font-medium text-gray-900">External ({externalConnections.length})</h3>
          </div>
          <div className="space-y-3">
            {externalConnections.length > 0 ? (
              externalConnections.map((connection) => (
                <ConnectionItem key={connection.id} connection={connection} />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No external connections</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIEmployeeConnections;
