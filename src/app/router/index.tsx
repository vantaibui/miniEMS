import { lazy, Suspense, type ComponentType } from 'react';

import { Box, CircularProgress } from '@mui/material';
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from 'react-router-dom';

import { AuthLayout, RootLayout } from '@app/layout';

import { authRoutes } from '@modules/auth';
import { deviceRoutes } from '@modules/devices';
import { rolesRoutes } from '@modules/roles';
import { usersRoutes } from '@modules/users';

import { ProtectedRoute } from './ProtectedRoute';

// Lazy-loaded to reduce initial bundle size (HomePage is 436 lines)
const HomePage = lazy(() => import('@modules/dashboard/pages/HomePage'));
// @libs/pages is a barrel file (→ index.ts), so use @ alias to reach the real file
const NotFoundPage = lazy(() => import('@/libs/pages/not-found/NotFoundPage'));

// Shared suspense fallback
const PageFallback = () => (
  <Box className="flex h-screen w-full items-center justify-center">
    <CircularProgress />
  </Box>
);

// Wrap a lazy component with Suspense — preserves typing for RouteObject
const withFallback = (LazyComponent: ComponentType) => (
  <Suspense fallback={<PageFallback />}>
    <LazyComponent />
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
        element: <Navigate to="/admin/users" replace />,
      },
      {
        path: 'dashboard',
        element: withFallback(HomePage),
      },
      {
        path: 'admin',
        children: [
          {
            index: true,
            element: <Navigate to="users" replace />,
          },
          ...usersRoutes,
          ...rolesRoutes,
        ],
      },
      ...deviceRoutes,
    ],
  },
  {
    path: '*',
    element: withFallback(NotFoundPage),
  },
];

export const router = createBrowserRouter(routes, {
  future: {
    v7_fallbackPersist: true,
  },
});
