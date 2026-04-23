import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, CheckCircle, Search, LayoutGrid, Link2, ChevronRight, Zap, MoreVertical, Settings, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Brand color logos as inline SVG components
const logos: Record<string, JSX.Element> = {
  'Slack': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"/>
      <path fill="#E01E5A" d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
      <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z"/>
      <path fill="#36C5F0" d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
      <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z"/>
      <path fill="#2EB67D" d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/>
      <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z"/>
      <path fill="#ECB22E" d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
  ),
  'Microsoft Teams': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#5059C9" d="M20.625 8.018h-4.5v7.875a4.5 4.5 0 0 0 4.5 4.5h.75A2.625 2.625 0 0 0 24 17.768v-7.125a2.625 2.625 0 0 0-3.375-2.625z"/>
      <circle fill="#5059C9" cx="19.875" cy="5.018" r="2.25"/>
      <circle fill="#7B83EB" cx="12.375" cy="4.143" r="3.375"/>
      <path fill="#7B83EB" d="M17.625 8.018H7.125A2.625 2.625 0 0 0 4.5 10.643v7.875a7.875 7.875 0 0 0 15.75 0v-7.875a2.625 2.625 0 0 0-2.625-2.625z"/>
    </svg>
  ),
  'Discord': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#5865F2" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  ),
  'Zoom': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#2D8CFF" width="24" height="24" rx="5"/>
      <path fill="white" d="M4 9.5A1.5 1.5 0 0 1 5.5 8h7A1.5 1.5 0 0 1 14 9.5v5A1.5 1.5 0 0 1 12.5 16h-7A1.5 1.5 0 0 1 4 14.5v-5zm11 .5 4.5-2.5v9L15 14V10z"/>
    </svg>
  ),
  'Telegram': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#2CA5E0" cx="12" cy="12" r="12"/>
      <path fill="white" d="M5.491 11.74L18.225 6.65c.585-.224 1.096.144.907.998l-2.156 10.165c-.16.717-.585.894-1.186.556l-3.308-2.437-1.597 1.538c-.177.177-.326.326-.669.326l.238-3.374 6.14-5.547c.267-.238-.058-.37-.413-.133L7.21 13.812 4 12.826c-.716-.225-.731-.716.15-1.087z"/>
    </svg>
  ),
  'Salesforce': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#00A1E0" d="M10.07 3.28A4.36 4.36 0 0 1 13.12 2a4.4 4.4 0 0 1 3.74 2.07 5.43 5.43 0 0 1 2.16-.44 5.48 5.48 0 0 1 5.48 5.48 5.48 5.48 0 0 1-5.48 5.48H6.46A4.46 4.46 0 0 1 2 10.13a4.46 4.46 0 0 1 4.46-4.46 4.43 4.43 0 0 1 3.61 1.61z"/>
    </svg>
  ),
  'HubSpot': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#FF7A59" d="M18.164 7.93V5.084a1.56 1.56 0 0 0 .9-1.406V3.64A1.562 1.562 0 0 0 17.5 2.08h-.038a1.562 1.562 0 0 0-1.563 1.562v.037c0 .635.378 1.182.924 1.43v2.822a4.428 4.428 0 0 0-2.1.922L7.888 4.083a1.722 1.722 0 1 0-.795.977l6.713 4.736A4.39 4.39 0 0 0 13.18 12a4.394 4.394 0 0 0 .626 2.204l-2.035 2.035a1.438 1.438 0 0 0-.432-.067 1.458 1.458 0 1 0 1.459 1.459 1.434 1.434 0 0 0-.067-.432l2.01-2.01A4.4 4.4 0 1 0 18.164 7.93z"/>
    </svg>
  ),
  'Google Workspace': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
  'Microsoft 365': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#D83B01" x="13" y="13" width="10" height="10" rx="1"/>
      <rect fill="#217346" x="1" y="13" width="10" height="10" rx="1"/>
      <rect fill="#0078D4" x="13" y="1" width="10" height="10" rx="1"/>
      <rect fill="#FFB900" x="1" y="1" width="10" height="10" rx="1"/>
    </svg>
  ),
  'Notion': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#f7f7f5" width="24" height="24" rx="4"/>
      <path fill="#000" d="M5 5h9l4 4v10H5V5zm9 0v4h4"/>
      <path fill="#000" d="M8 10h8M8 13h6M8 16h4" stroke="#000" strokeWidth="1" fill="none"/>
    </svg>
  ),
  'Asana': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#F06A6A" cx="12" cy="6.75" r="4.25"/>
      <circle fill="#F06A6A" cx="4.5" cy="15.75" r="4.25"/>
      <circle fill="#F06A6A" cx="19.5" cy="15.75" r="4.25"/>
    </svg>
  ),
  'Trello': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#0052CC" width="24" height="24" rx="4"/>
      <rect fill="white" x="4.5" y="4.5" width="6" height="10" rx="1.5"/>
      <rect fill="white" x="13.5" y="4.5" width="6" height="7" rx="1.5"/>
    </svg>
  ),
  'Mailchimp': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#FFE01B" cx="12" cy="12" r="12"/>
      <path fill="#241C15" d="M9 8.5c0-.83.67-1.5 1.5-1.5h3c.83 0 1.5.67 1.5 1.5v2c0 .55-.3 1.04-.75 1.3l1 3.7h-6l1-3.7C9.3 11.54 9 11.05 9 10.5v-2zm1.5.5v1.5h3V9h-3z"/>
    </svg>
  ),
  'Shopify': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#96BF48" d="M15.5 21.5l5-1.1L18 4.8c0-.1-.1-.2-.2-.2s-1.4-.1-1.4-.1-1-.9-1.1-1c-.1-.1-.2-.1-.3-.1L14.5 21.5h1z"/>
      <path fill="#5E8E3E" d="M11.5 7.5l-.7 2.1s-.7-.4-1.6-.4c-1.3 0-1.4.8-1.4 1 0 1.1 2.9 1.5 2.9 4.1 0 2-1.3 3.3-3 3.3-2.1 0-3.2-1.3-3.2-1.3l.6-1.9s1.1.9 2 .9c.6 0 .9-.5.9-.8 0-1.5-2.4-1.5-2.4-3.9 0-2 1.4-3.9 4.3-3.9 1.1 0 1.6.3 1.6.3z"/>
      <path fill="#fff" d="M14.2 3.1c0-.1-.1-.1-.2-.1-.1 0-1.5-.1-1.5-.1s-1-.9-1.1-1c-.1 0-.2-.1-.3-.1l-.5 19 8.5-1.8L15.4 3.3c-.1-.1-.2-.2-.3-.2-.4 0-.9.1-.9.1s-.3-1-.4-1.4c-.2-.4-.5-.5-.8-.5-.6 0-.8.8-.8.8z"/>
    </svg>
  ),
  'Google Analytics': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#F9AB00" x="1" y="11" width="5" height="10" rx="2.5"/>
      <rect fill="#E37400" x="9.5" y="5" width="5" height="16" rx="2.5"/>
      <rect fill="#F9AB00" x="18" y="1" width="5" height="20" rx="2.5"/>
    </svg>
  ),
  'QuickBooks': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#2CA01C" cx="12" cy="12" r="12"/>
      <path fill="white" d="M8 8h5a3 3 0 0 1 0 6H10v2h3.5v2H8V8zm2 2v2h3a1 1 0 0 0 0-2h-3zm6.5-2H18v10h-1.5V8zm2 1.5A1.5 1.5 0 0 1 18 8h.5v3H18a1.5 1.5 0 0 1-1.5-1.5z"/>
    </svg>
  ),
  'Stripe': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#6772E5" width="24" height="24" rx="5"/>
      <path fill="white" d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C4.81 22.556 7.685 24 11.52 24c2.557 0 4.694-.599 6.218-1.742 1.73-1.3 2.48-3.1 2.48-5.42-.002-4.044-2.467-5.666-6.242-6.688z"/>
    </svg>
  ),
  'PayPal': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#003087" d="M7.016 19.198c-.162.96.484 1.82 1.46 1.82h3.094c.548 0 .958-.343 1.05-.845l1.246-7.99c.09-.5.5-.844 1.046-.844h1.956c2.89 0 5.084-1.44 5.73-4.574.244-1.15.086-2.05-.336-2.69C21.796 4.77 20.17 4 18.13 4H9.54c-.546 0-.958.344-1.048.844L7.016 19.198z"/>
      <path fill="#009CDE" d="M20.516 7.97c-.646 3.133-2.84 4.573-5.73 4.573h-1.956c-.547 0-.957.344-1.047.844l-1.246 7.99c-.092.5-.5.844-1.046.844H6.34a.847.847 0 0 1-.84-.97l.418-2.66c.09-.5.5-.845 1.046-.845h1.956c2.89 0 5.084-1.44 5.73-4.574.34-1.605-.004-2.924-.998-3.85 1.34.195 2.345.832 2.864 1.648z"/>
    </svg>
  ),
  'GitHub': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#181717" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  'GitLab': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#FC6D26" d="m23.955 13.587-1.342-4.135-2.664-8.189a.455.455 0 0 0-.867 0L16.418 9.45H7.582L4.918 1.263a.455.455 0 0 0-.867 0L1.387 9.45.045 13.587a.924.924 0 0 0 .331 1.023L12 23.054l11.624-8.443a.92.92 0 0 0 .331-1.024"/>
    </svg>
  ),
  'Jira': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <defs>
        <linearGradient id="jira-a" x1="17.506" y1="6.37" x2="11.64" y2="12.518" gradientUnits="userSpaceOnUse">
          <stop offset=".18" stopColor="#0052CC"/>
          <stop offset="1" stopColor="#2684FF"/>
        </linearGradient>
        <linearGradient id="jira-b" x1="11.952" y1=".901" x2="6.087" y2="7.05" gradientUnits="userSpaceOnUse">
          <stop offset=".18" stopColor="#0052CC"/>
          <stop offset="1" stopColor="#2684FF"/>
        </linearGradient>
      </defs>
      <path fill="#2684FF" d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.218 5.218 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005z"/>
      <path fill="url(#jira-a)" d="M5.943 6.37H17.506a5.218 5.218 0 0 1 5.232 5.215h-2.13v2.058a5.218 5.218 0 0 1-5.213 5.214V7.375a1.005 1.005 0 0 0-1.005-1.005H5.943z"/>
      <path fill="url(#jira-b)" d="M.39.901h11.563a5.218 5.218 0 0 1 5.231 5.215h-2.13v2.057A5.218 5.218 0 0 1 9.843 13.39V1.906A1.005 1.005 0 0 0 8.838.901H.39z"/>
    </svg>
  ),
  'Google Drive': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#4285F4" d="M6.29 17l-3.45-6L8 1.98 11.45 8l-5.16 9z"/>
      <path fill="#FBBC05" d="M8 1.98L2.84 11H15.16L10 1.98H8z"/>
      <path fill="#34A853" d="M21.16 17H2.84l3.45-6H17.71l3.45 6z"/>
    </svg>
  ),
  'Dropbox': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#0061FF" d="M6 1.5L0 5.25l6 3.75 6-3.75L6 1.5zm12 0l-6 3.75 6 3.75 6-3.75L18 1.5zM0 12.75L6 16.5l6-3.75-6-3.75-6 3.75zm18-3.75l-6 3.75 6 3.75 6-3.75-6-3.75zM6 17.25L12 21l6-3.75-6-3.75-6 3.75z"/>
    </svg>
  ),
  'OneDrive': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#0078D4" d="M13.5 8.5a5.5 5.5 0 0 1 5.5 5.5H20a4 4 0 0 1 0 8H5a4 4 0 0 1 0-8h.5a5.5 5.5 0 0 1 8-5.5z"/>
      <path fill="#28A8E0" d="M9 9a6 6 0 0 1 11.5 2.5A4.5 4.5 0 0 1 24 16h-4a5.5 5.5 0 0 0-11 0H7a4 4 0 0 0-1 7.9V14a7 7 0 0 1 3-5z"/>
    </svg>
  ),
  'Facebook': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  'Twitter': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#000" width="24" height="24" rx="5"/>
      <path fill="white" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  'LinkedIn': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#0A66C2" width="24" height="24" rx="4"/>
      <path fill="white" d="M6.94 5a2 2 0 1 1-4-.002A2 2 0 0 1 6.94 5zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"/>
    </svg>
  ),
  'Instagram': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="5%" stopColor="#fdf497"/>
          <stop offset="45%" stopColor="#fd5949"/>
          <stop offset="60%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <rect fill="url(#ig-grad)" width="24" height="24" rx="6"/>
      <circle fill="none" stroke="white" strokeWidth="1.8" cx="12" cy="12" r="4.5"/>
      <circle fill="white" cx="17.5" cy="6.5" r="1.3"/>
    </svg>
  ),
  'YouTube': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#FF0000" d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  ),
  'TikTok': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#000" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  'Pipedrive': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#1A1A1A" cx="12" cy="12" r="12"/>
      <path fill="#1FA464" d="M12 6a6 6 0 1 0 0 12A6 6 0 0 0 12 6zm0 9.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/>
    </svg>
  ),
  'Mixpanel': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#7856FF" cx="12" cy="12" r="12"/>
      <path fill="white" d="M7 16V8h2v8H7zm4-10v10h2V6h-2zm4 4v6h2v-6h-2z"/>
    </svg>
  ),
  'Hotjar': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#FF3C00" cx="12" cy="12" r="12"/>
      <path fill="white" d="M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm2.5 9.5L12 12l-2.5 2.5L8 13l4-4 4 4-1.5 1.5z"/>
    </svg>
  ),
  'BambooHR': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#73AC38" cx="12" cy="12" r="12"/>
      <path fill="white" d="M8 6v12h2V6H8zm4 4v8h2v-8h-2zm4-2v10h2V8h-2z"/>
    </svg>
  ),
  'Workday': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#F5821F" cx="12" cy="12" r="12"/>
      <path fill="white" d="M8.4 7l1.8 10 1.8-6.5L13.8 17l1.8-10H17l-2.4 12h-2l-1.6-6-1.6 6h-2L5 7z"/>
    </svg>
  ),
  'Monday.com': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#FF3D57" cx="4.5" cy="12" r="3.5"/>
      <circle fill="#FFCB00" cx="12" cy="12" r="3.5"/>
      <circle fill="#00CA72" cx="19.5" cy="12" r="3.5"/>
    </svg>
  ),
  'Airtable': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#FCB400" d="M12 1.5L2.25 5.75v4.25L12 14.25l9.75-4.25V5.75L12 1.5z"/>
      <path fill="#18BFFF" d="M2.25 10l9.75 4.25v8.25L2.25 18.5V10z"/>
      <path fill="#F82B60" d="M21.75 10L12 14.25v8.25l9.75-3.75V10z"/>
    </svg>
  ),
  'ClickUp': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <defs>
        <linearGradient id="cu-grad" x1="3.78" y1="19" x2="20.22" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8930FD"/>
          <stop offset="1" stopColor="#49CCF9"/>
        </linearGradient>
      </defs>
      <path fill="url(#cu-grad)" d="M3.78 19.2L7.14 16.58a7.05 7.05 0 0 0 4.86 2.14 7.05 7.05 0 0 0 4.86-2.14l3.36 2.62C18.36 20.87 15.36 22 12 22S5.64 20.87 3.78 19.2z"/>
      <path fill="#7B68EE" d="M12 4.5l-8.22 7.08 1.99 2.31L12 8.5l6.23 5.39 1.99-2.31z"/>
    </svg>
  ),
  'ActiveCampaign': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#356AE6" cx="12" cy="12" r="12"/>
      <polyline fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points="5,12 9,16 19,8"/>
    </svg>
  ),
  'WooCommerce': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#96588A" width="24" height="17" rx="3"/>
      <path fill="white" d="M2 5l3.5 8L8 9l2.5 4L13 5l-1.5 8h2L15.5 5l2 8L20 5"/>
    </svg>
  ),
  'Square': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#3E4348" width="24" height="24" rx="4"/>
      <rect fill="white" x="5" y="5" width="14" height="14" rx="2"/>
      <rect fill="#3E4348" x="8" y="8" width="8" height="8" rx="1"/>
    </svg>
  ),
  'Xero': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#13B5EA" cx="12" cy="12" r="12"/>
      <path fill="white" d="M6 8l6 4-6 4M18 8l-6 4 6 4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  'FreshBooks': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#0075DD" cx="12" cy="12" r="12"/>
      <path fill="white" d="M7 7h9v2H9v2h6v2H9v5H7V7z"/>
    </svg>
  ),
  'ADP': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#D9251D" width="24" height="24" rx="3"/>
      <text fill="white" x="4" y="16" fontSize="9" fontWeight="bold" fontFamily="sans-serif">ADP</text>
    </svg>
  ),
  'Gusto': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#F45D48" cx="12" cy="12" r="12"/>
      <path fill="white" d="M12 6a6 6 0 0 0-6 6h3a3 3 0 0 1 6 0h3a6 6 0 0 0-6-6zm0 12a6 6 0 0 0 6-6h-3a3 3 0 0 1-6 0H6a6 6 0 0 0 6 6z"/>
    </svg>
  ),
  'Bitbucket': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#2684FF" d="M.778 1.213a.768.768 0 0 0-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 0 0 .77-.646l3.27-20.03a.768.768 0 0 0-.768-.891L.778 1.213zM14.52 15.53H9.522L8.17 8.467h7.561l-1.211 7.064z"/>
    </svg>
  ),
  'Box': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#0061D5" d="M12 4a8 8 0 1 0 0 16A8 8 0 0 0 12 4zm-1.5 4h3a2.5 2.5 0 0 1 0 5h-1.5v3h-1.5V8zm1.5 1.5v2h1.5a1 1 0 0 0 0-2H12z"/>
    </svg>
  ),
  'Amplitude': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#0000FF" cx="12" cy="12" r="12"/>
      <polyline fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="3,15 7,7 11,13 14,9 18,17"/>
    </svg>
  ),
  'Constant Contact': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#5BAE44" cx="12" cy="12" r="12"/>
      <path fill="white" d="M12 7a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 3.5-1.43l-1.42-1.42A3 3 0 0 1 12 15a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 2.08.85l1.42-1.42A5 5 0 0 0 12 7z"/>
    </svg>
  ),
  'Campaign Monitor': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#509CF5" cx="12" cy="12" r="12"/>
      <path fill="none" stroke="white" strokeWidth="1.5" d="M4 7h16v10H4z"/>
      <polyline fill="none" stroke="white" strokeWidth="1.5" points="4,7 12,14 20,7"/>
    </svg>
  ),
  'ConvertKit': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#FB6970" cx="12" cy="12" r="12"/>
      <path fill="white" d="M8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/>
    </svg>
  ),
  'Magento': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#EE672F" d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm0 3.25L19 9v6.25L12 19l-7-3.75V9l7-3.75zm0 3.5L8 11v4l4 2 4-2v-4l-4-2.25z"/>
    </svg>
  ),
  'BigCommerce': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#34313F" width="24" height="24" rx="5"/>
      <path fill="#34F2B4" d="M5 7h9a3 3 0 0 1 0 6H7v4H5V7zm2 2v2h7a1 1 0 0 0 0-2H7z"/>
    </svg>
  ),
  'Zoho CRM': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#E42527" width="24" height="24" rx="5"/>
      <text fill="white" x="3" y="16" fontSize="8" fontWeight="bold" fontFamily="sans-serif">ZOHO</text>
    </svg>
  ),
  'Freshworks': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#29B5E8" cx="12" cy="12" r="12"/>
      <path fill="white" d="M7 7h7a3 3 0 0 1 0 6H9v4H7V7zm2 2v2h5a1 1 0 0 0 0-2H9z"/>
    </svg>
  ),
  // AI & LLM
  'OpenAI': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <circle fill="#000" cx="12" cy="12" r="12"/>
      <path fill="white" d="M19.07 8.93A7 7 0 0 0 12.54 5a7 7 0 0 0-6.61 4.69A5.25 5.25 0 0 0 2.5 14a5.26 5.26 0 0 0 5.26 5.26h.24V17.5h-.24A3.5 3.5 0 0 1 4.25 14a3.49 3.49 0 0 1 2.67-3.4l.7-.16.22-.69A5.25 5.25 0 0 1 12.54 6.75a5.2 5.2 0 0 1 4.9 3.42l.22.7.71.14A3.5 3.5 0 0 1 21.5 14a3.5 3.5 0 0 1-3.5 3.5h-.25v1.76h.25A5.25 5.25 0 0 0 23.25 14a5.25 5.25 0 0 0-4.18-5.07z"/>
    </svg>
  ),
  'Anthropic': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#CC785C" width="24" height="24" rx="5"/>
      <path fill="white" d="M13.8 6h-2.6L7 18h2.4l.9-2.6h4.4l.9 2.6H18L13.8 6zm-2.9 7.5 1.6-4.6 1.6 4.6h-3.2z"/>
    </svg>
  ),
  'Google Gemini': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <defs>
        <linearGradient id="gemini-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4285F4"/>
          <stop offset="50%" stopColor="#9C27B0"/>
          <stop offset="100%" stopColor="#EA4335"/>
        </linearGradient>
      </defs>
      <circle fill="url(#gemini-g)" cx="12" cy="12" r="12"/>
      <path fill="white" d="M12 4c0 4.4-3.6 8-8 8 4.4 0 8 3.6 8 8 0-4.4 3.6-8 8-8-4.4 0-8-3.6-8-8z"/>
    </svg>
  ),
  'Mistral AI': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#F06A00" width="24" height="24" rx="5"/>
      <rect fill="white" x="4" y="4" width="4" height="4"/>
      <rect fill="white" x="10" y="4" width="4" height="4"/>
      <rect fill="white" x="16" y="4" width="4" height="4"/>
      <rect fill="white" x="4" y="10" width="4" height="4"/>
      <rect fill="#F06A00" x="10" y="10" width="4" height="4"/>
      <rect fill="white" x="16" y="10" width="4" height="4"/>
      <rect fill="white" x="4" y="16" width="4" height="4"/>
      <rect fill="white" x="10" y="16" width="4" height="4"/>
    </svg>
  ),
  'Cohere': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#39594D" width="24" height="24" rx="5"/>
      <circle fill="#D18EE2" cx="9" cy="9" r="4"/>
      <circle fill="#FF7759" cx="17" cy="15" r="3"/>
      <circle fill="#39E09B" cx="9" cy="17" r="2"/>
    </svg>
  ),
  'Meta Llama': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#0082FB" width="24" height="24" rx="5"/>
      <path fill="white" d="M4 16.5C4 13 6 8 9.5 8c1.5 0 2.5.8 3 2C13 8.5 14.5 6 17 6c2 0 3 1.5 3 3.5 0 4-3 9-5 9-1 0-1.8-.8-2-2-.5 1.2-1.2 2-2.5 2C8 18.5 4 20 4 16.5z"/>
    </svg>
  ),
  'Azure OpenAI': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <defs>
        <linearGradient id="azure-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0078D4"/>
          <stop offset="100%" stopColor="#50E6FF"/>
        </linearGradient>
      </defs>
      <rect fill="url(#azure-g)" width="24" height="24" rx="5"/>
      <path fill="white" d="M8 18l3.5-12 4.5 8H9.5L8 18zm7-2l2-6 1 6h-3z"/>
    </svg>
  ),
  'Groq': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#F55036" width="24" height="24" rx="5"/>
      <path fill="white" d="M12 6a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6V11h-5v2h3a4 4 0 0 1-4 3 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 2.83 1.17l1.42-1.42A6 6 0 0 0 12 6z"/>
    </svg>
  ),
  'Together AI': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#7C3AED" width="24" height="24" rx="5"/>
      <circle fill="white" cx="8" cy="12" r="2.5"/>
      <circle fill="white" cx="16" cy="8" r="2.5"/>
      <circle fill="white" cx="16" cy="16" r="2.5"/>
      <line stroke="white" strokeWidth="1.5" x1="10.5" y1="12" x2="13.5" y2="9"/>
      <line stroke="white" strokeWidth="1.5" x1="10.5" y1="12" x2="13.5" y2="15"/>
    </svg>
  ),
  'Perplexity': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#20808D" width="24" height="24" rx="5"/>
      <path fill="white" d="M12 3v5M9 5l3-2 3 2M7 8h10v2H7zM8 10v4l4 3 4-3v-4M12 14v4"/>
      <path fill="none" stroke="white" strokeWidth="1.3" d="M12 3v5M9 5l3-2 3 2M7 8h10v2H7zM8 10v4l4 3 4-3v-4M12 14v4"/>
    </svg>
  ),
  // Databases
  'PostgreSQL': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#336791" d="M17.13 13.77c.16-.9.13-1.04.87-1.04h.17c.65 0 1.26-.04 1.71-.26.35-.17.55-.38.55-.7 0-.28-.15-.5-.36-.66a2.6 2.6 0 0 0-.44-.24 4.4 4.4 0 0 0-1.8-.26c-.46 0-.9.04-1.32.15-.04-.3-.07-.61-.08-.93-.07-1.4.12-2.8.37-3.87.15-.64.5-1.6.93-2.12.38-.46.77-.56 1.13-.3.4.28.55.72.66 1.17.18.73.26 1.54.15 2.28-.05.36.28.7.65.65.36-.05.65-.35.65-.65.13-.9.04-1.78-.16-2.63-.13-.53-.36-1.1-.78-1.46C19.6 3.43 18.8 3.5 18.2 4c-.58.48-.98 1.37-1.2 2.15-.3 1.14-.5 2.56-.44 4.03.02.4.07.82.14 1.23a5.4 5.4 0 0 0-1.7.08c-1.08.3-1.8 1-1.8 1.92 0 .64.35 1.15.85 1.5.44.3.98.48 1.56.53l.06.5c.19 1.48.5 2.82 1.02 3.8.5.95 1.24 1.56 2.17 1.62.7.05 1.42-.27 1.97-.86.57-.62.94-1.57.97-2.72.04-1.07-.2-2.1-.65-2.9-.04-.07-.09-.12-.14-.18zm-7.47 3.64c-.12.03-.24.04-.36.04-.55 0-.82-.22-.96-.43-.17-.25-.24-.6-.24-1.02 0-.58.13-1.22.34-1.76-.05.3-.08.62-.08.94 0 .75.15 1.38.46 1.84.26.38.64.63 1.1.73l-.26.66zm-1.53-7.1c.53-.14 1.16-.08 1.74.17a2.38 2.38 0 0 1 .96.8c.2.3.31.64.31.97 0 .57-.28 1.02-.65 1.24a1.3 1.3 0 0 1-.62.15c-.23 0-.46-.06-.65-.18-.3-.18-.5-.5-.5-.87 0-.25.08-.5.24-.7.14-.2.34-.35.57-.44.27-.1.54-.1.78-.01.1.04.18.1.25.17-.03-.04-.08-.08-.13-.1a1.27 1.27 0 0 0-.92.03 1.15 1.15 0 0 0-.66.74c-.06.2-.08.42-.03.64.08.36.33.64.66.78.28.12.6.13.9.04.43-.12.8-.42.99-.8.1-.2.15-.42.15-.65 0-.46-.18-.9-.5-1.22a2.34 2.34 0 0 0-1.63-.64c-.37 0-.74.08-1.07.25.02-.05.05-.1.08-.14l.03-.05.1-.17zm3.03 7.5c.48-.26.82-.71.96-1.28.08-.3.1-.62.08-.93a3.2 3.2 0 0 1-1.22.63 2.28 2.28 0 0 1-2.56-1.03c-.2-.3-.32-.65-.34-1.02a2.5 2.5 0 0 0 .5 1.98 2.48 2.48 0 0 0 2.58.65zM12 2.1C6.5 2.1 2 6.6 2 12.1s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10z"/>
    </svg>
  ),
  'MySQL': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#00618A" d="M16.4 15.63c-.7 0-1.23.1-1.68.27l-.2.08c-.18.07-.35.14-.5.24.13-.42.2-.87.2-1.35 0-2.1-1.4-3.5-3.5-3.5S7.2 12.77 7.2 14.87c0 2.1 1.4 3.5 3.5 3.5.77 0 1.5-.24 2.06-.65.49.53 1.14.85 1.94.85 1.73 0 2.8-1.36 2.8-2.94 0-0-.02 0-.1 0zm-6 1.74c-1.3 0-2.1-.87-2.1-2.1s.8-2.1 2.1-2.1c1.3 0 2.1.87 2.1 2.1s-.8 2.1-2.1 2.1zm5.7.43c-.8 0-1.5-.6-1.5-1.54s.7-1.54 1.5-1.54c.8 0 1.5.6 1.5 1.54s-.7 1.54-1.5 1.54z"/>
      <path fill="#F29111" d="M13.36 7.2l-.05-.2c-.1-.44-.2-.86-.37-1.2a2.47 2.47 0 0 0-.8-.96c-.35-.22-.77-.34-1.2-.34-.18 0-.35.02-.52.06l-.23.05-.2.08c-.26.1-.5.24-.7.44-.3.28-.5.64-.58 1.04l-.03.22v.22c0 .42.07.82.2 1.2.14.36.33.7.57.96.5.54 1.15.82 1.82.82.3 0 .6-.05.88-.16.28-.1.54-.27.75-.48.42-.43.64-1.02.64-1.62 0-.04 0-.08-.01-.12l-.17.01z"/>
      <path fill="#00618A" d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12z" fillOpacity="0"/>
      <text fill="#00618A" x="3" y="10" fontSize="5" fontWeight="bold" fontFamily="sans-serif">MySQL</text>
    </svg>
  ),
  'MongoDB': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#4DB33D" d="M17.19 3.6C15.36 1.4 12.84.31 12.01.28c-.83.03-3.35 1.12-5.18 3.32C5 5.97 4.65 8.5 5.03 10.8c.37 2.3 1.37 3.96 2.14 4.75.07.07.14.14.22.21l4.62 8.24 4.6-8.24c.08-.07.15-.14.22-.21.77-.8 1.77-2.45 2.14-4.75.38-2.3.03-4.83-1.78-7.2z"/>
      <path fill="#3F9142" d="M12.01 22v-7.46c-1.82-.12-5.49-1.33-5.92-5.43-.27-2.58.59-4.9 1.78-6.48L12.01 22z"/>
      <path fill="#2E7D32" d="M12.01 22c.47 0 .94-.04 1.4-.13-1.1-1.96-2.8-5-4.6-8.28-.36.17-.72.35-1.1.54L12.01 22z"/>
    </svg>
  ),
  'Redis': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#D82C20" d="M22.31 16.16c-.97.5-5.97 2.56-7.03 3.12-.43.22-.98.34-1.53.34-.55 0-1.1-.12-1.53-.34-1.06-.56-6.06-2.62-7.03-3.12-.48-.25-.73-.54-.73-.82v-2.57c0-.3.25-.58.73-.83.97-.5 5.97-2.56 7.03-3.12.43-.22.98-.34 1.53-.34.55 0 1.1.12 1.53.34 1.06.56 6.06 2.62 7.03 3.12.48.25.73.54.73.83v2.57c0 .28-.25.57-.73.82zM13.75 12.48c.43-.22.98-.34 1.53-.34.55 0 1.1.12 1.53.34l3.5 1.52-4.75 2.01-4.75-2.01 2.94-1.52zM2.42 9.27c-.48.25-.73.54-.73.83v2.57c0 .28.25.57.73.82.97.5 5.97 2.56 7.03 3.12v-5.31L2.42 9.27z"/>
    </svg>
  ),
  'Supabase': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <defs>
        <linearGradient id="supa-g" x1="14.3" y1="2.2" x2="6.6" y2="14.8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361"/>
          <stop offset="1" stopColor="#3ECF8E"/>
        </linearGradient>
      </defs>
      <path fill="url(#supa-g)" d="M11.9 1.6 3 13.5h8.4V22l8.8-11.9H11.9V1.6z"/>
    </svg>
  ),
  'Firebase': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#FFA000" d="M5.71 16.22 8.27 1.5l4.42 4.87-7 9.85z"/>
      <path fill="#F57F17" d="M5.71 16.22l3.22-2.65 2.35 1.87-5.57.78z"/>
      <path fill="#FFCA28" d="M15.29 7.08l-4.6 6.49-3.76 2.65L19.3 18l-4-10.92z"/>
      <path fill="#FFA000" d="M11.28 5.36l-.59 8.21 3.1-6.14-2.51-2.07z"/>
    </svg>
  ),
  'Snowflake': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#29B5E8" d="M12 2v20M2 12h20M5.05 5.05l13.9 13.9M18.95 5.05 5.05 18.95M12 2l3 4-3 1.5L9 6l3-4zM12 22l3-4-3-1.5L9 18l3 4zM2 12l4 3-1.5-3L6 9 2 12zm20 0-4 3 1.5-3L18 9l4 3z" stroke="#29B5E8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  'BigQuery': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="#4285F4" d="M2 12L12 2l10 10-10 10L2 12z"/>
      <circle fill="white" cx="12" cy="12" r="4"/>
      <path fill="#4285F4" d="M14.83 14.83l2.83 2.83" stroke="#4285F4" strokeWidth="2"/>
    </svg>
  ),
  'Pinecone': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#000" width="24" height="24" rx="5"/>
      <path fill="#1EC9A0" d="M12 3l2 5h5l-4 3 1.5 5L12 13l-4.5 3 1.5-5-4-3h5l2-5z"/>
    </svg>
  ),
  'Weaviate': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#4CAF50" width="24" height="24" rx="5"/>
      <path fill="white" d="M4 7l4 10 4-7 4 7 4-10" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Chroma': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#FF6B35" width="24" height="24" rx="5"/>
      <circle fill="white" cx="8" cy="12" r="3"/>
      <circle fill="white" cx="16" cy="8" r="3"/>
      <circle fill="white" cx="16" cy="16" r="3"/>
    </svg>
  ),
  'Qdrant': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#DC143C" width="24" height="24" rx="5"/>
      <path fill="white" d="M12 4l6 3.5v7L12 18l-6-3.5v-7L12 4zm0 2.3L8 8.7v5.6l4 2.4 4-2.4V8.7L12 6.3z"/>
    </svg>
  ),
  // Agent Frameworks
  'LangChain': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#1C3F4B" width="24" height="24" rx="5"/>
      <path fill="#4CAF50" d="M6 12a6 6 0 0 1 6-6v2a4 4 0 0 0-4 4H6zm6-6a6 6 0 0 1 6 6h-2a4 4 0 0 0-4-4V6zm6 6a6 6 0 0 1-6 6v-2a4 4 0 0 0 4-4h2zm-6 6a6 6 0 0 1-6-6h2a4 4 0 0 0 4 4v2z"/>
    </svg>
  ),
  'LlamaIndex': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#7C3AED" width="24" height="24" rx="5"/>
      <path fill="white" d="M9 6h6l3 6-3 6H9L6 12l3-6zm0 2-2.5 4 2.5 4h6l2.5-4L15 8H9z"/>
    </svg>
  ),
  'CrewAI': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#111827" width="24" height="24" rx="5"/>
      <circle fill="#EF4444" cx="8" cy="10" r="2.5"/>
      <circle fill="#3B82F6" cx="16" cy="10" r="2.5"/>
      <circle fill="#22C55E" cx="12" cy="16" r="2.5"/>
      <line stroke="#6B7280" strokeWidth="1" x1="8" y1="10" x2="16" y2="10"/>
      <line stroke="#6B7280" strokeWidth="1" x1="8" y1="10" x2="12" y2="16"/>
      <line stroke="#6B7280" strokeWidth="1" x1="16" y1="10" x2="12" y2="16"/>
    </svg>
  ),
  'AutoGPT': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#0F172A" width="24" height="24" rx="5"/>
      <path fill="#38BDF8" d="M12 4l4 4h-2v4l2 2-2 2v2l-4-2-4 2v-2l-2-2 2-2V8H6l4-4z"/>
    </svg>
  ),
  'n8n': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#EA4B71" width="24" height="24" rx="5"/>
      <text fill="white" x="3.5" y="16" fontSize="8" fontWeight="bold" fontFamily="sans-serif">n8n</text>
    </svg>
  ),
  'Zapier': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#FF4A00" width="24" height="24" rx="5"/>
      <path fill="white" d="M12 3v5M12 16v5M3 12h5M16 12h5M5.64 5.64l3.54 3.54M14.82 14.82l3.54 3.54M5.64 18.36l3.54-3.54M14.82 9.18l3.54-3.54"/>
    </svg>
  ),
  'Make': (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <rect fill="#6D00CC" width="24" height="24" rx="5"/>
      <path fill="white" d="M5 12c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7-7-3.13-7-7zm7-5c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
    </svg>
  ),
};

