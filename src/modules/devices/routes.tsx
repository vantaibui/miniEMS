import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { createCrudRoutes } from '@modules/auth';

import { DeviceInventoryCreatePage, DeviceInventoryEditPage, DeviceInventoryListPage } from './pages';

const DashboardPage = lazy(() => import('./components/DashboardPage'));

const dashboardRoute: RouteObject = {
  path: 'dashboard',
  element: <DashboardPage />,
};

export const deviceRoutes: Array<RouteObject> = [
  dashboardRoute,
  ...createCrudRoutes({
    basePath: 'device-inventory',
    permissionPrefix: 'DEVICE_INVENTORY',
    pages: {
      list: DeviceInventoryListPage,
      create: DeviceInventoryCreatePage,
      edit: DeviceInventoryEditPage,
    },
    redirectDetailToEdit: true,
  }),
];
