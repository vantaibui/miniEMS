import type { RouteObject } from 'react-router-dom';
import { createCrudRoutes } from '@modules/auth';

import { RoleCreatePage, RoleEditPage, RoleListPage } from './pages';

export const rolesRoutes: Array<RouteObject> = createCrudRoutes({
  basePath: 'roles',
  permissionPrefix: 'ROLE_MANAGEMENT',
  pages: {
    list: RoleListPage,
    create: RoleCreatePage,
    edit: RoleEditPage,
  },
  redirectDetailToEdit: true,
});
