
import { Link } from 'react-router-dom';
import { openCookieSettings } from './CookieConsent';

const ACCENT = 'oklch(0.62 0.16 35)';
const DISPLAY = '"Inter Tight", "Inter", system-ui, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const colHeadStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#5A5550',
  marginBottom: 16,
};

const linkStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: DISPLAY,
  fontSize: 15,
  color: '#1A1715',
  marginBottom: 10,
  textDecoration: 'none',
  transition: 'color 0.2s',
};

const FootLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    style={linkStyle}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = ACCENT; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#1A1715'; }}
    className="dark:!text-white/80 dark:hover:!text-white"
  >
    {children}
  </Link>
);

const FootAnchor = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    style={linkStyle}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = ACCENT; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#1A1715'; }}
    className="dark:!text-white/80 dark:hover:!text-white"
  >
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer
      style={{ borderTop: '1px solid rgba(26,23,21,0.08)', background: '#F2EEE6' }}
      className="dark:!bg-[#1a1916] dark:!border-white/8"
    >
      {/* Main grid */}
      <div
        style={{ maxWidth: 1480, margin: '0 auto', padding: '56px 56px 48px' }}
        className="grid gap-12"
      >
        <div
          style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 48 }}
          className="max-md:!grid-cols-2"
        >
          {/* Brand */}
          <div>
            <Link
              to="/"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                fontSize: 26,
                letterSpacing: '-0.025em',
                color: '#1A1715',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
              }}
              className="dark:!text-white"
            >
              <span style={{ fontWeight: 700 }}>3</span>
              Days
              <span style={{ color: ACCENT, fontWeight: 700 }}>.ai</span>
            </Link>
            <p
              style={{ fontFamily: DISPLAY, fontSize: 14.5, color: '#5A5550', lineHeight: 1.5, marginTop: 14, maxWidth: 280 }}
              className="dark:!text-white/50"
            >
              A team of digital coworkers for every employee. Built and hosted in the EU.
            </p>
          </div>

          {/* Product */}
          <div>
            <div style={colHeadStyle} className="dark:!text-white/50">Product</div>
            <FootLink to="/how-it-works">How it works</FootLink>
            <FootLink to="/platform/integrations">Integrations</FootLink>
            <FootLink to="/platform/security">Security</FootLink>
          </div>

          {/* Company */}
          <div>
            <div style={colHeadStyle} className="dark:!text-white/50">Company</div>
            <FootLink to="/about">About</FootLink>
            <FootLink to="/customers/case-studies">Customers</FootLink>
            <FootLink to="/careers">Careers</FootLink>
          </div>

          {/* Resources */}
          <div>
            <div style={colHeadStyle} className="dark:!text-white/50">Resources</div>
            <FootLink to="/support/documentation">Docs</FootLink>
            <FootLink to="/resources/blog">Blog</FootLink>
          </div>

          {/* Contact */}
          <div>
            <div style={colHeadStyle} className="dark:!text-white/50">Contact</div>
            <FootAnchor href="mailto:hello@3days.ai">hello@3days.ai</FootAnchor>
            <FootLink to="/contact">Berlin · Munich</FootLink>
            <FootLink to="/contact">Get in touch</FootLink>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(26,23,21,0.08)' }} className="dark:!border-white/8">
        <div
          style={{
            maxWidth: 1480,
            margin: '0 auto',
            padding: '22px 56px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: MONO,
            fontSize: 11.5,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#5A5550',
          }}
          className="dark:!text-white/40 max-md:!flex-col max-md:!gap-4 max-md:!px-6"
        >
          <span>© 2026 3Days GmbH</span>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a
              href="#"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              className="hover:!text-[#1A1715] dark:hover:!text-white"
            >
              Privacy
            </a>
            <a
              href="#"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              className="hover:!text-[#1A1715] dark:hover:!text-white"
            >
              Terms
            </a>
            <button
              type="button"
              onClick={openCookieSettings}
              style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', fontFamily: MONO, fontSize: 11.5, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s' }}
              className="hover:!text-[#1A1715] dark:hover:!text-white"
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
