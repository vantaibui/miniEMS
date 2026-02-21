import { useRbacStore } from '../store/auth.store';
import { checkPermissionRaw } from '../lib/rbac.utils';
import type { Actions } from '@libs/types';

/**
 * Hook to check if a user has a specific permission.
 * path format: "MODULE_NAME.SUB_MODULE_NAME.ACTION"
 * Example: "MAIN_NAVIGATION.DASHBOARD.read"
 */
export const usePermission = (path: string): boolean => {
  const permissions = useRbacStore((state) => state.permissions);
  const rbacMode = useRbacStore((state) => state.rbacMode);

  return checkPermissionRaw(permissions, path, rbacMode);
};

/**
 * Granular hook for checking specific submodule actions.
 */
export const useHasAction = (
  moduleKey: string,
  subModuleKey: string,
  actionKey: keyof Actions
): boolean => {
  const permissions = useRbacStore((state) => state.permissions);
  const rbacMode = useRbacStore((state) => state.rbacMode);

  return checkPermissionRaw(permissions, `${moduleKey}.${subModuleKey}.${actionKey}`, rbacMode);
};
