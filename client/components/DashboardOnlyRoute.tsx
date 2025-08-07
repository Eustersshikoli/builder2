import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface DashboardOnlyRouteProps {
  children: React.ReactNode;
}

export default function DashboardOnlyRoute({ children }: DashboardOnlyRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-forex-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-forex-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user is authenticated but trying to access non-dashboard routes
  // redirect them back to dashboard (this creates the "locked" behavior)
  const allowedPaths = ['/dashboard', '/test-dashboard'];
  const isDashboardPath = allowedPaths.some(path => location.pathname.startsWith(path));
  
  if (!isDashboardPath) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
