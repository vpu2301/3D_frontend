
import { Link } from 'react-router-dom';
import { Bot, Twitter, Linkedin, Github, Mail, ArrowRight, Apple, Smartphone } from 'lucide-react';
import { openCookieSettings } from './CookieConsent';

const Footer = () => {
  return (
    <footer className="bg-[#1a1916] dark:bg-[#1a1916] text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-7 h-7 bg-white/90 flex items-center justify-center flex-shrink-0" style={{ borderRadius: '4px' }}>
                <Bot className="w-3.5 h-3.5 text-[#141413]" />
              </div>
              <span className="text-white font-semibold text-base tracking-tight">3Days.ai</span>
            </Link>
            <p className="text-white/40 mb-7 max-w-xs leading-relaxed text-sm">
              Transforming workplace productivity with AI-powered digital workers.
              Reclaim three workdays per week and focus on what matters most.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter" className="text-white/25 hover:text-white/65 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-white/25 hover:text-white/65 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="GitHub" className="text-white/25 hover:text-white/65 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Email" className="text-white/25 hover:text-white/65 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-8">
              <h3 className="text-white/55 text-[10px] font-semibold uppercase tracking-widest mb-3">Get the app</h3>
              <div className="flex flex-col sm:flex-row gap-2 max-w-xs">
                <a
                  href="#"
                  aria-label="Download on the App Store"
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  style={{ borderRadius: '4px' }}
                >
                  <Apple className="w-5 h-5 text-white/80" />
                  <div className="text-left leading-tight">
                    <div className="text-white/45 text-[9px] uppercase tracking-wider">Download on</div>
                    <div className="text-white/85 text-xs font-medium">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  aria-label="Get it on Google Play"
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  style={{ borderRadius: '4px' }}
                >
                  <Smartphone className="w-5 h-5 text-white/80" />
                  <div className="text-left leading-tight">
                    <div className="text-white/45 text-[9px] uppercase tracking-wider">Get it on</div>
                    <div className="text-white/85 text-xs font-medium">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white/55 text-[10px] font-semibold uppercase tracking-widest mb-5">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/solutions/sales" className="text-white/38 hover:text-white/75 text-sm transition-colors">Solutions</Link></li>
              <li><Link to="/pricing" className="text-white/38 hover:text-white/75 text-sm transition-colors">Pricing</Link></li>
              <li><Link to="/how-it-works" className="text-white/38 hover:text-white/75 text-sm transition-colors">How It Works</Link></li>
              <li><Link to="/platform/integrations" className="text-white/38 hover:text-white/75 text-sm transition-colors">Integrations</Link></li>
              <li><Link to="/platform/security" className="text-white/38 hover:text-white/75 text-sm transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* AI Employees */}
          <div>
            <h3 className="text-white/55 text-[10px] font-semibold uppercase tracking-widest mb-5">AI Employees</h3>
            <ul className="space-y-3">
              <li><Link to="/solutions/aria" className="text-white/38 hover:text-white/75 text-sm transition-colors">Aria</Link></li>
              <li><Link to="/solutions/atlas" className="text-white/38 hover:text-white/75 text-sm transition-colors">Atlas</Link></li>
              <li><Link to="/solutions/felix" className="text-white/38 hover:text-white/75 text-sm transition-colors">Felix</Link></li>
              <li><Link to="/solutions/sage" className="text-white/38 hover:text-white/75 text-sm transition-colors">Sage</Link></li>
              <li><Link to="/solutions/maya" className="text-white/38 hover:text-white/75 text-sm transition-colors">Maya</Link></li>
              <li><Link to="/solutions/nova" className="text-white/38 hover:text-white/75 text-sm transition-colors">Nova</Link></li>
              <li><Link to="/solutions/emma" className="text-white/38 hover:text-white/75 text-sm transition-colors">Emma</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white/55 text-[10px] font-semibold uppercase tracking-widest mb-5">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/customers/case-studies" className="text-white/38 hover:text-white/75 text-sm transition-colors">Case Studies</Link></li>
              <li><Link to="/resources/blog" className="text-white/38 hover:text-white/75 text-sm transition-colors">Blog</Link></li>
              <li><Link to="/support/help-center" className="text-white/38 hover:text-white/75 text-sm transition-colors">Help Center</Link></li>
              <li><Link to="/support/documentation" className="text-white/38 hover:text-white/75 text-sm transition-colors">Documentation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white/55 text-[10px] font-semibold uppercase tracking-widest mb-5">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-white/38 hover:text-white/75 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-white/38 hover:text-white/75 text-sm transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-white/38 hover:text-white/75 text-sm transition-colors">Contact</Link></li>
              <li><Link to="/support/contact" className="text-white/38 hover:text-white/75 text-sm transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        {/* CTA strip */}
        <div className="border-t border-white/8 mt-14 pt-10 mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-white/70 font-semibold text-base mb-1">Ready to reclaim your workweek?</p>
              <p className="text-white/35 text-sm">Join 500+ teams saving 3 days per week with AI.</p>
            </div>
            <Link to="/signup">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#f5f3ee] text-[#141413] text-sm font-medium transition-all duration-200 flex-shrink-0" style={{ borderRadius: '4px' }}>
                Start for free
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/22 text-sm">© 2026 3Days.ai. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-white/22 hover:text-white/50 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/22 hover:text-white/50 text-sm transition-colors">Terms of Service</a>
            <button
              type="button"
              onClick={openCookieSettings}
              className="text-white/22 hover:text-white/50 text-sm transition-colors"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
