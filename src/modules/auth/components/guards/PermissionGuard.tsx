import type { AuthState } from '@libs/types';
import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePermission } from '../../hooks/usePermission';
import { useRbacStore } from '../../store/auth.store';

interface GuardProps {
  permissionPath: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FullPageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

export const RouteGuard: React.FC<GuardProps> = ({
  permissionPath,
  children,
}) => {
  const isInitialized = useRbacStore((state: AuthState) => state.isInitialized);
  const isLoading = useRbacStore((state: AuthState) => state.isLoading);
  const hasPermission = usePermission(permissionPath);
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return <FullPageLoader />;
  }

  // if (!hasPermission) {
  //   return <Navigate to="/403" state={{ from: location }} replace />;
  // }

  return <>{children}</>;
};

export const ComponentGuard: React.FC<GuardProps> = ({
  permissionPath,
  children,
  fallback = null,
}) => {
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
