
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Building2, Users, BookOpen, Play, Calendar, MessageCircle, Heart, Trophy, Headphones } from 'lucide-react';
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

  const solutionsItems = [
    {
      category: 'BUSINESS SOLUTIONS',
      items: [
        { name: 'Sales Automation', href: '/solutions/sales' },
        { name: 'Marketing Operations', href: '/solutions/marketing' },
        { name: 'Business Operations', href: '/solutions/operations' },
        { name: 'Human Resources', href: '/solutions/hr' },
        { name: 'Finance & Accounting', href: '/solutions/finance' },
        { name: 'Customer Support', href: '/solutions/support' },
        { name: 'IT Operations', href: '/solutions/it' },
        { name: 'Legal Workflows', href: '/solutions/legal' }
      ]
    },
    {
      category: 'USE CASES',
      items: [
        { name: 'Document Processing', href: '/use-cases/document-processing' },
        { name: 'Data Entry Automation', href: '/use-cases/data-entry' },
        { name: 'Customer Onboarding', href: '/use-cases/customer-onboarding' },
        { name: 'Compliance Monitoring', href: '/use-cases/compliance' },
        { name: 'Report Generation', href: '/use-cases/reports' },
        { name: 'Email Management', href: '/use-cases/email-management' }
      ]
    },
    {
      category: 'ROLES',
      items: [
        { name: 'For CEOs', href: '/roles/ceo' },
        { name: 'For Operations Managers', href: '/roles/operations-manager' },
        { name: 'For IT Directors', href: '/roles/it-director' },
        { name: 'For Finance Teams', href: '/roles/finance-teams' },
        { name: 'For HR Professionals', href: '/roles/hr-professionals' },
        { name: 'For Sales Leaders', href: '/roles/sales-leaders' }
      ]
    }
  ];

  const productItems = [
    {
      category: 'Product',
      icon: Building2,
      items: [
        { name: 'AI Assistants', href: '/product/ai-assistants' },
        { name: 'Agents', href: '/product/agents' },
        { name: 'Workflow Builder', href: '/product/workflow-builder' },
        { name: 'Analytics Dashboard', href: '/product/analytics' },
        { name: 'Integrations Hub', href: '/product/integrations' },
        { name: 'API Gateway', href: '/product/api' }
      ]
    },
    {
      category: 'Resources',
      icon: BookOpen,
      items: [
        { name: 'Blog', href: '/resources/blog' },
        { name: 'Watch Demo', href: '/watch-demo', icon: Play },
        { name: 'Schedule Demo', href: '/schedule-demo', icon: Calendar },
        { name: 'Contact Support', href: '/contact', icon: MessageCircle }
      ]
    }
  ];

  const companyItems = [
    {
      category: 'Company',
      icon: Building2,
      items: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Story', href: '/company' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' }
      ]
    }
  ];

  const customersItems = [
    {
      category: 'Customer Stories',
      icon: Heart,
      items: [
        { name: 'Success Stories', href: '/customers/success-stories' },
        { name: 'Case Studies', href: '/customers/case-studies' },
        { name: 'Testimonials', href: '/customers/testimonials' },
        { name: 'ROI Calculator', href: '/customers/roi-calculator' }
      ]
    },
    {
      category: 'Customer Success',
      icon: Trophy,
      items: [
        { name: 'Implementation Guide', href: '/customers/implementation' },
        { name: 'Best Practices', href: '/customers/best-practices' },
        { name: 'Training Resources', href: '/customers/training' },
        { name: 'Community Forum', href: '/customers/community' }
      ]
    },
    {
      category: 'Support',
      icon: Headphones,
      items: [
        { name: 'Help Center', href: '/support/help-center' },
        { name: 'Documentation', href: '/support/documentation' },
        { name: 'Contact Support', href: '/contact' },
        { name: 'System Status', href: '/support/status' }
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
      <div className="absolute top-full left-0 right-0 w-full bg-white border border-gray-200 shadow-2xl z-50 rounded-xl mt-2 overflow-hidden mx-4 max-w-5xl lg:left-1/2 lg:right-auto lg:transform lg:-translate-x-1/2">
        <div className="py-8 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
                  {category.icon && <category.icon className="h-5 w-5 text-blue-600" />}
                  <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    {category.category}
                  </h3>
                </div>
                <div className="space-y-2">
                  {category.items.map((item: any, itemIndex: number) => (
                    <Link
                      key={itemIndex}
                      to={item.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm py-2 px-3 rounded-lg hover:bg-blue-50 group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.icon && <item.icon className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />}
                      <span>{item.name}</span>
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
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-light text-gray-900 tracking-tight">
              3days.ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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

            {/* Customers Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={(e) => handleDropdownToggle('customers', e)}
                onTouchStart={(e) => handleDropdownToggle('customers', e)}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-md hover:bg-gray-50 ${
                  activeDropdown === 'customers' ? 'text-blue-600 bg-blue-50' : ''
                }`}
              >
                Customers
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeDropdown === 'customers' ? 'rotate-180' : ''
                }`} />
              </button>
              {renderEnhancedMegaMenu(customersItems, activeDropdown === 'customers')}
            </div>

            {/* Company Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={(e) => handleDropdownToggle('company', e)}
                onTouchStart={(e) => handleDropdownToggle('company', e)}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-md hover:bg-gray-50 ${
                  activeDropdown === 'company' ? 'text-blue-600 bg-blue-50' : ''
                }`}
              >
                Company
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeDropdown === 'company' ? 'rotate-180' : ''
                }`} />
              </button>
              {renderEnhancedMegaMenu(companyItems, activeDropdown === 'company')}
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
              <Link to="/get-started">Get Started</Link>
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
                <Link to="/get-started" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
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
