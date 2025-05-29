
import { Link } from 'react-router-dom';
import { Zap, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">3days.ai</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Transforming workplace productivity with AI-powered digital workers. 
              Reclaim three workdays per week and focus on what matters most.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-stone-100">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/platform/automation" className="text-gray-400 hover:text-stone-200 transition-colors">
                  AI Automation
                </Link>
              </li>
              <li>
                <Link to="/platform/workflow" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Workflow Builder
                </Link>
              </li>
              <li>
                <Link to="/platform/analytics" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/platform/integrations" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link to="/platform/api" className="text-gray-400 hover:text-stone-200 transition-colors">
                  API Gateway
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-stone-100">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/solutions/sales" className="text-gray-400 hover:text-stone-200 transition-colors">
                  For Sales Teams
                </Link>
              </li>
              <li>
                <Link to="/solutions/marketing" className="text-gray-400 hover:text-stone-200 transition-colors">
                  For Marketing
                </Link>
              </li>
              <li>
                <Link to="/solutions/operations" className="text-gray-400 hover:text-stone-200 transition-colors">
                  For Operations
                </Link>
              </li>
              <li>
                <Link to="/solutions/hr" className="text-gray-400 hover:text-stone-200 transition-colors">
                  For HR Teams
                </Link>
              </li>
              <li>
                <Link to="/solutions/finance" className="text-gray-400 hover:text-stone-200 transition-colors">
                  For Finance
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-stone-100">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/resources/blog" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/resources/guides" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/watch-demo" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link to="/resources/videos" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Video Library
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-stone-100">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/company" className="text-gray-400 hover:text-stone-200 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/company/partners" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Company Logos */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-400 mb-8 text-sm">
            Trusted by leading companies worldwide
          </p>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            {/* Light-colored Japanese-style brand representations */}
            <div className="w-20 h-8 bg-gradient-to-r from-stone-300 to-stone-400 rounded-sm flex items-center justify-center">
              <span className="text-xs font-light text-gray-700">TECH CO</span>
            </div>
            <div className="w-20 h-8 bg-gradient-to-r from-stone-200 to-stone-300 rounded-sm flex items-center justify-center">
              <span className="text-xs font-light text-gray-700">INNOV</span>
            </div>
            <div className="w-20 h-8 bg-gradient-to-r from-stone-300 to-stone-400 rounded-sm flex items-center justify-center">
              <span className="text-xs font-light text-gray-700">FUTURE</span>
            </div>
            <div className="w-20 h-8 bg-gradient-to-r from-stone-200 to-stone-300 rounded-sm flex items-center justify-center">
              <span className="text-xs font-light text-gray-700">DIGITAL</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 3days.ai. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-stone-200 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-stone-200 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-stone-200 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
