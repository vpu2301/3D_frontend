
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Search, Zap, CheckCircle, Building2, Users, ShoppingCart, BarChart3, Shield, Code, FileText, Headphones, CreditCard, Globe, Database, Settings, BookOpen, TrendingUp, Package, Truck, ClipboardList, Layers, X, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Tool = {
  id: string;
  name: string;
  desc: string;
  type: 'read' | 'write';
  requiresApproval?: boolean;
};

const groupToolsMap: Record<string, { reads: [string, string][]; writes: [string, string][] }> = {
  productivity: {
    reads: [['list_documents', 'List all documents'], ['get_document', 'Get document details'], ['search_files', 'Search files & folders']],
    writes: [['create_document', 'Create new document'], ['update_document', 'Update document content'], ['share_document', 'Share with users'], ['delete_document', 'Delete document']],
  },
  'crm-sales': {
    reads: [['list_contacts', 'List all contacts'], ['get_contact', 'Get contact details'], ['search_contacts', 'Search contacts & companies']],
    writes: [['create_contact', 'Create new contact'], ['update_contact', 'Update contact record'], ['create_deal', 'Create deal/opportunity'], ['log_activity', 'Log call or meeting']],
  },
  finance: {
    reads: [['list_invoices', 'List all invoices'], ['get_invoice', 'Get invoice details'], ['list_transactions', 'List transactions']],
    writes: [['create_invoice', 'Create new invoice'], ['update_invoice', 'Update invoice'], ['send_payment', 'Send payment request'], ['reconcile', 'Reconcile transactions']],
  },
  hr: {
    reads: [['list_employees', 'List all employees'], ['get_employee', 'Get employee profile'], ['search_employees', 'Search employees']],
    writes: [['create_employee', 'Create employee record'], ['update_employee', 'Update employee details'], ['approve_leave', 'Approve leave request'], ['run_payroll', 'Trigger payroll run']],
  },
  ecommerce: {
    reads: [['list_orders', 'List all orders'], ['get_order', 'Get order details'], ['list_products', 'List products']],
    writes: [['create_order', 'Create new order'], ['update_order', 'Update order status'], ['process_refund', 'Process refund'], ['update_inventory', 'Update inventory levels']],
  },
  support: {
    reads: [['list_tickets', 'List all tickets'], ['get_ticket', 'Get ticket details'], ['search_tickets', 'Search tickets']],
    writes: [['create_ticket', 'Create new ticket'], ['update_ticket', 'Update ticket status'], ['escalate_ticket', 'Escalate to senior agent'], ['close_ticket', 'Close ticket']],
  },
  marketing: {
    reads: [['list_campaigns', 'List all campaigns'], ['get_campaign', 'Get campaign details'], ['get_analytics', 'Get campaign analytics']],
    writes: [['create_campaign', 'Create new campaign'], ['update_campaign', 'Update campaign'], ['send_email', 'Send email campaign'], ['schedule_post', 'Schedule social post']],
  },
  data: {
    reads: [['run_query', 'Run analytics query'], ['get_report', 'Get report data'], ['list_dashboards', 'List dashboards']],
    writes: [['create_report', 'Create new report'], ['update_dashboard', 'Update dashboard'], ['export_data', 'Export data snapshot'], ['refresh_dataset', 'Refresh dataset']],
  },
  security: {
    reads: [['list_users', 'List all users'], ['get_user', 'Get user details'], ['list_audit_logs', 'List audit logs']],
    writes: [['provision_user', 'Provision new user'], ['deprovision_user', 'Deprovision user'], ['reset_mfa', 'Reset MFA device'], ['update_permissions', 'Update permissions']],
  },
  operations: {
    reads: [['list_records', 'List all records'], ['get_record', 'Get record details'], ['run_report', 'Run operational report']],
    writes: [['create_record', 'Create new record'], ['update_record', 'Update record'], ['trigger_approval', 'Trigger approval workflow'], ['sync_data', 'Sync data between systems']],
  },
  developer: {
    reads: [['list_builds', 'List all builds'], ['get_build', 'Get build details'], ['list_errors', 'List error events']],
    writes: [['trigger_build', 'Trigger CI/CD build'], ['create_incident', 'Create incident'], ['resolve_incident', 'Resolve incident'], ['deploy_release', 'Deploy release']],
  },
  document: {
    reads: [['list_documents', 'List all documents'], ['get_document', 'Get document details'], ['search_documents', 'Search documents']],
    writes: [['create_document', 'Create new document'], ['send_for_signature', 'Send for signature'], ['update_document', 'Update document'], ['archive_document', 'Archive document']],
  },
};

const generateTools = (integration: (typeof integrations)[0]): Tool[] => {
  const template = groupToolsMap[integration.group] ?? {
    reads: [['list_records', 'List all records'], ['get_record', 'Get record details'], ['search_records', 'Search records']],
    writes: [['create_record', 'Create new record'], ['update_record', 'Update record'], ['delete_record', 'Delete record'], ['export_data', 'Export data']],
  };
  return [
    ...template.reads.map(([id, desc]) => ({ id, name: id, desc, type: 'read' as const })),
    ...template.writes.map(([id, desc]) => ({ id, name: id, desc, type: 'write' as const, requiresApproval: true })),
  ];
};

