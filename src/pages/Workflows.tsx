
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  // Layout
  Workflow, Plus, Activity, Clock, Settings, Play, Pause,
  LayoutTemplate, MoreVertical, ChevronRight,
  // People
  UserPlus, UserMinus, Users, Bot,
  // Files
  FileText, FileCheck, FolderOpen,
  // Charts / analytics
  TrendingUp, BarChart2, Target, Award,
  // Actions
  CheckSquare, CheckCircle2, Circle, Trash2,
  // Communication
  Phone, Mail, MessageSquare, Globe, Send, Star, ThumbsUp,
  // Calendar / time
  Calendar, CalendarCheck, CalendarPlus, Sun, Bell,
  // Finance
  CreditCard, DollarSign,
  // Search / intel
  Search, Eye, History,
  // Tech / system
  Video, Shield, Database, RefreshCw, Archive, Zap,
  // Misc
  MapPin, AlertTriangle, GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type TabKey = 'templates' | 'my-workflows';
type CategoryKey = 'all' | 'communication' | 'search' | 'orchestration' | 'reporting' | 'automation';

/* ─── Agent display data ──────────────────────────────────────────── */
const AGENTS = [
  { id: 'aria',  name: 'Aria',  role: 'Customer Support',  avatar: 'AR' },
  { id: 'atlas', name: 'Atlas', role: 'Data Analysis',     avatar: 'AT' },
  { id: 'felix', name: 'Felix', role: 'Engineering',       avatar: 'FX' },
  { id: 'maya',  name: 'Maya',  role: 'Marketing',         avatar: 'MY' },
  { id: 'nova',  name: 'Nova',  role: 'Sales',             avatar: 'NV' },
  { id: 'emma',  name: 'Emma',  role: 'HR',                avatar: 'EM' },
  { id: 'sage',  name: 'Sage',  role: 'Finance',           avatar: 'SG' },
];

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-pink-100 text-pink-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
];

const NEUTRAL_TAG = 'bg-[color:var(--sand)] text-[color:var(--text-3)] border-[color:var(--line-soft)]';

const AGENT_TAG_COLORS: Record<string, string> = {
  'Secretary':  NEUTRAL_TAG,
  'Support':    NEUTRAL_TAG,
  'Sales SDR':  NEUTRAL_TAG,
  'Sales':      NEUTRAL_TAG,
  'Executive':  NEUTRAL_TAG,
  'Project':    NEUTRAL_TAG,
  'All Agents': NEUTRAL_TAG,
};

/* ─── Category definitions ────────────────────────────────────────── */
const CATEGORIES: Array<{ key: CategoryKey; label: string; count: number }> = [
  { key: 'all',           label: 'All Templates',           count: 50 },
  { key: 'communication', label: 'Customer Communication',  count: 12 },
  { key: 'search',        label: 'Internal Search',         count: 10 },
  { key: 'orchestration', label: 'Business Processes',      count: 16 },
  { key: 'reporting',     label: 'Reporting & Analytics',   count:  6 },
  { key: 'automation',    label: 'System Automation',       count:  6 },
];

/* ─── Template type ───────────────────────────────────────────────── */
interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  trigger: string;
  category: CategoryKey;
  categoryLabel: string;
  categoryColor: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  nodes: number;
  agents: string[];
}

