
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Plus } from 'lucide-react';

const AgentsNavbar = () => {
  // Mock data for current agents
  const agents = [
    { id: 1, name: 'Emma AI', type: 'Customer Support', status: 'active' },
    { id: 2, name: 'Alex AI', type: 'Sales Assistant', status: 'active' },
    { id: 3, name: 'Data AI', type: 'Data Analysis', status: 'inactive' },
  ];

  return (
    <div className="bg-gray-50 border-b">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-medium text-gray-700">Current Agents:</h3>
            <div className="flex items-center space-x-2">
              {agents.map((agent) => (
                <Card key={agent.id} className="px-3 py-2 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2">
                    <Bot className={`h-4 w-4 ${agent.status === 'active' ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                    <span className="text-xs text-gray-500">({agent.type})</span>
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Agent</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentsNavbar;