const integrations = [
  // Productivity
  {
    id: 1, group: 'productivity',
    name: 'Office & Collaboration Suites',
    desc: 'Let 3Days.ai read emails, draft documents, schedule meetings and summarize threads — across your entire workspace.',
    tools: ['Google Workspace', 'Microsoft 365', 'Slack', 'Zoom'],
    icon: Globe, badge: 'Most Popular', count: '50+ tools'
  },
  {
    id: 5, group: 'productivity',
    name: 'Project & Task Management',
    desc: 'Create tasks, update statuses, generate progress reports and surface blockers — automatically.',
    tools: ['Asana', 'Trello', 'Monday.com', 'Jira'],
    icon: ClipboardList, count: '30+ tools'
  },
  {
    id: 9, group: 'productivity',
    name: 'Cloud Storage & File Sharing',
    desc: 'Index, search and summarize files from any cloud drive. Never lose a document again.',
    tools: ['Google Drive', 'OneDrive', 'Dropbox', 'Box'],
    icon: Database, count: '15+ tools'
  },
  {
    id: 23, group: 'productivity',
    name: 'Calendar & Scheduling',
    desc: 'Let AI workers book meetings, reschedule calls and send follow-ups without manual effort.',
    tools: ['Calendly', 'Acuity Scheduling', 'Google Calendar', 'Outlook'],
    icon: Settings, count: '10+ tools'
  },
  {
    id: 37, group: 'productivity',
    name: 'Knowledge Base & Wiki',
    desc: 'Train AI workers on your SOPs, internal docs and wikis so they always answer correctly.',
    tools: ['Confluence', 'Notion', 'GitBook', 'Helpjuice'],
    icon: BookOpen, count: '12+ tools'
  },

  // CRM & Sales
  {
    id: 3, group: 'crm-sales',
    name: 'CRM',
    desc: 'Update pipeline stages, log calls, draft outreach and forecast revenue — hands-free.',
    tools: ['HubSpot CRM', 'Salesforce', 'Zoho CRM', 'Pipedrive'],
    icon: Users, badge: 'Top Integration', count: '25+ tools'
  },
  {
    id: 35, group: 'crm-sales',
    name: 'Live Chat & Chatbots',
    desc: 'AI workers qualify leads, answer questions and escalate complex issues in real-time.',
    tools: ['Intercom', 'Drift', 'Zendesk Chat', 'Userlike'],
    icon: Headphones, count: '20+ tools'
  },
  {
    id: 36, group: 'crm-sales',
    name: 'Affiliate & Partner Management',
    desc: 'Track commissions, onboard partners and generate reports with zero manual admin.',
    tools: ['Impact', 'PartnerStack', 'Tapfiliate', 'ShareASale'],
    icon: TrendingUp, count: '10+ tools'
  },
  {
    id: 12, group: 'crm-sales',
    name: 'Marketing Automation',
    desc: 'Design, launch and optimise campaigns automatically with AI-driven lead nurturing.',
    tools: ['HubSpot Marketing Hub', 'ActiveCampaign', 'GoHighLevel', 'Marketo'],
    icon: Zap, badge: 'High ROI', count: '20+ tools'
  },

  // Finance
  {
    id: 2, group: 'finance',
    name: 'Accounting & Finance',
    desc: 'Reconcile transactions, prepare reports, chase invoices and flag anomalies — all automated.',
    tools: ['QuickBooks Online', 'Xero', 'FreshBooks', 'Sage Accounting'],
    icon: CreditCard, badge: 'High ROI', count: '20+ tools'
  },
  {
    id: 22, group: 'finance',
    name: 'Payment Processing',
    desc: 'Monitor payments, handle disputes and generate revenue reports without touching a spreadsheet.',
    tools: ['Stripe', 'PayPal', 'Square', 'Adyen'],
    icon: CreditCard, count: '15+ tools'
  },
  {
    id: 31, group: 'finance',
    name: 'Expense Management',
    desc: 'Capture receipts, code expenses and push approvals through the right workflows instantly.',
    tools: ['Expensify', 'Concur', 'Rydoo', 'Moss'],
    icon: FileText, count: '10+ tools'
  },
  {
    id: 66, group: 'finance',
    name: 'Subscription Billing',
    desc: 'Prevent churn, handle dunning and analyse MRR/ARR without touching your billing portal.',
    tools: ['Chargebee', 'Recurly', 'Zuora', 'billwerk+'],
    icon: TrendingUp, count: '10+ tools'
  },
  {
    id: 32, group: 'finance',
    name: 'Time Tracking',
    desc: 'Automatically log billable hours, generate client reports and flag overtime in real time.',
    tools: ['Toggl', 'Harvest', 'Clockify', 'Clockodo'],
    icon: Settings, count: '10+ tools'
  },

  // HR & People
  {
    id: 10, group: 'hr',
    name: 'HR & Payroll',
    desc: 'Automate onboarding, answer HR queries, process leave requests and run payroll checks.',
    tools: ['Rippling', 'Gusto', 'BambooHR', 'Personio'],
    icon: Users, badge: 'Popular', count: '20+ tools'
  },
  {
    id: 30, group: 'hr',
    name: 'Applicant Tracking Systems',
    desc: 'Screen CVs, schedule interviews, send offers and keep candidates warm — on autopilot.',
    tools: ['Greenhouse', 'Lever', 'Workable', 'Recruitee'],
    icon: Users, count: '15+ tools'
  },
  {
    id: 64, group: 'hr',
    name: 'Performance Management',
    desc: 'Collect 360 feedback, track OKRs and surface top performers automatically.',
    tools: ['Lattice', '15Five', 'BambooHR Performance', 'Reflektive'],
    icon: TrendingUp, count: '12+ tools'
  },
  {
    id: 63, group: 'hr',
    name: 'Employee Engagement',
    desc: 'Run pulse surveys, analyse sentiment and generate action plans without HR overhead.',
    tools: ['Culture Amp', 'Officevibe', 'TINYpulse', 'Leapsome'],
    icon: Users, count: '10+ tools'
  },
  {
    id: 62, group: 'hr',
    name: 'OKR & Goal Setting',
    desc: 'Align teams on strategic objectives and track progress reports automatically.',
    tools: ['Lattice', '15Five', 'Perdoo', 'Betterworks'],
    icon: ClipboardList, count: '8+ tools'
  },

  // E-commerce
  {
    id: 6, group: 'ecommerce',
    name: 'E-commerce Platforms',
    desc: 'Answer customer questions, process returns, update listings and monitor inventory — 24/7.',
    tools: ['Shopify', 'WooCommerce', 'BigCommerce', 'Shopware'],
    icon: ShoppingCart, badge: 'Popular', count: '20+ tools'
  },
  {
    id: 17, group: 'ecommerce',
    name: 'Inventory / Order / POS',
    desc: 'Track stock levels, trigger reorders and keep order data synced across all channels.',
    tools: ['Square', 'Lightspeed', 'Shopify POS', 'Vend'],
    icon: Package, count: '15+ tools'
  },
  {
    id: 48, group: 'ecommerce',
    name: 'Reputation Management',
    desc: 'Monitor reviews, generate response drafts and escalate negative feedback instantly.',
    tools: ['Birdeye', 'Podium', 'Yext', 'Trusted Shops'],
    icon: Shield, count: '10+ tools'
  },

  // Support
  {
    id: 7, group: 'support',
    name: 'Help Desk / Customer Support',
    desc: 'Triage tickets, draft resolutions, manage SLAs and escalate complex cases automatically.',
    tools: ['Zendesk', 'Freshdesk', 'Zoho Desk', 'Jira Service Mgmt'],
    icon: Headphones, badge: 'High ROI', count: '20+ tools'
  },
  {
    id: 20, group: 'support',
    name: 'ITSM / Internal Ticketing',
    desc: 'Log incidents, update the CMDB and generate post-mortems without touching your IT desk.',
    tools: ['ServiceNow', 'Jira Service Mgmt', 'Freshservice', 'BMC Helix'],
    icon: Settings, count: '15+ tools'
  },
  {
    id: 89, group: 'support',
    name: 'Incident Response',
    desc: 'Triage alerts, notify on-call teams and draft incident reports automatically.',
    tools: ['PagerDuty', 'Opsgenie', 'VictorOps', 'xMatters'],
    icon: Shield, count: '8+ tools'
  },

  // Marketing
  {
    id: 4, group: 'marketing',
    name: 'Email Marketing',
    desc: 'Write, segment, schedule and A/B test email campaigns — let AI do the heavy lifting.',
    tools: ['Mailchimp', 'Brevo', 'MailerLite', 'CleverReach'],
    icon: Globe, count: '20+ tools'
  },
  {
    id: 19, group: 'marketing',
    name: 'SEO & Social Media Tools',
    desc: 'Research keywords, schedule posts, analyse rankings and generate content briefs.',
    tools: ['Semrush', 'Ahrefs', 'Hootsuite', 'Buffer'],
    icon: TrendingUp, count: '20+ tools'
  },
  {
    id: 18, group: 'marketing',
    name: 'Customer Feedback & Survey',
    desc: 'Automate NPS collection, summarise feedback and create action plans from raw data.',
    tools: ['SurveyMonkey', 'Typeform', 'Qualtrics', 'LamaPoll'],
    icon: Users, count: '12+ tools'
  },
  {
    id: 34, group: 'marketing',
    name: 'A/B Testing & CRO',
    desc: 'Interpret experiment results, generate hypotheses and create test briefs automatically.',
    tools: ['Optimizely', 'VWO', 'AB Tasty', 'Google Optimize'],
    icon: BarChart3, count: '8+ tools'
  },
  {
    id: 79, group: 'marketing',
    name: 'Webinar Platforms',
    desc: 'Manage registrations, send reminders, follow up with attendees and score leads.',
    tools: ['ON24', 'Demio', 'GoTo Webinar', 'WebinarJam'],
    icon: Globe, count: '10+ tools'
  },
  {
    id: 50, group: 'marketing',
    name: 'Content Planning',
    desc: 'Build editorial calendars, assign tasks and track content performance in one workflow.',
    tools: ['CoSchedule', 'Airtable', 'Monday.com', 'Notion'],
    icon: ClipboardList, count: '10+ tools'
  },

  // Data & Analytics
  {
    id: 13, group: 'data',
    name: 'BI & Analytics',
    desc: 'Generate plain-language reports, surface anomalies and answer data questions in chat.',
    tools: ['Power BI', 'Tableau', 'Looker Studio', 'Qlik'],
    icon: BarChart3, badge: 'Popular', count: '15+ tools'
  },
  {
    id: 45, group: 'data',
    name: 'Data Warehousing',
    desc: 'Query your data warehouse in natural language and get instant structured results.',
    tools: ['Snowflake', 'BigQuery', 'Redshift', 'Azure Synapse'],
    icon: Database, count: '10+ tools'
  },
  {
    id: 33, group: 'data',
    name: 'Customer Data Platforms',
    desc: 'Unify customer profiles across all touchpoints and personalise AI responses at scale.',
    tools: ['Segment', 'mParticle', 'Tealium', 'Bloomreach'],
    icon: Users, count: '8+ tools'
  },
  {
    id: 47, group: 'data',
    name: 'Product Analytics',
    desc: 'Analyse funnels, surface drop-off points and generate improvement recommendations.',
    tools: ['Mixpanel', 'Amplitude', 'Heap', 'FullStory'],
    icon: TrendingUp, count: '10+ tools'
  },

  // IT & Security
  {
    id: 67, group: 'security',
    name: 'Identity & Access Management',
    desc: 'Automate provisioning, handle access requests and audit permissions continuously.',
    tools: ['Okta', 'Auth0', 'Azure AD', 'OneLogin'],
    icon: Shield, count: '12+ tools'
  },
  {
    id: 72, group: 'security',
    name: 'Compliance Management',
    desc: 'Monitor controls, flag gaps and generate audit-ready reports automatically.',
    tools: ['OneTrust', 'ServiceNow GRC', 'LogicGate', 'Vanta'],
    icon: CheckCircle, count: '10+ tools'
  },
  {
    id: 68, group: 'security',
    name: 'Endpoint Security',
    desc: 'Surface threats, triage alerts and initiate response workflows without manual effort.',
    tools: ['CrowdStrike', 'SentinelOne', 'Microsoft Defender', 'Sophos'],
    icon: Shield, count: '10+ tools'
  },
  {
    id: 70, group: 'security',
    name: 'SIEM & Threat Detection',
    desc: 'Correlate logs, detect anomalies and generate incident summaries in plain language.',
    tools: ['Splunk', 'IBM QRadar', 'LogRhythm', 'Microsoft Sentinel'],
    icon: Shield, count: '8+ tools'
  },
  {
    id: 86, group: 'security',
    name: 'Mobile Device Management',
    desc: 'Track devices, enforce policies and respond to security events without manual checks.',
    tools: ['Jamf', 'VMware Workspace ONE', 'Microsoft Intune', 'Kandji'],
    icon: Settings, count: '8+ tools'
  },

  // ERP & Operations
  {
    id: 14, group: 'operations',
    name: 'ERP (Midmarket / Enterprise)',
    desc: 'Query financials, trigger approvals and generate operational reports from one AI layer.',
    tools: ['SAP S/4HANA', 'Oracle NetSuite', 'MS Dynamics 365', 'Odoo'],
    icon: Building2, badge: 'Enterprise', count: '15+ tools'
  },
  {
    id: 8, group: 'operations',
    name: 'All-in-One SMB Suites',
    desc: 'One AI worker that spans your entire SMB platform — CRM, finance, projects and more.',
    tools: ['Zoho One', 'Odoo', 'SuiteDash', 'Barawave ERP'],
    icon: Layers, count: '10+ tools'
  },
  {
    id: 15, group: 'operations',
    name: 'Integration & Automation (iPaaS)',
    desc: 'Supercharge your existing automations by adding intelligent AI decision-making.',
    tools: ['Zapier', 'Make', 'n8n', 'Workato'],
    icon: Zap, badge: 'Popular', count: '10+ tools'
  },
  {
    id: 54, group: 'operations',
    name: 'Procurement & E-sourcing',
    desc: 'Automate RFQ creation, supplier scoring and purchase approval workflows.',
    tools: ['Coupa', 'SAP Ariba', 'Jaggaer', 'Ivalua'],
    icon: ClipboardList, count: '8+ tools'
  },
  {
    id: 55, group: 'operations',
    name: 'Supply Chain Management',
    desc: 'Track shipments, flag delays and generate supply chain reports in plain language.',
    tools: ['Blue Yonder', 'Kinaxis', 'SAP SCM', 'Manhattan Associates'],
    icon: Truck, count: '8+ tools'
  },
  {
    id: 58, group: 'operations',
    name: 'Field Service Management',
    desc: 'Dispatch technicians, log job outcomes and handle customer comms automatically.',
    tools: ['ServiceMax', 'FieldAware', 'Jobber', 'Salesforce Field Service'],
    icon: Settings, count: '8+ tools'
  },

  // Developer Tools
  {
    id: 44, group: 'developer',
    name: 'API Management',
    desc: 'Monitor usage, detect anomalies and generate API health reports in real time.',
    tools: ['Postman', 'Apigee', 'Kong', 'AWS API Gateway'],
    icon: Code, count: '10+ tools'
  },
  {
    id: 92, group: 'developer',
    name: 'CI/CD Platforms',
    desc: 'Summarise build failures, suggest fixes and keep your team informed automatically.',
    tools: ['Jenkins', 'GitLab CI', 'CircleCI', 'GitHub Actions'],
    icon: Code, count: '10+ tools'
  },
  {
    id: 93, group: 'developer',
    name: 'Observability & APM',
    desc: 'Surface performance regressions, generate runbooks and triage incidents faster.',
    tools: ['New Relic', 'Dynatrace', 'Datadog', 'AppDynamics'],
    icon: BarChart3, count: '10+ tools'
  },
  {
    id: 95, group: 'developer',
    name: 'Error Tracking',
    desc: 'Triage errors, assign to the right engineer and generate fix summaries automatically.',
    tools: ['Sentry', 'Rollbar', 'Bugsnag', 'Honeybadger'],
    icon: Code, count: '8+ tools'
  },
  {
    id: 97, group: 'developer',
    name: 'Database as a Service',
    desc: 'Query your database in natural language and get structured results instantly.',
    tools: ['MongoDB Atlas', 'Amazon RDS', 'Azure SQL', 'PlanetScale'],
    icon: Database, count: '10+ tools'
  },

  // Document & Legal
  {
    id: 16, group: 'document',
    name: 'Document Mgmt & E-signature',
    desc: 'Draft contracts, route for signature and track document status without manual chasing.',
    tools: ['DocuSign', 'Adobe Acrobat Sign', 'PandaDoc', 'HelloSign'],
    icon: FileText, badge: 'Popular', count: '15+ tools'
  },
  {
    id: 29, group: 'document',
    name: 'Contract Lifecycle Management',
    desc: 'Review contracts, flag risks, track renewals and generate summaries automatically.',
    tools: ['Ironclad', 'ContractWorks', 'PandaDoc', 'Contractbook'],
    icon: FileText, count: '10+ tools'
  },
  {
    id: 77, group: 'document',
    name: 'Document Scanning / OCR',
    desc: 'Extract, classify and route data from scanned documents and PDFs in seconds.',
    tools: ['ABBYY FineReader', 'Adobe Scan', 'Kofax', 'Hyperscience'],
    icon: FileText, count: '8+ tools'
  },
  {
    id: 78, group: 'document',
    name: 'Virtual Data Rooms',
    desc: 'Summarise due diligence documents, flag risks and manage Q&A in M&A processes.',
    tools: ['Datasite', 'Intralinks', 'Firmex', 'Drooms'],
    icon: Shield, count: '8+ tools'
  },
];

