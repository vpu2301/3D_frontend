
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const MetricCard = ({ title, value, change, icon: Icon, color, bgColor }: MetricCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-light text-gray-900">{value}</p>
            <p className="text-sm text-green-600 mt-1">{change} from last month</p>
          </div>
          <div className={`p-3 rounded-xl ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
