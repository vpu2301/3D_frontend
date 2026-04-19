
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Bot, Zap, BarChart3, Shield, Users, Building2, Workflow, Brain, BookOpen, HelpCircle, MessageCircle, ShoppingCart, CreditCard, Globe, ClipboardList, Headphones, TrendingUp, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeSelector from './ThemeSelector';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const openDropdown = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(key);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const productItems = [
    {
      category: t('nav.productCategory'),
      items: [
        { name: t('nav.aiCopilot'), href: '/product/ai-assistants', icon: Brain, desc: t('nav.aiCopilotDesc') },
        { name: t('nav.workflowAutomation'), href: '/product/workflow-builder', icon: Workflow, desc: t('nav.workflowAutomationDesc') },
        { name: t('nav.analytics'), href: '/platform/analytics', icon: BarChart3, desc: t('nav.analyticsDesc') },
        { name: t('nav.agents'), href: '/product/agents', icon: Bot, desc: t('nav.agentsDesc') },
      ]
    },
    {
      category: t('nav.platformCategory'),
      items: [
        { name: t('nav.integrations'), href: '/platform/integrations', icon: Zap, desc: t('nav.integrationsDesc') },
        { name: t('nav.security'), href: '/platform/security', icon: Shield, desc: t('nav.securityDesc') },
        { name: t('nav.fineTuning'), href: '/product/fine-tuning', icon: Brain, desc: t('nav.fineTuningDesc') },
      ]
    }
  ];

  const solutionsItems = [
    {
      category: t('nav.byTeam'),
      items: [
        { name: t('nav.salesTeams'), href: '/solutions/sales', icon: Users, desc: t('nav.salesTeamsDesc') },
        { name: t('nav.operations'), href: '/solutions/operations', icon: Building2, desc: t('nav.operationsDesc') },
        { name: t('nav.marketing'), href: '/solutions/marketing', icon: Zap, desc: t('nav.marketingDesc') },
        { name: t('nav.hrPeople'), href: '/solutions/hr', icon: Users, desc: t('nav.hrPeopleDesc') },
      ]
    },
    {
      category: t('nav.byRole'),
      items: [
        { name: t('nav.forCEOs'), href: '/roles/ceo', icon: Building2, desc: t('nav.forCEOsDesc') },
        { name: t('nav.forITLeaders'), href: '/roles/it-director', icon: Shield, desc: t('nav.forITLeadersDesc') },
        { name: t('nav.forSalesLeaders'), href: '/roles/sales-leaders', icon: Users, desc: t('nav.forSalesLeadersDesc') },
      ]
    }
  ];

  const integrationsItems = [
    {
      category: t('nav.productivityComms'),
      items: [
        { name: t('nav.officeCollaboration'), href: '/platform/integrations', icon: Globe, desc: t('nav.officeCollaborationDesc') },
        { name: t('nav.projectManagement'), href: '/platform/integrations', icon: ClipboardList, desc: t('nav.projectManagementDesc') },
        { name: t('nav.calendarScheduling'), href: '/platform/integrations', icon: ClipboardList, desc: t('nav.calendarSchedulingDesc') },
      ]
    },
    {
      category: t('nav.crmSales'),
      items: [
        { name: t('nav.crm'), href: '/platform/integrations', icon: Users, desc: t('nav.crmDesc') },
        { name: t('nav.emailMarketing'), href: '/platform/integrations', icon: Globe, desc: t('nav.emailMarketingDesc') },
        { name: t('nav.liveChat'), href: '/platform/integrations', icon: Headphones, desc: t('nav.liveChatDesc') },
      ]
    },
    {
      category: t('nav.financeHr'),
      items: [
        { name: t('nav.accounting'), href: '/platform/integrations', icon: CreditCard, desc: t('nav.accountingDesc') },
        { name: t('nav.paymentProcessing'), href: '/platform/integrations', icon: CreditCard, desc: t('nav.paymentProcessingDesc') },
        { name: t('nav.hrPayroll'), href: '/platform/integrations', icon: Users, desc: t('nav.hrPayrollDesc') },
      ]
    },
    {
      category: t('nav.dataOperations'),
      items: [
        { name: t('nav.biAnalytics'), href: '/platform/integrations', icon: BarChart3, desc: t('nav.biAnalyticsDesc') },
        { name: t('nav.erp'), href: '/platform/integrations', icon: Building2, desc: t('nav.erpDesc') },
        { name: t('nav.ecommerce'), href: '/platform/integrations', icon: ShoppingCart, desc: t('nav.ecommerceDesc') },
        { name: t('nav.helpDesk'), href: '/platform/integrations', icon: Headphones, desc: t('nav.helpDeskDesc') },
      ]
    },
  ];

  const resourcesItems = [
    {
      category: t('nav.resourcesCategory'),
      items: [
        { name: t('nav.documentation'), href: '/support/documentation', icon: BookOpen, desc: t('nav.documentationDesc') },
        { name: t('nav.caseStudies'), href: '/customers/case-studies', icon: BarChart3, desc: t('nav.caseStudiesDesc') },
        { name: t('nav.helpCenter'), href: '/support/help-center', icon: HelpCircle, desc: t('nav.helpCenterDesc') },
        { name: t('nav.contact'), href: '/contact', icon: MessageCircle, desc: t('nav.contactDesc') },
      ]
    },
    {
      category: t('nav.learnCategory'),
      items: [
        { name: t('nav.bestPractices'), href: '/resources/best-practices', icon: TrendingUp, desc: t('nav.bestPracticesDesc') },
        { name: t('nav.implementationGuide'), href: '/resources/implementation-guide', icon: BookOpen, desc: t('nav.implementationGuideDesc') },
        { name: t('nav.training'), href: '/resources/training', icon: Brain, desc: t('nav.trainingDesc') },
        { name: t('nav.community'), href: '/resources/community', icon: Users, desc: t('nav.communityDesc') },
      ]
    }
  ];

  const renderMegaMenu = (items: any[], isOpen: boolean, wide?: boolean, talkToSales?: boolean) => {
    if (!isOpen) return null;
    const cols = wide ? 'grid-cols-4' : 'grid-cols-2';
    const minW = wide ? 'min-w-[1080px]' : 'min-w-[740px]';
    return (
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 ${minW} border border-[#c8c6be] bg-white shadow-2xl shadow-black/15 z-[200] overflow-hidden dark:bg-[#1a1815] dark:border-white/18 dark:shadow-black/50`}
        style={{ borderRadius: '18px' }}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {wide && (
          <div className="px-8 pt-4 pb-3.5 border-b border-[#c8c6be] dark:border-white/12 flex items-center justify-between">
            <span className="text-xs text-black/40 dark:text-white/35">
              {t('nav.integrationCategories')} —{' '}
              <Link to="/platform/integrations" className="underline underline-offset-2 hover:text-black dark:hover:text-white transition-colors" onClick={() => setActiveDropdown(null)}>
                {t('nav.browseAll')}
              </Link>
            </span>
            <Link to="/platform/integrations" className="text-xs text-black/50 hover:text-black transition-colors flex items-center gap-1 dark:text-white/40 dark:hover:text-white" onClick={() => setActiveDropdown(null)}>
              {t('nav.viewAllIntegrations')}
            </Link>
          </div>
        )}
        <div className={`p-8 grid ${cols} gap-8`}>
          {items.map((category, ci) => (
            <div key={ci}>
              <div className="text-black/35 text-[11px] font-semibold uppercase tracking-widest mb-4 px-2 dark:text-white/30">
                {category.category}
              </div>
              <div className="space-y-0.5">
                {category.items.map((item: any, ii: number) => (
                  <Link
                    key={ii}
                    to={item.href}
                    className="flex items-start gap-3.5 px-3 py-3 hover:bg-[#141413]/5 transition-colors group dark:hover:bg-white/7"
                    style={{ borderRadius: '11px' }}
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="w-10 h-10 bg-[#141413]/6 border border-[#c8c6be] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#141413]/10 transition-colors dark:bg-white/5 dark:border-white/15 dark:group-hover:bg-white/10" style={{ borderRadius: '9px' }}>
                      <item.icon className="w-[18px] h-[18px] text-black/45 group-hover:text-black/75 transition-colors dark:text-white/35 dark:group-hover:text-white/70" />
                    </div>
                    <div>
                      <div className="text-[#111111] text-[15px] font-semibold group-hover:text-black transition-colors dark:text-white/85 dark:group-hover:text-white">{item.name}</div>
                      {item.desc && <div className="text-black/45 text-[13px] mt-0.5 leading-snug dark:text-white/38">{item.desc}</div>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        {wide && (
          <Link
            to="/skills-hub"
            onClick={() => setActiveDropdown(null)}
            className="flex items-center justify-between gap-4 px-8 py-3 bg-[#1e4a7a]/[0.06] hover:bg-[#1e4a7a]/[0.11] transition-colors dark:bg-[#7ab3dc]/[0.08] dark:hover:bg-[#7ab3dc]/[0.14]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-4 h-4 flex-shrink-0 text-[#1e4a7a] dark:text-[#7ab3dc]" />
              <span className="text-[13px] font-semibold text-[#1e4a7a] dark:text-[#7ab3dc]">
                {t('nav.skillsHub')}
              </span>
              <span className="text-[12px] text-[#1e4a7a]/70 truncate dark:text-[#7ab3dc]/70">
                — {t('nav.skillsHubDesc')}
              </span>
            </div>
            <span className="text-[12px] font-medium text-[#1e4a7a] flex-shrink-0 dark:text-[#7ab3dc]">
              {t('nav.skillsHubCta')}
            </span>
          </Link>
        )}
        {talkToSales && (
          <Link
            to="/contact"
            onClick={() => setActiveDropdown(null)}
            className="group relative flex items-center justify-between gap-4 px-8 py-3 bg-gradient-to-r from-[#f59e0b]/[0.10] via-[#ec4899]/[0.10] to-[#1e4a7a]/[0.12] hover:from-[#f59e0b]/[0.18] hover:via-[#ec4899]/[0.18] hover:to-[#1e4a7a]/[0.20] transition-all dark:from-[#f59e0b]/[0.14] dark:via-[#ec4899]/[0.14] dark:to-[#7ab3dc]/[0.16] dark:hover:from-[#f59e0b]/[0.22] dark:hover:via-[#ec4899]/[0.22] dark:hover:to-[#7ab3dc]/[0.24]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="flex w-6 h-6 items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#f59e0b] via-[#ec4899] to-[#1e4a7a] dark:to-[#7ab3dc]"
                style={{ borderRadius: '7px' }}
              >
                <Headphones className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="text-[13px] font-semibold bg-gradient-to-r from-[#b45309] via-[#be185d] to-[#1e4a7a] bg-clip-text text-transparent dark:from-[#f59e0b] dark:via-[#ec4899] dark:to-[#7ab3dc]">
                {t('nav.talkToSales')}
              </span>
              <span className="text-[12px] text-black/55 truncate dark:text-white/55">
                — {t('nav.talkToSalesDesc')}
              </span>
            </div>
            <span className="text-[12px] font-medium text-[#be185d] flex-shrink-0 group-hover:text-[#9d174d] dark:text-[#ec4899] dark:group-hover:text-[#f472b6]">
              {t('nav.talkToSalesCta')}
            </span>
          </Link>
        )}
      </div>
    );
  };

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-200 bg-[#e8e6dc]/95 backdrop-blur-md dark:bg-[#181512]/95 ${
      scrolled
        ? 'border-b border-[#141413]/10 shadow-sm shadow-black/5 dark:border-white/8 dark:shadow-black/20'
        : 'border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-[60px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 bg-[#141413] flex items-center justify-center dark:bg-white/90" style={{ borderRadius: '4px' }}>
              <Bot className="w-3.5 h-3.5 text-white dark:text-[#141413]" />
            </div>
            <span className="text-[#141413] font-semibold text-[15px] tracking-tight dark:text-white">3Days.ai</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {[
              { label: t('nav.product'), key: 'product', items: productItems, wide: false, talkToSales: true },
              { label: t('nav.solutions'), key: 'solutions', items: solutionsItems, wide: false, talkToSales: true },
              { label: t('nav.integrations'), key: 'integrations', items: integrationsItems, wide: true, talkToSales: false },
              { label: t('nav.resources'), key: 'resources', items: resourcesItems, wide: false, talkToSales: false },
            ].map(({ label, key, items, wide, talkToSales }) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => openDropdown(key)}
                onMouseLeave={scheduleClose}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors rounded-sm ${
                    activeDropdown === key
                      ? 'text-[#111111] dark:text-white'
                      : 'text-[#141413]/55 hover:text-[#111111] dark:text-white/50 dark:hover:text-white'
                  }`}
                >
                  {label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`} />
                </button>
                {renderMegaMenu(items, activeDropdown === key, wide, talkToSales)}
              </div>
            ))}
            <Link
              to="/pricing"
              className={`px-3 py-2 text-sm transition-colors rounded-sm ${
                location.pathname === '/pricing'
                  ? 'text-[#111111] dark:text-white'
                  : 'text-[#141413]/55 hover:text-[#111111] dark:text-white/50 dark:hover:text-white'
              }`}
            >
              {t('nav.pricing')}
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeSelector />
            <Link
              to="/login"
              className="text-[#141413]/55 hover:text-[#111111] text-sm transition-colors px-3 py-2 dark:text-white/50 dark:hover:text-white"
            >
              {t('common.signIn')}
            </Link>
            <Link to="/signup">
              <button className="ml-1 px-5 py-2 bg-[#141413] hover:bg-[#2a2a28] text-white text-sm font-medium transition-all duration-200 dark:bg-white dark:text-[#141413] dark:hover:bg-white/90" style={{ borderRadius: '6px' }}>
                {t('common.startForFree')}
              </button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#141413]/60 hover:text-[#141413] transition-colors rounded-lg dark:text-white/60 dark:hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#141413]/8 bg-[#e8e6dc]/98 backdrop-blur-xl dark:bg-[#181512]/98 dark:border-white/8">
          <div className="max-w-7xl mx-auto px-6 py-5 space-y-0.5">
            {[
              { label: t('nav.product'), href: '/product/ai-assistants' },
              { label: t('nav.solutions'), href: '/solutions/sales' },
              { label: t('nav.integrations'), href: '/platform/integrations' },
              { label: t('nav.pricing'), href: '/pricing' },
              { label: t('nav.resources'), href: '/support/help-center' },
            ].map(item => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-3 py-3 text-[#141413]/60 hover:text-[#111111] text-sm font-medium transition-colors dark:text-white/55 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 pb-1 flex items-center gap-2 px-3">
              <LanguageSwitcher />
              <ThemeSelector />
            </div>
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                className="block text-center px-4 py-2.5 border border-[#141413]/12 text-[#141413]/60 hover:text-[#141413] hover:border-[#141413]/20 text-sm font-medium transition-colors dark:border-white/12 dark:text-white/55 dark:hover:text-white"
                style={{ borderRadius: '6px' }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.signIn')}
              </Link>
              <Link
                to="/signup"
                className="block text-center px-4 py-2.5 bg-[#141413] hover:bg-[#2a2a28] text-white text-sm font-medium transition-colors dark:bg-white dark:text-[#141413] dark:hover:bg-white/90"
                style={{ borderRadius: '6px' }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.startForFree')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