const stats = [
  { value: '100+', label: 'Integration categories' },
  { value: '500+', label: 'Pre-built connectors' },
  { value: '1-click', label: 'Setup for most tools' },
  { value: '99.9%', label: 'Uptime SLA' },
];

const howItWorks = [
  {
    step: '01',
    title: 'Connect your tools',
    desc: 'Authenticate with your existing stack in one click. No engineers needed for most integrations.',
  },
  {
    step: '02',
    title: 'AI workers go to work',
    desc: '3Days.ai reads, writes and acts inside your tools — updating records, sending messages, filing reports.',
  },
  {
    step: '03',
    title: 'Watch the time savings stack up',
    desc: 'Every connected tool multiplies the value. Your team focuses on decisions, not data entry.',
  },
];

const Integrations = () => {
  const { t } = useTranslation();
  const [activeGroup, setActiveGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [modalIntegration, setModalIntegration] = useState<(typeof integrations)[0] | null>(null);
  const [modalTools, setModalTools] = useState<Tool[]>([]);
  const [toolStates, setToolStates] = useState<Record<string, boolean>>({});
  const [toolFilter, setToolFilter] = useState<'all' | 'read' | 'write'>('all');
  const [toolSearch, setToolSearch] = useState('');

  const openModal = (integration: (typeof integrations)[0]) => {
    const tools = generateTools(integration);
    const states: Record<string, boolean> = {};
    tools.forEach(t => { states[t.id] = true; });
    setModalTools(tools);
    setToolStates(states);
    setToolFilter('all');
    setToolSearch('');
    setModalIntegration(integration);
  };

  const closeModal = () => setModalIntegration(null);

  const toggleTool = (id: string) =>
    setToolStates(prev => ({ ...prev, [id]: !prev[id] }));

  const enableAll = () =>
    setToolStates(prev => Object.fromEntries(Object.keys(prev).map(k => [k, true])));

  const disableAll = () =>
    setToolStates(prev => Object.fromEntries(Object.keys(prev).map(k => [k, false])));

  const filteredModalTools = modalTools.filter(t => {
    const matchesFilter = toolFilter === 'all' || t.type === toolFilter;
    const matchesSearch = !toolSearch.trim() || t.name.includes(toolSearch.toLowerCase()) || t.desc.toLowerCase().includes(toolSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const enabledCount = Object.values(toolStates).filter(Boolean).length;

  const integrationGroups = [
    { id: 'all', label: t('platform.integrations.allCategories') },
    { id: 'productivity', label: t('platform.integrations.productivity') },
    { id: 'crm-sales', label: t('platform.integrations.crmSales') },
    { id: 'finance', label: t('platform.integrations.finance') },
    { id: 'hr', label: t('platform.integrations.hrPeople') },
    { id: 'ecommerce', label: t('platform.integrations.ecommerce') },
    { id: 'support', label: t('platform.integrations.support') },
    { id: 'marketing', label: t('platform.integrations.marketing') },
    { id: 'data', label: t('platform.integrations.dataAnalytics') },
    { id: 'security', label: t('platform.integrations.itSecurity') },
    { id: 'operations', label: t('platform.integrations.erpOperations') },
    { id: 'developer', label: t('platform.integrations.developerTools') },
    { id: 'document', label: t('platform.integrations.documentLegal') },
  ];

  const filtered = useMemo(() => {
    let list = integrations;
    if (activeGroup !== 'all') list = list.filter(i => i.group === activeGroup);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.tools.some(t => t.toLowerCase().includes(q)) ||
        i.desc.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeGroup, searchQuery]);

  return (
    <div className="min-h-screen bg-[color:var(--paper)]">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[color:var(--sand)] border border-[color:var(--line)] text-[color:var(--text-2)] text-xs font-medium mb-6 dark:bg-[color:var(--paper)] dark:border-white/10 dark:text-white/50" style={{ borderRadius: '28px' }}>
            <Zap className="w-3 h-3" />
            500+ integrations — all in one AI layer
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-[color:var(--ink)] tracking-tight mb-6 dark:text-white">
            {t('platform.integrations.heroTitle')}<br />
            <span className="font-semibold">{t('platform.integrations.heroTitle2')}</span>
          </h1>
          <p className="text-lg text-[color:var(--text-2)] max-w-2xl mx-auto mb-10 leading-relaxed dark:text-white/50">
            {t('platform.integrations.heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <button className="px-7 py-3.5 bg-[color:var(--ink)] hover:bg-[#2a2a28] text-white text-sm font-medium transition-all duration-200 flex items-center gap-2" style={{ borderRadius: '9999px' }}>
                {t('platform.integrations.ctaBtn')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/schedule-demo">
              <button className="px-7 py-3.5 border border-[color:var(--line)] text-[color:var(--text-2)] hover:text-[color:var(--ink)] hover:border-[color:var(--line)] text-sm font-medium transition-all duration-200 dark:border-white/15 dark:text-white/60 dark:hover:text-white" style={{ borderRadius: '9999px' }}>
                {t('platform.integrations.ctaBtn2')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[color:var(--line)] dark:border-white/8">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-light text-[color:var(--ink)] dark:text-white mb-1">{s.value}</div>
              <div className="text-sm text-[color:var(--text-2)] dark:text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-light text-[color:var(--ink)] dark:text-white mb-3">{t('platform.integrations.seeHowItWorks')}</h2>
            <p className="text-[color:var(--text-2)] dark:text-white/45">From zero to automated in under 10 minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-[color:var(--sand)] dark:bg-[color:var(--paper)] z-0" style={{ width: 'calc(100% - 2rem)', left: 'calc(50% + 1.5rem)' }} />
                )}
                <div className="text-[10px] font-semibold text-[color:var(--text-4)] dark:text-white/20 tracking-widest uppercase mb-4">{step.step}</div>
                <h3 className="text-lg font-medium text-[color:var(--ink)] dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[color:var(--text-2)] dark:text-white/45 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse integrations */}
      <section className="py-20 px-6 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-[color:var(--ink)] dark:text-white mb-3">Browse all integrations</h2>
            <p className="text-[color:var(--text-2)] dark:text-white/45">Find the tools your team already uses.</p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-4)] dark:text-white/30" />
            <input
              type="text"
              placeholder={t('platform.integrations.searchPlaceholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[color:var(--paper)] border border-[color:var(--line)] text-[color:var(--ink)] text-sm placeholder:text-[color:var(--text-4)] focus:outline-none focus:border-[color:var(--line)] transition-colors dark:bg-[color:var(--paper)] dark:border-white/10 dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/25"
              style={{ borderRadius: '16px' }}
            />
          </div>

          {/* Group filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {integrationGroups.map(g => (
              <button
                key={g.id}
                onClick={() => { setActiveGroup(g.id); setSearchQuery(''); }}
                className={`px-4 py-1.5 text-xs font-medium transition-all duration-150 ${
                  activeGroup === g.id
                    ? 'bg-[color:var(--ink)] text-white dark:bg-[color:var(--paper)] dark:text-[color:var(--ink)]'
                    : 'bg-[color:var(--sand)] text-[color:var(--text-2)] hover:bg-[color:var(--sand)] hover:text-[color:var(--ink)] dark:bg-[color:var(--paper)] dark:text-white/50 dark:hover:bg-[color:var(--paper)] dark:hover:text-white'
                }`}
                style={{ borderRadius: '28px' }}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Integration items — dropdown style */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[color:var(--text-4)] dark:text-white/30">
              No integrations found for "{searchQuery}"
            </div>
          ) : activeGroup !== 'all' ? (
            <div className="border border-[color:var(--line)] bg-[color:var(--paper)] dark:bg-[color:var(--paper)] dark:border-white/18 overflow-hidden" style={{ borderRadius: '28px' }}>
              <div className="p-3 grid sm:grid-cols-2 gap-0.5">
                {filtered.map(integration => {
                  const Icon = integration.icon;
                  return (
                    <div
                      key={integration.id}
                      onClick={() => openModal(integration)}
                      className="flex items-start gap-3.5 px-3 py-3.5 hover:bg-[color:var(--sand)] cursor-pointer group transition-colors dark:hover:bg-[color:var(--paper)]"
                      style={{ borderRadius: '16px' }}
                    >
                      <div className="w-10 h-10 bg-[color:var(--sand)] border border-[color:var(--line)] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[color:var(--sand)] transition-colors dark:bg-[color:var(--paper)] dark:border-white/15 dark:group-hover:bg-[color:var(--paper)]" style={{ borderRadius: '16px' }}>
                        <Icon className="w-[18px] h-[18px] text-[color:var(--text-2)] group-hover:text-[color:var(--text-2)] transition-colors dark:text-white/35 dark:group-hover:text-white/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[color:var(--ink)] text-[14px] font-semibold group-hover:text-[color:var(--ink)] transition-colors dark:text-white/85 dark:group-hover:text-white leading-tight">{integration.name}</span>
                          {integration.badge && <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 bg-[color:var(--sand)] text-[color:var(--text-2)] dark:bg-[color:var(--paper)] dark:text-white/40 flex-shrink-0" style={{ borderRadius: '9999px' }}>{integration.badge}</span>}
                          <span className="text-[11px] text-[color:var(--text-4)] dark:text-white/25 ml-auto flex-shrink-0">{integration.count}</span>
                        </div>
                        <div className="text-[color:var(--text-2)] text-[12px] leading-snug dark:text-white/38 mb-1.5">{integration.desc}</div>
                        <div className="flex flex-wrap gap-1">
                          {integration.tools.map((tool, ti) => (
                            <span key={ti} className="text-[11px] px-2 py-0.5 bg-[color:var(--sand)] text-[color:var(--text-2)] dark:bg-[color:var(--paper)] dark:text-white/40" style={{ borderRadius: '9999px' }}>{tool}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {integrationGroups.slice(1).map(group => {
                const groupItems = filtered.filter(i => i.group === group.id);
                if (groupItems.length === 0) return null;
                return (
                  <div key={group.id} className="border border-[color:var(--line)] bg-[color:var(--paper)] dark:bg-[color:var(--paper)] dark:border-white/18 overflow-hidden" style={{ borderRadius: '28px' }}>
                    <div className="px-6 py-3.5 border-b border-[color:var(--line)] dark:border-white/10">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--text-2)] dark:text-white/30">{group.label}</span>
                    </div>
                    <div className="p-3 grid sm:grid-cols-2 gap-0.5">
                      {groupItems.map(integration => {
                        const Icon = integration.icon;
                        return (
                          <div
                            key={integration.id}
                            onClick={() => openModal(integration)}
                            className="flex items-start gap-3.5 px-3 py-3.5 hover:bg-[color:var(--sand)] cursor-pointer group transition-colors dark:hover:bg-[color:var(--paper)]"
                            style={{ borderRadius: '16px' }}
                          >
                            <div className="w-10 h-10 bg-[color:var(--sand)] border border-[color:var(--line)] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[color:var(--sand)] transition-colors dark:bg-[color:var(--paper)] dark:border-white/15 dark:group-hover:bg-[color:var(--paper)]" style={{ borderRadius: '16px' }}>
                              <Icon className="w-[18px] h-[18px] text-[color:var(--text-2)] group-hover:text-[color:var(--text-2)] transition-colors dark:text-white/35 dark:group-hover:text-white/70" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[color:var(--ink)] text-[14px] font-semibold group-hover:text-[color:var(--ink)] transition-colors dark:text-white/85 dark:group-hover:text-white leading-tight">{integration.name}</span>
                                {integration.badge && <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 bg-[color:var(--sand)] text-[color:var(--text-2)] dark:bg-[color:var(--paper)] dark:text-white/40 flex-shrink-0" style={{ borderRadius: '9999px' }}>{integration.badge}</span>}
                                <span className="text-[11px] text-[color:var(--text-4)] dark:text-white/25 ml-auto flex-shrink-0">{integration.count}</span>
                              </div>
                              <div className="text-[color:var(--text-2)] text-[12px] leading-snug dark:text-white/38 mb-1.5">{integration.desc}</div>
                              <div className="flex flex-wrap gap-1">
                                {integration.tools.map((tool, ti) => (
                                  <span key={ti} className="text-[11px] px-2 py-0.5 bg-[color:var(--sand)] text-[color:var(--text-2)] dark:bg-[color:var(--paper)] dark:text-white/40" style={{ borderRadius: '9999px' }}>{tool}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Result count */}
          {filtered.length > 0 && (
            <p className="text-center text-xs text-[color:var(--text-4)] dark:text-white/25 mt-8">
              Showing {filtered.length} integration {filtered.length === 1 ? 'category' : 'categories'}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          )}
        </div>
      </section>

      {/* Trust / enterprise section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Enterprise-grade security',
                desc: 'SOC 2 Type II certified. All data in transit and at rest is encrypted. OAuth 2.0 for every integration.'
              },
              {
                icon: CheckCircle,
                title: 'GDPR & compliance ready',
                desc: 'EU data hosting available. Audit logs on every integration action. Role-based access control built in.'
              },
              {
                icon: Zap,
                title: 'Real-time, bidirectional sync',
                desc: 'Data flows both ways. Your AI workers read from and write to your tools in real time — no batch delays.'
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-6 border border-[color:var(--line)] bg-[color:var(--paper)] dark:bg-[color:var(--paper)] dark:border-white/8" style={{ borderRadius: '16px' }}>
                  <div className="w-9 h-9 bg-[color:var(--sand)] border border-[color:var(--line)] flex items-center justify-center mb-4 dark:bg-[color:var(--paper)] dark:border-white/8" style={{ borderRadius: '16px' }}>
                    <Icon className="w-4 h-4 text-[color:var(--text-2)] dark:text-white/45" />
                  </div>
                  <h3 className="text-sm font-semibold text-[color:var(--ink)] dark:text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-[color:var(--text-2)] dark:text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[color:var(--ink)] dark:bg-[color:var(--paper)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-light text-white mb-4">
            {t('platform.integrations.ctaTitle')}
          </h2>
          <p className="text-white/50 text-lg mb-10 font-light">
            {t('platform.integrations.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <button className="px-7 py-3.5 bg-[color:var(--paper)] hover:bg-[color:var(--paper)] text-[color:var(--ink)] text-sm font-medium transition-all duration-200 flex items-center gap-2" style={{ borderRadius: '9999px' }}>
                {t('platform.integrations.ctaBtn')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/contact">
              <button className="px-7 py-3.5 border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-sm font-medium transition-all duration-200" style={{ borderRadius: '9999px' }}>
                Talk to sales
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Tool detail modal */}
      {modalIntegration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="bg-[#f0ede6] dark:bg-[#1e1d1b] w-full max-w-lg shadow-2xl flex flex-col"
            style={{ borderRadius: '28px', maxHeight: '88vh' }}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[color:var(--paper)] dark:bg-[color:var(--paper)] border border-[color:var(--line)] dark:border-white/10 flex items-center justify-center flex-shrink-0" style={{ borderRadius: '16px' }}>
                  {(() => { const Icon = modalIntegration.icon; return <Icon className="w-5 h-5 text-[color:var(--text-2)] dark:text-white/50" />; })()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[color:var(--ink)] dark:text-white leading-tight">{modalIntegration.name}</div>
                  <div className="text-xs text-[color:var(--text-2)] dark:text-white/35 mt-0.5">{enabledCount} / {modalTools.length} tools enabled</div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-7 h-7 flex items-center justify-center text-[color:var(--text-4)] hover:text-[color:var(--text-2)] dark:text-white/30 dark:hover:text-white/60 transition-colors"
                style={{ borderRadius: '9999px' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 pb-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[color:var(--text-4)] dark:text-white/30" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={toolSearch}
                  onChange={e => setToolSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[color:var(--paper)] dark:bg-[color:var(--paper)] border border-[color:var(--line)] dark:border-white/10 text-[color:var(--ink)] dark:text-white text-sm placeholder:text-[color:var(--text-4)] dark:placeholder:text-white/30 focus:outline-none focus:border-[color:var(--line)] dark:focus:border-white/25 transition-colors"
                  style={{ borderRadius: '16px' }}
                />
              </div>
            </div>

            {/* Filter tabs + bulk actions */}
            <div className="px-6 pb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {(['all', 'read', 'write'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setToolFilter(f)}
                    className={`px-3 py-1 text-xs font-medium transition-all duration-150 capitalize ${
                      toolFilter === f
                        ? 'bg-[color:var(--ink)] text-white dark:bg-[color:var(--paper)] dark:text-[color:var(--ink)]'
                        : 'bg-[color:var(--sand)] text-[color:var(--text-2)] hover:bg-[color:var(--sand)] hover:text-[color:var(--ink)] dark:bg-[color:var(--paper)] dark:text-white/45 dark:hover:bg-[color:var(--paper)] dark:hover:text-white'
                    }`}
                    style={{ borderRadius: '9999px' }}
                  >
                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={enableAll}
                  className="px-3 py-1 text-xs font-medium bg-[color:var(--ink)] text-white hover:bg-[#2a2a28] dark:bg-[color:var(--paper)] dark:text-[color:var(--ink)] dark:hover:bg-[color:var(--paper)] transition-colors"
                  style={{ borderRadius: '9999px' }}
                >
                  Enable all
                </button>
                <button
                  onClick={disableAll}
                  className="px-3 py-1 text-xs font-medium border border-[color:var(--line)] text-[color:var(--text-2)] hover:border-[color:var(--line)] hover:text-[color:var(--ink)] dark:border-white/15 dark:text-white/50 dark:hover:border-white/30 dark:hover:text-white transition-colors"
                  style={{ borderRadius: '9999px' }}
                >
                  Disable all
                </button>
              </div>
            </div>

            {/* Tool list — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-3 space-y-4">
              {(['read', 'write'] as const).map(section => {
                const sectionTools = filteredModalTools.filter(t => t.type === section);
                if (sectionTools.length === 0) return null;
                return (
                  <div key={section}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-4)] dark:text-white/30">
                        {section}
                      </span>
                      <span className="text-[10px] text-[color:var(--text-4)] dark:text-white/20">{sectionTools.length}</span>
                    </div>
                    <div className="space-y-1.5">
                      {sectionTools.map(tool => (
                        <div
                          key={tool.id}
                          className="flex items-center justify-between bg-[color:var(--paper)] dark:bg-[color:var(--paper)] border border-[color:var(--line)] dark:border-white/6 px-4 py-3"
                          style={{ borderRadius: '16px' }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Toggle */}
                            <button
                              onClick={() => toggleTool(tool.id)}
                              className={`relative flex-shrink-0 w-9 h-5 transition-colors duration-200 ${
                                toolStates[tool.id]
                                  ? 'bg-[color:var(--ink)] dark:bg-[color:var(--paper)]'
                                  : 'bg-[color:var(--sand)] dark:bg-[color:var(--paper)]'
                              }`}
                              style={{ borderRadius: '28px' }}
                              aria-label={`Toggle ${tool.name}`}
                            >
                              <span
                                className={`absolute top-0.5 w-4 h-4 bg-[color:var(--paper)] dark:bg-[color:var(--ink)] shadow-sm transition-transform duration-200 ${
                                  toolStates[tool.id] ? 'translate-x-[18px]' : 'translate-x-0.5'
                                }`}
                                style={{ borderRadius: '28px' }}
                              />
                            </button>
                            <div className="min-w-0">
                              <div className="text-xs font-mono font-medium text-[color:var(--ink)] dark:text-white truncate">{tool.name}</div>
                              <div className="text-[11px] text-[color:var(--text-4)] dark:text-white/35 truncate">{tool.desc}</div>
                            </div>
                          </div>
                          {tool.requiresApproval && (
                            <span
                              className="ml-3 flex-shrink-0 text-[10px] font-medium px-2 py-0.5 bg-[color:var(--blue-100)] text-[color:var(--blue)] dark:bg-[color:var(--blue-100)] dark:text-[color:var(--blue)]"
                              style={{ borderRadius: '9999px' }}
                            >
                              Approval
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {filteredModalTools.length === 0 && (
                <div className="text-center py-10 text-[color:var(--text-4)] dark:text-white/25 text-sm">
                  No tools match "{toolSearch}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[color:var(--line)] dark:border-white/8 flex items-center justify-between">
              <span className="text-[11px] text-[color:var(--text-4)] dark:text-white/25">
                {filteredModalTools.length} shown · {enabledCount} total enabled
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-medium border border-[color:var(--line)] text-[color:var(--text-2)] hover:border-[color:var(--line)] hover:text-[color:var(--ink)] dark:border-white/15 dark:text-white/50 dark:hover:border-white/30 dark:hover:text-white transition-colors"
                  style={{ borderRadius: '16px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-medium bg-[color:var(--ink)] text-white hover:bg-[#2a2a28] dark:bg-[color:var(--paper)] dark:text-[color:var(--ink)] dark:hover:bg-[color:var(--paper)] flex items-center gap-1.5 transition-colors"
                  style={{ borderRadius: '16px' }}
                >
                  <RefreshCw className="w-3 h-3" />
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
