import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const LoginPage = lazy(() => import('./pages/LoginPage'));

export const authRoutes: Array<RouteObject> = [
  {
    index: true,
    element: <LoginPage />,
  },
];
