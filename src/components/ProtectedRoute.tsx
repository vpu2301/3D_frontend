
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PlatformAppsBar from '@/components/dashboard/PlatformAppsBar';
import '@/styles/platform.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      console.log('ProtectedRoute: Checking authentication...');
      const authStatus = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated');
      const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');

      console.log('ProtectedRoute: Auth status:', authStatus);
      console.log('ProtectedRoute: User email:', userEmail);

      const isAuth = authStatus === 'true';
      setIsAuthenticated(isAuth);
      setIsChecking(false);
      
      console.log('ProtectedRoute: Final auth decision:', isAuth);
    };

    // Add a small delay to ensure localStorage is updated
    const timeoutId = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  console.log('ProtectedRoute: Rendering with state:', { isChecking, isAuthenticated });

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: Authenticated, rendering children');
  return (
    <div className="platform min-h-screen md:pr-14">
      {children}
      <PlatformAppsBar />
    </div>
  );
};

export default ProtectedRoute;
