import type { Actions, PermissionNode } from '@libs/types';

import {
  PERMISSION_ACTIONS,
  type PermissionAction,
} from '../constants/permissions.constants';

export const buildPermissionPath = (
  subModuleKey: string,
  actionKey: PermissionAction = PERMISSION_ACTIONS.READ,
): string => `${subModuleKey}.${actionKey}`;

export const hasPermission = (
  permissions: Array<PermissionNode> | null,
  subModuleKey: string,
  actionKey: PermissionAction = PERMISSION_ACTIONS.READ,
): boolean => {
  if (!permissions) return false;

  const record = permissions.find(
    (permission) => permission.subModule === subModuleKey,
  );
  if (!record?.actions) return false;

  if (actionKey in record.actions) {
    return record.actions[actionKey as keyof Actions];
  }

  return record.actions.read ?? false;
};
