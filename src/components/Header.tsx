
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Features', href: '/features' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
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
          <nav className="hidden md:flex items-center space-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-lg font-light transition-colors duration-300 hover:text-gray-900 ${
                  isActive(item.href)
                    ? 'text-gray-900'
                    : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

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
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-6 py-4 text-lg font-light rounded-xl transition-colors duration-300 ${
                    isActive(item.href)
                      ? 'text-gray-900 bg-gray-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
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
