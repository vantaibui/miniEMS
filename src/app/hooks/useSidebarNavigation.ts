import { useMemo } from 'react';

import type { SidebarTopItem } from '@app/navigation';

import { useRbacStore } from '@modules/auth';

import { isItemAllowed } from '../navigation';

/**
 * Returns the sidebar nav items visible to the current user,
 * filtered by RBAC permissions.
 */
export const useSidebarNavigation = (items: Array<SidebarTopItem>) => {
  const permissions = useRbacStore((s) => s.permissions);

  return useMemo(
    () => items.filter((item) => isItemAllowed(permissions, item)),
    [items, permissions],
  );
};
