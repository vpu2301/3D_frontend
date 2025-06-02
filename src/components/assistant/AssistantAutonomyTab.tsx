
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface AssistantAutonomyTabProps {
  assistant: any;
}

const AssistantAutonomyTab = ({ assistant }: AssistantAutonomyTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            <CheckCircle className="h-5 w-5 mr-2" />
            Can Make Decisions For
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assistant.canMakeDecisions.map((decision: string, index: number) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">{decision}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            Requires Approval For
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assistant.approvalRequired.map((approval: string, index: number) => (
              <div key={index} className="p-3 bg-orange-50 rounded-lg">
                <p className="text-orange-800 font-medium">{approval}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistantAutonomyTab;
