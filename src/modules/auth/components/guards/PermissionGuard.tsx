import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useRbacStore } from '../../store/auth.store';
import { usePermission } from '../../hooks/usePermission';
import type { AuthState } from '@libs/types';

interface GuardProps {
  permissionPath: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FullPageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

/**
 * RouteGuard
 * - Protects entire route segments.
 * - Redirects to /403 if unauthorized.
 * - Shows loader if RBAC not initialized.
 */
export const RouteGuard: React.FC<GuardProps> = ({ permissionPath, children }) => {
  const isInitialized = useRbacStore((state: AuthState) => state.isInitialized);
  const isLoading = useRbacStore((state: AuthState) => state.isLoading);
  const rbacMode = useRbacStore((state: AuthState) => state.rbacMode);
  const hasPermission = usePermission(permissionPath);
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return <FullPageLoader />;
  }

  if (!hasPermission && rbacMode === 'strict') {
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * ComponentGuard
 * - Toggles UI fragments (buttons, tabs).
 * - STRICT: returns fallback (default null) if unauthorized.
 */
export const ComponentGuard: React.FC<GuardProps> = ({ permissionPath, children, fallback = null }) => {
  const isInitialized = useRbacStore((state: AuthState) => state.isInitialized);
  const hasPermission = usePermission(permissionPath);

  if (!isInitialized) return null;

  if (!hasPermission) return <>{fallback}</>;

  return <>{children}</>;
};

/**
 * LayoutGuard
 * - Alias for RouteGuard, used to wrap layout-level outlets.
 */
export const LayoutGuard = RouteGuard;
