import type { ReactNode } from 'react';

import { Box, CircularProgress } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@modules/auth';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <Box className="flex h-screen w-full items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};
