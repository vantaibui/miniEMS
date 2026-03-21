import type { BreadcrumbItem } from './nav.types';

/**
 * Build breadcrumb trail from the current pathname.
 * Labels must stay aligned with tab labels in `nav.config.tsx`.
 */
export function getBreadcrumbItems(pathname: string): Array<BreadcrumbItem> {
  const path = pathname.replace(/\/$/, '') || '/';
  const items: Array<BreadcrumbItem> = [{ label: 'Home', href: '/' }];

  if (path.startsWith('/admin')) {
    items.push({ label: 'Admin', href: '/admin/users' });

    if (path.startsWith('/admin/users')) {
      items.push({
        label: 'User Management',
        href: path === '/admin/users' ? undefined : '/admin/users',
      });
      if (path === '/admin/users/create') {
        items.push({ label: 'Add New User' });
      } else if (/\/admin\/users\/[^/]+\/edit$/.test(path)) {
        items.push({ label: 'Edit User' });
      }
    } else if (path.startsWith('/admin/roles')) {
      items.push({
        label: 'Role Management',
        href: path === '/admin/roles' ? undefined : '/admin/roles',
      });
      if (path === '/admin/roles/create') {
        items.push({ label: 'Add New Role' });
      } else if (/\/admin\/roles\/[^/]+\/edit$/.test(path)) {
        items.push({ label: 'Edit Role' });
      }
    }
  } else if (path.startsWith('/devices')) {
    items.push({ label: 'Devices', href: '/devices' });
    items.push({
      label: 'Device Management',
      href: path === '/devices' ? undefined : '/devices',
    });
    if (path === '/devices/create') {
      items.push({ label: 'Add Device' });
    } else if (/\/devices\/[^/]+\/edit$/.test(path)) {
      items.push({ label: 'Edit Device' });
    } else if (
      /^\/devices\/[^/]+$/.test(path) &&
      path !== '/devices/create'
    ) {
      items.push({ label: 'Device Detail' });
    }
  }

  return items;
}
