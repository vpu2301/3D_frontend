
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeSelector from './ThemeSelector';
import LanguageSwitcher from './LanguageSwitcher';

const ACCENT = 'oklch(0.62 0.16 35)';
const DISPLAY = '"Inter Tight", "Inter", system-ui, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        background: 'color-mix(in srgb, #F2EEE6 88%, transparent)',
        backdropFilter: 'blur(14px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.1)',
        borderBottom: 'none',
      }}
      className="dark:!bg-[#181512]/95"
    >
      <div style={{ maxWidth: 1480, margin: '0 auto', padding: '0 56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 48, height: 64 }}>

          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: '-0.025em',
              color: '#1A1715',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexShrink: 0,
              textDecoration: 'none',
            }}
            className="dark:!text-white"
          >
            <span style={{ fontWeight: 700 }}>3</span>
            Days
            <span style={{ color: ACCENT, fontWeight: 700 }}>.ai</span>
          </Link>

          {/* Desktop nav links */}
          <nav style={{ display: 'flex', gap: 32, marginLeft: 24 }} className="hidden md:flex">
            {[
              { label: 'How it works', href: '/#how' },
              { label: 'For your team', href: '/#roles' },
              { label: 'EU-sovereign', href: '/#sovereign' },
              { label: 'Pricing', href: '/pricing' },
            ].map(({ label, href }) => (
              href.startsWith('/#') ? (
                <a
                  key={href}
                  href={href}
                  style={{ fontFamily: DISPLAY, fontSize: 14.5, fontWeight: 500, color: '#5A5550', transition: 'color 0.2s', textDecoration: 'none' }}
                  className="hover:!text-[#1A1715] dark:!text-white/60 dark:hover:!text-white"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  to={href}
                  style={{ fontFamily: DISPLAY, fontSize: 14.5, fontWeight: 500, color: '#5A5550', transition: 'color 0.2s', textDecoration: 'none' }}
                  className="hover:!text-[#1A1715] dark:!text-white/60 dark:hover:!text-white"
                >
                  {label}
                </Link>
              )
            ))}
          </nav>

          <div style={{ flex: 1 }} />

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center" style={{ gap: 16 }}>
            <LanguageSwitcher />
            <ThemeSelector />
            <a
              href="/#talk"
              style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A5550', transition: 'color 0.2s', textDecoration: 'none' }}
              className="hover:!text-[#1A1715] dark:!text-white/55 dark:hover:!text-white"
            >
              Talk to sales
            </a>
            <Link
              to="/login"
              style={{ fontFamily: DISPLAY, fontSize: 14, color: 'rgba(26,23,21,0.55)', transition: 'color 0.2s', padding: '8px 12px', textDecoration: 'none' }}
              className="hover:!text-[#1A1715] dark:!text-white/50 dark:hover:!text-white"
            >
              {t('common.signIn')}
            </Link>
            <Link to="/signup">
              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 22px',
                  fontFamily: DISPLAY,
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  borderRadius: 999,
                  border: '1px solid #1A1715',
                  background: '#1A1715',
                  color: '#F2EEE6',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => {
                  const b = e.currentTarget;
                  b.style.background = ACCENT;
                  b.style.borderColor = ACCENT;
                  b.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget;
                  b.style.background = '#1A1715';
                  b.style.borderColor = '#1A1715';
                  b.style.transform = 'none';
                }}
              >
                Book a demo <span>→</span>
              </button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#1A1715]/60 hover:text-[#1A1715] dark:text-white/60 dark:hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          style={{ borderTop: '1px solid rgba(26,23,21,0.08)' }}
          className="md:hidden bg-[#F2EEE6]/98 backdrop-blur-xl dark:bg-[#181512]/98 dark:!border-white/8"
        >
          <div style={{ maxWidth: 1480, margin: '0 auto', padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: 'How it works', href: '/#how', isAnchor: true },
                { label: 'For your team', href: '/#roles', isAnchor: true },
                { label: 'EU-sovereign', href: '/#sovereign', isAnchor: true },
                { label: 'Pricing', href: '/pricing', isAnchor: false },
              ].map(({ label, href, isAnchor }) =>
                isAnchor ? (
                  <a
                    key={href}
                    href={href}
                    style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 500, color: '#5A5550', padding: '12px', textDecoration: 'none' }}
                    className="hover:!text-[#1A1715] dark:!text-white/55 dark:hover:!text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={href}
                    to={href}
                    style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 500, color: '#5A5550', padding: '12px', textDecoration: 'none' }}
                    className="hover:!text-[#1A1715] dark:!text-white/55 dark:hover:!text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                )
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', marginTop: 8 }}>
              <LanguageSwitcher />
              <ThemeSelector />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <Link
                to="/login"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px 16px',
                  border: '1px solid rgba(26,23,21,0.12)',
                  fontFamily: DISPLAY,
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'rgba(26,23,21,0.6)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                className="hover:!text-[#1A1715] hover:!border-[#1A1715]/20 dark:!border-white/12 dark:!text-white/55 dark:hover:!text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.signIn')}
              </Link>
              <Link
                to="/signup"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px 16px',
                  background: '#1A1715',
                  fontFamily: DISPLAY,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#F2EEE6',
                  borderRadius: 999,
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                className="hover:!bg-[#2a2a28] dark:!bg-white dark:!text-[#1A1715]"
                onClick={() => setIsMenuOpen(false)}
              >
                Book a demo →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
