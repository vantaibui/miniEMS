import { Navigate, type RouteObject } from 'react-router-dom';

import { RouteGuard } from '../auth';
import { RoleCreatePage, RoleEditPage, RoleListPage } from './pages';

export const rolesRoutes: Array<RouteObject> = [
  {
    path: 'roles',
    element: (
      <RouteGuard subModuleKey="ROLE_MANAGEMENT">
        <RoleListPage />
      </RouteGuard>
    ),
  },
  {
    path: 'roles/create',
    element: (
      <RouteGuard subModuleKey="ROLE_MANAGEMENT" actionKey="create">
        <RoleCreatePage />
      </RouteGuard>
    ),
  },
  {
    path: 'roles/:id/edit',
    element: (
      <RouteGuard subModuleKey="ROLE_MANAGEMENT" actionKey="update">
        <RoleEditPage />
      </RouteGuard>
    ),
  },
  {
    path: 'roles/:id',
    element: <Navigate to="edit" replace />,
  },
];
