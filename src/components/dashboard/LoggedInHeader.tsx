
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, LogOut, User, Brain } from 'lucide-react';
import ExpandableSearch from './ExpandableSearch';

interface LoggedInHeaderProps {
  userEmail: string;
}

const LoggedInHeader = ({ userEmail }: LoggedInHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <header className="bg-background shadow-neu-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg shadow-neu-sm flex items-center justify-center bg-primary">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-light text-foreground hidden sm:block">3Days.ai</span>
            </div>
            <ExpandableSearch />
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl hover:shadow-neu-sm">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 rounded-xl hover:shadow-neu-sm">
                  <Avatar className="h-8 w-8 shadow-neu-sm">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(userEmail)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border-border/20 shadow-neu-lg rounded-2xl">
                <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer rounded-xl">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettings} className="flex items-center space-x-2 cursor-pointer rounded-xl">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 cursor-pointer text-destructive rounded-xl">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoggedInHeader;
