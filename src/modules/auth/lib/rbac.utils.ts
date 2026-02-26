import type { Actions, PermissionNode } from '@libs/types';

export const checkPermissionRaw = (
  permissions: Array<PermissionNode> | null,
  path: string,
): boolean => {
  if (!permissions) return false;

  // "SUB_MODULE.ACTION", e.g. "user_list.read"
  const [subModuleKey, actionKey] = path.split('.');

  const record = permissions.find((p) => p.subModule === subModuleKey);
  console.log(record);
  if (!record) return false;

  if (actionKey && record.actions && actionKey in record.actions) {
    return record.actions[actionKey as keyof Actions];
  }

  // Default to read if action omitted
  return record.actions?.read ?? false;
};
