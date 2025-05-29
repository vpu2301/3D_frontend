
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
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
    }
  ];

  const resourcesItems = [
    {
      category: 'Platform',
      items: [
        { name: 'AI Automation', href: '/platform/automation' },
        { name: 'Workflow Builder', href: '/platform/workflow' },
        { name: 'Analytics Dashboard', href: '/platform/analytics' },
        { name: 'Integrations Hub', href: '/platform/integrations' },
        { name: 'Document Management', href: '/platform/documents' },
        { name: 'Task Management', href: '/platform/tasks' },
        { name: 'API Gateway', href: '/platform/api' },
        { name: 'Security Center', href: '/platform/security' }
      ]
    },
    {
      category: 'Resources',
      items: [
        { name: 'Blog', href: '/resources/blog' },
        { name: 'Watch Demo', href: '/watch-demo' },
        { name: 'Schedule Demo', href: '/schedule-demo' },
        { name: 'Contact Support', href: '/contact' }
      ]
    },
    {
      category: 'Company',
      items: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
        { name: 'Pricing', href: '/pricing' }
      ]
    }
  ];

  const aboutItems = [
    {
      category: 'Company',
      items: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Story', href: '/company' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' }
      ]
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleDropdownToggle = (dropdown: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const renderMegaMenu = (items: any[], isOpen: boolean) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-4xl bg-white border border-gray-200 shadow-xl z-50 rounded-lg mt-1">
        <div className="py-6 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wide border-b border-gray-200 pb-2">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((item: any, itemIndex: number) => (
                    <Link
                      key={itemIndex}
                      to={item.href}
                      className="block text-gray-600 hover:text-blue-600 transition-colors text-sm py-1 px-2 rounded-md hover:bg-gray-50"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.name}
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
                onClick={(e) => handleDropdownToggle('solutions', e)}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-md hover:bg-gray-50 ${
                  activeDropdown === 'solutions' ? 'text-blue-600 bg-blue-50' : ''
                }`}
              >
                Solutions
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeDropdown === 'solutions' ? 'rotate-180' : ''
                }`} />
              </button>
              {renderMegaMenu(solutionsItems, activeDropdown === 'solutions')}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => handleDropdownToggle('resources', e)}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-md hover:bg-gray-50 ${
                  activeDropdown === 'resources' ? 'text-blue-600 bg-blue-50' : ''
                }`}
              >
                Resources
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeDropdown === 'resources' ? 'rotate-180' : ''
                }`} />
              </button>
              {renderMegaMenu(resourcesItems, activeDropdown === 'resources')}
            </div>

            {/* About Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => handleDropdownToggle('about', e)}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-md hover:bg-gray-50 ${
                  activeDropdown === 'about' ? 'text-blue-600 bg-blue-50' : ''
                }`}
              >
                About
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeDropdown === 'about' ? 'rotate-180' : ''
                }`} />
              </button>
              {renderMegaMenu(aboutItems, activeDropdown === 'about')}
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
