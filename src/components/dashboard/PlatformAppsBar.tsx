import {
  Calendar,
  StickyNote,
  FileText,
  FolderOpen,
  ListTodo,
  Contact,
  Mail,
  Plus,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type PlatformApp = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  ringColor: string;
  href?: string;
  comingSoon?: boolean;
};

const apps: PlatformApp[] = [
  {
    key: 'calendar',
    label: 'Calendar',
    icon: Calendar,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    ringColor: 'hover:ring-blue-200',
    href: '/calendar',
  },
  {
    key: 'notes',
    label: 'Notes',
    icon: StickyNote,
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50 hover:bg-amber-100',
    ringColor: 'hover:ring-amber-200',
    comingSoon: true,
  },
  {
    key: 'docs',
    label: 'Docs',
    icon: FileText,
    iconColor: 'text-sky-600',
    bgColor: 'bg-sky-50 hover:bg-sky-100',
    ringColor: 'hover:ring-sky-200',
    comingSoon: true,
  },
  {
    key: 'drive',
    label: 'Drive',
    icon: FolderOpen,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100',
    ringColor: 'hover:ring-emerald-200',
    comingSoon: true,
  },
  {
    key: 'todos',
    label: 'To-Dos',
    icon: ListTodo,
    iconColor: 'text-violet-600',
    bgColor: 'bg-violet-50 hover:bg-violet-100',
    ringColor: 'hover:ring-violet-200',
    comingSoon: true,
  },
  {
    key: 'contacts',
    label: 'Contacts',
    icon: Contact,
    iconColor: 'text-rose-600',
    bgColor: 'bg-rose-50 hover:bg-rose-100',
    ringColor: 'hover:ring-rose-200',
    comingSoon: true,
  },
  {
    key: 'mail',
    label: 'Mail',
    icon: Mail,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
    ringColor: 'hover:ring-indigo-200',
    comingSoon: true,
  },
];

export const PLATFORM_APPS_BAR_WIDTH = 56;

export function PlatformAppsBar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={100}>
      <aside
        aria-label="3Days apps"
        className="fixed right-0 top-0 z-40 hidden h-screen w-14 flex-col items-center justify-between border-l border-gray-200/70 bg-white/90 py-3 backdrop-blur-sm md:flex"
      >
        <div className="flex w-full flex-col items-center gap-3">
          {apps.map(app => {
            const Icon = app.icon;
            const isActive = app.href ? location.pathname.startsWith(app.href) : false;
            return (
              <Tooltip key={app.key}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={app.label}
                    aria-current={isActive ? 'page' : undefined}
                    disabled={app.comingSoon}
                    onClick={() => app.href && navigate(app.href)}
                    className={cn(
                      'group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 ring-1 ring-transparent',
                      app.bgColor,
                      app.ringColor,
                      'hover:ring-2 active:scale-95',
                      isActive && 'ring-2',
                      app.comingSoon && 'cursor-not-allowed opacity-80'
                    )}
                  >
                    <Icon className={cn('h-[18px] w-[18px]', app.iconColor)} />
                    {app.comingSoon && (
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 ring-2 ring-white" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipPrimitive.Portal>
                  <TooltipContent side="left" sideOffset={8} className="text-xs">
                    <span className="font-medium">{app.label}</span>
                    {app.comingSoon && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-gray-400">Soon</span>
                    )}
                  </TooltipContent>
                </TooltipPrimitive.Portal>
              </Tooltip>
            );
          })}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Add app"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-gray-300 text-gray-400 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600"
            >
              <Plus className="h-[18px] w-[18px]" />
            </button>
          </TooltipTrigger>
          <TooltipPrimitive.Portal>
            <TooltipContent side="left" sideOffset={8} className="text-xs font-medium">
              Add app
            </TooltipContent>
          </TooltipPrimitive.Portal>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
}

export default PlatformAppsBar;
