import type { RouteObject } from 'react-router-dom';
import { RouteGuard } from '@modules/auth';

export const rolesRoutes: Array<RouteObject> = [
  {
    path: 'roles',
    element: (
      <RouteGuard permissionPath="ACCESS_MANAGEMENT.ROLE_MANAGEMENT.read">
        <div className="p-8">
          <div className="rounded-2xl border border-(--color-divider) bg-white p-8">
            <h1 className="text-2xl font-extrabold">Roles & Permissions</h1>
            <p className="mt-2 text-(--color-text-secondary)">Under development.</p>
          </div>
        </div>
      </RouteGuard>
    ),
  },
];
