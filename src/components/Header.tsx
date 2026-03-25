
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Building2, Users, BookOpen, Play, Calendar, MessageCircle, Heart, Trophy, Headphones, Zap, Database, FileText, Shield, BarChart, Mail, Cog, Scale, DollarSign, UserCheck, Briefcase, Target, CheckCircle, BookMarked, HelpCircle, MessageSquare, Activity, Brain, Network, Bot, Palette, FlaskConical, Microscope, Stethoscope, Dna, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const productItems = [
    {
      category: 'CORE MODULES',
      items: [
        { name: 'Research Assistant', href: '/product/research-assistant', icon: Brain },
        { name: 'Data Analytics', href: '/product/data-analytics', icon: BarChart },
        { name: 'Lab Automation', href: '/product/lab-automation', icon: FlaskConical },
        { name: 'Regulatory Compliance', href: '/product/regulatory-compliance', icon: Shield }
      ]
    },
    {
      category: 'SPECIALIZED TOOLS',
      items: [
        { name: 'Genomics Analysis', href: '/product/genomics-analysis', icon: Dna },
        { name: 'Clinical Trials', href: '/product/clinical-trials', icon: Stethoscope },
        { name: 'Drug Discovery', href: '/product/drug-discovery', icon: TestTube },
        { name: 'Biomarker Detection', href: '/product/biomarker-detection', icon: Microscope }
      ]
    }
  ];

  const solutionsItems = [
    {
      category: 'BY ORGANIZATION SIZE',
      items: [
        { name: 'Academic Labs', href: '/solutions/academic-labs', icon: Users },
        { name: 'Biotech Startups', href: '/solutions/biotech-startups', icon: Building2 },
        { name: 'Pharmaceutical Companies', href: '/solutions/pharmaceutical', icon: Network }
      ]
    },
    {
      category: 'BY RESEARCH AREA',
      items: [
        { name: 'Oncology Research', href: '/solutions/oncology', icon: Heart },
        { name: 'Neuroscience', href: '/solutions/neuroscience', icon: Brain },
        { name: 'Cardiovascular', href: '/solutions/cardiovascular', icon: Activity },
        { name: 'Infectious Disease', href: '/solutions/infectious-disease', icon: Shield }
      ]
    }
  ];

  const resourcesItems = [
    {
      category: 'LEARN',
      items: [
        { name: 'Research Success Stories', href: '/resources/success-stories', icon: Trophy },
        { name: 'AI in Healthcare Guide', href: '/resources/ai-healthcare-guide', icon: BookOpen },
        { name: 'ROI Calculator', href: '/resources/roi-calculator', icon: BarChart },
        { name: 'Best Practices', href: '/resources/best-practices', icon: Target }
      ]
    },
    {
      category: 'SUPPORT',
      items: [
        { name: 'Help Center', href: '/support/help-center', icon: HelpCircle },
        { name: 'API Documentation', href: '/support/documentation', icon: BookOpen },
        { name: 'Contact Support', href: '/contact', icon: MessageCircle },
        { name: 'Research Community', href: '/community', icon: Users }
      ]
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleDropdownToggle = (dropdown: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const renderEnhancedMegaMenu = (items: any[], isOpen: boolean) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-full left-0 transform translate-x-0 w-screen max-w-4xl bg-white border border-gray-200 shadow-2xl z-50 mt-1 rounded-lg">
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
                  <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wide">
                    {category.category}
                  </h3>
                </div>
                <div className="space-y-1">
                  {category.items.map((item: any, itemIndex: number) => (
                    <Link
                      key={itemIndex}
                      to={item.href}
                      className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors text-sm py-2 px-3 rounded-lg hover:bg-blue-50 group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.icon && <item.icon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />}
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
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
              <Microscope className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-light text-gray-900 tracking-tight">
              Observio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Product Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={(e) => handleDropdownToggle('product', e)}
                onTouchStart={(e) => handleDropdownToggle('product', e)}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-md hover:bg-gray-50 ${
                  activeDropdown === 'product' ? 'text-blue-600 bg-blue-50' : ''
                }`}
              >
                Product
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeDropdown === 'product' ? 'rotate-180' : ''
                }`} />
              </button>
              {renderEnhancedMegaMenu(productItems, activeDropdown === 'product')}
            </div>

            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={(e) => handleDropdownToggle('solutions', e)}
                onTouchStart={(e) => handleDropdownToggle('solutions', e)}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-md hover:bg-gray-50 ${
                  activeDropdown === 'solutions' ? 'text-blue-600 bg-blue-50' : ''
                }`}
              >
                Solutions
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeDropdown === 'solutions' ? 'rotate-180' : ''
                }`} />
              </button>
              {renderEnhancedMegaMenu(solutionsItems, activeDropdown === 'solutions')}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={(e) => handleDropdownToggle('resources', e)}
                onTouchStart={(e) => handleDropdownToggle('resources', e)}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-md hover:bg-gray-50 ${
                  activeDropdown === 'resources' ? 'text-blue-600 bg-blue-50' : ''
                }`}
              >
                Resources
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeDropdown === 'resources' ? 'rotate-180' : ''
                }`} />
              </button>
              {renderEnhancedMegaMenu(resourcesItems, activeDropdown === 'resources')}
            </div>

            {/* Pricing Link */}
            <Link 
              to="/pricing" 
              className={`text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-md hover:bg-gray-50 ${
                isActive('/pricing') ? 'text-blue-600 bg-blue-50' : ''
              }`}
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50" asChild>
              <Link to="/contact">Contact</Link>
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-md hover:bg-gray-50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 bg-white">
            <div className="space-y-4">
              <Link to="/pricing" className="block text-gray-600 hover:text-gray-900 py-2 px-3 rounded-md hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                Pricing
              </Link>
              <Link to="/contact" className="block text-gray-600 hover:text-gray-900 py-2 px-3 rounded-md hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/login" className="block text-gray-600 hover:text-gray-900 py-2 px-3 rounded-md hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md" asChild>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Start Free Trial</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay to close dropdown when clicking outside */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </header>
  );
};

export default Header;
