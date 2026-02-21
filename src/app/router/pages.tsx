import { lazy } from 'react';

// Lazy load pages for code splitting
// export const HomePage = lazy(() => import('@modules/home/pages/HomePage'));

// export const AdminPage = lazy(() => import('@modules/access-management/admin-dashboard/AdminPage'));
// export const RoleListPage = lazy(() => import('@modules/access-management/roles/role-list'));
// export const AddRolePage = lazy(() => import('@modules/access-management/roles/role-editor'));
// export const UserListPage = lazy(() => import('@modules/access-management/users/user-list'));

export const LoginPage = lazy(() => import('@modules/auth/pages/LoginPage'));

export { NotFoundPage } from '@libs/pages';
