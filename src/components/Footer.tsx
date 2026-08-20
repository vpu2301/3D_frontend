import { Link } from 'react-router-dom';
import { Bot, Twitter, Linkedin, Github, Mail, Apple, Smartphone } from 'lucide-react';
import { openCookieSettings } from './CookieConsent';

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Solutions', to: '/solutions/sales' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Integrations', to: '/platform/integrations' },
      { label: 'Security', to: '/platform/security' },
    ],
  },
  {
    title: 'AI Employees',
    links: [
      { label: 'Aria', to: '/solutions/aria' },
      { label: 'Atlas', to: '/solutions/atlas' },
      { label: 'Felix', to: '/solutions/felix' },
      { label: 'Sage', to: '/solutions/sage' },
      { label: 'Maya', to: '/solutions/maya' },
      { label: 'Nova', to: '/solutions/nova' },
      { label: 'Emma', to: '/solutions/emma' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Case Studies', to: '/customers/case-studies' },
      { label: 'Blog', to: '/resources/blog' },
      { label: 'Help Center', to: '/support/help-center' },
      { label: 'Documentation', to: '/support/documentation' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
      { label: 'Support', to: '/support/contact' },
    ],
  },
];

const SOCIALS = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Github, label: 'GitHub' },
  { icon: Mail, label: 'Email' },
];

const Footer = () => (
  <footer className="px-6 pb-10 pt-14 lg:px-8">
    <div className="mx-auto max-w-[1280px]">
      {/* CTA strip */}
      <div className="m-dark-panel relative mb-8 overflow-hidden px-8 py-10 sm:px-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xl font-semibold tracking-[-0.02em] text-white">Ready to reclaim your workweek?</p>
            <p className="mt-1.5 text-sm text-[color:var(--on-dark-2)]">
              Join 500+ teams saving 3 days per week with AI.
            </p>
          </div>
          <Link to="/signup" className="m-btn m-btn-primary flex-shrink-0">
            Start for free
            <span className="m-arrow">→</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 border-b border-[color:var(--line)] pb-12 md:grid-cols-6">
        {/* Wordmark and description */}
        <div className="md:col-span-2">
          <Link to="/" className="mb-5 flex items-center gap-2.5">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[9px] bg-[color:var(--ink)]">
              <Bot className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="m-wordmark text-[18px]">
              3Days<span>.ai</span>
            </span>
          </Link>
          <p className="max-w-xs text-[15px] leading-relaxed text-[color:var(--text-2)]">
            Transforming workplace productivity with AI-powered digital workers. Reclaim three workdays per week
            and focus on what matters most.
          </p>

          <div className="mt-6 flex gap-5">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="text-[color:var(--text-4)] transition-colors hover:text-[color:var(--ink)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="m-eyebrow-muted mb-3">Get the app</h3>
            <div className="flex max-w-xs flex-col gap-2 sm:flex-row">
              <a
                href="#"
                aria-label="Download on the App Store"
                className="flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-2.5 transition-colors hover:border-[color:var(--ink)]"
              >
                <Apple className="h-5 w-5 text-[color:var(--ink)]" />
                <span className="text-left leading-tight">
                  <span className="block text-[9px] uppercase tracking-wider text-[color:var(--text-4)]">Download on</span>
                  <span className="block text-xs font-semibold text-[color:var(--ink)]">App Store</span>
                </span>
              </a>
              <a
                href="#"
                aria-label="Get it on Google Play"
                className="flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-2.5 transition-colors hover:border-[color:var(--ink)]"
              >
                <Smartphone className="h-5 w-5 text-[color:var(--ink)]" />
                <span className="text-left leading-tight">
                  <span className="block text-[9px] uppercase tracking-wider text-[color:var(--text-4)]">Get it on</span>
                  <span className="block text-xs font-semibold text-[color:var(--ink)]">Google Play</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="m-eyebrow-muted mb-4">{column.title}</h3>
            <ul className="space-y-2.5">
              {column.links.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-[15px] text-[color:var(--text-1)] transition-colors hover:text-[color:var(--ink)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex flex-col items-center justify-between gap-4 pt-6 text-[13px] text-[color:var(--text-4)] md:flex-row">
        <span>© 2026 3Days.ai. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="transition-colors hover:text-[color:var(--ink)]">Privacy Policy</a>
          <a href="#" className="transition-colors hover:text-[color:var(--ink)]">Terms of Service</a>
          <button type="button" onClick={openCookieSettings} className="transition-colors hover:text-[color:var(--ink)]">
            Cookie Settings
          </button>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
