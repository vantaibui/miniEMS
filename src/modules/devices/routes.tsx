import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const DashboardPage = lazy(() => import('./components/DashboardPage'));

export const deviceRoutes: Array<RouteObject> = [
  {
    path: 'dashboard',
    element: <DashboardPage />,
  },
];
