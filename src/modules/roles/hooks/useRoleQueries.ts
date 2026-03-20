import { useAppQuery } from '@libs/query';

import type { ApiSuccessResponse, PaginationResult } from '@services/http';

import { rolesApi, type RolesListParams } from '../api';

import type { PermissionNode, Role, RoleDetails } from '../types';

export type ListResult<T> = {
  items: Array<T>;
  pagination?: PaginationResult;
};

export const useRoles = (params: RolesListParams = {}) => {
  return useAppQuery<ApiSuccessResponse<Array<Role>>, ListResult<Role>>({
    queryKey: ['roles', 'list', params],
    queryFn: () => rolesApi.getList(params),
    select: (response) => ({
      items: response?.data ?? [],
      pagination: response?.meta?.pagination,
    }),
  });
};

export const useRoleDetail = (id: number | string | undefined) => {
  return useAppQuery<ApiSuccessResponse<RoleDetails>, RoleDetails>({
    queryKey: ['roles', 'detail', id],
    queryFn: () => {
      if (id === undefined || id === null) {
        throw new Error('Role id is required');
      }
      return rolesApi.getById(id);
    },
    select: (response) => response.data,
    enabled: id !== undefined && id !== null,
  });
};

export const usePermissions = (params: RolesListParams = {}) => {
  return useAppQuery<
    ApiSuccessResponse<Array<PermissionNode>>,
    ListResult<PermissionNode>
  >({
    queryKey: ['roles', 'permissions', params],
    queryFn: () => rolesApi.getAllPermissions(params),
    select: (response) => ({
      items: (response?.data ?? []).map((permission) => ({
        ...permission,
        actions: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
      })),
      pagination: response?.meta?.pagination,
    }),
  });
};

export const usePermissionsById = (
  roleId: number | string | undefined,
  params: RolesListParams = {},
) => {
  return useAppQuery<
    ApiSuccessResponse<Array<PermissionNode>>,
    ListResult<PermissionNode>
  >({
    queryKey: ['roles', 'permissions', roleId, params],
    queryFn: () => {
      if (!roleId) throw new Error('Role id is required');

      return rolesApi.getPermissions(roleId, params);
    },
    select: (response) => ({
      items: response?.data ?? [],
      pagination: response?.meta?.pagination,
    }),
    enabled: roleId !== undefined && roleId !== null,
  });
};
