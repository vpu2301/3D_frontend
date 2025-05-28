
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const platformItems = [
    { name: 'AI Automation', href: '/platform/automation', description: 'Intelligent task automation' },
    { name: 'Workflow Builder', href: '/platform/workflow', description: 'Visual workflow creation' },
    { name: 'Analytics Dashboard', href: '/platform/analytics', description: 'Real-time insights' },
    { name: 'Integration Hub', href: '/platform/integrations', description: 'Connect your tools' }
  ];

  const solutionsItems = [
    { name: 'For Sales Teams', href: '/solutions/sales', description: 'Boost sales productivity' },
    { name: 'For Marketing', href: '/solutions/marketing', description: 'Automate campaigns' },
    { name: 'For Operations', href: '/solutions/operations', description: 'Streamline processes' },
    { name: 'For HR Teams', href: '/solutions/hr', description: 'People operations' }
  ];

  const companyItems = [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-2xl font-light text-gray-900 tracking-tight">
              3days.ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-8">
              {/* Platform Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg font-light text-gray-600 hover:text-gray-900 bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                  Platform
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[500px] p-6 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl">
                    <div className="grid grid-cols-2 gap-4">
                      {platformItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Solutions Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg font-light text-gray-600 hover:text-gray-900 bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[500px] p-6 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl">
                    <div className="grid grid-cols-2 gap-4">
                      {solutionsItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Company Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg font-light text-gray-600 hover:text-gray-900 bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[300px] p-6 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl">
                    <div className="space-y-2">
                      {companyItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-gray-900 hover:text-blue-600">
                            {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-lg font-light text-gray-600 hover:text-gray-900 px-6 py-2 rounded-full"
            >
              Sign In
            </Button>
            <Button 
              className="bg-black hover:bg-gray-800 text-white text-lg px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-6 space-y-1 bg-white/95 backdrop-blur-xl border-t border-gray-100 rounded-b-2xl">
              {/* Mobile Platform */}
              <div className="px-6 py-4">
                <div className="text-lg font-medium text-gray-900 mb-3">Platform</div>
                <div className="space-y-2 ml-4">
                  {platformItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block py-2 text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Solutions */}
              <div className="px-6 py-4">
                <div className="text-lg font-medium text-gray-900 mb-3">Solutions</div>
                <div className="space-y-2 ml-4">
                  {solutionsItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block py-2 text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Company */}
              <div className="px-6 py-4">
                <div className="text-lg font-medium text-gray-900 mb-3">Company</div>
                <div className="space-y-2 ml-4">
                  {companyItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block py-2 text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="px-6 pt-4 space-y-3">
                <Button variant="ghost" className="w-full text-lg font-light rounded-full py-3">
                  Sign In
                </Button>
                <Button className="w-full bg-black hover:bg-gray-800 text-white text-lg rounded-full py-3">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
