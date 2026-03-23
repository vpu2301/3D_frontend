
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Plus } from 'lucide-react';

interface AgentsNavbarProps {
  onAddAgent?: () => void;
}

const AgentsNavbar = ({ onAddAgent }: AgentsNavbarProps) => {
  const agents = [
    { id: 1, name: 'Emma AI', type: 'Customer Support', status: 'active' },
    { id: 2, name: 'Alex AI', type: 'Sales Assistant', status: 'active' },
    { id: 3, name: 'Data AI', type: 'Data Analysis', status: 'inactive' },
  ];

  return (
    <div className="bg-muted/50 border-b border-border">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-medium text-muted-foreground">Current Agents:</h3>
            <div className="flex items-center space-x-2">
              {agents.map((agent) => (
                <Card key={agent.id} className="px-3 py-2 bg-card hover:bg-muted cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2">
                    <Bot className={`h-4 w-4 ${agent.status === 'active' ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium text-foreground">{agent.name}</span>
                    <span className="text-xs text-muted-foreground">({agent.type})</span>
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-400' : 'bg-muted-foreground/30'}`}></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center space-x-2" onClick={onAddAgent}>
            <Plus className="h-4 w-4" />
            <span>Add Agent</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentsNavbar;
