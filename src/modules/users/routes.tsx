import type { RouteObject } from 'react-router-dom';
import { RouteGuard } from '@modules/auth';

// For now using PlaceholderPage-like logic until actual components are implemented
// In a real scenario, we would import the actual page components here.

export const usersRoutes: Array<RouteObject> = [
  {
    path: 'users',
    element: (
      <RouteGuard permissionPath="ACCESS_MANAGEMENT.USER_MANAGEMENT.read">
        <div className="p-8">
          <div className="rounded-2xl border border-(--color-divider) bg-white p-8">
            <h1 className="text-2xl font-extrabold">User Management</h1>
            <p className="mt-2 text-(--color-text-secondary)">Under development.</p>
          </div>
        </div>
      </RouteGuard>
    ),
  },
];