/* ─── All 50 Pincer templates ─────────────────────────────────────── */
const ALL_TEMPLATES: TemplateConfig[] = [
  // ══ CATEGORY 1: Customer Communication (12) ══════════════════════
  {
    id: 'missed-call-whatsapp',
    name: 'Missed Call → WhatsApp Follow-up',
    description: 'Detect missed call → look up caller in CRM → send WhatsApp message → create ticket if they reply → route to support',
    trigger: 'Inbound call not answered',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: Phone, iconBg: 'from-sky-100 to-cyan-100', iconColor: 'text-sky-600',
    nodes: 5, agents: ['Support', 'Secretary'],
  },
  {
    id: 'email-auto-draft',
    name: 'Email Auto-Draft Reply',
    description: 'Read email → classify intent → search past threads → draft reply in sender\'s language → send on approval → log in CRM',
    trigger: 'New unread email matching filter',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: Mail, iconBg: 'from-blue-100 to-sky-100', iconColor: 'text-blue-600',
    nodes: 6, agents: ['Secretary', 'Support'],
  },
  {
    id: 'customer-inquiry-crm',
    name: 'Inquiry → CRM Ticket → Slack Alert',
    description: 'Check CRM for contact → create if new → classify inquiry → create ticket → post to #support Slack → draft response',
    trigger: 'Inbound WhatsApp from unknown number',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: MessageSquare, iconBg: 'from-sky-100 to-indigo-100', iconColor: 'text-indigo-600',
    nodes: 6, agents: ['Support'],
  },
  {
    id: 'meeting-followup-email',
    name: 'Meeting Follow-up Email',
    description: 'Get meeting details → search context → draft follow-up with action items → present for approval → send → log in CRM',
    trigger: 'Calendar event ends',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: CalendarCheck, iconBg: 'from-blue-100 to-sky-100', iconColor: 'text-blue-600',
    nodes: 5, agents: ['Secretary', 'Sales', 'Executive'],
  },
  {
    id: 'cold-outreach-sequence',
    name: 'Cold Outreach Sequence (3-touch)',
    description: 'Research company → draft personalized emails → 3-step sequence over 7 days → §7 UWG compliance check → log in CRM',
    trigger: '"Start sequence for [company]"',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: Send, iconBg: 'from-blue-100 to-indigo-100', iconColor: 'text-indigo-600',
    nodes: 9, agents: ['Sales SDR'],
  },
  {
    id: 'reply-classification-routing',
    name: 'Reply Classification & Routing',
    description: 'Read reply → classify intent (interested / not now / wrong person / unsubscribe / OOO) → route accordingly → log in CRM',
    trigger: 'New reply to outbound sequence',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: GitBranch, iconBg: 'from-indigo-100 to-purple-100', iconColor: 'text-purple-600',
    nodes: 5, agents: ['Sales SDR'],
  },
  {
    id: 'customer-review-response',
    name: 'Customer Review Response',
    description: 'Search Google/Trustpilot for new reviews → classify sentiment → draft response in brand voice → present for approval',
    trigger: 'Scheduled daily or on demand',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: Star, iconBg: 'from-yellow-100 to-amber-100', iconColor: 'text-amber-600',
    nodes: 4, agents: ['Support', 'Secretary'],
  },
  {
    id: 'multilingual-support-handoff',
    name: 'Multilingual Support Handoff',
    description: 'Detect message language → translate to German for internal log → draft response in customer\'s language → escalate if complex',
    trigger: 'Inbound message in non-German language',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: Globe, iconBg: 'from-teal-100 to-cyan-100', iconColor: 'text-teal-600',
    nodes: 4, agents: ['Support'],
  },
  {
    id: 'csat-survey-after-resolution',
    name: 'CSAT Survey After Resolution',
    description: 'Wait 24h after ticket resolved → send WhatsApp star-rating survey → log score → reopen ticket + escalate if ≤2 stars',
    trigger: 'Support ticket marked resolved',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: ThumbsUp, iconBg: 'from-green-100 to-teal-100', iconColor: 'text-green-600',
    nodes: 5, agents: ['Support'],
  },
  {
    id: 'invoice-dispute-handling',
    name: 'Invoice Dispute Handling',
    description: 'Detect "Rechnung" + negative sentiment → look up related invoices → create high-priority ticket → notify finance → draft acknowledgment',
    trigger: 'Customer mentions invoice + negative tone',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: AlertTriangle, iconBg: 'from-red-100 to-orange-100', iconColor: 'text-red-600',
    nodes: 6, agents: ['Support'],
  },
  {
    id: 'whatsapp-appointment-booking',
    name: 'WhatsApp Appointment Booking',
    description: 'Ask for preferred time → check calendar availability → propose 3 slots → customer picks → create event → send confirmation',
    trigger: 'Customer texts "Termin" on WhatsApp',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: Calendar, iconBg: 'from-sky-100 to-blue-100', iconColor: 'text-sky-600',
    nodes: 6, agents: ['Secretary', 'Support'],
  },
  {
    id: 'phone-appointment-rescheduling',
    name: 'Phone Appointment Rescheduling',
    description: 'Look up contact → place outbound call → navigate IVR → request reschedule → confirm new time → update calendar → report back',
    trigger: '"Call and reschedule my appointment"',
    category: 'communication', categoryLabel: 'Communication', categoryColor: 'bg-sky-100 text-sky-700',
    icon: Phone, iconBg: 'from-violet-100 to-purple-100', iconColor: 'text-violet-600',
    nodes: 5, agents: ['Secretary', 'Executive'],
  },

  // ══ CATEGORY 2: Internal Search (10) ═════════════════════════════
  {
    id: 'universal-company-search',
    name: 'Universal Company Search',
    description: 'Search CRM (contacts, deals, tickets) + email threads + files + memory → compile structured company brief',
    trigger: '"What do we have on [Company]?"',
    category: 'search', categoryLabel: 'Internal Search', categoryColor: 'bg-violet-100 text-violet-700',
    icon: Search, iconBg: 'from-violet-100 to-purple-100', iconColor: 'text-violet-600',
    nodes: 5, agents: ['All Agents'],
  },
  {
    id: 'meeting-prep-brief',
    name: 'Meeting Prep Brief',
    description: 'Get meeting attendees → look up each in CRM → search recent email threads → search web for company news → compile 1-page brief',
    trigger: '1 hour before external meeting',
    category: 'search', categoryLabel: 'Internal Search', categoryColor: 'bg-violet-100 text-violet-700',
    icon: FileText, iconBg: 'from-indigo-100 to-violet-100', iconColor: 'text-indigo-600',
    nodes: 5, agents: ['Secretary', 'Sales', 'Executive'],
  },
  {
    id: 'contract-document-finder',
    name: 'Contract / Document Finder',
    description: 'Search OneDrive/Drive by company → search email attachments → search Slack file shares → return best matches with links',
    trigger: '"Where is the contract with [Company]?"',
    category: 'search', categoryLabel: 'Internal Search', categoryColor: 'bg-violet-100 text-violet-700',
    icon: FolderOpen, iconBg: 'from-amber-100 to-yellow-100', iconColor: 'text-amber-600',
    nodes: 4, agents: ['All Agents'],
  },
  {
    id: 'pipeline-status-query',
    name: 'Pipeline Status Query',
    description: 'Query CRM: deals by stage → calculate totals → compare to target → identify stale deals and top closers → format summary',
    trigger: '"How does the pipeline look?" or weekly',
    category: 'search', categoryLabel: 'Internal Search', categoryColor: 'bg-violet-100 text-violet-700',
    icon: TrendingUp, iconBg: 'from-blue-100 to-indigo-100', iconColor: 'text-blue-600',
    nodes: 5, agents: ['Sales', 'Executive'],
  },
  {
    id: 'team-activity-summary',
    name: 'Team Activity Summary',
    description: 'Query CRM: activities per rep → emails sent, calls made, meetings held, deals moved → compile per-rep summary → post or send',
    trigger: '"What did the sales team do this week?"',
    category: 'search', categoryLabel: 'Internal Search', categoryColor: 'bg-violet-100 text-violet-700',
    icon: Users, iconBg: 'from-purple-100 to-violet-100', iconColor: 'text-purple-600',
    nodes: 4, agents: ['Executive'],
  },
  {
    id: 'support-ticket-analytics',
    name: 'Support Ticket Analytics',
    description: 'Query tickets: opened, resolved, escalated, avg response time → identify top issues → calculate CSAT → compare to last week',
    trigger: '"How was support this week?" or Monday 9am',
    category: 'search', categoryLabel: 'Internal Search', categoryColor: 'bg-violet-100 text-violet-700',
    icon: BarChart2, iconBg: 'from-teal-100 to-cyan-100', iconColor: 'text-teal-600',
    nodes: 5, agents: ['Support', 'Executive'],
  },
  {
    id: 'employee-info-lookup',
    name: 'Employee Information Lookup',
    description: 'Search HR email threads → search memory for HR decisions → respond with best available info + suggest checking HR system',
    trigger: '"How many vacation days does [Name] have?"',
    category: 'search', categoryLabel: 'Internal Search', categoryColor: 'bg-violet-100 text-violet-700',
    icon: UserPlus, iconBg: 'from-orange-100 to-amber-100', iconColor: 'text-orange-600',
    nodes: 3, agents: ['Secretary'],
  },
  {
    id: 'competitive-intelligence',
    name: 'Competitive Intelligence',
    description: 'Web search for competitor news → browse their website for updates → search CRM for lost deals to this competitor → compile brief',
    trigger: '"What is [Competitor] doing right now?"',
    category: 'search', categoryLabel: 'Internal Search', categoryColor: 'bg-violet-100 text-violet-700',
    icon: Eye, iconBg: 'from-rose-100 to-pink-100', iconColor: 'text-rose-600',
    nodes: 5, agents: ['Sales', 'Executive'],
  },
  {
    id: 'historical-decision-recall',
    name: 'Historical Decision Recall',
    description: 'Search memory + email threads + Slack messages + meeting notes for topic in date range → compile decision timeline',
    trigger: '"What did we decide about [topic] in October?"',
    category: 'search', categoryLabel: 'Internal Search', categoryColor: 'bg-violet-100 text-violet-700',
    icon: History, iconBg: 'from-slate-100 to-gray-100', iconColor: 'text-slate-600',
    nodes: 5, agents: ['All Agents'],
  },
  {
    id: 'financial-quick-look',
    name: 'Financial Quick Look',
    description: 'Search email for financial reports → query CRM for outstanding invoices → query pipeline for expected revenue → compile snapshot',
    trigger: '"How are we doing financially?"',
    category: 'search', categoryLabel: 'Internal Search', categoryColor: 'bg-violet-100 text-violet-700',
    icon: DollarSign, iconBg: 'from-green-100 to-emerald-100', iconColor: 'text-green-600',
    nodes: 4, agents: ['Executive'],
  },

  // ══ CATEGORY 3: Business Processes (16) ══════════════════════════
  {
    id: 'morning-briefing',
    name: 'Morning Briefing',
    description: 'Get weather + today\'s calendar + top 3 urgent emails + overdue tasks + pipeline summary + support count → send WhatsApp',
    trigger: 'Cron: 7:00 am daily',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: Sun, iconBg: 'from-yellow-100 to-amber-100', iconColor: 'text-yellow-600',
    nodes: 7, agents: ['Secretary', 'Executive'],
  },
  {
    id: 'receipt-expense-entry',
    name: 'Receipt → Expense Entry',
    description: 'OCR photo → extract amount, vendor, date, category → create expense entry → file image → confirm via WhatsApp',
    trigger: 'Photo received on WhatsApp',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: CreditCard, iconBg: 'from-emerald-100 to-green-100', iconColor: 'text-emerald-600',
    nodes: 5, agents: ['Secretary', 'Executive'],
  },
  {
    id: 'multi-person-meeting-scheduler',
    name: 'Multi-Person Meeting Scheduler',
    description: 'Parse attendees → look up emails in CRM → check free/busy for all → find mutual slots → create event + invites + Zoom link',
    trigger: '"Find a time with Thomas, Lisa and Anna"',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: CalendarPlus, iconBg: 'from-blue-100 to-cyan-100', iconColor: 'text-blue-600',
    nodes: 6, agents: ['Secretary', 'Project'],
  },
  {
    id: 'weekly-pipeline-digest',
    name: 'Weekly Pipeline Digest',
    description: 'Query deals moved this week → new deals added → deals closed (won/lost) → compare to target → send to WhatsApp + #sales Slack',
    trigger: 'Cron: Friday 17:00',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: BarChart2, iconBg: 'from-indigo-100 to-blue-100', iconColor: 'text-indigo-600',
    nodes: 5, agents: ['Sales', 'Executive'],
  },
  {
    id: 'automated-followup-reminder',
    name: 'Automated Follow-up Reminder',
    description: 'Set reminder → on trigger date: search inbox for reply → if no reply: draft follow-up email → send on approval → update CRM',
    trigger: '"Remind me if [contact] doesn\'t reply by [date]"',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: Bell, iconBg: 'from-orange-100 to-amber-100', iconColor: 'text-orange-600',
    nodes: 5, agents: ['Sales', 'Secretary'],
  },
  {
    id: 'new-lead-crm-research',
    name: 'New Lead → CRM + Research + First Touch',
    description: 'Create CRM contact + company → web search → browse website → draft personalized first email → send on approval → log activity',
    trigger: '"New lead: [Name], [Title], [Company]"',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: UserPlus, iconBg: 'from-blue-100 to-indigo-100', iconColor: 'text-blue-600',
    nodes: 7, agents: ['Sales SDR'],
  },
  {
    id: 'invoice-forwarding-steuerberater',
    name: 'Invoice Forwarding to Steuerberater',
    description: 'Search email for receipts/invoices last 7 days → collect attachments → bundle into single email → send to Steuerberater',
    trigger: '"Send all receipts this week to the accountant"',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: Send, iconBg: 'from-green-100 to-teal-100', iconColor: 'text-green-600',
    nodes: 5, agents: ['Secretary'],
  },
  {
    id: 'standup-digest-slack',
    name: 'Standup Digest (Slack)',
    description: 'Summarize yesterday\'s project Slack messages → extract action items → check task status → compile digest → post to channel',
    trigger: 'Cron: 9:00 am daily on workdays',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: MessageSquare, iconBg: 'from-purple-100 to-violet-100', iconColor: 'text-purple-600',
    nodes: 5, agents: ['Project'],
  },
  {
    id: 'deal-stage-change-notification',
    name: 'Deal Stage Change → Notification Chain',
    description: 'Detect deal stage change → notify GF on WhatsApp → post to #sales Slack → if Closed Won: create celebration + onboarding task',
    trigger: 'Deal moved to new stage (CRM poll)',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: TrendingUp, iconBg: 'from-green-100 to-emerald-100', iconColor: 'text-green-600',
    nodes: 5, agents: ['Sales', 'Executive'],
  },
  {
    id: 'german-business-letter',
    name: 'German Business Letter Generator',
    description: 'Get company + contact from CRM → load template from OneDrive → fill in details → generate document → review → send as attachment',
    trigger: '"Write an offer / reminder / order confirmation for [Company]"',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: FileText, iconBg: 'from-amber-100 to-yellow-100', iconColor: 'text-amber-600',
    nodes: 6, agents: ['Secretary'],
  },
  {
    id: 'zoom-meeting-action-items',
    name: 'Zoom Meeting → Action Items → Tasks',
    description: 'Get transcript → summarize key decisions + action items → create task per person → post summary to Slack → email participants',
    trigger: 'Zoom meeting recording becomes available',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: Video, iconBg: 'from-blue-100 to-cyan-100', iconColor: 'text-blue-600',
    nodes: 6, agents: ['Project', 'Executive'],
  },
  {
    id: 'overdue-task-escalation',
    name: 'Overdue Task Escalation',
    description: 'Check tasks overdue >24h → DM each owner on Slack → if >72h: escalate to manager → weekly overdue report to GF',
    trigger: 'Cron: daily 10:00 am',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: AlertTriangle, iconBg: 'from-red-100 to-orange-100', iconColor: 'text-orange-600',
    nodes: 5, agents: ['Project', 'Executive'],
  },
  {
    id: 'travel-prep-package',
    name: 'Travel Prep Package',
    description: 'Get meeting details → research company → get attendee bios → check weather at destination → compile travel brief → send to WhatsApp',
    trigger: '"I\'m traveling to [City] tomorrow for [Company]"',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: MapPin, iconBg: 'from-sky-100 to-blue-100', iconColor: 'text-sky-600',
    nodes: 6, agents: ['Secretary', 'Executive'],
  },
  {
    id: 'e-rechnung-validation',
    name: 'E-Rechnung Validation',
    description: 'Download .xml/ZUGFeRD attachment → parse XRechnung → validate structure → extract sender, amount, tax → flag if invalid',
    trigger: 'Inbound email with .xml or ZUGFeRD attachment',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: FileCheck, iconBg: 'from-teal-100 to-emerald-100', iconColor: 'text-teal-600',
    nodes: 7, agents: ['Secretary'],
  },
  {
    id: 'crm-data-cleanup',
    name: 'CRM Data Cleanup',
    description: 'Find duplicate contacts → find stale contacts (>6 months inactive) → propose merges → merge on approval → enrich from web',
    trigger: 'Scheduled weekly or "Clean up duplicates"',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: Database, iconBg: 'from-slate-100 to-gray-100', iconColor: 'text-slate-600',
    nodes: 6, agents: ['Sales SDR'],
  },
  {
    id: 'new-employee-welcome',
    name: 'New Employee Welcome Package',
    description: 'Create HR entry → build task list (laptop, access, buddy) → schedule onboarding meetings → send welcome email → notify team on Slack',
    trigger: '"New employee: [Name], starting [Date]"',
    category: 'orchestration', categoryLabel: 'Business Processes', categoryColor: 'bg-emerald-100 text-emerald-700',
    icon: UserMinus, iconBg: 'from-green-100 to-teal-100', iconColor: 'text-green-600',
    nodes: 7, agents: ['Secretary', 'Project'],
  },

  // ══ CATEGORY 4: Reporting & Analytics (6) ════════════════════════
  {
    id: 'weekly-executive-dashboard',
    name: 'Weekly Executive Dashboard',
    description: 'Pull pipeline value + deals closed + new leads + support CSAT + project status + team activity → dashboard to WhatsApp + email',
    trigger: 'Cron: Monday 7:00 am',
    category: 'reporting', categoryLabel: 'Reporting', categoryColor: 'bg-amber-100 text-amber-700',
    icon: LayoutTemplate, iconBg: 'from-amber-100 to-yellow-100', iconColor: 'text-amber-600',
    nodes: 7, agents: ['Executive'],
  },
  {
    id: 'sales-rep-performance-report',
    name: 'Sales Rep Performance Report',
    description: 'For each rep: emails sent, calls logged, meetings held, deals moved → rank by activity + results → draft and send to Head of Sales',
    trigger: 'Cron: Friday 16:00 or on demand',
    category: 'reporting', categoryLabel: 'Reporting', categoryColor: 'bg-amber-100 text-amber-700',
    icon: Award, iconBg: 'from-blue-100 to-indigo-100', iconColor: 'text-blue-600',
    nodes: 6, agents: ['Sales', 'Executive'],
  },
  {
    id: 'support-volume-report',
    name: 'Support Volume Report',
    description: 'Query tickets by: category, priority, resolution time, CSAT → identify trends → compare to last period → format and send report',
    trigger: 'Monthly or on demand',
    category: 'reporting', categoryLabel: 'Reporting', categoryColor: 'bg-amber-100 text-amber-700',
    icon: BarChart2, iconBg: 'from-teal-100 to-cyan-100', iconColor: 'text-teal-600',
    nodes: 5, agents: ['Support', 'Executive'],
  },
  {
    id: 'deal-win-loss-analysis',
    name: 'Deal Win/Loss Analysis',
    description: 'Query closed-lost deals → analyze common loss reasons, pipeline death stages, time in pipeline → compile actionable insights',
    trigger: '"Why did we lose deals?" or quarterly',
    category: 'reporting', categoryLabel: 'Reporting', categoryColor: 'bg-amber-100 text-amber-700',
    icon: Target, iconBg: 'from-red-100 to-rose-100', iconColor: 'text-rose-600',
    nodes: 5, agents: ['Sales', 'Executive'],
  },
  {
    id: 'email-productivity-report',
    name: 'Email Productivity Report',
    description: 'Count emails sent/received/replied → avg response time → identify unanswered threads → highlight high-volume senders',
    trigger: 'Weekly or on demand',
    category: 'reporting', categoryLabel: 'Reporting', categoryColor: 'bg-amber-100 text-amber-700',
    icon: Mail, iconBg: 'from-indigo-100 to-blue-100', iconColor: 'text-indigo-600',
    nodes: 4, agents: ['Secretary', 'Executive'],
  },
  {
    id: 'meeting-load-analysis',
    name: 'Meeting Load Analysis',
    description: 'Count meetings by: internal vs external, duration, recurring vs one-off → calculate total hours → compare to target → suggest optimization',
    trigger: '"How many meetings did I have this week?"',
    category: 'reporting', categoryLabel: 'Reporting', categoryColor: 'bg-amber-100 text-amber-700',
    icon: Calendar, iconBg: 'from-purple-100 to-violet-100', iconColor: 'text-purple-600',
    nodes: 4, agents: ['Executive', 'Secretary'],
  },

  // ══ CATEGORY 5: System Automation (6) ════════════════════════════
  {
    id: 'slack-channel-archival',
    name: 'Slack Channel Archival',
    description: 'List all channels → identify inactive (30+ days) → compile list → present for approval → archive → notify members',
    trigger: '"Archive inactive Slack channels"',
    category: 'automation', categoryLabel: 'Automation', categoryColor: 'bg-rose-100 text-rose-700',
    icon: Archive, iconBg: 'from-purple-100 to-indigo-100', iconColor: 'text-purple-600',
    nodes: 5, agents: ['Project', 'Executive'],
  },
  {
    id: 'file-organization',
    name: 'File Organization',
    description: 'List files in folder → classify by type/date/project → create folders by category → move files → report what was organized',
    trigger: '"Clean up the Downloads folder" or weekly',
    category: 'automation', categoryLabel: 'Automation', categoryColor: 'bg-rose-100 text-rose-700',
    icon: FolderOpen, iconBg: 'from-amber-100 to-orange-100', iconColor: 'text-amber-600',
    nodes: 5, agents: ['Secretary'],
  },
  {
    id: 'security-audit-report',
    name: 'Security Audit + Report',
    description: 'Run pincer doctor → check CRM access permissions → review Slack channel policies → compile security report → email IT lead',
    trigger: 'Scheduled monthly or on demand',
    category: 'automation', categoryLabel: 'Automation', categoryColor: 'bg-rose-100 text-rose-700',
    icon: Shield, iconBg: 'from-red-100 to-rose-100', iconColor: 'text-red-600',
    nodes: 5, agents: ['Executive'],
  },
  {
    id: 'contact-enrichment-pipeline',
    name: 'Contact Enrichment Pipeline',
    description: 'Get company contacts from CRM → web search for current role/company per contact → update CRM → flag contacts who\'ve left',
    trigger: '"Update all contacts at [Company]" or monthly',
    category: 'automation', categoryLabel: 'Automation', categoryColor: 'bg-rose-100 text-rose-700',
    icon: RefreshCw, iconBg: 'from-blue-100 to-cyan-100', iconColor: 'text-blue-600',
    nodes: 5, agents: ['Sales SDR'],
  },
  {
    id: 'zoom-recording-meeting-notes',
    name: 'Zoom Recording → Meeting Notes → Team Update',
    description: 'Download transcript → structured notes (decisions, action items, open questions) → create doc → share with attendees → post to Slack',
    trigger: 'New Zoom recording available',
    category: 'automation', categoryLabel: 'Automation', categoryColor: 'bg-rose-100 text-rose-700',
    icon: Video, iconBg: 'from-indigo-100 to-blue-100', iconColor: 'text-indigo-600',
    nodes: 6, agents: ['Project', 'Executive'],
  },
  {
    id: 'end-of-day-wrapup',
    name: 'End-of-Day Wrap-up',
    description: 'Summarize today: emails, meetings, tasks, deals moved → list open items for tomorrow → draft priority list → send WhatsApp summary',
    trigger: 'Cron: 18:00 daily or "Feierabend"',
    category: 'automation', categoryLabel: 'Automation', categoryColor: 'bg-rose-100 text-rose-700',
    icon: CheckCircle2, iconBg: 'from-green-100 to-teal-100', iconColor: 'text-green-600',
    nodes: 6, agents: ['Secretary', 'Executive'],
  },
];

