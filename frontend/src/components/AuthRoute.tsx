import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';

interface AuthRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthRoute({ children, redirectTo = '/login' }: AuthRouteProps) {
  const { isAuthenticated, isLoading } = useUser();
  const location = useLocation();
  const [showingToast, setShowingToast] = useState(false);

  useEffect(() => {
    // Show toast only once when redirecting due to auth
    if (!isLoading && !isAuthenticated && !showingToast) {
      toast.info("Please log in to continue");
      setShowingToast(true);
    }
  }, [isLoading, isAuthenticated, showingToast]);

  // While checking auth status, return nothing (or a loading spinner)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the return URL
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
}
