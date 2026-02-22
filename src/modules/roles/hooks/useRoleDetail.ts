import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@libs/query';

import { rolesApi } from '../api';
import type { RoleEntity } from '../types';

export const useRoleDetail = (id: number | string | undefined) => {
  return useQuery<RoleEntity, Error>({
    queryKey: queryKeys.roles.detail?.(id as any) ?? ['roles', 'detail', id],
    queryFn: () => {
      if (id === undefined || id === null) {
        return Promise.reject(new Error('Role id is required'));
      }
      return rolesApi.getById(id);
    },
    enabled: id !== undefined && id !== null,
  });
};
