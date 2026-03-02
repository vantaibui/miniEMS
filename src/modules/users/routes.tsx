import type { RouteObject } from 'react-router-dom';
import { createCrudRoutes } from '@modules/auth';
import { UserListPage } from './pages/UserListPage';
import { UserCreatePage } from './pages/UserCreatePage';
import { UserEditPage } from './pages/UserEditPage';

export const usersRoutes: Array<RouteObject> = createCrudRoutes({
  basePath: 'users',
  permissionPrefix: 'USER_MANAGEMENT',
  pages: {
    list: UserListPage,
    create: UserCreatePage,
    edit: UserEditPage,
  },
});
