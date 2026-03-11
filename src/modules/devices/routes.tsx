import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { RouteGuard } from '@modules/auth/components/guards/PermissionGuard';

import {
  DeviceInventoryCreatePage,
  DeviceInventoryDetailPage,
  DeviceInventoryEditPage,
  DeviceInventoryListPage,
} from './pages';
import { createCrudRoutes } from '../auth';

const DashboardPage = lazy(() => import('./components/DashboardPage'));

const dashboardRoute: RouteObject = {
  path: 'dashboard',
  element: <DashboardPage />,
};

export const deviceRoutes: Array<RouteObject> = [
  dashboardRoute,
  {
    path: 'device-inventory/:id',
    element: (
      <RouteGuard subModuleKey="DEVICE_MANAGEMENT">
        <DeviceInventoryDetailPage />
      </RouteGuard>
    ),
  },
  ...createCrudRoutes({
    basePath: 'device-inventory',
    permissionPrefix: 'DEVICE_MANAGEMENT',
    pages: {
      list: DeviceInventoryListPage,
      create: DeviceInventoryCreatePage,
      edit: DeviceInventoryEditPage,
    },
  }),
];
