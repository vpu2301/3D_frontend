
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Bot, Zap, BarChart3, Shield, Users, Building2, Workflow, Brain, BookOpen, HelpCircle, MessageCircle, ShoppingCart, CreditCard, Globe, ClipboardList, Headphones, TrendingUp, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeSelector from './ThemeSelector';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const { t } = useTranslation();

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
    const minW = wide ? 'min-w-[1080px]' : 'min-w-[720px]';
    return (
      <div
        className={`m-menu absolute top-[66px] left-2 ${minW} z-[200] overflow-hidden`}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {wide && (
          <div className="flex items-center justify-between px-5 pb-4 pt-1">
            <span className="m-eyebrow-muted">{t('nav.integrationCategories')}</span>
            <Link
              to="/platform/integrations"
              className="text-[13px] font-medium text-[color:var(--blue)] hover:text-[color:var(--blue-deep)]"
              onClick={() => setActiveDropdown(null)}
            >
              {t('nav.viewAllIntegrations')}
            </Link>
          </div>
        )}
        <div className={`grid ${cols} gap-4 px-1`}>
          {items.map((category, ci) => (
            <div key={ci}>
              <div className="m-eyebrow-muted px-4 pb-3 pt-2">{category.category}</div>
              <div className="flex flex-col gap-1">
                {category.items.map((item: any, ii: number) => (
                  <Link key={ii} to={item.href} className="m-menu-item group" onClick={() => setActiveDropdown(null)}>
                    <span className="m-menu-num bg-[color:var(--sand)] text-[color:var(--ink)] group-hover:bg-[color:var(--blue)] group-hover:text-white transition-colors">
                      <item.icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="block">
                      <span className="block text-[15px] font-semibold">{item.name}</span>
                      {item.desc && (
                        <span className="mt-0.5 block text-[13px] leading-snug text-[color:var(--text-3)]">{item.desc}</span>
                      )}
                    </span>
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
            className="mt-3 flex items-center justify-between gap-4 rounded-[18px] bg-[color:var(--blue-100)] px-5 py-4"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <Sparkles className="h-4 w-4 flex-shrink-0 text-[color:var(--blue)]" />
              <span className="text-[13px] font-semibold text-[color:var(--ink)]">{t('nav.skillsHub')}</span>
              <span className="truncate text-[12px] text-[color:var(--text-3)]">— {t('nav.skillsHubDesc')}</span>
            </span>
            <span className="flex-shrink-0 text-[12px] font-semibold text-[color:var(--blue)]">{t('nav.skillsHubCta')}</span>
          </Link>
        )}
        {talkToSales && (
          <Link
            to="/contact"
            onClick={() => setActiveDropdown(null)}
            className="mt-3 flex items-center justify-between gap-4 rounded-[18px] bg-[color:var(--blue-100)] px-5 py-4"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--blue)]">
                <Headphones className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-[13px] font-semibold text-[color:var(--ink)]">{t('nav.talkToSales')}</span>
              <span className="truncate text-[12px] text-[color:var(--text-3)]">— {t('nav.talkToSalesDesc')}</span>
            </span>
            <span className="flex-shrink-0 text-[12px] font-semibold text-[color:var(--blue)]">{t('nav.talkToSalesCta')}</span>
          </Link>
        )}
      </div>
    );
  };

  return (
    <header className="m-header">
      <div className="relative mx-auto max-w-[1180px]" onMouseLeave={scheduleClose}>
        <div className="m-navbar">
          <Link to="/" className="m-wordmark mr-2.5 flex-shrink-0">
            3Days<span>.ai</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0">
            {[
              { label: t('nav.product'), key: 'product', items: productItems, wide: false, talkToSales: true },
              { label: t('nav.solutions'), key: 'solutions', items: solutionsItems, wide: false, talkToSales: true },
              { label: t('nav.integrations'), key: 'integrations', items: integrationsItems, wide: true, talkToSales: false },
              { label: t('nav.resources'), key: 'resources', items: resourcesItems, wide: false, talkToSales: false },
            ].map(({ label, key }) => (
              <button
                key={key}
                className={`m-nav-tab${activeDropdown === key ? ' is-open' : ''}`}
                onMouseEnter={() => openDropdown(key)}
              >
                {label}
                <span className="text-[10px] opacity-60">▾</span>
              </button>
            ))}
            <Link
              to="/pricing"
              className={`m-nav-tab${location.pathname === '/pricing' ? ' is-active' : ''}`}
              onMouseEnter={() => setActiveDropdown(null)}
            >
              {t('nav.pricing')}
            </Link>
          </nav>

          <div className="flex-1" />

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-1.5">
            <LanguageSwitcher />
            <ThemeSelector />
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-[color:var(--text-1)] transition-colors hover:bg-[color:var(--sand)] hover:text-[color:var(--ink)]"
            >
              {t('common.signIn')}
            </Link>
            <Link to="/signup" className="m-btn m-btn-primary text-sm">
              {t('common.startForFree')}
              <span className="m-arrow text-[13px]">→</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--ink)] transition-colors hover:bg-[color:var(--sand)] md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mega menus */}
        {[
          { key: 'product', items: productItems, wide: false, talkToSales: true },
          { key: 'solutions', items: solutionsItems, wide: false, talkToSales: true },
          { key: 'integrations', items: integrationsItems, wide: true, talkToSales: false },
          { key: 'resources', items: resourcesItems, wide: false, talkToSales: false },
        ].map(({ key, items, wide, talkToSales }) => (
          <div key={key} className="hidden md:block">
            {renderMegaMenu(items, activeDropdown === key, wide, talkToSales)}
          </div>
        ))}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="m-menu absolute left-0 right-0 top-[66px] z-[200] md:hidden">
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
                className="block rounded-[16px] px-4 py-3 text-[15px] font-semibold text-[color:var(--ink)] hover:bg-[color:var(--sand)]"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-4 py-3">
              <LanguageSwitcher />
              <ThemeSelector />
            </div>
            <div className="flex flex-col gap-2 px-2 pb-1">
              <Link to="/login" className="m-btn m-btn-soft w-full" onClick={() => setIsMenuOpen(false)}>
                {t('common.signIn')}
              </Link>
              <Link to="/signup" className="m-btn m-btn-dark w-full" onClick={() => setIsMenuOpen(false)}>
                {t('common.startForFree')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
