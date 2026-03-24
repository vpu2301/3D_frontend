
import { useLocation, Link } from 'react-router-dom';
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
  Code,
  Terminal,
  BookOpen,
  Play,
  GitBranch,
  Brain
} from 'lucide-react';

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
  {
    title: "Work Flows",
    url: "/flows",
    icon: GitBranch,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Help & Support",
    url: "/help",
    icon: HelpCircle,
  },
];


export function AppSidebar() {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();

  const handleLogoClick = () => {
    toggleSidebar();
  };

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="p-4">
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
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

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
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
      
      <SidebarFooter className="p-4">
        {state === "expanded" && (
          <div className="text-xs text-gray-500">
            3Days.ai Platform v1.0
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
