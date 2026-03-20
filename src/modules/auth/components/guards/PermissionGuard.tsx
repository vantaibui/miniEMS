import React from 'react';

import { Box, CircularProgress } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';

import type { AuthState } from '@libs/types';

import {
  PERMISSION_ACTIONS,
  type PermissionAction,
} from '../../constants/permissions.constants';
import { usePermission } from '../../hooks/usePermission';
import { useRbacStore } from '../../store/auth.store';

interface GuardProps {
  subModuleKey: string;
  actionKey?: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FullPageLoader = () => (
  <Box className="flex justify-center items-center h-screen">
    <CircularProgress />
  </Box>
);

export const RouteGuard: React.FC<GuardProps> = ({
  subModuleKey,
  actionKey,
  children,
}) => {
  const resolvedAction = actionKey ?? PERMISSION_ACTIONS.READ;

  const isInitialized = useRbacStore((state: AuthState) => state.isInitialized);
  const isLoading = useRbacStore((state: AuthState) => state.isLoading);
  const hasAccess = usePermission(subModuleKey, resolvedAction);
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return <FullPageLoader />;
  }

  if (!hasAccess) {
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const ComponentGuard: React.FC<GuardProps> = ({
  subModuleKey,
  actionKey,
  children,
  fallback = null,
}) => {
  const resolvedAction = actionKey ?? PERMISSION_ACTIONS.READ;

  const isInitialized = useRbacStore((state: AuthState) => state.isInitialized);
  const hasAccess = usePermission(subModuleKey, resolvedAction);

  if (!isInitialized) return null;

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
};

/**
 * LayoutGuard
 * - Alias for RouteGuard, used to wrap layout-level outlets.
 */
export const LayoutGuard = RouteGuard;