const getFallbackLogo = (name: string, category: string) => {
  const colors: Record<string, string> = {
    'Communication': '#7C3AED', 'CRM': '#2563EB', 'Productivity': '#059669',
    'Marketing': '#D97706', 'E-commerce': '#DC2626', 'Analytics': '#0891B2',
    'Finance': '#65A30D', 'HR': '#9333EA', 'Development': '#1F2937',
    'Storage': '#2563EB', 'Social Media': '#EC4899',
    'AI & LLM': '#6D28D9', 'Databases': '#1E40AF', 'Vector DBs': '#0F766E',
    'Agent Frameworks': '#C2410C',
  };
  const color = colors[category] || '#6B7280';
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-7 h-7 rounded flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
};

const categoryMeta: Record<string, { color: string; bg: string; border: string; label: string; gradient: string }> = {
  'Communication': { color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-300', label: 'Communication', gradient: 'from-violet-50 via-purple-50 to-indigo-50' },
  'CRM':           { color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-300',   label: 'CRM',           gradient: 'from-blue-50 via-sky-50 to-cyan-50' },
  'Productivity':  { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300', label: 'Productivity', gradient: 'from-emerald-50 via-green-50 to-teal-50' },
  'Marketing':     { color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-300',  label: 'Marketing',     gradient: 'from-amber-50 via-yellow-50 to-[#111111]' },
  'E-commerce':    { color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-300',    label: 'E-commerce',    gradient: 'from-red-50 via-rose-50 to-pink-50' },
  'Analytics':     { color: 'text-cyan-700',   bg: 'bg-cyan-50',   border: 'border-cyan-300',   label: 'Analytics',     gradient: 'from-cyan-50 via-sky-50 to-blue-50' },
  'Finance':       { color: 'text-lime-700',   bg: 'bg-lime-50',   border: 'border-lime-300',   label: 'Finance',       gradient: 'from-lime-50 via-green-50 to-emerald-50' },
  'HR':            { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-300', label: 'HR & People',   gradient: 'from-purple-50 via-violet-50 to-fuchsia-50' },
  'Development':   { color: 'text-gray-800',   bg: 'bg-gray-100',  border: 'border-gray-300',   label: 'Development',   gradient: 'from-gray-50 via-slate-50 to-zinc-50' },
  'Storage':       { color: 'text-sky-700',    bg: 'bg-sky-50',    border: 'border-sky-300',    label: 'Storage',       gradient: 'from-sky-50 via-blue-50 to-indigo-50' },
  'Social Media':  { color: 'text-pink-700',   bg: 'bg-pink-50',   border: 'border-pink-300',   label: 'Social Media',  gradient: 'from-pink-50 via-rose-50 to-fuchsia-50' },
  'AI & LLM':      { color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-400', label: 'AI & LLM',      gradient: 'from-violet-50 via-purple-50 to-indigo-50' },
  'Databases':     { color: 'text-blue-800',   bg: 'bg-blue-50',   border: 'border-blue-400',   label: 'Databases',     gradient: 'from-blue-50 via-indigo-50 to-slate-50' },
  'Vector DBs':    { color: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-400',   label: 'Vector DBs',    gradient: 'from-teal-50 via-cyan-50 to-emerald-50' },
  'Agent Frameworks': { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-400', label: 'Agent Frameworks', gradient: 'from-orange-50 via-amber-50 to-yellow-50' },
};

type TabKey = 'browse' | 'connected';

const CATEGORIES = [
  { key: 'all',              label: 'All Integrations',  count: 84 },
  { key: 'AI & LLM',         label: 'AI & LLM',          count: 10 },
  { key: 'Databases',        label: 'Databases',          count: 8  },
  { key: 'Vector DBs',       label: 'Vector DBs',         count: 4  },
  { key: 'Agent Frameworks', label: 'Agent Frameworks',   count: 7  },
  { key: 'Communication',    label: 'Communication',      count: 5  },
  { key: 'CRM',              label: 'CRM',                count: 5  },
  { key: 'Productivity',     label: 'Productivity',       count: 8  },
  { key: 'Marketing',        label: 'Marketing',          count: 5  },
  { key: 'E-commerce',       label: 'E-commerce',         count: 5  },
  { key: 'Analytics',        label: 'Analytics',          count: 4  },
  { key: 'Finance',          label: 'Finance',            count: 5  },
  { key: 'HR',               label: 'HR & People',        count: 4  },
  { key: 'Development',      label: 'Development',        count: 4  },
  { key: 'Storage',          label: 'Storage',            count: 4  },
  { key: 'Social Media',     label: 'Social Media',       count: 6  },
];

const INITIAL_VISIBLE = 9;

const ALL_INTEGRATIONS = [
    { id: 1,  name: 'Slack',            category: 'Communication', status: 'Connected',    description: 'Team messaging platform',               popularity: 98 },
    { id: 2,  name: 'Microsoft Teams',  category: 'Communication', status: 'Disconnected', description: 'Video conferencing and chat',            popularity: 95 },
    { id: 3,  name: 'Discord',          category: 'Communication', status: 'Connected',    description: 'Voice and text chat',                   popularity: 85 },
    { id: 4,  name: 'Zoom',             category: 'Communication', status: 'Disconnected', description: 'Video conferencing',                    popularity: 92 },
    { id: 5,  name: 'Telegram',         category: 'Communication', status: 'Disconnected', description: 'Messaging app',                         popularity: 78 },
    { id: 6,  name: 'Salesforce',       category: 'CRM',           status: 'Connected',    description: 'Customer relationship management',      popularity: 97 },
    { id: 7,  name: 'HubSpot',          category: 'CRM',           status: 'Connected',    description: 'Marketing automation platform',         popularity: 94 },
    { id: 8,  name: 'Pipedrive',        category: 'CRM',           status: 'Disconnected', description: 'Sales pipeline management',             popularity: 82 },
    { id: 9,  name: 'Zoho CRM',         category: 'CRM',           status: 'Disconnected', description: 'Customer management suite',             popularity: 76 },
    { id: 10, name: 'Freshworks',       category: 'CRM',           status: 'Disconnected', description: 'Customer experience software',          popularity: 71 },
    { id: 11, name: 'Google Workspace', category: 'Productivity',  status: 'Disconnected', description: 'Email and document collaboration',      popularity: 96 },
    { id: 12, name: 'Microsoft 365',    category: 'Productivity',  status: 'Connected',    description: 'Office productivity suite',             popularity: 94 },
    { id: 13, name: 'Notion',           category: 'Productivity',  status: 'Connected',    description: 'All-in-one workspace',                  popularity: 88 },
    { id: 14, name: 'Asana',            category: 'Productivity',  status: 'Disconnected', description: 'Project management tool',               popularity: 85 },
    { id: 15, name: 'Trello',           category: 'Productivity',  status: 'Connected',    description: 'Visual project management',             popularity: 83 },
    { id: 16, name: 'Monday.com',       category: 'Productivity',  status: 'Disconnected', description: 'Work management platform',              popularity: 80 },
    { id: 17, name: 'Airtable',         category: 'Productivity',  status: 'Disconnected', description: 'Spreadsheet-database hybrid',           popularity: 77 },
    { id: 18, name: 'ClickUp',          category: 'Productivity',  status: 'Disconnected', description: 'All-in-one productivity app',           popularity: 75 },
    { id: 19, name: 'Mailchimp',        category: 'Marketing',     status: 'Connected',    description: 'Email marketing platform',              popularity: 91 },
    { id: 20, name: 'Constant Contact', category: 'Marketing',     status: 'Disconnected', description: 'Email and social marketing',            popularity: 73 },
    { id: 21, name: 'Campaign Monitor', category: 'Marketing',     status: 'Disconnected', description: 'Email marketing software',              popularity: 68 },
    { id: 22, name: 'ConvertKit',       category: 'Marketing',     status: 'Disconnected', description: 'Creator marketing platform',            popularity: 65 },
    { id: 23, name: 'ActiveCampaign',   category: 'Marketing',     status: 'Disconnected', description: 'Customer experience automation',        popularity: 79 },
    { id: 24, name: 'Shopify',          category: 'E-commerce',    status: 'Connected',    description: 'E-commerce platform',                   popularity: 93 },
    { id: 25, name: 'WooCommerce',      category: 'E-commerce',    status: 'Disconnected', description: 'WordPress e-commerce plugin',           popularity: 87 },
    { id: 26, name: 'Magento',          category: 'E-commerce',    status: 'Disconnected', description: 'Open-source e-commerce',                popularity: 72 },
    { id: 27, name: 'BigCommerce',      category: 'E-commerce',    status: 'Disconnected', description: 'E-commerce SaaS platform',              popularity: 69 },
    { id: 28, name: 'Square',           category: 'E-commerce',    status: 'Disconnected', description: 'Point of sale system',                  popularity: 81 },
    { id: 29, name: 'Google Analytics', category: 'Analytics',     status: 'Connected',    description: 'Web analytics service',                 popularity: 99 },
    { id: 30, name: 'Mixpanel',         category: 'Analytics',     status: 'Disconnected', description: 'Product analytics platform',            popularity: 74 },
    { id: 31, name: 'Amplitude',        category: 'Analytics',     status: 'Disconnected', description: 'Digital optimization system',           popularity: 70 },
    { id: 32, name: 'Hotjar',           category: 'Analytics',     status: 'Disconnected', description: 'Website heatmaps and recordings',       popularity: 76 },
    { id: 33, name: 'QuickBooks',       category: 'Finance',       status: 'Connected',    description: 'Accounting software',                   popularity: 89 },
    { id: 34, name: 'Xero',             category: 'Finance',       status: 'Disconnected', description: 'Cloud accounting software',             popularity: 74 },
    { id: 35, name: 'FreshBooks',       category: 'Finance',       status: 'Disconnected', description: 'Cloud accounting for small business',   popularity: 67 },
    { id: 36, name: 'Stripe',           category: 'Finance',       status: 'Connected',    description: 'Online payment processing',             popularity: 92 },
    { id: 37, name: 'PayPal',           category: 'Finance',       status: 'Disconnected', description: 'Digital payment platform',              popularity: 90 },
    { id: 38, name: 'BambooHR',         category: 'HR',            status: 'Disconnected', description: 'HR management system',                  popularity: 78 },
    { id: 39, name: 'Workday',          category: 'HR',            status: 'Disconnected', description: 'Enterprise HR software',                popularity: 73 },
    { id: 40, name: 'ADP',              category: 'HR',            status: 'Disconnected', description: 'Payroll and HR services',               popularity: 75 },
    { id: 41, name: 'Gusto',            category: 'HR',            status: 'Disconnected', description: 'Payroll and benefits platform',         popularity: 71 },
    { id: 42, name: 'GitHub',           category: 'Development',   status: 'Connected',    description: 'Code hosting platform',                 popularity: 96 },
    { id: 43, name: 'GitLab',           category: 'Development',   status: 'Disconnected', description: 'DevOps platform',                       popularity: 78 },
    { id: 44, name: 'Jira',             category: 'Development',   status: 'Connected',    description: 'Issue tracking and project management', popularity: 86 },
    { id: 45, name: 'Bitbucket',        category: 'Development',   status: 'Disconnected', description: 'Git repository management',             popularity: 65 },
    { id: 46, name: 'Google Drive',     category: 'Storage',       status: 'Connected',    description: 'Cloud storage service',                 popularity: 97 },
    { id: 47, name: 'Dropbox',          category: 'Storage',       status: 'Disconnected', description: 'File hosting service',                  popularity: 84 },
    { id: 48, name: 'OneDrive',         category: 'Storage',       status: 'Connected',    description: 'Microsoft cloud storage',               popularity: 81 },
    { id: 49, name: 'Box',              category: 'Storage',       status: 'Disconnected', description: 'Enterprise cloud storage',              popularity: 66 },
    { id: 50, name: 'Facebook',         category: 'Social Media',  status: 'Connected',    description: 'Social networking platform',            popularity: 95 },
    { id: 51, name: 'Twitter',          category: 'Social Media',  status: 'Disconnected', description: 'Microblogging platform',                popularity: 88 },
    { id: 52, name: 'LinkedIn',         category: 'Social Media',  status: 'Connected',    description: 'Professional networking',               popularity: 91 },
    { id: 53, name: 'Instagram',        category: 'Social Media',  status: 'Disconnected', description: 'Photo and video sharing',               popularity: 93 },
    { id: 54, name: 'YouTube',          category: 'Social Media',  status: 'Disconnected', description: 'Video sharing platform',                popularity: 96 },
    { id: 55, name: 'TikTok',           category: 'Social Media',  status: 'Disconnected', description: 'Short-form video platform',             popularity: 89 },
    // AI & LLM
    { id: 56, name: 'OpenAI',           category: 'AI & LLM',      status: 'Connected',    description: 'GPT-4o, o1, and DALL·E models',         popularity: 99 },
    { id: 57, name: 'Anthropic',        category: 'AI & LLM',      status: 'Connected',    description: 'Claude 3.5 Sonnet, Haiku, Opus',        popularity: 97 },
    { id: 58, name: 'Google Gemini',    category: 'AI & LLM',      status: 'Disconnected', description: 'Gemini 1.5 Pro and Flash models',       popularity: 95 },
    { id: 59, name: 'Mistral AI',       category: 'AI & LLM',      status: 'Disconnected', description: 'Mistral Large, Mixtral 8x22B',          popularity: 88 },
    { id: 60, name: 'Cohere',           category: 'AI & LLM',      status: 'Disconnected', description: 'Command R+, Embed, Rerank models',      popularity: 82 },
    { id: 61, name: 'Meta Llama',       category: 'AI & LLM',      status: 'Disconnected', description: 'Open-source Llama 3 model family',      popularity: 85 },
    { id: 62, name: 'Azure OpenAI',     category: 'AI & LLM',      status: 'Disconnected', description: 'Enterprise OpenAI on Azure',            popularity: 90 },
    { id: 63, name: 'Groq',             category: 'AI & LLM',      status: 'Disconnected', description: 'Ultra-fast LLM inference API',          popularity: 80 },
    { id: 64, name: 'Together AI',      category: 'AI & LLM',      status: 'Disconnected', description: 'Run open-source models at scale',       popularity: 75 },
    { id: 65, name: 'Perplexity',       category: 'AI & LLM',      status: 'Disconnected', description: 'AI-powered search and reasoning',       popularity: 78 },
    // Databases
    { id: 66, name: 'PostgreSQL',       category: 'Databases',      status: 'Connected',    description: 'Advanced open-source relational DB',    popularity: 98 },
    { id: 67, name: 'MySQL',            category: 'Databases',      status: 'Disconnected', description: 'World\'s most popular open-source DB',  popularity: 94 },
    { id: 68, name: 'MongoDB',          category: 'Databases',      status: 'Connected',    description: 'Document-oriented NoSQL database',      popularity: 92 },
    { id: 69, name: 'Redis',            category: 'Databases',      status: 'Disconnected', description: 'In-memory data store and cache',        popularity: 90 },
    { id: 70, name: 'Supabase',         category: 'Databases',      status: 'Connected',    description: 'Open-source Firebase alternative',      popularity: 88 },
    { id: 71, name: 'Firebase',         category: 'Databases',      status: 'Disconnected', description: 'Google\'s real-time NoSQL database',    popularity: 87 },
    { id: 72, name: 'Snowflake',        category: 'Databases',      status: 'Disconnected', description: 'Cloud data warehouse platform',         popularity: 85 },
    { id: 73, name: 'BigQuery',         category: 'Databases',      status: 'Disconnected', description: 'Serverless multi-cloud data warehouse', popularity: 84 },
    // Vector DBs
    { id: 74, name: 'Pinecone',         category: 'Vector DBs',     status: 'Connected',    description: 'Managed vector database for AI',        popularity: 92 },
    { id: 75, name: 'Weaviate',         category: 'Vector DBs',     status: 'Disconnected', description: 'Open-source vector search engine',      popularity: 80 },
    { id: 76, name: 'Chroma',           category: 'Vector DBs',     status: 'Disconnected', description: 'AI-native open-source vector store',    popularity: 78 },
    { id: 77, name: 'Qdrant',           category: 'Vector DBs',     status: 'Disconnected', description: 'High-performance vector similarity DB', popularity: 75 },
    // Agent Frameworks
    { id: 78, name: 'LangChain',        category: 'Agent Frameworks', status: 'Connected',  description: 'Build LLM-powered agent chains',        popularity: 96 },
    { id: 79, name: 'LlamaIndex',       category: 'Agent Frameworks', status: 'Connected',  description: 'Data framework for LLM applications',   popularity: 88 },
    { id: 80, name: 'CrewAI',           category: 'Agent Frameworks', status: 'Disconnected', description: 'Multi-agent role-playing framework',  popularity: 82 },
    { id: 81, name: 'AutoGPT',          category: 'Agent Frameworks', status: 'Disconnected', description: 'Autonomous AI agent platform',        popularity: 79 },
    { id: 82, name: 'n8n',              category: 'Agent Frameworks', status: 'Disconnected', description: 'Workflow automation with AI nodes',   popularity: 85 },
    { id: 83, name: 'Zapier',           category: 'Agent Frameworks', status: 'Connected',  description: 'No-code automation and AI actions',     popularity: 93 },
    { id: 84, name: 'Make',             category: 'Agent Frameworks', status: 'Disconnected', description: 'Visual workflow automation platform', popularity: 80 },
];

const IntegrationsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') { navigate('/login'); return; }
  }, [navigate]);

  useEffect(() => { setShowAll(false); }, [selectedCategory, searchTerm]);

  const filtered = useMemo(() => {
    let result = ALL_INTEGRATIONS;
    if (selectedCategory !== 'all') {
      result = result.filter(i => i.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => b.popularity - a.popularity);
  }, [selectedCategory, searchTerm]);

  const visibleIntegrations = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const connectedIntegrations = ALL_INTEGRATIONS.filter(i => i.status === 'Connected');

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 min-w-0 flex flex-col bg-white overflow-hidden">
            <main className="flex-1 p-6">

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
                  <p className="text-gray-600">Connect your tools and automate across your stack</p>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              </div>

              {/* Tab nav */}
              <div className="flex border-b border-gray-200 mb-6">
                {([
                  { key: 'browse' as TabKey,    label: 'Browse Integrations', icon: LayoutGrid },
                  { key: 'connected' as TabKey, label: 'Connected',           icon: Link2      },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                      activeTab === key
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {key === 'connected' && (
                      <span className="text-[10px] px-1.5 py-0 rounded-full font-semibold bg-green-100 text-green-700 ml-0.5">
                        {connectedIntegrations.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── Browse tab ── */}
              {activeTab === 'browse' && (
                <div>
                  {/* Subtitle + search row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <p className="text-sm text-gray-500 flex-1">
                      Browse and connect integrations across {CATEGORIES.length - 1} categories
                    </p>
                    <div className="relative w-full sm:w-56 flex-shrink-0">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search integrations…"
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Category filter chips */}
                  <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors flex-shrink-0',
                          selectedCategory === cat.key
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800'
                        )}
                      >
                        {cat.label}
                        <span className={cn(
                          'text-[10px] px-1.5 py-0 rounded-full font-semibold',
                          selectedCategory === cat.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                        )}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Results count */}
                  {(searchTerm || selectedCategory !== 'all') && (
                    <p className="text-xs text-gray-400 mb-3">
                      {filtered.length} integration{filtered.length !== 1 ? 's' : ''} found
                      {searchTerm && <> for "<span className="text-gray-600 font-medium">{searchTerm}</span>"</>}
                    </p>
                  )}

                  {/* Integration grid */}
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Search className="h-10 w-10 text-gray-200 mb-3" />
                      <p className="text-sm font-medium text-gray-500">No integrations match your search</p>
                      <button
                        onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                        className="text-xs text-green-600 hover:text-green-700 mt-2"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {visibleIntegrations.map((integration) => {
                          const isConnected = integration.status === 'Connected';
                          const logo = logos[integration.name] ?? getFallbackLogo(integration.name, integration.category);
                          const meta = categoryMeta[integration.category];
                          return (
                            <div
                              key={integration.id}
                              className="group bg-white border border-gray-200/70 rounded-xl p-4 hover:shadow-md hover:border-green-200 transition-all duration-200 cursor-pointer flex flex-col gap-3"
                            >
                              {/* Icon + name + category */}
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-10 h-10 bg-[#141413]/6 border border-[#c8c6be] flex items-center justify-center flex-shrink-0 group-hover:bg-[#141413]/10 transition-colors"
                                  style={{ borderRadius: '9px' }}
                                >
                                  {logo}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-2 flex-wrap">
                                    <h3 className="text-sm font-medium text-gray-900 leading-tight">{integration.name}</h3>
                                    <Badge className={`text-[10px] px-1.5 py-0 font-normal border-0 flex-shrink-0 ${meta?.bg ?? 'bg-gray-100'} ${meta?.color ?? 'text-gray-600'}`}>
                                      {meta?.label ?? integration.category}
                                    </Badge>
                                  </div>
                                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{integration.description}</p>
                                </div>
                              </div>

                              {/* Status line */}
                              <div className="flex items-center gap-1.5">
                                <Zap className="h-3 w-3 text-gray-300 flex-shrink-0" />
                                <span className="text-[10px] text-gray-400 truncate">
                                  {isConnected ? 'Active — connected to your workspace' : 'Available to connect'}
                                </span>
                              </div>

                              {/* Footer */}
                              <div className="flex items-center justify-between gap-2 mt-auto">
                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                                  {isConnected && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium border bg-green-50 text-green-700 border-green-200">
                                      Connected
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 flex-shrink-0">
                                  {isConnected ? 'Configure' : 'Connect'} <ChevronRight className="h-3 w-3" />
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Load more / Show less */}
                      {filtered.length > INITIAL_VISIBLE && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={() => setShowAll(v => !v)}
                            className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                          >
                            {showAll ? 'Show less' : `Show all ${filtered.length} integrations`}
                            <ChevronRight className={cn('h-4 w-4 transition-transform', showAll && 'rotate-90')} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── Connected tab ── */}
              {activeTab === 'connected' && (
                connectedIntegrations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Link2 className="h-10 w-10 text-gray-200 mb-3" />
                    <p className="text-sm font-medium text-gray-500">No integrations connected yet</p>
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="text-xs text-green-600 hover:text-green-700 mt-2"
                    >
                      Browse integrations
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {connectedIntegrations.map((integration) => {
                      const logo = logos[integration.name] ?? getFallbackLogo(integration.name, integration.category);
                      return (
                        <Card key={integration.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-10 h-10 bg-[#141413]/6 border border-[#c8c6be] flex items-center justify-center flex-shrink-0"
                                  style={{ borderRadius: '9px' }}
                                >
                                  {logo}
                                </div>
                                <span className="font-medium">{integration.name}</span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="hover:bg-gray-100 h-8 w-8">
                                    <MoreVertical className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Settings className="h-4 w-4 text-gray-500" />
                                    Configure
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                    Disconnect
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <p className="text-xs text-gray-600">{integration.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="default" className="bg-green-500">Connected</Badge>
                                <span className="text-[10px] text-gray-500">{integration.category}</span>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200">
                                  <Settings className="h-3 w-3 mr-1" />
                                  Configure
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50">
                                  Disconnect
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )
              )}

            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default IntegrationsPage;
