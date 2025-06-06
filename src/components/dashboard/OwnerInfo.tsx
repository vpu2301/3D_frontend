
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Users } from 'lucide-react';

interface OwnerInfoProps {
  owner: {
    type: 'person' | 'team';
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
    teamMembers?: number;
  };
}

const OwnerInfo = ({ owner }: OwnerInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {owner.type === 'person' ? (
            <User className="h-5 w-5 mr-2" />
          ) : (
            <Users className="h-5 w-5 mr-2" />
          )}
          Owner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={owner.avatar} alt={owner.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {owner.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">{owner.name}</h3>
              <Badge variant="outline" className="capitalize">
                {owner.type}
              </Badge>
            </div>
            {owner.email && (
              <p className="text-sm text-gray-600">{owner.email}</p>
            )}
            {owner.role && (
              <p className="text-sm text-gray-500">{owner.role}</p>
            )}
            {owner.type === 'team' && owner.teamMembers && (
              <p className="text-sm text-gray-500">{owner.teamMembers} members</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerInfo;
