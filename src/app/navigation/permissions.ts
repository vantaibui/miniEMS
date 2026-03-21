import type { NavPermission, SidebarTopItem } from './nav.types';
import { hasPermission } from '@modules/auth';
import type { PermissionNode } from '@libs/types';

/**
 * Check if a permission object grants access.
 * Defaults to 'read' action if not specified.
 */
export const isAllowed = (
  permissions: Array<PermissionNode> | null,
  permission?: NavPermission,
): boolean => {
  if (!permission) return true;
  return hasPermission(
    permissions,
    permission.subModule,
    permission.action ?? 'read',
  );
};

/**
 * Check if a sidebar nav item is visible based on RBAC.
 * Supports both single permission and permissionAnyOf (OR logic).
 */
export const isItemAllowed = (
  permissions: Array<PermissionNode> | null,
  item: SidebarTopItem,
): boolean => {
  if (item.permissionAnyOf?.length) {
    return item.permissionAnyOf.some((p) => isAllowed(permissions, p));
  }
  return isAllowed(permissions, item.permission);
};
