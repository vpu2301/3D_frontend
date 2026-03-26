
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Bot, Zap, BarChart3, Shield, Users, Building2, Workflow, Brain, BookOpen, HelpCircle, MessageCircle } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const productItems = [
    {
      category: 'PRODUCT',
      items: [
        { name: 'AI Copilot', href: '/product/ai-assistants', icon: Brain, desc: 'Personal AI for every employee' },
        { name: 'Workflow Automation', href: '/product/workflow-builder', icon: Workflow, desc: 'Automate repetitive tasks' },
        { name: 'Analytics', href: '/platform/analytics', icon: BarChart3, desc: 'Team productivity insights' },
        { name: 'Agents', href: '/product/agents', icon: Bot, desc: 'Autonomous AI agents' },
      ]
    },
    {
      category: 'PLATFORM',
      items: [
        { name: 'Integrations', href: '/platform/integrations', icon: Zap, desc: '200+ tool connections' },
        { name: 'Security', href: '/platform/security', icon: Shield, desc: 'SOC 2, enterprise-grade' },
        { name: 'Fine-Tuning', href: '/product/fine-tuning', icon: Brain, desc: 'Custom AI for your org' },
      ]
    }
  ];

  const solutionsItems = [
    {
      category: 'BY TEAM',
      items: [
        { name: 'Sales Teams', href: '/solutions/sales', icon: Users, desc: 'Close more, faster' },
        { name: 'Operations', href: '/solutions/operations', icon: Building2, desc: 'Run leaner processes' },
        { name: 'Marketing', href: '/solutions/marketing', icon: Zap, desc: 'Campaigns on autopilot' },
        { name: 'HR & People', href: '/solutions/hr', icon: Users, desc: 'Streamline HR workflows' },
      ]
    },
    {
      category: 'BY ROLE',
      items: [
        { name: 'For CEOs', href: '/roles/ceo', icon: Building2, desc: 'Strategic visibility' },
        { name: 'For IT Leaders', href: '/roles/it-director', icon: Shield, desc: 'Secure deployment' },
        { name: 'For Sales Leaders', href: '/roles/sales-leaders', icon: Users, desc: 'Pipeline automation' },
      ]
    }
  ];

  const resourcesItems = [
    {
      category: 'RESOURCES',
      items: [
        { name: 'Documentation', href: '/support/documentation', icon: BookOpen, desc: 'API & integration docs' },
        { name: 'Case Studies', href: '/customers/case-studies', icon: BarChart3, desc: 'Real customer results' },
        { name: 'Help Center', href: '/support/help-center', icon: HelpCircle, desc: 'Guides & tutorials' },
        { name: 'Contact', href: '/contact', icon: MessageCircle, desc: 'Talk to us' },
      ]
    }
  ];

  const handleDropdownToggle = (dropdown: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const renderMegaMenu = (items: any[], isOpen: boolean) => {
    if (!isOpen) return null;
    return (
      <div className="absolute top-full left-0 mt-2 min-w-[520px] border border-[#141413]/10 bg-[#f0ede6] shadow-xl shadow-[#141413]/10 z-50 overflow-hidden dark:bg-[#1c1916] dark:border-white/10 dark:shadow-black/40" style={{ borderRadius: '10px' }}>
        <div className="p-5 grid grid-cols-2 gap-4">
          {items.map((category, ci) => (
            <div key={ci}>
              <div className="text-black/30 text-[10px] font-semibold uppercase tracking-widest mb-3 px-2 dark:text-white/25">
                {category.category}
              </div>
              <div className="space-y-0.5">
                {category.items.map((item: any, ii: number) => (
                  <Link
                    key={ii}
                    to={item.href}
                    className="flex items-start gap-3 px-2 py-2.5 hover:bg-[#141413]/5 transition-colors group dark:hover:bg-white/6"
                    style={{ borderRadius: '8px' }}
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="w-8 h-8 bg-[#141413]/8 border border-[#141413]/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#141413]/12 transition-colors dark:bg-white/6 dark:border-white/10 dark:group-hover:bg-white/10" style={{ borderRadius: '6px' }}>
                      <item.icon className="w-4 h-4 text-black/40 group-hover:text-black/70 transition-colors dark:text-white/35 dark:group-hover:text-white/65" />
                    </div>
                    <div>
                      <div className="text-black/80 text-sm font-medium group-hover:text-black transition-colors dark:text-white/70 dark:group-hover:text-white">{item.name}</div>
                      {item.desc && <div className="text-black/40 text-xs mt-0.5 dark:text-white/30">{item.desc}</div>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#f0ede6]/95 border-b border-[#141413]/8 backdrop-blur-xl shadow-sm dark:bg-[#181512]/95 dark:border-white/8'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 bg-[#141413] flex items-center justify-center dark:bg-white/90" style={{ borderRadius: '4px' }}>
              <Bot className="w-3.5 h-3.5 text-white dark:text-[#141413]" />
            </div>
            <span className="text-[#141413] font-semibold text-base tracking-tight dark:text-white">3Days.ai</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Product', key: 'product', items: productItems },
              { label: 'Solutions', key: 'solutions', items: solutionsItems },
              { label: 'Resources', key: 'resources', items: resourcesItems },
            ].map(({ label, key, items }) => (
              <div key={key} className="relative">
                <button
                  onMouseEnter={(e) => handleDropdownToggle(key, e)}
                  className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeDropdown === key
                      ? 'text-[#111111] bg-black/6 dark:text-white dark:bg-white/10'
                      : 'text-black/55 hover:text-[#111111] hover:bg-black/4 dark:text-white/55 dark:hover:text-white dark:hover:bg-white/8'
                  }`}
                >
                  {label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`} />
                </button>
                {renderMegaMenu(items, activeDropdown === key)}
              </div>
            ))}
            <Link
              to="/pricing"
              className={`px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${
                location.pathname === '/pricing'
                  ? 'text-[#111111] bg-black/6 dark:text-white dark:bg-white/10'
                  : 'text-black/55 hover:text-[#111111] hover:bg-black/4 dark:text-white/55 dark:hover:text-white dark:hover:bg-white/8'
              }`}
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeSelector />
            <Link
              to="/login"
              className="text-black/55 hover:text-[#111111] text-sm font-medium transition-colors px-3.5 py-2 rounded-full hover:bg-black/4 dark:text-white/55 dark:hover:text-white dark:hover:bg-white/8"
            >
              Sign in
            </Link>
            <Link to="/signup">
              <button className="px-5 py-2 bg-[#141413] hover:bg-[#2a2a28] text-white text-sm font-medium transition-all duration-200" style={{ borderRadius: '4px' }}>
                Start for free
              </button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-black/60 hover:text-black transition-colors rounded-lg hover:bg-black/5 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/8"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#141413]/8 bg-[#f0ede6]/98 backdrop-blur-xl dark:bg-[#181512]/98 dark:border-white/8">
          <div className="max-w-7xl mx-auto px-6 py-5 space-y-1">
            {[
              { label: 'Product', href: '/product/ai-assistants' },
              { label: 'Solutions', href: '/solutions/sales' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Resources', href: '/support/help-center' },
            ].map(item => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-4 py-3 text-black/60 hover:text-black hover:bg-black/4 text-sm font-medium transition-colors rounded-xl dark:text-white/60 dark:hover:text-white dark:hover:bg-white/6"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                className="block text-center px-4 py-3 border border-[#141413]/12 text-[#141413]/60 hover:text-[#141413] text-sm font-medium transition-colors dark:border-white/12 dark:text-white/60 dark:hover:text-white"
                style={{ borderRadius: '4px' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="block text-center px-4 py-3 bg-[#141413] hover:bg-[#2a2a28] text-white text-sm font-medium transition-colors"
                style={{ borderRadius: '4px' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Start for free
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown overlay */}
      {activeDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
      )}
    </header>
  );
};

export default Header;
