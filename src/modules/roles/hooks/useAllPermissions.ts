import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@libs/query';

import { rolesApi } from '../api';
import type { PermissionNode } from '../types';

import type { RolesListParams } from '../api';

export const useAllPermissions = (params: RolesListParams = {}) => {
  return useQuery<Array<PermissionNode>, Error>({
    queryKey: [...queryKeys.roles.allPermissions(), { params }],
    queryFn: () => rolesApi.getAllPermissions(params),
  });
};
