
import { Link } from 'react-router-dom';
import { Zap, Twitter, Linkedin, Github, Mail, Microscope } from 'lucide-react';

const Footer = () => {
  const linkSections = [
    { title: 'Product', links: [
      { name: 'Solutions', href: '/solutions' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Integrations', href: '/platform/integrations' },
      { name: 'Security', href: '/platform/security' },
    ]},
    { title: 'AI Employees', links: [
      { name: 'Aria (Executive Assistant)', href: '/solutions/aria' },
      { name: 'Atlas (Support Specialist)', href: '/solutions/atlas' },
      { name: 'Felix (Finance Analyst)', href: '/solutions/felix' },
      { name: 'Sage (Research Analyst)', href: '/solutions/sage' },
      { name: 'Maya (Marketing Specialist)', href: '/solutions/maya' },
      { name: 'Nova (HR Specialist)', href: '/solutions/nova' },
      { name: 'Emma (Sales Specialist)', href: '/solutions/emma' },
    ]},
    { title: 'Resources', links: [
      { name: 'Case Studies', href: '/customers/case-studies' },
      { name: 'Blog', href: '/resources/blog' },
      { name: 'Webinars', href: '/resources' },
      { name: 'FAQs', href: '/support/help-center' },
      { name: 'Documentation', href: '/support/documentation' },
    ]},
    { title: 'Company', links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
      { name: 'Support', href: '/support/contact' },
    ]},
  ];

  return (
    <footer className="bg-foreground text-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="p-2 rounded-lg bg-primary">
                <Microscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background">3days.ai</span>
            </Link>
            <p className="text-background/60 mb-6 max-w-md leading-relaxed">
              Transforming workplace productivity with AI-powered digital workers. 
              Reclaim three workdays per week and focus on what matters most.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" className="text-background/40 hover:text-background transition-colors p-2 rounded-lg hover:bg-background/10">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {linkSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4 text-background">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-background/50 hover:text-background/80 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 mt-12 pt-8">
          <p className="text-center text-background/40 mb-8 text-sm">
            Trusted by leading companies worldwide
          </p>
          <div className="flex justify-center items-center space-x-12 opacity-40">
            {['TECH CO', 'INNOV', 'FUTURE', 'DIGITAL'].map((name) => (
              <div key={name} className="w-20 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                <span className="text-xs font-light text-background/60">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/40 text-sm">© 2024 3days.ai. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-background/40 hover:text-background/70 text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
