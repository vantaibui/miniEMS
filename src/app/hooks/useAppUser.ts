import { useMemo } from 'react';

import { useAuthStore, useRbacStore } from '@modules/auth';

/**
 * Returns the current app user info and auth actions.
 * Used by Sidebar and other layout components.
 */
export const useAppUser = () => {
  const user = useRbacStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const initials = useMemo(() => {
    if (!user) return 'AU';
    const f = user.firstName?.[0] ?? '';
    const l = user.lastName?.[0] ?? '';
    return `${f}${l}`.toUpperCase() || user.username?.[0]?.toUpperCase() || 'AU';
  }, [user]);

  return { user, initials, logout };
};
