import type { Actions, PermissionNode, RBACMode } from '@libs/types';

/**
 * Traverses the raw nested API structure to check for permissions.
 *
 * Path format: "MODULE_NAME.SUB_MODULE_NAME.ACTION"
 * Example: "MAIN_NAVIGATION.DASHBOARD.read"
 *
 * IMPORTANT:
 * - This is intentionally NOT normalized.
 * - Every check traverses the API response shape (module -> subModule -> actions).
 * - This keeps RBAC behavior strictly dependent on backend contract.
 *
 * TODO: Once backend permission schema is stable, consider adding optional memoization
 *       at the call-site level (not global caching) to reduce repeated traversal cost.
 */
export const checkPermissionRaw = (
  permissions: Array<PermissionNode> | null,
  path: string,
  mode: RBACMode = 'strict',
): boolean => {
  // STRICT: deny-by-default
  if (!permissions) return mode === 'soft';

  const [moduleKey, subModuleKey, actionKey] = path.split('.');

  const parentModule = permissions.find((p) => p.module === moduleKey);
  if (!parentModule) return mode === 'soft';

  // If checking parent module only
  if (!subModuleKey) {
    return parentModule.actions?.read ?? mode === 'soft';
  }

  const subModule = parentModule.subModule?.find(
    (s) => s.module === subModuleKey,
  );
  if (!subModule) return mode === 'soft';

  if (actionKey && subModule.actions && actionKey in subModule.actions) {
    return subModule.actions[actionKey as keyof Actions];
  }

  // Default to read if action omitted
  return subModule.actions?.read ?? mode === 'soft';
};
