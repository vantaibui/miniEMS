import { PERMISSION_ACTIONS, type PermissionAction } from '../constants/permissions.constants';
import { checkPermissionRaw } from '../lib/rbac.utils';
import { useRbacStore } from '../store/auth.store';

/**
 * Granular hook for checking specific submodule actions.
 */
export const useHasAction = (
  subModuleKey: string,
  actionKey: PermissionAction,
): boolean => {
  const permissions = useRbacStore((state) => state.permissions);

  return checkPermissionRaw(
    permissions,
    `${subModuleKey}.${actionKey}`,
  );
};

/**
 * Convenience hook: check permission by subModule only.
 * Example: usePermissionBySubModule('user_list', 'read')
 */
export const usePermission = (
  subModuleKey: string,
  actionKey: PermissionAction = PERMISSION_ACTIONS.READ,
): boolean => {
  const permissions = useRbacStore((state) => state.permissions);

  return checkPermissionRaw(
    permissions,
    `${subModuleKey}.${actionKey}`,
  );
};
