import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import DotsBackground from './DotsBackground';
import CookieConsent from './CookieConsent';
import '@/styles/marketing.css';

/**
 * The public marketing shell. `site3d` scopes the 3days.ai design system
 * (tokens, type, primitives) to these pages so the logged-in platform keeps
 * its own look.
 */
const PublicLayout = () => (
  <div className="site3d">
    <DotsBackground />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Header />
      <Outlet />
      <Footer />
    </div>
    <CookieConsent />
  </div>
);

export default PublicLayout;
