
import { useLocation, Link } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, MessageCircle, Users, UserCheck, Bot, Workflow,
  Puzzle, Settings, HelpCircle, ClipboardCheck, CreditCard, GitBranch, Brain
} from 'lucide-react';

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Chat", url: "/chat", icon: MessageCircle },
  { title: "Tasks", url: "/tasks", icon: ClipboardCheck },
  { title: "AI Workers", url: "/ai-employees", icon: Bot },
  { title: "Human Teams", url: "/teams", icon: Users },
  { title: "Worker Groups", url: "/ai-agents", icon: UserCheck },
  { title: "Workflows", url: "/workflows", icon: Workflow },
  { title: "Integrations", url: "/integrations", icon: Puzzle },
  { title: "Work Flows", url: "/flows", icon: GitBranch },
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar className="border-r border-border/30 bg-sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <div 
          className="flex items-center space-x-2 cursor-pointer rounded-xl p-2 -m-2 transition-all hover:shadow-neu-sm"
          onClick={toggleSidebar}
        >
          <div className="w-6 h-6 rounded-lg shadow-neu-sm flex items-center justify-center flex-shrink-0 bg-primary">
            <Brain className="w-3 h-3 text-primary-foreground" />
          </div>
          {state === "expanded" && (
            <span className="font-medium text-foreground truncate">3Days.ai</span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Worker Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={state === "collapsed" ? item.title : undefined}
                    className="rounded-xl transition-all data-[active=true]:shadow-neu-inset-sm"
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
          <SidebarGroupLabel className="text-muted-foreground">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={state === "collapsed" ? item.title : undefined}
                    className="rounded-xl transition-all data-[active=true]:shadow-neu-inset-sm"
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
          <div className="text-xs text-muted-foreground">
            3Days.ai Platform v1.0
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
