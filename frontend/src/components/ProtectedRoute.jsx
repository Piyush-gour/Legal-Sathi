import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  const { user, lawyer, admin, loading, getUserRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentRole = getUserRole();

  // If no role required, just check if authenticated
  if (!requiredRole) {
    if (!currentRole) {
      return <Navigate to={redirectTo} replace />;
    }
    return children;
  }

  // Check specific role
  if (currentRole !== requiredRole) {
    // Redirect based on current role or to login
    if (currentRole === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (currentRole === 'lawyer') {
      return <Navigate to="/lawyer-dashboard" replace />;
    } else if (currentRole === 'user') {
      return <Navigate to="/user-dashboard" replace />;
    } else {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
