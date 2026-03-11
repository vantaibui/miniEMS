import { Box, CircularProgress } from '@mui/material';
import { Suspense, type ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { deviceRoutes } from '@/modules/devices';
import { NotFoundPage } from '@libs/pages';
import { authRoutes } from '@modules/auth';
import { rolesRoutes } from '@modules/roles';
import { usersRoutes } from '@modules/users';
import { AuthLayout, RootLayout } from '../layouts';
import { ProtectedRoute } from './ProtectedRoute';

/**
 * Centrally managed route registry for the application shell.
 * Delegates feature-specific routing to their respective modules.
 */

const withSuspense = (Component: ComponentType<unknown>) => (
  <Suspense
    fallback={
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    }
  >
    <Component />
  </Suspense>
);

const routes: Array<RouteObject> = [
  {
    path: '/login',
    element: <AuthLayout />,
    children: authRoutes,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/users" replace />,
      },
      ...usersRoutes,
      ...rolesRoutes,
      ...deviceRoutes,
    ],
  },
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
];

export const router = createBrowserRouter(routes);
