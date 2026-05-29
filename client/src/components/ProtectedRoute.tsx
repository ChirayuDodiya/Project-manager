import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) {
    return <div className="w-screen h-screen bg-[#121212]"></div>;
  }

  if (user === null) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
