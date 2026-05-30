import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';

export const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) {
    return <div className="w-screen h-screen bg-[#121212]"></div>;
  }

  if (user === null) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute;
