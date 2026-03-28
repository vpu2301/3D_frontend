
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import ExpandableSearch from './ExpandableSearch';

interface LoggedInHeaderProps {
  userEmail: string;
}

const LoggedInHeader = ({ userEmail }: LoggedInHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-[hsl(30,20%,98%)] shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 space-x-4">
          <ExpandableSearch />
        </div>
      </div>
    </header>
  );
};

export default LoggedInHeader;
