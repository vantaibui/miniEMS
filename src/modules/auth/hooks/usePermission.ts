import {
  PERMISSION_ACTIONS,
  type PermissionAction,
} from '../constants/permissions.constants';
import { hasPermission } from '../lib/rbac.utils';
import { useRbacStore } from '../store/auth.store';

export const usePermission = (
  subModuleKey: string,
  actionKey: PermissionAction = PERMISSION_ACTIONS.READ,
): boolean => {
  const permissions = useRbacStore((state) => state.permissions);

  return hasPermission(permissions, subModuleKey, actionKey);
};

/**
 * Backward-compatible alias.
 */
export const useHasAction = usePermission;
