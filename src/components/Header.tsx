
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const platformItems = [
    { 
      category: 'Products',
      items: [
        { name: 'AI Automation', href: '/platform/automation', description: 'AI-powered task automation and workflow management' },
        { name: 'Workflow Builder', href: '/platform/workflow', description: 'Visual workflow creation and process design' },
        { name: 'Analytics Dashboard', href: '/platform/analytics', description: 'Real-time insights and performance tracking' },
        { name: 'Integration Hub', href: '/platform/integrations', description: 'Connect your existing tools and platforms' },
        { name: 'Document Processing', href: '/platform/documents', description: 'AI-powered document analysis and extraction' },
        { name: 'Task Management', href: '/platform/tasks', description: 'Smart task orchestration and scheduling' },
        { name: 'API Gateway', href: '/platform/api', description: 'Unified API access and management' },
        { name: 'Security Center', href: '/platform/security', description: 'Enterprise-grade protection and compliance' }
      ]
    }
  ];

  const solutionsItems = [
    {
      category: 'Solutions',
      items: [
        { name: 'Open Platform', href: '/solutions/platform', description: 'Comprehensive automation platform' },
        { name: 'Safety & Risk', href: '/solutions/safety', description: 'Risk management and safety protocols' },
        { name: 'Compliance', href: '/solutions/compliance', description: 'Regulatory compliance automation' },
        { name: 'Fuel & Energy', href: '/solutions/energy', description: 'Energy management and optimization' },
        { name: 'Security', href: '/solutions/security', description: 'Security monitoring and response' },
        { name: 'Efficiency', href: '/solutions/efficiency', description: 'Operational efficiency improvements' },
        { name: 'Sustainability', href: '/solutions/sustainability', description: 'Environmental sustainability tracking' }
      ]
    },
    {
      category: 'Industry',
      items: [
        { name: 'Public Sector', href: '/solutions/public-sector', description: 'Government and public services' },
        { name: 'Construction', href: '/solutions/construction', description: 'Construction project management' },
        { name: 'Transportation & Logistics', href: '/solutions/transportation', description: 'Supply chain and logistics' },
        { name: 'Field Services', href: '/solutions/field-services', description: 'Field operations management' },
        { name: 'Food & Beverage', href: '/solutions/food-beverage', description: 'Food industry compliance' },
        { name: 'Utilities', href: '/solutions/utilities', description: 'Utility operations and maintenance' },
        { name: 'Passenger Transit', href: '/solutions/transit', description: 'Public transportation systems' }
      ]
    },
    {
      category: 'Integrations',
      items: [
        { name: 'App Marketplace', href: '/integrations/marketplace', description: 'Pre-built application integrations' },
        { name: 'OEM Integrations', href: '/integrations/oem', description: 'Original equipment manufacturer solutions' },
        { name: 'Developer API', href: '/integrations/api', description: 'Developer tools and API access' },
        { name: 'Experts Marketplace', href: '/integrations/experts', description: 'Professional services and consulting' },
        { name: 'Developer Portal', href: '/integrations/portal', description: 'Developer resources and documentation' }
      ]
    }
  ];

  const resourcesItems = [
    {
      category: 'Support',
      items: [
        { name: 'Customer Services', href: '/support/customer-services', description: 'Get help from our support team' },
        { name: 'Education & Training', href: '/support/training', description: 'Learn how to use our platform' },
        { name: 'Developer API', href: '/support/api', description: 'API documentation and guides' }
      ]
    },
    {
      category: 'Resources',
      items: [
        { name: 'Knowledge Base', href: '/resources/knowledge-base', description: 'Comprehensive guides and tutorials' },
        { name: 'Developer Portal', href: '/resources/developer-portal', description: 'Developer tools and resources' },
        { name: 'Contact Us', href: '/contact', description: 'Get in touch with our team' },
        { name: 'Customer Stories', href: '/resources/stories', description: 'Success stories from our customers' },
        { name: 'Blog', href: '/resources/blog', description: 'Latest news and insights' },
        { name: 'Guides', href: '/resources/guides', description: 'Step-by-step implementation guides' },
        { name: 'Product Tours', href: '/resources/tours', description: 'Interactive product demonstrations' },
        { name: 'Video Library', href: '/resources/videos', description: 'Educational videos and webinars' }
      ]
    },
    {
      category: 'Events',
      items: [
        { name: 'Events', href: '/events', description: 'Upcoming conferences and meetups' },
        { name: 'Webinars', href: '/events/webinars', description: 'Live and recorded webinars' }
      ]
    }
  ];

  const aboutItems = [
    {
      category: 'Company',
      items: [
        { name: 'About Us', href: '/company', description: 'Learn about our mission and values' },
        { name: '3days.ai Ventures', href: '/company/ventures', description: 'Our investment and partnership initiatives' },
        { name: 'Partner Programs', href: '/company/partners', description: 'Join our partner ecosystem' }
      ]
    },
    {
      category: 'Careers',
      items: [
        { name: 'Investor Relations', href: '/careers/investors', description: 'Information for investors' },
        { name: 'Contact Us', href: '/contact', description: 'Get in touch with our team' },
        { name: '3days.ai Jobs', href: '/careers', description: 'Join our growing team' }
      ]
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const renderMegaMenu = (items: any[], isOpen: boolean) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl z-50">
        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h3 className="font-medium text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.items.map((item: any, itemIndex: number) => (
                    <Link
                      key={itemIndex}
                      to={item.href}
                      className="block group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </div>
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
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
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
                onClick={() => handleDropdownToggle('solutions')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                Solutions
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {renderMegaMenu(solutionsItems, activeDropdown === 'solutions')}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('resources')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                Resources
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {renderMegaMenu(resourcesItems, activeDropdown === 'resources')}
            </div>

            {/* About Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('about')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {renderMegaMenu(aboutItems, activeDropdown === 'about')}
            </div>

            {/* Pricing Link */}
            <Link 
              to="/pricing" 
              className={`text-gray-600 hover:text-gray-900 transition-colors ${
                isActive('/pricing') ? 'text-blue-600' : ''
              }`}
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" asChild>
              <Link to="/contact">Contact</Link>
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md" asChild>
              <Link to="/get-started">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-4">
              <Link to="/pricing" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                Pricing
              </Link>
              <Link to="/contact" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/login" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link to="/get-started" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay to close dropdown when clicking outside */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </header>
  );
};

export default Header;
