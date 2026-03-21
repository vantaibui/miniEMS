import { Suspense, type ComponentType } from 'react';

import { Box, CircularProgress } from '@mui/material';
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from 'react-router-dom';

import { AuthLayout, RootLayout } from '@app/layout';

import { NotFoundPage } from '@libs/pages';

import { authRoutes } from '@modules/auth';
import { HomePage } from '@modules/dashboard';
import { deviceRoutes } from '@modules/devices';
import { rolesRoutes } from '@modules/roles';
import { usersRoutes } from '@modules/users';


import { ProtectedRoute } from './ProtectedRoute';

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
        element: <Navigate to="/admin/users" replace />,
      },
      {
        path: 'dashboard',
        element: <HomePage />,
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
    element: withSuspense(NotFoundPage),
  },
];

export const router = createBrowserRouter(routes);
