import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@libs/query';

import { rolesApi, type RolesListParams } from '../api';
import type { PermissionNode } from '../types';

export const useRolePermissions = (
  roleId: number | string | undefined,
  params: RolesListParams = {},
) => {
  return useQuery<Array<PermissionNode>, Error>({
    queryKey:
      roleId == null
        ? [...queryKeys.roles.all, 'permissions', { roleId, params }]
        : [...queryKeys.roles.permissions(roleId), { params }],
    queryFn: () => {
      if (roleId === undefined || roleId === null) {
        return Promise.reject(new Error('Role id is required'));
      }
      return rolesApi.getPermissions(roleId, params);
    },
    enabled: roleId !== undefined && roleId !== null,
  });
};
