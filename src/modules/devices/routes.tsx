import { RouteGuard } from '@modules/auth';

import { createCrudRoutes } from '../auth';
import {
  DeviceInventoryCreatePage,
  DeviceInventoryDetailPage,
  DeviceInventoryEditPage,
  DeviceInventoryListPage,
} from './pages';

import type { RouteObject } from 'react-router-dom';

export const deviceRoutes: Array<RouteObject> = [
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
