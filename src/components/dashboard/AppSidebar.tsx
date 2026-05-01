
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  MessageCircle,
  Users,
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
  Bell,
  CheckCheck,
  Pencil,
  MessageSquare,
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

interface ChatHistoryItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface AppSidebarProps {
  chatHistory?: ChatHistoryItem[];
  currentChatId?: string;
  onSelectChat?: (id: string) => void;
  onNewChat?: () => void;
}

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
    title: "Staff",
    url: "/staff",
    icon: Users,
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


export function AppSidebar({ chatHistory, currentChatId, onSelectChat, onNewChat }: AppSidebarProps = {}) {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const isChat = location.pathname === '/chat';
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const userEmail = localStorage.getItem('userEmail') || '';
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Aria completed task',       body: 'Qualified 12 inbound leads from CRM',       time: '2m ago',  read: false },
    { id: 2, title: 'Atlas escalated a ticket',  body: 'VIP ticket #9023 needs your attention',      time: '18m ago', read: false },
    { id: 3, title: 'New team member added',     body: 'Lisa Chen joined Sales Hybrid Team',         time: '1h ago',  read: false },
    { id: 4, title: 'Workflow completed',        body: 'Monthly invoice reconciliation finished',    time: '3h ago',  read: true  },
    { id: 5, title: 'Maya finished campaign',    body: 'Social media content brief is ready',        time: '5h ago',  read: true  },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const getInitials = (email: string) => email.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleLogoClick = () => {
    toggleSidebar();
  };

  return (
    <Sidebar className="border-r [&>[data-sidebar=sidebar]]:bg-white" collapsible="icon">
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
                    isActive={location.pathname === item.url || location.pathname.startsWith(item.url + '/')}
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

        {isChat && state === 'expanded' && (
          <SidebarGroup className="flex-1 min-h-0">
            <div className="flex items-center justify-between px-2 pb-1">
              <SidebarGroupLabel className="flex items-center gap-1.5 p-0">
                <MessageSquare className="h-3 w-3" />
                History
              </SidebarGroupLabel>
              {onNewChat && (
                <button
                  onClick={onNewChat}
                  title="New chat"
                  className="flex items-center justify-center h-5 w-5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </div>
            <SidebarGroupContent className="flex-1 min-h-0">
              <ScrollArea className="h-full max-h-64">
                <div className="px-1 space-y-0.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 pt-1 pb-1.5">Today</p>
                  <button
                    onClick={() => onSelectChat?.('current')}
                    className={`w-full text-left px-2 py-1.5 rounded-md transition-colors text-xs flex items-center gap-1.5 ${
                      currentChatId === 'current'
                        ? 'bg-accent font-medium text-gray-900'
                        : 'hover:bg-accent/60 text-gray-700'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                    <span className="truncate">Current Chat</span>
                  </button>

                  {chatHistory && chatHistory.length > 0 && (
                    <>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 pt-3 pb-1">Earlier</p>
                      {chatHistory.map(chat => (
                        <button
                          key={chat.id}
                          onClick={() => onSelectChat?.(chat.id)}
                          className={`w-full text-left px-2 py-1.5 rounded-md transition-colors text-xs truncate ${
                            currentChatId === chat.id
                              ? 'bg-accent font-medium text-gray-900'
                              : 'hover:bg-accent/60 text-gray-700'
                          }`}
                        >
                          {chat.title}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </ScrollArea>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>
      
      <SidebarFooter className="p-3 border-t">
        <div className="flex items-center gap-1">
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
              <DropdownMenuItem onClick={() => navigate('/profile')} className="flex items-center space-x-2 cursor-pointer">
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

          {state === "expanded" && (
            <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 hover:bg-accent flex-shrink-0">
                  <Bell className="h-4 w-4 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-80 bg-white border shadow-lg p-0" onCloseAutoFocus={e => e.preventDefault()}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-100 text-red-600 text-xs font-medium px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                      <CheckCheck className="h-3.5 w-3.5" />Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <button
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-medium truncate ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{n.body}</p>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{n.time}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
