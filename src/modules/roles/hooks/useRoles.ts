import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@libs/query';

import { rolesApi, type RolesListParams } from '../api';
import type { RoleEntity } from '../types';

export const useRoles = (params: RolesListParams = {}) => {
  return useQuery<Array<RoleEntity>, Error>({
    queryKey: queryKeys.roles.list(params),
    queryFn: () => rolesApi.getList(params),
  });
};
