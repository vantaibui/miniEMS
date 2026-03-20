import type { ReactNode } from 'react';

import { Box, CircularProgress } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@modules/auth';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) {
    return (
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
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};
