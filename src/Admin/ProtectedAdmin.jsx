import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedAdmin({ children }) {
  const isAuthenticated = sessionStorage.getItem('adminToken') !== null;
  const isAdmin = sessionStorage.getItem('userRole') === 'admin';
  console.log('Admin auth check:', { isAuthenticated, isAdmin });
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}
