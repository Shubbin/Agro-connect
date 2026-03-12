import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, requireFarmer = false }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location to come back to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireFarmer && user?.role !== 'farmer') {
    // If they need to be a farmer but aren't, send to home or a restricted page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
