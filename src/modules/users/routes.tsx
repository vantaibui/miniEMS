import { RouteGuard } from '@modules/auth';

import { UserCreatePage } from './pages/UserCreatePage';
import { UserEditPage } from './pages/UserEditPage';
import { UserListPage } from './pages/UserListPage';

import type { RouteObject } from 'react-router-dom';

export const usersRoutes: Array<RouteObject> = [
  {
    path: 'users',
    element: (
      <RouteGuard subModuleKey="USER_MANAGEMENT">
        <UserListPage />
      </RouteGuard>
    ),
  },
  {
    path: 'users/create',
    element: (
      <RouteGuard subModuleKey="USER_MANAGEMENT" actionKey="create">
        <UserCreatePage />
      </RouteGuard>
    ),
  },
  {
    path: 'users/:id/edit',
    element: (
      <RouteGuard subModuleKey="USER_MANAGEMENT" actionKey="update">
        <UserEditPage />
      </RouteGuard>
    ),
  },
];
