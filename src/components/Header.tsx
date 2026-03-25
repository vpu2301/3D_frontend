
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Building2, Users, BookOpen, Play, Calendar, MessageCircle, Heart, Trophy, Headphones, Zap, Database, FileText, Shield, BarChart, Mail, Cog, Scale, DollarSign, UserCheck, Briefcase, Target, CheckCircle, BookMarked, HelpCircle, MessageSquare, Activity, Brain, Network, Bot, Palette, FlaskConical, Microscope, Stethoscope, Dna, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const productItems = [
    { category: 'CORE MODULES', items: [
      { name: 'Research Assistant', href: '/product/research-assistant', icon: Brain },
      { name: 'Data Analytics', href: '/product/data-analytics', icon: BarChart },
      { name: 'Lab Automation', href: '/product/lab-automation', icon: FlaskConical },
      { name: 'Regulatory Compliance', href: '/product/regulatory-compliance', icon: Shield }
    ]},
    { category: 'SPECIALIZED TOOLS', items: [
      { name: 'Genomics Analysis', href: '/product/genomics-analysis', icon: Dna },
      { name: 'Clinical Trials', href: '/product/clinical-trials', icon: Stethoscope },
      { name: 'Drug Discovery', href: '/product/drug-discovery', icon: TestTube },
      { name: 'Biomarker Detection', href: '/product/biomarker-detection', icon: Microscope }
    ]}
  ];

  const solutionsItems = [
    { category: 'BY ORGANIZATION SIZE', items: [
      { name: 'Academic Labs', href: '/solutions/academic-labs', icon: Users },
      { name: 'Biotech Startups', href: '/solutions/biotech-startups', icon: Building2 },
      { name: 'Pharmaceutical Companies', href: '/solutions/pharmaceutical', icon: Network }
    ]},
    { category: 'BY RESEARCH AREA', items: [
      { name: 'Oncology Research', href: '/solutions/oncology', icon: Heart },
      { name: 'Neuroscience', href: '/solutions/neuroscience', icon: Brain },
      { name: 'Cardiovascular', href: '/solutions/cardiovascular', icon: Activity },
      { name: 'Infectious Disease', href: '/solutions/infectious-disease', icon: Shield }
    ]}
  ];

  const resourcesItems = [
    { category: 'LEARN', items: [
      { name: 'Research Success Stories', href: '/resources/success-stories', icon: Trophy },
      { name: 'AI in Healthcare Guide', href: '/resources/ai-healthcare-guide', icon: BookOpen },
      { name: 'ROI Calculator', href: '/resources/roi-calculator', icon: BarChart },
      { name: 'Best Practices', href: '/resources/best-practices', icon: Target }
    ]},
    { category: 'SUPPORT', items: [
      { name: 'Help Center', href: '/support/help-center', icon: HelpCircle },
      { name: 'API Documentation', href: '/support/documentation', icon: BookOpen },
      { name: 'Contact Support', href: '/contact', icon: MessageCircle },
      { name: 'Research Community', href: '/community', icon: Users }
    ]}
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleDropdownToggle = (dropdown: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const renderEnhancedMegaMenu = (items: any[], isOpen: boolean) => {
    if (!isOpen) return null;
    return (
      <div className="absolute top-full left-0 w-screen max-w-4xl bg-background shadow-neu-lg z-50 mt-2 rounded-2xl border border-border/20 p-2">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-border pb-2">
                  <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    {category.category}
                  </h3>
                </div>
                <div className="space-y-1">
                  {category.items.map((item: any, itemIndex: number) => (
                    <Link
                      key={itemIndex}
                      to={item.href}
                      className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors text-sm py-2 px-3 rounded-xl hover:shadow-neu-sm group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.icon && <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 shadow-neu-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded-lg shadow-neu-sm flex items-center justify-center mr-3 bg-primary">
              <Microscope className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-light text-foreground tracking-tight">Observio</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {[
              { label: 'Product', key: 'product', items: productItems },
              { label: 'Solutions', key: 'solutions', items: solutionsItems },
              { label: 'Resources', key: 'resources', items: resourcesItems },
            ].map(({ label, key, items }) => (
              <div key={key} className="relative">
                <button
                  onMouseEnter={(e) => handleDropdownToggle(key, e)}
                  onTouchStart={(e) => handleDropdownToggle(key, e)}
                  className={`flex items-center text-muted-foreground hover:text-foreground transition-all py-2 px-4 rounded-xl hover:shadow-neu-sm ${
                    activeDropdown === key ? 'text-primary shadow-neu-inset-sm' : ''
                  }`}
                >
                  {label}
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`} />
                </button>
                {renderEnhancedMegaMenu(items, activeDropdown === key)}
              </div>
            ))}
            <Link
              to="/pricing"
              className={`text-muted-foreground hover:text-foreground transition-all py-2 px-4 rounded-xl hover:shadow-neu-sm ${
                isActive('/pricing') ? 'text-primary shadow-neu-inset-sm' : ''
              }`}
            >
              Pricing
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground rounded-xl" asChild>
              <Link to="/contact">Contact</Link>
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground rounded-xl" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="bg-primary text-primary-foreground px-6 py-2 rounded-full shadow-neu-sm hover:shadow-neu transition-all" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:shadow-neu-sm"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 bg-background rounded-2xl shadow-neu-sm my-2 px-4">
            <div className="space-y-2">
              {['Pricing', 'Contact', 'Login'].map((item) => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="block text-muted-foreground hover:text-foreground py-2 px-3 rounded-xl hover:shadow-neu-sm" onClick={() => setIsMenuOpen(false)}>
                  {item}
                </Link>
              ))}
              <Button className="w-full bg-primary text-primary-foreground shadow-neu-sm mt-2" asChild>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Start Free Trial</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {activeDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
      )}
    </header>
  );
};

export default Header;
