import type { AuthState } from '@libs/types';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  if (!isInitialized || isLoading) {
    return <FullPageLoader />;
  }

  if (!hasPermission) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          px: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 420,
            width: '100%',
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: 'background.paper',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main' }}>
            403
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
            Access denied
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            You do not have the required permissions to view this page.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Go back
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/', { replace: true, state: { from: location } })}
            >
              Go to dashboard
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

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
