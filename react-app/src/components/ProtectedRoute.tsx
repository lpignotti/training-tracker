import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireTrainer?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireTrainer = false 
}) => {
  const { isAuthenticated, isTrainer } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireTrainer && !isTrainer()) {
    return <Navigate to="/training" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
