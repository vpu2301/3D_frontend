
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow } from 'lucide-react';

interface AssistantIntegrationsTabProps {
  assistant: any;
}

const AssistantIntegrationsTab = ({ assistant }: AssistantIntegrationsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Workflow className="h-5 w-5 mr-2" />
          Connected Integrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {assistant.integrations.map((integration: string, index: number) => (
            <div key={index} className="p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors">
              <p className="font-medium">{integration}</p>
              <p className="text-xs text-gray-600 mt-1">Connected</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssistantIntegrationsTab;
