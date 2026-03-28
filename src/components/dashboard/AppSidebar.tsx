
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  MessageCircle,
  Users,
  UserCheck,
  Bot,
  Workflow,
  Puzzle,
  Settings,
  HelpCircle,
  ClipboardCheck,
  CreditCard,
  Brain,
  LogOut,
  User,
  Globe,
  Check,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: ClipboardCheck,
  },
  {
    title: "AI Workers",
    url: "/ai-employees",
    icon: Bot,
  },
  {
    title: "Human Teams",
    url: "/teams",
    icon: Users,
  },
  {
    title: "Worker Groups",
    url: "/ai-agents",
    icon: UserCheck,
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: Workflow,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: Puzzle,
  },
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'sv', label: 'Svenska' },
  { code: 'no', label: 'Norsk' },
];


export function AppSidebar() {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const userEmail = localStorage.getItem('userEmail') || '';

  const getInitials = (email: string) => email.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleLogoClick = () => {
    toggleSidebar();
  };

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="p-4">
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded-lg p-2 -m-2 transition-colors"
          onClick={handleLogoClick}
        >
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center flex-shrink-0">
            <Brain className="w-3 h-3 text-white" />
          </div>
          {state === "expanded" && (
            <span className="font-medium text-gray-900 truncate">3Days.ai</span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Worker Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      
      <SidebarFooter className="p-3 border-t">
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`flex items-center gap-2 hover:bg-accent px-2 ${state === "collapsed" ? "justify-center w-full" : ""}`}>
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                    {getInitials(userEmail)}
                  </AvatarFallback>
                </Avatar>
                {state === "expanded" && (
                  <span className="text-sm text-gray-700 truncate max-w-[120px]">{userEmail}</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align={state === "expanded" ? "end" : "center"} className="w-64 bg-white border shadow-lg">
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="flex items-center space-x-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/billing')} className="flex items-center space-x-2 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/help')} className="flex items-center space-x-2 cursor-pointer">
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-3.5 w-3.5 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Plan</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">Pro</span>
                  <button
                    onClick={() => navigate('/billing')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center space-x-2 cursor-pointer">
                  <Globe className="h-4 w-4" />
                  <span>Language</span>
                  <span className="ml-auto text-xs text-gray-400 mr-1">
                    {languages.find(l => l.code === selectedLanguage)?.label}
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-44 bg-white border shadow-lg">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span>{lang.label}</span>
                      {selectedLanguage === lang.code && (
                        <Check className="h-3.5 w-3.5 text-blue-600" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 cursor-pointer text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
