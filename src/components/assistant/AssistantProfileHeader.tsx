
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Settings, ArrowLeft } from 'lucide-react';

interface AssistantProfileHeaderProps {
  assistant: any;
  onBack: () => void;
  onConfigure: () => void;
}

const AssistantProfileHeader = ({ assistant, onBack, onConfigure }: AssistantProfileHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="relative">
          <Avatar className="h-16 w-16">
            <AvatarImage src={assistant.avatar} alt={assistant.name} />
            <AvatarFallback className={`bg-gradient-to-br ${assistant.bgColor || 'from-blue-100 to-indigo-100'} ${assistant.iconColor || 'text-blue-600'} text-lg font-medium`}>
              {assistant.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 p-2 rounded-full bg-gradient-to-br ${assistant.bgColor || 'from-blue-100 to-indigo-100'}`}>
            <Bot className={`h-4 w-4 ${assistant.iconColor || 'text-blue-600'}`} />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-light text-gray-900">{assistant.name}</h1>
          <p className="text-gray-600">{assistant.type} • {assistant.department}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge 
          variant={assistant.status === 'Active' ? 'default' : 'secondary'}
          className={assistant.status === 'Active' ? 'bg-green-500' : ''}
        >
          {assistant.status}
        </Badge>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onConfigure}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </div>
    </div>
  );
};

export default AssistantProfileHeader;
