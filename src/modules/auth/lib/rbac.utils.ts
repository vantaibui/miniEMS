import type { Actions, PermissionNode } from '@libs/types';

export const checkPermissionRaw = (
  permissions: Array<PermissionNode> | null,
  path: string,
): boolean => {
  if (!permissions) return false;

  // Expected format: "SUB_MODULE.ACTION", e.g. "USER_MANAGEMENT.read"
  // We split on the LAST dot so this still works if subModule contains dots.
  const lastDotIndex = path.lastIndexOf('.');

  const subModuleKey =
    lastDotIndex === -1 ? path : path.slice(0, lastDotIndex);
  const actionKey =
    lastDotIndex === -1 ? undefined : path.slice(lastDotIndex + 1);

  const record = permissions.find((p) => p.subModule === subModuleKey);
  if (!record) return false;

  if (actionKey && record.actions && actionKey in record.actions) {
    return record.actions[actionKey as keyof Actions];
  }

  // If no action is provided, fall back to "read" by convention.
  return record.actions?.read ?? false;
};
