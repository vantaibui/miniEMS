import type { RouteObject } from 'react-router-dom';
import { RouteGuard } from '@modules/auth';
import { UserListPage } from './pages/UserListPage';
import { UserCreatePage } from './pages/UserCreatePage';
import { UserEditPage } from './pages/UserEditPage';

export const usersRoutes: Array<RouteObject> = [
  {
    path: 'users',
    element: (
      <RouteGuard permissionPath="ACCESS_MANAGEMENT.USER_MANAGEMENT.read">
        <UserListPage />
      </RouteGuard>
    ),
  },
  {
    path: 'users/create',
    element: (
      <RouteGuard permissionPath="ACCESS_MANAGEMENT.USER_MANAGEMENT.create">
        <UserCreatePage />
      </RouteGuard>
    ),
  },
  {
    path: 'users/:id/edit',
    element: (
      <RouteGuard permissionPath="ACCESS_MANAGEMENT.USER_MANAGEMENT.update">
        <UserEditPage />
      </RouteGuard>
    ),
  },
];
