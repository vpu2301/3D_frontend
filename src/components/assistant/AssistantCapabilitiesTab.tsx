
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface AssistantCapabilitiesTabProps {
  assistant: any;
}

const AssistantCapabilitiesTab = ({ assistant }: AssistantCapabilitiesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Assistant Capabilities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {assistant.capabilities.map((capability: string, index: number) => (
            <div key={index} className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="font-medium text-blue-900">{capability}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssistantCapabilitiesTab;
