import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { RouteGuard } from '../auth';

import { RoleCreatePage, RoleEditPage, RoleListPage } from './pages';

export const rolesRoutes: Array<RouteObject> = [
  {
    path: 'roles',
    element: (
      <RouteGuard permissionPath="ROLE_MANAGEMENT.read">
        <RoleListPage />
      </RouteGuard>
    ),
  },
  {
    path: 'roles/create',
    element: (
      <RouteGuard permissionPath="ROLE_MANAGEMENT.create">
        <RoleCreatePage />
      </RouteGuard>
    ),
  },
  {
    path: 'roles/:id/edit',
    element: (
      <RouteGuard permissionPath="ROLE_MANAGEMENT.update">
        <RoleEditPage />
      </RouteGuard>
    ),
  },
  {
    path: 'roles/:id',
    element: <Navigate to="edit" replace />,
  },
];