/* ─── Assign-to-Agent modal ───────────────────────────────────────── */
interface AssignAgentModalProps {
  workflowName: string;
  open: boolean;
  onClose: () => void;
  onAssign: (mode: 'all' | 'specific', agentId: string | null) => void;
}

function AssignAgentModal({ workflowName, open, onClose, onAssign }: AssignAgentModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'all' | 'specific'>('specific');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleAssign() {
    onAssign(mode, selectedId);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setSelectedId(null);
      setMode('specific');
      onClose();
    }, 1200);
  }

  const canConfirm = mode === 'all' || (mode === 'specific' && selectedId !== null);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--line-soft)' }}>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Bot className="h-4 w-4" style={{ color: 'var(--text-4)' }} />
            {t('workflows.assignToAgent')}
          </DialogTitle>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>
            {t('workflows.workflowLabel')} <span className="font-medium" style={{ color: 'var(--text-2)' }}>{workflowName}</span>
          </p>
        </DialogHeader>

        <div className="px-6 py-4 flex gap-2">
          <button
            onClick={() => { setMode('all'); setSelectedId(null); }}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-[12px] border text-sm font-medium transition-colors',
              mode === 'all'
                ? 'border-[color:var(--ink)] bg-[rgba(20,22,26,0.06)] text-[color:var(--ink)]'
                : 'border-[color:var(--line)] text-[color:var(--text-4)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]'
            )}
          >
            <Users className="h-4 w-4" />
            {t('workflows.assignToAll')}
          </button>
          <button
            onClick={() => setMode('specific')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-[12px] border text-sm font-medium transition-colors',
              mode === 'specific'
                ? 'border-[color:var(--ink)] bg-[rgba(20,22,26,0.06)] text-[color:var(--ink)]'
                : 'border-[color:var(--line)] text-[color:var(--text-4)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]'
            )}
          >
            <Bot className="h-4 w-4" />
            {t('workflows.specificAgent')}
          </button>
        </div>

        <div className="px-6 pb-2 max-h-[280px] overflow-y-auto space-y-1.5">
          {AGENTS.map((agent, i) => {
            const isSelected = selectedId === agent.id;
            const disabled = mode === 'all';
            return (
              <button
                key={agent.id}
                disabled={disabled}
                onClick={() => setSelectedId(agent.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] border text-left transition-colors',
                  disabled
                    ? 'border-[color:var(--line-soft)] bg-[color:var(--sand)] opacity-50 cursor-default'
                    : isSelected
                    ? 'border-[color:var(--ink)] bg-[rgba(20,22,26,0.06)]'
                    : 'border-[color:var(--line)] hover:border-[color:var(--ink)] hover:bg-[rgba(20,22,26,0.02)] cursor-pointer'
                )}
              >
                <span className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0', AVATAR_COLORS[i])}>
                  {agent.avatar}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none" style={{ color: 'var(--ink)' }}>{agent.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{agent.role}</p>
                </div>
                {!disabled && (
                  isSelected
                    ? <CheckCircle2 className="h-4 w-4 text-[color:var(--ink)] flex-shrink-0" />
                    : <Circle className="h-4 w-4 text-[color:var(--text-5)] flex-shrink-0" />
                )}
                {disabled && mode === 'all' && (
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--text-5)] flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <DialogFooter className="px-6 py-4 border-t flex gap-2" style={{ borderColor: 'var(--line-soft)' }}>
          <Button variant="outline" size="sm" className="plat-btn-ghost flex-1 !justify-center !border-[color:var(--line)]" onClick={onClose} disabled={done}>
            {t('common.cancel')}
          </Button>
          <Button
            size="sm"
            className={cn(
              'plat-btn flex-1 !justify-center transition-all',
              done && '!bg-[color:var(--ok-fg)]'
            )}
            disabled={!canConfirm || done}
            onClick={handleAssign}
          >
            {done ? (
              <><CheckCircle2 className="h-4 w-4 mr-1.5" /> {t('common.assigned')}</>
            ) : mode === 'all' ? (
              t('workflows.assignToAllAgents')
            ) : (
              t('workflows.confirmAssignment')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */
const Workflows = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('templates');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [assignTarget, setAssignTarget] = useState<{ id: number; name: string } | null>(null);
  const [assignments, setAssignments] = useState<Record<number, { mode: 'all' | 'specific'; agentId: string | null } | null>>({});

  function handleAssign(mode: 'all' | 'specific', agentId: string | null) {
    if (!assignTarget) return;
    setAssignments(prev => ({ ...prev, [assignTarget.id]: { mode, agentId } }));
  }

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated');
    if (isAuth !== 'true') navigate('/login');
  }, [navigate]);

  // Reset showAll when filters change
  useEffect(() => { setShowAll(false); }, [activeCategory, searchQuery]);

  const filteredTemplates = useMemo(() => {
    let result = ALL_TEMPLATES;
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.agents.some(a => a.toLowerCase().includes(q)) ||
        t.trigger.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  const INITIAL_VISIBLE = 9;
  const visibleTemplates = showAll ? filteredTemplates : filteredTemplates.slice(0, INITIAL_VISIBLE);

  const workflows = [
    { id: 1, name: t('workflows.workflow1Name'), description: t('workflows.workflow1Desc'), status: 'Active', executions: 245, successRate: '98%', iconColor: 'text-blue-600', bgColor: 'from-blue-100 to-cyan-100' },
    { id: 2, name: t('workflows.workflow2Name'), description: t('workflows.workflow2Desc'), status: 'Active', executions: 189, successRate: '95%', iconColor: 'text-green-600', bgColor: 'from-green-100 to-emerald-100' },
    { id: 3, name: t('workflows.workflow3Name'), description: t('workflows.workflow3Desc'), status: 'Paused', executions: 76, successRate: '92%', iconColor: 'text-purple-600', bgColor: 'from-purple-100 to-violet-100' },
    { id: 4, name: t('workflows.workflow4Name'), description: t('workflows.workflow4Desc'), status: 'Active', executions: 134, successRate: '97%', iconColor: 'text-orange-600', bgColor: 'from-orange-100 to-red-100' },
  ];

  return (
    <div className="plat min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-6 overflow-y-auto">

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="plat-crumb">3days.workflows</p>
                  <h1 className="text-2xl mt-1">{t('workflows.pageTitle')}</h1>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>{t('workflows.pageSubtitle')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/workflows/create')}
                  className="plat-btn !h-9 !px-4 !text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t('workflows.createWorkflow')}
                </button>
              </div>

              {/* Tab nav */}
              <div className="flex items-center gap-1.5 border-b pb-3 mb-6" style={{ borderColor: 'var(--line-soft)' }}>
                {([
                  { key: 'templates' as TabKey,    label: t('workflows.tabTemplates'),    icon: LayoutTemplate },
                  { key: 'my-workflows' as TabKey, label: t('workflows.tabMyWorkflows'), icon: Workflow },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      'flex h-8 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition-colors',
                      activeTab === key
                        ? 'border-transparent bg-[color:var(--ink)] text-white'
                        : 'border-[color:var(--line)] text-[color:var(--text-2)] hover:bg-[rgba(20,22,26,0.04)] hover:text-[color:var(--ink)]'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Templates tab ── */}
              {activeTab === 'templates' && (
                <div>
                  {/* Subtitle + search row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <p className="text-sm flex-1" style={{ color: 'var(--text-4)' }}>
                      {t('workflows.templatesSubtitle')}
                    </p>
                    <div className="relative w-full sm:w-64 flex-shrink-0">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--text-5)]" />
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search templates…"
                        className="h-9 w-full rounded-[10px] border border-[color:var(--line)] bg-white pl-9 pr-3 text-xs text-[color:var(--ink)] placeholder:text-[color:var(--text-5)] transition-colors focus:border-[color:var(--ink)] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category filter chips */}
                  <div className="flex gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={cn(
                          'flex h-8 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0',
                          activeCategory === cat.key
                            ? 'bg-[color:var(--ink)] text-white border-transparent'
                            : 'bg-transparent text-[color:var(--text-2)] border-[color:var(--line)] hover:bg-[rgba(20,22,26,0.04)] hover:text-[color:var(--ink)]'
                        )}
                      >
                        {cat.label}
                        <span className={cn(
                          'text-[10px] px-1.5 py-0 rounded-full font-semibold',
                          activeCategory === cat.key ? 'bg-white/20 text-white' : 'bg-[color:var(--sand)] text-[color:var(--text-4)]'
                        )}>
                          {cat.key === 'all' ? ALL_TEMPLATES.length : cat.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Results count */}
                  {(searchQuery || activeCategory !== 'all') && (
                    <p className="text-xs mb-3" style={{ color: 'var(--text-5)' }}>
                      {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                      {searchQuery && <> for "<span className="font-medium" style={{ color: 'var(--text-2)' }}>{searchQuery}</span>"</>}
                    </p>
                  )}

                  {/* Template grid */}
                  {filteredTemplates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Search className="h-10 w-10 text-[color:var(--text-5)] mb-3" strokeWidth={1.5} />
                      <p className="text-sm font-medium" style={{ color: 'var(--text-4)' }}>No templates match your search</p>
                      <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="text-xs mt-2 text-[color:var(--text-3)] hover:text-[color:var(--ink)] underline underline-offset-2">
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {visibleTemplates.map((tpl) => {
                          const Icon = tpl.icon;
                          return (
                            <div
                              key={tpl.id}
                              className="group bg-white border border-[color:var(--line-soft)] rounded-[14px] p-4 hover:border-[color:var(--line)] transition-colors duration-200 cursor-pointer flex flex-col gap-3"
                              onClick={() => navigate('/workflows/create', { state: { templateId: tpl.id } })}
                            >
                              {/* Icon + name + category */}
                              <div className="flex items-start gap-3">
                                <div className="plat-item-icon !h-10 !w-10 !rounded-[10px] group-hover:bg-[rgba(20,22,26,0.07)] transition-colors">
                                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-2 flex-wrap">
                                    <h3 className="text-sm font-medium leading-tight" style={{ color: 'var(--ink)' }}>{tpl.name}</h3>
                                    <Badge className="plat-pill plat-pill-mute !text-[10px] !px-2 !py-0 !font-medium !border-0 flex-shrink-0">
                                      {tpl.categoryLabel}
                                    </Badge>
                                  </div>
                                  <p className="text-[11px] mt-1 leading-relaxed line-clamp-2" style={{ color: 'var(--text-4)' }}>{tpl.description}</p>
                                </div>
                              </div>

                              {/* Trigger line */}
                              <div className="flex items-center gap-1.5">
                                <Zap className="h-3 w-3 text-[color:var(--text-5)] flex-shrink-0" />
                                <span className="text-[10px] truncate" style={{ color: 'var(--text-5)' }}>{tpl.trigger}</span>
                              </div>

                              {/* Footer: nodes + agents + use-template hover */}
                              <div className="flex items-center justify-between gap-2 mt-auto">
                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                                  <span className="text-[11px] flex-shrink-0" style={{ color: 'var(--text-5)' }}>{tpl.nodes} nodes</span>
                                  <div className="flex gap-1 flex-wrap">
                                    {tpl.agents.map((agent) => (
                                      <span
                                        key={agent}
                                        className={cn(
                                          'text-[10px] px-1.5 py-0.5 rounded-full font-medium border',
                                          AGENT_TAG_COLORS[agent] ?? NEUTRAL_TAG
                                        )}
                                      >
                                        {agent}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 flex-shrink-0" style={{ color: 'var(--ink)' }}>
                                  {t('workflows.useTemplate')} <ChevronRight className="h-3 w-3" />
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Load more / Show less */}
                      {filteredTemplates.length > INITIAL_VISIBLE && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={() => setShowAll(v => !v)}
                            className="flex items-center gap-1.5 text-sm text-[color:var(--text-2)] hover:text-[color:var(--ink)] font-medium transition-colors"
                          >
                            {showAll
                              ? t('workflows.showLess')
                              : `Show all ${filteredTemplates.length} templates`}
                            <ChevronRight className={cn('h-4 w-4 transition-transform', showAll && 'rotate-90')} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── My Workflows tab ── */}
              {activeTab === 'my-workflows' && (
                <div className="plat-panel !p-0 overflow-hidden">
                  {workflows.map((workflow) => (
                    <Card
                      key={workflow.id}
                      className="!rounded-none !border-x-0 !border-t-0 !border-b !border-[color:var(--line-soft)] !shadow-none !bg-transparent last:!border-b-0"
                    >
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="plat-item-icon !h-10 !w-10 !rounded-[10px]">
                              <Workflow className="w-[18px] h-[18px]" strokeWidth={1.75} />
                            </div>
                            <span className="text-[15px] font-semibold">{workflow.name}</span>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-[rgba(20,22,26,0.05)] h-8 w-8">
                                <MoreVertical className="h-4 w-4" style={{ color: 'var(--text-4)' }} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => navigate('/workflows/create')}
                              >
                                <Settings className="h-4 w-4" style={{ color: 'var(--text-4)' }} />
                                {t('workflows.editWorkflow')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => setAssignTarget({ id: workflow.id, name: workflow.name })}
                              >
                                <Bot className="h-4 w-4" style={{ color: 'var(--text-4)' }} />
                                {t('workflows.assignToAgent')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                                {t('common.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-4 pt-0">
                        <div className="space-y-3">
                          <p className="text-xs" style={{ color: 'var(--text-3)' }}>{workflow.description}</p>

                          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                          <span className={workflow.status === 'Active' ? 'plat-pill plat-pill-ok' : 'plat-pill plat-pill-mute'}>
                            {workflow.status}
                          </span>

                          {(() => {
                            const a = assignments[workflow.id];
                            if (!a) return null;
                            if (a.mode === 'all') {
                              return (
                                <div className="plat-pill plat-pill-ok w-fit">
                                  <Users className="h-3 w-3 flex-shrink-0" />
                                  <span className="text-xs font-medium">{t('workflows.allAgentsLabel')}</span>
                                </div>
                              );
                            }
                            const agent = AGENTS.find(ag => ag.id === a.agentId);
                            if (!agent) return null;
                            const colorIdx = AGENTS.indexOf(agent);
                            return (
                              <div className="plat-pill plat-pill-ok w-fit">
                                <Bot className="h-3 w-3 flex-shrink-0" />
                                <span className={cn('w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-semibold flex-shrink-0', AVATAR_COLORS[colorIdx])}>
                                  {agent.avatar}
                                </span>
                                <span className="text-xs font-medium">{agent.name}</span>
                              </div>
                            );
                          })()}

                          <div className="flex items-center space-x-2">
                            <div className="p-1 rounded-[8px]" style={{ background: 'var(--sand)' }}>
                              <Activity className="h-3 w-3" style={{ color: 'var(--text-4)' }} />
                            </div>
                            <span className="text-sm" style={{ color: 'var(--text-3)' }}>{t('workflows.executions')} {workflow.executions}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="p-1 rounded-[8px]" style={{ background: 'var(--sand)' }}>
                              <Clock className="h-3 w-3" style={{ color: 'var(--text-4)' }} />
                            </div>
                            <span className="text-sm" style={{ color: 'var(--text-3)' }}>{t('workflows.successRate')} {workflow.successRate}</span>
                          </div>

                          <div className="flex space-x-2 sm:ml-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              className="plat-btn-ghost !h-8 !justify-center !border-[color:var(--line)] text-xs"
                            >
                              {workflow.status === 'Active' ? (
                                <><Pause className="h-3 w-3 mr-1" />{t('common.pause')}</>
                              ) : (
                                <><Play className="h-3 w-3 mr-1" />{t('common.resume')}</>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="plat-btn-ghost !h-8 !justify-center !border-[color:var(--line)] text-xs"
                              onClick={() => navigate('/workflows/create')}
                            >
                              {t('common.edit')}
                            </Button>
                          </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      {assignTarget && (
        <AssignAgentModal
          workflowName={assignTarget.name}
          open={true}
          onClose={() => setAssignTarget(null)}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
};

export default Workflows;
