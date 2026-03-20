import { queryKeys, useAppQuery } from '@libs/query';
import type { PermissionNode, User } from '@libs/types';

import type { ApiSuccessResponse } from '@services/http';

import { authService, type PaginationParams } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const useAuthMe = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useAppQuery<ApiSuccessResponse<User>, User>({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.getMe() as Promise<ApiSuccessResponse<User>>,
    select: (response) => response.data,
    enabled: isAuthenticated,
  });
};

export const useAuthPermissions = (
  roleId: number | string | undefined,
  params?: PaginationParams,
) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useAppQuery<
    ApiSuccessResponse<Array<PermissionNode>>,
    Array<PermissionNode>
  >({
    queryKey: roleId
      ? ([...queryKeys.auth.all, 'permissions', roleId] as const)
      : ([...queryKeys.auth.all, 'permissions'] as const),
    queryFn: () => {
      if (!roleId) {
        throw new Error('Role id is required to fetch permissions');
      }

      return authService.getPermissions(roleId, params) as Promise<
        ApiSuccessResponse<Array<PermissionNode>>
      >;
    },
    select: (response) => response.data,
    enabled: isAuthenticated && roleId !== undefined && roleId !== null,
  });
};
