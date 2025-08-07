import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";

interface NavigationGuardProps {
  children: React.ReactNode;
}

export default function NavigationGuard({ children }: NavigationGuardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is authenticated and tries to navigate away from dashboard
    if (user) {
      const allowedPaths = [
        '/dashboard',
        '/test-dashboard',
        '/admin-panel',
        '/admin',
        '/admin-login',
        '/eustersmain'
      ];
      
      const isAllowedPath = allowedPaths.some(path => 
        location.pathname.startsWith(path)
      );

      // If user is trying to access a non-dashboard page while logged in
      if (!isAllowedPath) {
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  return <>{children}</>;
}
