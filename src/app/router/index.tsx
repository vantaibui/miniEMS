import { lazy, Suspense, type ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import { AdminLayout, AuthLayout, RootLayout } from '../layouts';
import { authRoutes } from '@modules/auth';
import { deviceRoutes } from '@modules/devices';
import { usersRoutes } from '@modules/users';
import { rolesRoutes } from '@modules/roles';
import { ProtectedRoute } from './ProtectedRoute';
import { RouteGuard } from '@modules/auth';
import { NotFoundPage } from '@libs/pages';

export const HomePage = lazy(() => import('@/modules/dashboard/pages/HomePage'));

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
        element: withSuspense(HomePage),
      },
      ...deviceRoutes,
    ],
  },

  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RouteGuard permissionPath="ACCESS_MANAGEMENT.USER_MANAGEMENT.read">
          <AdminLayout />
        </RouteGuard>
      </ProtectedRoute>
    ),
    children: [
      ...usersRoutes,
      ...rolesRoutes,
    ],
  },

  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
];

// eslint-disable-next-line react-refresh/only-export-components
export const router = createBrowserRouter(routes);
