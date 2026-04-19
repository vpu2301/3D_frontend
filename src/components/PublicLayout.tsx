import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import DotsBackground from './DotsBackground';

const PublicLayout = () => (
  <>
    <DotsBackground />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  </>
);

export default PublicLayout;
