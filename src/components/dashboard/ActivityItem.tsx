
import { Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface ActivityItemProps {
  id: number;
  type: string;
  message: string;
  time: string;
  status: 'success' | 'error' | 'info';
}

const ActivityItem = ({ type, message, time, status }: ActivityItemProps) => {
  return (
    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-full ${
        status === 'success' ? 'bg-green-100' :
        status === 'error' ? 'bg-red-100' : 'bg-blue-100'
      }`}>
        {status === 'success' ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : status === 'error' ? (
          <AlertCircle className="h-4 w-4 text-red-600" />
        ) : (
          <Activity className="h-4 w-4 text-blue-600" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{message}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
