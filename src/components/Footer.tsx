
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

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-stone-100">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/solutions" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-stone-200 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/platform/integrations" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link to="/platform/security" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-stone-100">AI Employees</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/solutions/aria" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Aria (Executive Assistant)
                </Link>
              </li>
              <li>
                <Link to="/solutions/atlas" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Atlas (Support Specialist)
                </Link>
              </li>
              <li>
                <Link to="/solutions/felix" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Felix (Finance Analyst)
                </Link>
              </li>
              <li>
                <Link to="/solutions/sage" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Sage (Research Analyst)
                </Link>
              </li>
              <li>
                <Link to="/solutions/maya" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Maya (Marketing Specialist)
                </Link>
              </li>
              <li>
                <Link to="/solutions/nova" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Nova (Legal Specialist)
                </Link>
              </li>
              <li>
                <Link to="/solutions/emma" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Emma (Sales Specialist)
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-stone-100">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/customers/case-studies" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/resources/blog" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Webinars
                </Link>
              </li>
              <li>
                <Link to="/support/help-center" className="text-gray-400 hover:text-stone-200 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/support/documentation" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-stone-100">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-stone-200 transition-colors">
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
                <Link to="/support/contact" className="text-gray-400 hover:text-stone-200 transition-colors">
                  Support
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
